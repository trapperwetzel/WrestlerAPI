import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

async function fetchWWEChampions() {
  console.log("Starting fetch for WWE Champions");

  try {
    const resp = await fetch("https://en.wikipedia.org/w/api.php?action=parse&page=List_of_WWE_Champions&format=json&origin=*");
    const data = await resp.json();

    const htmlContent = data?.parse?.text?.["*"];
    const dom = new JSDOM(htmlContent);
    const doc = dom.window.document;

    const tables = doc.querySelectorAll("table.wikitable.sortable");
    const table = tables[2];

    if (!table) {
      console.warn("Target table not found.");
      return [];
    }

    const rows = table.querySelectorAll("tbody tr");
    const transformedData = [];

    rows.forEach((row, index) => {
      if (index < 2) return;

      const cells = row.querySelectorAll("th, td");
      const values = Array.from(cells).map((cell) =>
        cell.textContent.trim().replace(/\[\d+\]/g, '')
      );

      const rawRank = values[0]?.replace(/\D/g, '');
      const rank = parseInt(rawRank, 10);
      if (isNaN(rank) || values.length < 4 || !values[1]) return;

      const totalReigns = parseInt(values[2], 10);
      const totalDaysHeld = parseInt(values[3].replace(/,/g, ''), 10) || 0;

      const name = values[1].replace(/["']/g, '').trim();

      transformedData.push({
        name:name,
        championship: {
          championshipName: "WWE Championship",
          totalReigns,
          totalDaysHeld,
        },
      });
    });

    transformedData.sort((a, b) => b.totalReigns - a.totalReigns);

    return transformedData;

  } catch (err) {
    console.error("Fetch or parse failed:", err);
    return [];
  }
}

export default fetchWWEChampions;
