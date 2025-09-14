import mergeChampionsData from "../../fetches/mergeChampionsData.js";
import wrestlerVariations from "./wrestlerVariations.js";

const wrestlers = await mergeChampionsData();
function findDuplicateName(wrestlerName) {
  
  
  const cleanName = wrestlerName.replace(/[^a-zA-Z0-9\s]/g, '').trim().toLowerCase();
  
  for (const [duplicate, variations] of Object.entries(wrestlerVariations)) {
    if (variations.some(variation => {
      const cleanVariation = variation.replace(/[^a-zA-Z0-9\s]/g, '').trim().toLowerCase();
      return cleanName === cleanVariation || 
             cleanName.includes(cleanVariation) || 
             cleanVariation.includes(cleanName);
    })) {
      return duplicate;
    }
  }
  
  return null; // No match found
}

const parseDuplicateData = () => {
  const duplicates = [];
  const duplicateGroups = new Map();

  for (const wrestler of wrestlers) {
    const duplicateName = findDuplicateName(wrestler.name);
    
    if (duplicateName) {
      console.log(`✓ Found duplicate: "${wrestler.name}" → "${duplicateName}"`);
      duplicates.push({
        originalName: wrestler.name,
        duplicateName: duplicateName,
        wrestler: wrestler
      });

      // Group duplicates together
      if (!duplicateGroups.has(duplicateName)) {
        duplicateGroups.set(duplicateName, []);
      }
      duplicateGroups.get(duplicateName).push(wrestler);
    }
  }

  console.log('\n=== DUPLICATE SUMMARY ===');
  console.log(`Total duplicates found: ${duplicates.length}`);
  
  console.log('\n=== DUPLICATE GROUPS ===');
  for (const [duplicate, wrestlerGroup] of duplicateGroups) {
    if (wrestlerGroup.length > 1) {
      console.log(`\n${duplicate.toUpperCase()}:`);
      wrestlerGroup.forEach(w => {
        console.log(`  - ${w.name} (${w.totalReignsAll} reigns, ${w.totalDaysAll} days)`);
      });
    }
  }

  return { duplicates, duplicateGroups };
};

export default parseDuplicateData;