import pokemon from 'pokemontcgsdk';
import api from './api_key.js';

pokemon.configure({ apiKey: api });

const getPokemonSets = () =>{
    return pokemon.sets()
}