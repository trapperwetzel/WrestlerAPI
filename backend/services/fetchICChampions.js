import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

async function fetchICChampions() {
    console.log("Starting fetch for IC Champions");

    try {
        const resp = await fetch("https://en.wikipedia.org/w/api.php?action=parse&page=List_of_WWE_Intercontinental_Champions&format=json");
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
        
        // Keep track of the current rank to handle tied positions
        let currentRank = null;

        rows.forEach((row, index) => {
            if (index < 2) return; // Skip header rows

            const cells = row.querySelectorAll("th, td");
            const values = Array.from(cells).map(cell =>
                cell.textContent.trim().replace(/\[\d+\]/g, '').replace(/\s+/g, ' ')
            );
            
            // Skip empty rows or rows with insufficient data
            if (values.length < 4) {
                return;
            }
            
            // Parse rank - handle tied positions
            let rank;
            const firstCell = values[0]?.trim();
            
            // If the first cell contains a number, update currentRank
            if (/^\d+/.test(firstCell)) {
                const rankMatch = firstCell.match(/\d+/);
                if (rankMatch) {
                    currentRank = parseInt(rankMatch[0], 10);
                    rank = currentRank;
                }
            }
            
            // For tied positions (rows starting with a name), use the current rank
            if (!rank && currentRank) {
                rank = currentRank;
            }
            
            // If we couldn't determine a rank, generate one based on array position
            if (!rank) {
                console.warn(`Could not determine rank for row ${index}, using index as fallback`);
                rank = index - 1; // Adjust for header rows
            }
            
            // Determine which index has the name based on whether this is a ranked row or tied row
            const nameIndex = /^\d+/.test(firstCell) ? 1 : 0;
            const name = values[nameIndex]?.replace(/["']/g, '').trim();
            
            // Adjust indexes for reigns and days based on whether we have a rank or not
            const reignsIndex = nameIndex + 1;
            const daysIndex = reignsIndex + 1;
            
            // Parse reigns - handle annotations like [a] in "5[a]"
            let totalReigns = 0;
            const reignsValue = values[reignsIndex];
            if (reignsValue) {
                const cleanReigns = reignsValue.replace(/\[.*?\]/g, '').trim();
                totalReigns = parseInt(cleanReigns, 10) || 0;
            }
            
            // Parse days - handle special cases like "72+" or "<1"
            let totalDaysHeld = 0;
            const daysValue = values[daysIndex];
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
                    id: rank,
                    name: name,
                    championship: "IC Championship",
                    totalReigns: totalReigns,
                    totalDaysHeld: totalDaysHeld
                });
            } else {
                console.log(`Skipping row ${index} due to invalid name or reigns:`, values);
            }
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

export default fetchICChampions;



/*
async function fetchICChampions() {
    console.log("Starting fetch for IC Champions");

    try {
        const resp = await fetch("https://en.wikipedia.org/w/api.php?action=parse&page=List_of_WWE_Intercontinental_Champions&format=json");
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
        
        // Keep track of the current rank to handle tied positions
        let currentRank = null;

        rows.forEach((row, index) => {
            if (index < 2) return; // Skip header rows

            const cells = row.querySelectorAll("th, td");
            const values = Array.from(cells).map(cell =>
                cell.textContent.trim().replace(/\[\d+\]/g, '').replace(/\s+/g, ' ')
            );
            
            // Skip empty rows or rows with insufficient data
            if (values.length < 4) {
                return;
            }
            
            // Parse rank - handle tied positions
            let rank;
            const firstCell = values[0]?.trim();
            
            // If the first cell contains a number, update currentRank
            if (/^\d+/.test(firstCell)) {
                const rankMatch = firstCell.match(/\d+/);
                if (rankMatch) {
                    currentRank = parseInt(rankMatch[0], 10);
                    rank = currentRank;
                }
            }
            
            // For tied positions (rows starting with a name), use the current rank
            if (!rank && currentRank) {
                rank = currentRank;
            }
            
            // If we couldn't determine a rank, generate one based on array position
            if (!rank) {
                console.warn(`Could not determine rank for row ${index}, using index as fallback`);
                rank = index - 1; // Adjust for header rows
            }
            
            // Determine which index has the name based on whether this is a ranked row or tied row
            const nameIndex = /^\d+/.test(firstCell) ? 1 : 0;
            const name = values[nameIndex]?.replace(/["']/g, '').trim();
            
            // Adjust indexes for reigns and days based on whether we have a rank or not
            const reignsIndex = nameIndex + 1;
            const daysIndex = reignsIndex + 1;
            
            // Parse reigns - handle annotations like [a] in "5[a]"
            let totalReigns = 0;
            const reignsValue = values[reignsIndex];
            if (reignsValue) {
                const cleanReigns = reignsValue.replace(/\[.*?\]/g, '').trim();
                totalReigns = parseInt(cleanReigns, 10) || 0;
            }
            
            // Parse days - handle special cases like "72+" or "<1"
            let totalDaysHeld = 0;
            const daysValue = values[daysIndex];
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
                    id: rank,
                    name: name,
                    championship: "IC Championship",
                    totalReigns: totalReigns,
                    totalDaysHeld: totalDaysHeld
                });
            } else {
                console.log(`Skipping row ${index} due to invalid name or reigns:`, values);
            }
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

export default fetchICChampions;
*/