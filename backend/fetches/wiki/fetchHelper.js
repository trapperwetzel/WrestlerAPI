// DEFINING THE WIKI FETCH SO FETCHES CAN GET EASIER.
//
//
//
//
//
//
//
//

const BASE_URL = "https://en.wikipedia.org/w/api.php?action=parse&page=";
const API_PARAMS = "&prop=text&format=json&origin=*";

const buildWikiUrl = (pageTitle) => {
    return BASE_URL + pageTitle + API_PARAMS;
}



export default buildWikiUrl; 