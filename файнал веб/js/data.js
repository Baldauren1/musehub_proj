import { fetchJsonAny } from './utils.js';

let cache = null;

export async function loadArtistsData(){
  if(cache) return cache;
  cache = await fetchJsonAny(['assets/artists.json', 'artists.json']);
  if(!Array.isArray(cache)) cache = [];
  window.MUSEHUB_DATA = cache;
  return cache;
}
