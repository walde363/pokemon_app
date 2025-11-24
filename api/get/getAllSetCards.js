const axios = require('axios');


export default async function getAllSetCards(setID) {
    try {
    const response = await axios.get(`https://api.tcgdex.net/v2/en/sets/${setID}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sets:', error);
  }
};
