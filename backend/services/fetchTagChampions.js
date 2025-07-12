import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

async function fetchTagChampions() {
    console.log("Starting fetch for Tag Champions");

    try {
        const resp = await fetch("https://en.wikipedia.org/w/api.php?action=parse&page=List_of_World_Tag_Team_Champions_(WWE)&format=json");
        const data = await resp.json();
        
        
        const htmlContent = data?.parse?.text?.["*"];
        
        const dom = new JSDOM(htmlContent);
        
        const doc = dom.window.document;
        

        
        const tables = doc.querySelectorAll("table.wikitable.sortable");
        console.log(tables);
        const table = tables[1];
        console.log(table);

        if (!table) {
            console.warn("Combined reigns table not found.");
            return [];
        }

        const rows = table.querySelectorAll("tbody tr");
        console.log("Rows found:", rows.length);
        
        const transformedData = [];

        rows.forEach((row, index) => {
            
            if (index < 2) return;

            const cells = row.querySelectorAll("th, td");
            const values = Array.from(cells).map(cell =>
                cell.textContent.trim().replace(/\[\d+\]/g, '').replace(/\s+/g, ' ')
            );
            
            console.log(values);

            
            const firstCell = values[0]?.trim();
            
            // Determine if the first cell is a number or a name
            let nameIndex = isNaN(firstCell) ? 0 : 1; 
            const name = values[nameIndex]?.replace(/["']/g, '').trim();
            
            
            const reignsIndex = nameIndex + 1;
            const totaldaysIndex = reignsIndex + 1;
            
            // Parse reigns - handle annotations like [a] in "5[a]"
            let totalReigns = 0;
            const reignsValue = values[reignsIndex];
            if (reignsValue) {
                const cleanReigns = reignsValue.replace(/\[.*?\]/g, '').trim();
                totalReigns = parseInt(cleanReigns, 10) || 0;
            }
            
            // Parse days - handle special cases like "72+" or "<1"
            let totalDaysHeld = 0;
            const daysValue = values[totaldaysIndex];
            if (daysValue) {
                if (daysValue === '<1') {
                    totalDaysHeld = 0;
                } else if (daysValue.includes('+')) {
                    // For current champion with ongoing reign, use the number part
                    totalDaysHeld = parseInt(daysValue.replace(/[+]/g, ''), 10) || 0;
                } else {
                    totalDaysHeld = parseInt(daysValue.replace(/[,+–]/g, ''), 10) || 0;
                }
            }
            
            // Only add the entry if we have a valid name and reigns count
            if (name && !isNaN(totalReigns)) {
                transformedData.push({
                    
                    name: name,
                    championshipName: "Tag Championship",
                    championship:{ 
                        championshipName: "Tag Championship",
                        totalReigns: totalReigns,
                        totalDaysHeld: totalDaysHeld
                    },
                    totalReigns: totalReigns,
                    totalDaysHeld: totalDaysHeld
                });
            } else {
                console.log(`Skipping row ${index} due to invalid name or reigns:`, values);
            }
        });

        transformedData.sort((a, b) => b.totalReigns - a.totalReigns || b.totalDaysHeld - a.totalDaysHeld);

        
        console.table(transformedData);

        return transformedData;

    } catch (err) {
        console.error("Fetch or parse failed:", err);
        return [];
    }
}

export default fetchTagChampions;