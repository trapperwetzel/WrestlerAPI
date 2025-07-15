import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';


const fetchWWEHeavyWeightChampions = async () => {
  console.log("Starting fetch for WWE HeavyWeight Champions");
  try {
    const resp = await fetch("https://en.wikipedia.org/w/api.php?action=parse&page=List_of_World_Heavyweight_Champions_(WWE,_2002–2013)&format=json");
    const data = await resp.json();

    const htmlContent = data?.parse?.text?.["*"];
    const dom = new JSDOM(htmlContent);
    const doc = dom.window.document;

    const tables = doc.querySelectorAll("table.wikitable.sortable");
    const table = tables[1];
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
      
      

      const firstCell = values[0]?.trim();
      let nameIndex = isNaN(firstCell) ? 0 : 1;
      console.log("Name Index:", nameIndex, "Name:", values[nameIndex]);
      const name = values[nameIndex]?.replace(/["']/g, '').trim();

      const reignsIndex = nameIndex + 1;
      const totaldaysIndex = reignsIndex + 1;

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

      if (name && !isNaN(totalReigns)) {
        transformedData.push({
          name: name,
          championship: {
            championshipName: "WWE Heavyweight Championship",
            totalReigns,
            totalDaysHeld,
          },
        });
      }
    });
    
    return transformedData;

  } catch (err) {
    console.error("Fetch or parse failed:", err);
    return [];
  }
}

export default fetchWWEHeavyWeightChampions;
