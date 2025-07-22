import fetchICChampions from './fetchICChampions.js';
import fetchTagChampions from './fetchTagChampions.js';
import fetchUSChampions from './fetchUSChampions.js';
import fetchWWEChampions from './fetchWWEChampions.js';
import fetchDivaChampions from './fetchDivasChampions.js';
import fetchWomensChampionship from './fetchWomensChampionship.js';
import fetchWWEHeavyWeightChampions from "./fetchWWEHeavyWeightChampions.js";
import fetchECWHeavyWeightChampions from "./fetchECWHeavyWeightChampions.js";
import fetchAEWChampions from './fetchAEWChampions.js';
import fetchNXTChampions from './fetchNXTChampions.js';
import fetchWCWChampions from './fetchWCWChampions.js';
import fetchAEWTNTChampions from './fetchAEWTNTChampions.js';
import fetchNXTNorthAChampions from './fetchNXTNorthAChampions.js';
import fetchNXTWomensChampionship from "./fetchNXTWomensChampionship.js";
import fetchTNAChampions from './fetchTNAChampions.js';
const mergeChampionsData = async () => {
  const combinedMap = new Map();

  const mergeData = (dataArray) => {
    dataArray.forEach(({ name, championship }) => {
      if (!name || !championship?.championshipName) return;

      const cleanKey = name.replace(/[^a-zA-Z0-9\s]/g, '').trim().toLowerCase();

      if (!combinedMap.has(cleanKey)) {
        combinedMap.set(cleanKey, { name: name.trim(), championships: [] });
      }
      combinedMap.get(cleanKey).championships.push(championship);
    });
  };

  // Fetch all championship data
  const [
    wweICChampions,
    wweChampions,
    wweTagChampions,
    usChampions,
    divaChampions,
    womensChampions,
    wweHeavyweight,
    ecwHeavyweight,
    aewChampions,
    nxtChampions,
    wcwChampions,
    aewTNTChampions,
    nxtNorthAmericanChampions,
    nxtWomensChampions,
    tnaChampions

  ] = await Promise.all([
    fetchICChampions(),
    fetchWWEChampions(),
    fetchTagChampions(),
    fetchUSChampions(),
    fetchDivaChampions(),
    fetchWomensChampionship(),
    fetchWWEHeavyWeightChampions(),
    fetchECWHeavyWeightChampions(),
    fetchAEWChampions(),
    fetchNXTChampions(),
    fetchWCWChampions(),
    fetchAEWTNTChampions(),
    fetchNXTNorthAChampions(),
    fetchNXTWomensChampionship(),
    fetchTNAChampions()
  ]);

  // Merge all championship data into combinedMap
  [
    wweICChampions,
    wweChampions,
    wweTagChampions,
    usChampions,
    divaChampions,
    womensChampions,
    wweHeavyweight,
    ecwHeavyweight,
    aewChampions,
    nxtChampions,
    wcwChampions,
    aewTNTChampions,
    nxtNorthAmericanChampions,
    nxtWomensChampions,
    tnaChampions
  ].forEach(mergeData);


  const mergedData = Array.from(combinedMap.values()).filter(
    w => w.championships.length
  );

  const finalData = mergedData.map(wrestler => {
    const totals = wrestler.championships.reduce(
      (acc, ch) => ({
        reigns: acc.reigns + ch.totalReigns,
        days: acc.days + ch.totalDaysHeld
      }),
      { reigns: 0, days: 0 }
    );

    return {
      name: wrestler.name,
      totalReignsAll: totals.reigns,
      totalDaysAll: totals.days,
      championships: wrestler.championships
    };
  });


  console.table(finalData);
  return finalData;
};
export default mergeChampionsData;