import mergeChampionsData from "../../fetches/mergeChampionsData.js";
import fs from "fs";
import path from "path";
import wrestlerVariations from "./wrestlerVariations.js"; 
import federations from "../federations.js";

const wrestlers = await mergeChampionsData();

const normalizeName = (name) => {
  return name.replace(/[^a-zA-Z0-9\s]/g, '').trim().toLowerCase();
}

const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

const findMainGimmick = (name) => {
  const cleanName = normalizeName(name);

  for (const [finalName, aliases] of Object.entries(wrestlerVariations)) {
    if (aliases.map(normalizeName).includes(cleanName)) return finalName;
  }

  return capitalizeWords(name.trim()); // fallback to capitalized original
}

// find the federations the wrestler is apart of
// take the wrestlers championship array, and search from the strings "AEW", "TNA", "WWE"
// const findFederations = (championships) => {

    

//  }

const buildDataset = () => {
  const mergedMap = new Map();

  for (const wrestler of wrestlers) {
    const mainName = findMainGimmick(wrestler.name);

    if (!mergedMap.has(mainName)) {
      mergedMap.set(mainName, {
        name: mainName,
        championships: []
      });
    }

    const entry = mergedMap.get(mainName);

    entry.championships.push(...wrestler.championships || []);
  }

  return Array.from(mergedMap.values());
}

// Write to JSON
const wrestlerData = buildDataset();

fs.writeFileSync(
  path.resolve("./officalWrestlers.json"),
  JSON.stringify(wrestlerData, null, 2)
);

console.log("Offical wrestler data written to src/officalWrestlers.json");

export default buildDataset;