import fetchICChampions from './services/fetchICChampions.js'
import fetchWWEChampions from './services/fetchWWEChampions.js';
import mergeChampionsData from './services/mergeChampionsData.js';

fetchICChampions();
fetchWWEChampions();
mergeChampionsData();