import { ILanguage } from '../enums/enumLanguageAPI.js';

export const API_URL = `http://api.tcgdex.net/v2/${ILanguage.EN}`; 
export const API_IMAGE_URL = `https://assets.tcgdex.net/${ILanguage.EN}`;

/*
http://api.tcgdex.net/v2/${API_LANGUAGE}/${API_DATA}?${filter}
http://assets.tcgdex.net/${API_LANGUAGE}/${card.id_card.set}/${card.id_card.number}/${quality}.png
*/