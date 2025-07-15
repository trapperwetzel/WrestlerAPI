import fetchICChampions from './fetchICChampions.js';
import fetchTagChampions from './fetchTagChampions.js';
import fetchWWEChampions from './fetchWWEChampions.js';

const mergeChampionsData = async () => {
  const combinedMap = new Map();

  const mergeData = (dataArray) => {
    dataArray.forEach(({ name, championship }) => {
      if (!name || !championship || !championship.championshipName) return;

      // Normalize name
      const cleanKey = name.replace(/[^a-zA-Z0-9\s]/g, '').trim().toLowerCase();

      if (!combinedMap.has(cleanKey)) {
        combinedMap.set(cleanKey, {
          name: name.trim(),
          championships: [],
        });
      }

      combinedMap.get(cleanKey).championships.push(championship);
    });
  };

  const icChampionsData = await fetchICChampions();
  const wweChampionsData = await fetchWWEChampions();
  const tagChampionsData = await fetchTagChampions();

  mergeData(icChampionsData);
  mergeData(wweChampionsData);
  mergeData(tagChampionsData);
  

  const mergedData = Array.from(combinedMap.values()).filter(w => w.championships.length > 0);

  const finalData = mergedData.flatMap(wrestler =>
    wrestler.championships.map(champ => ({
      name: wrestler.name,
      championship: champ.championshipName,
      totalReigns: champ.totalReigns,
      totalDaysHeld: champ.totalDaysHeld,
    }))
  );

  return finalData;
};

export default mergeChampionsData;
