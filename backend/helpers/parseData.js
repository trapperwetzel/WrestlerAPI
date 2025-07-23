import wrestlers from "./wrestlerData.js";


const parseData = () => {
    for (const wrestler of wrestlers) {
  if (wrestler.name.includes("Hulk Hogan") || 
      wrestler.name.includes("Hollywood Hogan") || 
      wrestler.name.includes("Hollywood Hulk Hogan")) {
    console.log(`Found Hogan variant: ${wrestler.name}`);
  }
}

}

export default parseData;