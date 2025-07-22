import buildWikiTitleFromChampionship from "./wikiTitleHelper.js";

const title = buildWikiTitleFromChampionship("AEW World Championship");
if (!title) {
  console.error("Failed to build title for AEW World Championship");
}   else {
  console.log("AEW World Championship title:", title);
}                           
