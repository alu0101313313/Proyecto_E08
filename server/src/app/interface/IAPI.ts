import { ILanguage } from '../enums/enumLanguageAPI.js';
import TCGdex from '@tcgdex/sdk';

export const tcgdex = new TCGdex(`${ILanguage.EN}`); 

/*
http://api.tcgdex.net/v2/${API_LANGUAGE}/${API_DATA}?${filter}
http://assets.tcgdex.net/${API_LANGUAGE}/${card.id_card.set}/${card.id_card.number}/${quality}.png
*/