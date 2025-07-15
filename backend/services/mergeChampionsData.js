import fetchICChampions      from './fetchICChampions.js';
import fetchTagChampions     from './fetchTagChampions.js';
import fetchUSChampions      from './fetchUSChampions.js';
import fetchWWEChampions     from './fetchWWEChampions.js';
import fetchDivaChampions    from './fetchDivasChampions.js';
import fetchWomensChampionship from './fetchWomensChampionship.js';

const mergeChampionsData = async () => {
  const combinedMap = new Map();

  const mergeData = dataArray => {
    dataArray.forEach(({ name, championship }) => {
      if (!name || !championship?.championshipName) return;

      const cleanKey = name.replace(/[^a-zA-Z0-9\s]/g, '').trim().toLowerCase();

      if (!combinedMap.has(cleanKey)) {
        combinedMap.set(cleanKey, { name: name.trim(), championships: [] });
      }
      combinedMap.get(cleanKey).championships.push(championship);
    });
  };

  mergeData(await fetchICChampions());
  mergeData(await fetchWWEChampions());
  mergeData(await fetchTagChampions());
  mergeData(await fetchUSChampions());
  mergeData(await fetchDivaChampions());
  mergeData(await fetchWomensChampionship());
  
  
  const mergedData = Array.from(combinedMap.values()).filter(
    w => w.championships.length
  );

  const finalData = mergedData.map(wrestler => {
    const totals = wrestler.championships.reduce(
      (acc, ch) => ({ reigns: acc.reigns + ch.totalReigns,
                      days:   acc.days  + ch.totalDaysHeld }),
      { reigns: 0, days: 0 }
    );

    return {
      name: wrestler.name,
      totalReignsAll: totals.reigns,
      totalDaysAll:   totals.days,
      championships:  wrestler.championships
    };
  });
  finalData.sort((a, b) => b.totalReignsAll - a.totalReignsAll);
  console.table(finalData);         
  return finalData;                  
};                                  

export default mergeChampionsData;   
