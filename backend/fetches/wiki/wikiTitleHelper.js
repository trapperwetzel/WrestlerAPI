// backend/fetches/wiki/wikiTitleHelper.js

/**
 * SPECIAL_PAGE_OVERRIDES:
 * key = normalized signature (lowercase, stripped noise) => exact Wikipedia page title
 *
 * Keep only the *final* "page" portion (without the base URL).
 * If a page uses parentheses or punctuation, put the full correct title here.
 */
const SPECIAL_PAGE_OVERRIDES = {
  // WWE Core Singles
  "wwe": "List_of_WWE_Champions",
  "wwechampionship": "List_of_WWE_Champions",
  "wwechampion": "List_of_WWE_Champions",

  "intercontinental": "List_of_WWE_Intercontinental_Champions",
  "ic": "List_of_WWE_Intercontinental_Champions",

  "unitedstates": "List_of_WWE_United_States_Champions",
  "us": "List_of_WWE_United_States_Champions",
  "uschampionship": "List_of_WWE_United_States_Champions",
  "uschampion": "List_of_WWE_United_States_Champions",

  // Legacy World Heavyweight (2002–2013)
  "worldheavyweightwwe2002–2013": "List_of_World_Heavyweight_Champions_(WWE,_2002–2013)",
  "worldheavyweightwwe2002-2013": "List_of_World_Heavyweight_Champions_(WWE,_2002–2013)",

  // AEW
  "aew": "List_of_AEW_World_Champions",
  "aewworld": "List_of_AEW_World_Champions",
  "aewworldchampionship": "List_of_AEW_World_Champions",
  "aewworldchampion": "List_of_AEW_World_Champions",
  "aewtnt": "List_of_AEW_TNT_Champions",
  "tnt": "List_of_AEW_TNT_Champions",

  // NXT
  "nxt": "List_of_NXT_Champions",
  "nxtchampionship": "List_of_NXT_Champions",
  "nxtchampion": "List_of_NXT_Champions",

  "nxtnorthamerican": "List_of_NXT_North_American_Champions",
  "northamerican": "List_of_NXT_North_American_Champions",
  "nxtnortha": "List_of_NXT_North_American_Champions",

  "nxtwomens": "List_of_NXT_Women's_Champions",
  "nxtwomen": "List_of_NXT_Women's_Champions",

  // WWE Women’s / Divas
  "womens": "List_of_WWE_Women's_Champions",
  "wwewomens": "List_of_WWE_Women's_Champions",
  "divas": "List_of_Divas_Champions",
  "divaschampionship": "List_of_Divas_Champions",

  // ECW
  "ecw": "List_of_ECW_World_Heavyweight_Champions",
  "ecwworldheavyweight": "List_of_ECW_World_Heavyweight_Champions",

  // WCW
  "wcw": "List_of_WCW_World_Heavyweight_Champions",
  "wcwworldheavyweight": "List_of_WCW_World_Heavyweight_Champions",

  // Tag Team (various eras)
  "worldtagteam": "List_of_World_Tag_Team_Champions_(WWE)",          // Legacy
  "tagteam": "List_of_World_Tag_Team_Champions_(WWE)",
  "tag": "List_of_World_Tag_Team_Champions_(WWE)",
  "rawtagteam": "List_of_WWE_Raw_Tag_Team_Champions",
  "smackdowntagteam": "List_of_WWE_SmackDown_Tag_Team_Champions",
  "nxttagteam": "List_of_NXT_Tag_Team_Champions",
  "aewtagteam": "List_of_AEW_World_Tag_Team_Champions",
};

/**
 * TOKEN_ALIASES:
 * Single tokens we can substitute to canonical tokens before building a “default” title.
 * (Used only when not matched by an override.)
 */
const TOKEN_ALIASES = {
  ic: "Intercontinental",
  us: "United_States",
  womens: "Women's",
  womensworld: "Women's_World",
  women: "Women's",
  nxt: "NXT",
  aew: "AEW",
  wwe: "WWE",
  ecw: "ECW",
  wcw: "WCW",
  tnt: "TNT",
  divas: "Divas",
  tag: "Tag_Team",
  team: "Team",
  north: "North",
  american: "American"
};

const splitCamelCase = (str) =>
  str
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");

/**
 * Normalize a raw input into a lowercase signature without spaces/punctuation
 * used for matching overrides.
 */
const makeSignature = (s) =>
  s
    .toLowerCase()
    .replace(/['’]/g, "")           // drop apostrophes for signature matching
    .replace(/[^a-z0-9]+/g, " ")    // non-alphanumeric to space
    .trim()
    .replace(/\s+/g, "");           // collapse & remove spaces entirely

/**
 * Build a Wikipedia list page title from loose championship input.
 * If a SPECIAL_PAGE_OVERRIDES entry matches, returns that.
 * Otherwise: "List_of_<Tokens>_Champions"
 */
const buildWikiTitleFromChampionship = (raw) => {
  if (!raw || typeof raw !== "string") return null;

  // 1. Expand camelCase: "NXTNorthAChampion" -> "NXT North A Champion"
  let working = splitCamelCase(raw).trim();

  // 2. Normalize inner whitespace
  working = working.replace(/\s+/g, " ");

  // 3. Signature for direct overrides
  const sig = makeSignature(working);
  if (SPECIAL_PAGE_OVERRIDES[sig]) {
    return SPECIAL_PAGE_OVERRIDES[sig];
  }

  // 4. Tokenize (keep original order)
  let tokens = working.split(" ").filter(Boolean);

  // 5. Remove trailing generic words we will re-add anyway
  tokens = tokens.filter(
    t => !/^champion(ship)?s?$/i.test(t)
  );

  // 6. Alias mapping
  tokens = tokens.map(t => {
    const key = t.toLowerCase();
    if (TOKEN_ALIASES[key]) return TOKEN_ALIASES[key];
    // Title-case if not aliased; preserve ALLCAP tokens (like WWE, AEW)
    if (/^[A-Z0-9]+$/.test(t)) return t;
    return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
  });

  // 7. Compact duplicates (e.g. "NXT NXT Tag Team")
  const deduped = [];
  for (const tok of tokens) {
    if (deduped[deduped.length - 1] !== tok) deduped.push(tok);
  }

  // 8. Join core
  const core = deduped.join("_");

  // 9. Default fall-back
  return `List_of_${core}_Champions`;
};

export default buildWikiTitleFromChampionship;
export {
  buildWikiTitleFromChampionship,
  SPECIAL_PAGE_OVERRIDES,
  TOKEN_ALIASES,
  makeSignature
};
