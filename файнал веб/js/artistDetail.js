import { resolveImageSrc, PERSON_PLACEHOLDER } from './utils.js';
import { loadArtistsData } from './data.js';

function getIdFromUrl(){
  const p = new URLSearchParams(location.search);
  return p.get('id');
}

export async function initArtistDetail(){
  const id = getIdFromUrl();
  if(!id) return;
  const all = await loadArtistsData();
  let artist = all.find(a => a.id === id);
  if(!artist){
    const lower = id.toLowerCase();
    artist = all.find(a => (a.id && a.id.toLowerCase() === lower) || (a.name && a.name.toLowerCase() === lower));
  }
  if(!artist){
    const el = document.getElementById('artist-name'); if(el) el.textContent = 'Artist not found'; return;
  }

  const titleEl = document.getElementById('artist-name'); if(titleEl) titleEl.textContent = artist.name;
  const img = document.getElementById('artist-photo'); if(img){
    img.src = resolveImageSrc(artist.image); img.loading = 'lazy';
    img.onerror = function(){ img.onerror = null; img.src = PERSON_PLACEHOLDER; };
  }
  const g = document.getElementById('artist-genre'); if(g) g.textContent = artist.genre || '—';
  const c = document.getElementById('artist-country'); if(c) c.textContent = artist.country || '—';
  const bio = document.getElementById('artist-bio'); if(bio) bio.textContent = artist.bio || '';

  const ol = document.getElementById('artist-tracks'); if(ol){
    ol.innerHTML = '';
    (artist.tracks || []).forEach(t => {
      const li = document.createElement('li');
      const span = document.createElement('span');
      span.textContent = t;
      span.className = 'btn btn-outline-secondary btn-sm';
      span.style.margin = '6px 0';
      span.style.cursor = 'default';
      span.style.pointerEvents = 'none';
      li.appendChild(span);
      ol.appendChild(li);
    });
  }

  const favBtn = document.getElementById('favorite-button');
  if(favBtn){
    const favs = JSON.parse(localStorage.getItem('musehub_favs') || '[]');
    favBtn.textContent = favs.includes(artist.id) ? 'In favorites' : 'Add to favorites';
    favBtn.onclick = () => {
      let f = JSON.parse(localStorage.getItem('musehub_favs') || '[]');
      if(f.includes(artist.id)){ f = f.filter(x=>x!==artist.id); favBtn.textContent = 'Add to favorites'; }
      else { f.push(artist.id); favBtn.textContent = 'In favorites'; }
      localStorage.setItem('musehub_favs', JSON.stringify(f));
    };
  }
}
