import fetchICChampions from './fetchICChampions.js';
import fetchWWEChampions from './fetchWWEChampions.js';



const mergeChampionsData = async () => {
  const combinedMap = new Map();

  const mergeData = (dataArray) => {
    dataArray.forEach(({ name, championship }) => {
      if (!combinedMap.has(name)) {
        combinedMap.set(name, { name, championships: [] });
      }
      combinedMap.get(name).championships.push(championship);
    });
  };

  const icChampionsData = await fetchICChampions();
  const wweChampionsData = await fetchWWEChampions();

 
  mergeData(icChampionsData);
  mergeData(wweChampionsData);

  
  const mergedData = Array.from(combinedMap.values());

  
  const finalData = mergedData.map(wrestler => ({
    Name: wrestler.name,
    Championships: wrestler.championships.map(champ => ({
      Championship: champ.championshipName,
      TotalReigns: champ.totalReigns,
      TotalDaysHeld: champ.totalDaysHeld
    }))
  }));

  console.log(JSON.stringify(finalData, null, 2));
  return finalData;
};

export default mergeChampionsData;

