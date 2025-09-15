import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';


/*
 getTablesData function:
Takes in the specific url/championship page we want to fetch. 
Outputs the tables on that specific page, which is the HTML content we use and extract data from in our fetch functions.
NOTE:
    We return "tables" because normally there is multiple tables on the page.
    For this reason, we just return tables and in the fetch function we decide which table on that page we are going to use. 
    Which looks like this: const table = tables[1]; OR const table = tables[2] etc
*/


const getTablesData = async (url, retries = 3, delayMs = 1000) => {
    for(let attempt = 1; attempt <= retries; attempt++){
        try {
            const response = await fetch(url);
            
            const data = await response.json();
        
            const htmlContent = data?.parse?.text?.["*"];
            const dom = new JSDOM(htmlContent);
            const doc = dom.window.document;
        
            const tables = doc.querySelectorAll("table.wikitable.sortable");
    } catch (error) {
        console.error("Fetch or parse failed:", error);
        return [];
  }
    }
    

  return tables;

}

export default getTablesData;