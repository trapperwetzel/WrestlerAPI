import fetchWWEICChampions from './fetchWWEICChampions.js';
import fetchWWETagChampions from './fetchWWETagChampions.js';
import fetchWWEUSChampions from './fetchWWEUSChampions.js';
import fetchWWEChampions from './fetchWWEChampions.js';
import fetchWWEDivasChampions from './fetchWWEDivasChampions.js';
import fetchWWEWomensChampions from './fetchWWEWomensChampions.js';
import fetchWWEHeavyWeightChampions from "./fetchWWEHeavyWeightChampions.js";
import fetchECWHeavyWeightChampions from "./fetchECWHeavyWeightChampions.js";
import fetchAEWChampions from './fetchAEWChampions.js';
import fetchNXTChampions from './fetchNXTChampions.js';
import fetchWCWChampions from './fetchWCWChampions.js';
import fetchAEWTNTChampions from './fetchAEWTNTChampions.js';
import fetchNXTNorthAChampions from './fetchNXTNorthAChampions.js';
import fetchNXTWomensChampions from "./fetchNXTWomensChampions.js";
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
    aewChampions,
    ecwHeavyweightChampions,
    wweHeavyweightChampions,
    wweChampions,
    wweICChampions,
    wweTagChampions,
    wweUSChampions,
    wweDivaChampions,
    wweWomensChampions,
    nxtChampions,
    wcwChampions,
    aewTNTChampions,
    nxtNorthAmericanChampions,
    nxtWomensChampions,
    tnaChampions

  ] = await Promise.all([
    fetchAEWChampions(),
    fetchECWHeavyWeightChampions(),
    fetchWWEHeavyWeightChampions(),
    fetchWWEChampions(),
    fetchWWEICChampions(),
    fetchWWETagChampions(),
    fetchWWEUSChampions(),
    fetchWWEDivasChampions(),
    fetchWWEWomensChampions(),
    fetchNXTChampions(),
    fetchWCWChampions(),
    fetchAEWTNTChampions(),
    fetchNXTNorthAChampions(),
    fetchNXTWomensChampions(),
    fetchTNAChampions()
  ]);

  // Merge all championship data into combinedMap
  [
    aewChampions,
    ecwHeavyweightChampions,
    wweHeavyweightChampions,
    wweChampions,
    wweICChampions,
    wweTagChampions,
    wweUSChampions,
    wweDivaChampions,
    wweWomensChampions,
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
