import axios from 'axios';

export default async function getAllSets() {
  try {
    const response = await axios.get('https://api.tcgdex.net/v2/en/sets');

    const sorted = [...response.data].reverse();

    return sorted;
  } catch (error) {
    console.error('Error fetching sets:', error);
    return [];
  }
}
