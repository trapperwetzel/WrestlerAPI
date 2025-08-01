import wrestlers from "../wrestlerData.js";
import fs from "fs";
import path from "path";

import wrestlerVariations from "./wrestlerVariations.js"; 

function normalizeName(name) {
  return name.replace(/[^a-zA-Z0-9\s]/g, '').trim().toLowerCase();
}


function capitalizeWords(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

function findMainGimmick(name) {
  const cleanName = normalizeName(name);

  for (const [canonical, aliases] of Object.entries(wrestlerVariations)) {
    if (aliases.map(normalizeName).includes(cleanName)) return canonical;
  }

  return capitalizeWords(name.trim()); // fallback to capitalized original
}

function buildDataset() {
  const mergedMap = new Map();

  for (const wrestler of wrestlers) {
    const mainName = findMainGimmick(wrestler.name);

    if (!mergedMap.has(mainName)) {
      mergedMap.set(mainName, {
        name: mainName,
        totalReignsAll: 0,
        totalDaysAll: 0,
        championships: []
      });
    }

    const entry = mergedMap.get(mainName);

    entry.totalReignsAll += wrestler.totalReignsAll || 0;
    entry.totalDaysAll   += wrestler.totalDaysAll || 0;
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