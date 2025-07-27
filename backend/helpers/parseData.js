import wrestlers from "./wrestlerData.js";

const wrestlerVariations = {
  "hulk hogan": ["hulk hogan", "hulk hogan/hollywood hogan", "hollywood hogan", "hollywood hulk hogan"],
  "steve austin": ["steve austin", "stone cold steve austin", "stunning steve austin"],
  "scott hall": ["scott hall", "razor ramon"],
  "mick foley": ["mick foley", "mankind", "cactus jack", "dude love"],
  "dean ambrose": ["dean ambrose", "jon moxley"],
  "big show": ["big show", "the giant"],
  "john morrison": ["john morrison", "johnny nitro/john morrison", "johnny nitro", "johnny impact"],
  "cesaro": ["cesaro", "antonio cesaro"],
  "goldust": ["goldust", "dustin rhodes"],
  "diesel": ["diesel", "kevin nash"],
  "rhino": ["rhino", "rhyno"],
  "daniel bryan": ["daniel bryan", "bryan danielson"],
  "rusev": ["rusev", "miro"],
  "andrade": ["andrade", "andrade cien almas"],
  "big e": ["big e", "big e langston"],
  "dolph ziggler": ["dolph ziggler", "nic nemeth"],
  "drew mcintyre": ["drew mcintyre", "drew galloway"],
  "bobby lashley": ["bobby lashley", "lashley"],
  "ultimate warrior": ["ultimate warrior", "the ultimate warrior"],
  "christian": ["christian", "christian cage"],
  "edge": ["edge", "adam copeland"],
  "undertaker": ["undertaker", "the undertaker"],
  "finn balor": ["finn balor", "finn bálor"],
  "mr perfect": ["mr perfect", "curt hennig"],
  "charlotte flair": ["charlotte", "charlotte flair"],
  "john cena": ["john cena", "john cena †"],
  "dominik mysterio": ["dominik mysterio †", "dominik mysterio"],
  "hangman adam page": ["hangman adam page †", "hangman adam page"],
  "solo sikoa": ["solo sikoa †", "solo sikoa"],
  "jd mcdonagh": ["jd mcdonagh †", "jd mcdonagh"],
  "oba femi": ["oba femi †", "oba femi"],
  "jacy jayne": ["jacy jayne †", "jacy jayne"],
  "alberto del rio": ["alberto del rio", "alberto el patrón"],
  "jack swagger": ["jack swagger", "jake hager"],
  "mr mcmahon": ["mr mcmahon", "mr. mcmahon", "vince mcmahon"],
  "the rock": ["the rock", "rocky maivia", "dwayne johnson"],
  "triple h": ["triple h", "hunter hearst helmsley", "the game"],
  "kane": ["kane", "glenn jacobs"],
  "rey mysterio": ["rey mysterio", "rey mysterio jr"],
  "cm punk": ["cm punk", "phil brooks"],
  "kevin owens": ["kevin owens", "kevin steen"],
  "sami zayn": ["sami zayn", "el generico"],
  "seth rollins": ["seth rollins", "tyler black"],
  "roman reigns": ["roman reigns", "joe anoa'i"],
  "cody rhodes": ["cody rhodes", "stardust"],
  "randy orton": ["randy orton", "the viper"],
  "bret hart": ["bret hart", "the hitman"],
  "shawn michaels": ["shawn michaels", "hbk", "the heartbreak kid"],
  "ric flair": ["ric flair", "nature boy"],
  "booker t": ["booker t", "king booker"],
  "sting": ["sting", "steve borden"],
  "andre the giant": ["andre the giant", "andre roussimoff"],
  "mark henry": ["mark henry", "world's strongest man"],
  "batista": ["batista", "dave batista"],
  "goldberg": ["goldberg", "bill goldberg"],
  "aj styles": ["aj styles", "phenomenal one"]
};

function findCanonicalName(wrestlerName) {
  const cleanName = wrestlerName.replace(/[^a-zA-Z0-9\s]/g, '').trim().toLowerCase();
  
  for (const [canonical, variations] of Object.entries(wrestlerVariations)) {
    if (variations.some(variation => {
      const cleanVariation = variation.replace(/[^a-zA-Z0-9\s]/g, '').trim().toLowerCase();
      return cleanName === cleanVariation || 
             cleanName.includes(cleanVariation) || 
             cleanVariation.includes(cleanName);
    })) {
      return canonical;
    }
  }
  
  return null; // No match found
}

const parseData = () => {
  const duplicates = [];
  const duplicateGroups = new Map();

  for (const wrestler of wrestlers) {
    const canonicalName = findCanonicalName(wrestler.name);
    
    if (canonicalName) {
      console.log(`✓ Found duplicate: "${wrestler.name}" → "${canonicalName}"`);
      duplicates.push({
        originalName: wrestler.name,
        canonicalName: canonicalName,
        wrestler: wrestler
      });

      // Group duplicates together
      if (!duplicateGroups.has(canonicalName)) {
        duplicateGroups.set(canonicalName, []);
      }
      duplicateGroups.get(canonicalName).push(wrestler);
    }
  }

  console.log('\n=== DUPLICATE SUMMARY ===');
  console.log(`Total duplicates found: ${duplicates.length}`);
  
  console.log('\n=== DUPLICATE GROUPS ===');
  for (const [canonical, wrestlerGroup] of duplicateGroups) {
    if (wrestlerGroup.length > 1) {
      console.log(`\n${canonical.toUpperCase()}:`);
      wrestlerGroup.forEach(w => {
        console.log(`  - ${w.name} (${w.totalReignsAll} reigns, ${w.totalDaysAll} days)`);
      });
    }
  }

  return { duplicates, duplicateGroups };
};

export default parseData;