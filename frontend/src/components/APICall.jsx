import React, { useEffect } from 'react';



// Get the list of WWE Champions from the table on Wikipedia using the Wiki API
export default async function fetchWWEChampions() {
  console.log("Starting fetch for WWE Champions");

  try {
    const resp = await fetch("https://en.wikipedia.org/w/api.php?action=parse&page=List_of_WWE_Champions&format=json&origin=*");
    const data = await resp.json();

    const htmlContent = data?.parse?.text?.["*"];
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    const tables = doc.querySelectorAll("table.wikitable.sortable");
    const table = tables[2];

    if (!table) {
      console.warn(" Target table not found.");
      return [];
    }

    const rows = table.querySelectorAll("tbody tr");
    
    // initalize array for the data from wiki 
    const transformedData = [];

    rows.forEach((row, index) => {
      if (index < 2) return;

      const cells = row.querySelectorAll("th, td");
      const values = Array.from(cells).map((cell) =>
        cell.textContent.trim().replace(/\[\d+\]/g, '')
      );
      console.log(values);
      const rawRank = values[0]?.replace(/\D/g, '');
      const rank = parseInt(rawRank, 10);
      if (isNaN(rank) || values.length < 4 || !values[1]) return;


      transformedData.push({
        id: rank,
        rank,
        name: values[1].replace(/["']/g,'').trim(),
        championship: [
            {
                title: "WWE Championship",
                times: values[2]
            }
        ],
        totalReigns: parseInt(values[2],10), // This is for the ability to sort based on reigns.
        totalDaysHeld: parseInt(values[3].replace(/,/g,''),10) || 0
      });
    });

    transformedData.sort((a, b) => b.totalReigns - a.totalReigns); // Start table sorting by most title reigns

    console.log("Table results:");
    console.table(transformedData); 
    
    return transformedData;

  } catch (err) {
    console.error(" Fetch or parse failed:", err);
    return [];
  }
}



/* 
CALL FOR MORE INFO 
React.useEffect(() => {
    fetch("https://en.wikipedia.org/w/api.php?action=parse&page=List_of_WWE_Champions&format=json&origin=*")
        .then((resp) => resp.json())
        .then((data) => {
            const htmlContent = data?.parse?.text?.["*"];
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, "text/html");

            const table = doc.querySelector("table.wikitable.sortable");
            //<table class="wikitable sortable jquery-tablesorter"
            if (!table) {
                console.warn(" Table not found.");
                return;
            }

            const rows = table.querySelectorAll("tbody tr");
            const result = [];

            for (const row of rows) {
                const cells = row.querySelectorAll("td, th");

                // Some rows (like headers or federation rows) won't have enough cells
                if (cells.length < 9) continue;

                // Extract relevant cell text
                const values = Array.from(cells).map((cell) =>
                    cell.textContent.trim().replace(/\[\d+\]/g, '') // Remove reference numbers like [1]
                );

                const item = {
                    no: values[0],
                    champion: values[1],
                    date: values[2],
                    event: values[3],
                    location: values[4],
                    reign: values[5],
                    days: values[6],
                    daysRecognized: values[7],
                    notes: values[8]
                };

                result.push(item);
            }

            
            console.log("Log Table")
            console.table(result)
        })
        .catch((err) => {
            console.error("Error fetching/parsing Wikipedia:", err);
        });
}, []);
*/

