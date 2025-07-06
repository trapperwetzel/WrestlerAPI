import fetchICChampions from '../fetchICChampions.js';
import fetchWWEChampions from './fetchWWEChampions.js';


async function connectChampionsData() {
    
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

    const mergedData = Array.from(combindedMap.values());
    console.log(mergedData);

    return mergedData;
}

export default connectChampionsData;
