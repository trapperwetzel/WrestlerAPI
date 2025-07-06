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

    const icChampionsData = fetchICChampions();
    const wweChampionsData = fetchWWEChampions();
    mergeData(icChampionsData);
    mergeData(wweChampionsData);

    const mergedData = Array.from(combinedMap.values());
    console.log(mergedData);


    let data = [];
    
    mergedData.forEach(wrestler => {
       push({Name: wrestler.name,
        Championship: wrestler.championship.championshipName,
        TotalReigns: wrestler.championship.totalReigns,
        TotalDaysHeld: wrestler.championship.totalDaysHeld
       })
    });
    console.log(data);

    return data;
}

export default mergeChampionsData;
