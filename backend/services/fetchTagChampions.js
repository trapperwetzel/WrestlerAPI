import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

async function fetchTagChampions() {
    console.log("Starting fetch for IC Champions");

    try {
        const resp = await fetch("https://en.wikipedia.org/w/api.php?action=parse&page=List_of_World_Tag_Team_Champions_(WWE)&format=json");
        const data = await resp.json();
        
        
        const htmlContent = data?.parse?.text?.["*"];
        
        const dom = new JSDOM(htmlContent);
        
        const doc = dom.window.document;
        

        
        const tables = doc.querySelectorAll("table.wikitable.sortable");
        console.log(tables);
        const table = tables[2];
        console.log(table);

        if (!table) {
            console.warn("Combined reigns table not found.");
            return [];
        }

        const rows = table.querySelectorAll("tbody tr");
        const transformedData = [];

        rows.forEach((row, index) => {
            
            if (index < 2) return;

            const cells = row.querySelectorAll("th, td");
            const values = Array.from(cells).map(cell =>
                cell.textContent.trim().replace(/\[\d+\]/g, '').replace(/\s+/g, ' ')
            );

            
            if (values.length < 4 || !values[1]) {
                console.log(`Skipping row ${index} due to insufficient data:`, values);
                return;
            }

            
            const rawRank = values[0]?.match(/\d+/)?.[0] || '';
            const rank = parseInt(rawRank, 10);

            
            const rawDays = values[3]?.replace(/[,+–]/g, '') || '0';
            const totalDaysHeld = parseInt(rawDays, 10) || 0;

            // Parse reigns
            const totalReigns = parseInt(values[2], 10) || 0;

            if (isNaN(rank) || isNaN(totalReigns)) {
                console.log(`Skipping row ${index} due to invalid rank or reigns:`, values);
                return;
            }

            transformedData.push({
                id: rank,
                name: values[1].replace(/["']/g, '').trim(),
                championship: "IC Championship",
                totalReigns: totalReigns,
                totalDaysHeld: totalDaysHeld
            });
        });

        transformedData.sort((a, b) => b.totalReigns - a.totalReigns || b.totalDaysHeld - a.totalDaysHeld);

        console.log("Combined Reigns Table:");
        console.table(transformedData);

        return transformedData;

    } catch (err) {
        console.error("Fetch or parse failed:", err);
        return [];
    }
}

export default fetchTagChampions;