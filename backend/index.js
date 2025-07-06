import fetchICChampions from './services/fetchICChampions.js'
import fetchWWEChampions from './services/fetchWWEChampions.js';
import connectChampionsData from './services/connectChampionsData.js';

fetchICChampions();
fetchWWEChampions();
connectChampionsData();