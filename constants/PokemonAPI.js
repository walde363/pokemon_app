import api from './api_key.js';

const API_BASE = "https://api.pokemontcg.io/v2";

export const PokemonAPI = {
  async getAllSets() {
    console.log("Fetching all sets from Pokemon TCG API...");
    try {
      const res = await fetch(`${API_BASE}/sets?page=1&pageSize=20`, {
        headers: { 'X-Api-Key': api }
    });

      console.log("Status:", res.status);
      console.log("Content-Type:", res.headers.get("content-type"));

      const text = await res.text();
      console.log("Response snippet:", text.slice(0, 200));

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = JSON.parse(text);
      console.log("Fetched sets:", data.data?.length);
      return data.data;
    } catch (err) {
      console.error("Error fetching sets:", err);
      return [];
    }
  },
};
