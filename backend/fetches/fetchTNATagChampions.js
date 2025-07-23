import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import buildWikiUrl from "./wiki/fetchHelper.js";

const fetchTNATagChampions = async () => {

  const url = buildWikiUrl("List of TNA World Tag Team Champions")
  if (!url) {
    console.error("Failed to build URL for TNA Tag Champions");
    return [];
  }
  console.log("Starting fetch for TNA Tag Champions");
  try {
    const resp = await fetch(url);
    const data = await resp.json();

    const htmlContent = data?.parse?.text?.["*"];
    const dom = new JSDOM(htmlContent);
    const doc = dom.window.document;

    const tables = doc.querySelectorAll("table.wikitable.sortable");
    const table = tables[2];
    if (!table) {
      console.warn("Combined reigns table not found.");
      return [];
    }

    const rows = table.querySelectorAll("tbody tr");
    const transformedData = [];

    rows.forEach((row, index) => {
      if (index < 1) return;

      const cells = row.querySelectorAll("th, td");
      const values = Array.from(cells).map(cell =>
        cell.textContent.trim().replace(/\[\d+\]/g, '').replace(/\s+/g, ' ')
      );
      
      
      // Log raw values for debugging
      console.log(`Row ${index} raw values:`, values);
      
      const firstCell = values[0]?.trim();
      let nameIndex = isNaN(firstCell) ? 0 : 1;
      
      console.log(`Row ${index} - First cell: "${firstCell}", Name Index: ${nameIndex}`);
      
      const name = values[nameIndex]?.replace(/["']/g, '').trim();
      console.log(`Row ${index} - Name: "${name}"`);

      const reignsIndex = nameIndex + 1;
      const totaldaysIndex = reignsIndex + 1;
      
      console.log(`Row ${index} - Reigns Index: ${reignsIndex}, Days Index: ${totaldaysIndex}`);
      console.log(`Row ${index} - Reigns Value: "${values[reignsIndex]}", Days Value: "${values[totaldaysIndex]}"`);

      let totalReigns = 0;
      const reignsValue = values[reignsIndex];
      if (reignsValue) {
        const cleanReigns = reignsValue.replace(/\[.*?\]/g, '').trim();
        totalReigns = parseInt(cleanReigns, 10) || 0;
      }

      let totalDaysHeld = 0;
      const daysValue = values[totaldaysIndex];
      if (daysValue) {
        if (daysValue === '<1') {
          totalDaysHeld = 0;
        } else if (daysValue.includes('+')) {
          totalDaysHeld = parseInt(daysValue.replace(/[+]/g, ''), 10) || 0;
        } else {
          totalDaysHeld = parseInt(daysValue.replace(/[,+–]/g, ''), 10) || 0;
        }
      }
      console.log(rows[index-1]);
      

      if (name && !isNaN(totalReigns)) {
        transformedData.push({
          name: name,
          championship: {
            championshipName: "TNA Tag Championship",
            totalReigns,
            totalDaysHeld,
          },
        });
      }
    });
    console.log("Transformed Data:", transformedData);
    return transformedData;

  } catch (err) {
    console.error("Fetch or parse failed:", err);
    return [];
  }
}

export default fetchTNATagChampions;
