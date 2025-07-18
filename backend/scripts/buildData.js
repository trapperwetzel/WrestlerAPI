// scripts/build-data.js
import fs from 'fs';
import mergeChampionsData from '../fetches/mergeChampionsData.js';

const buildData = async () => {
  const data = await mergeChampionsData();
  fs.writeFileSync('./wrestlers.json', JSON.stringify(data, null, 2));
  console.log(' Data written to wrestlers.json');
};

buildData();
