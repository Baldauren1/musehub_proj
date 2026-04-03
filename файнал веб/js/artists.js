import { resolveImageSrc, debounce, formatNumber, PERSON_PLACEHOLDER } from './utils.js';
import { loadArtistsData } from './data.js';

function makeCardElement(artist){
  const li = document.createElement('li');
  li.className = 'col';
  const card = document.createElement('div');
  card.className = 'card h-100 artist-card';
  card.tabIndex = 0;
  card.setAttribute('role','link');

  const img = document.createElement('img'); img.className = 'card-img-top';
  img.src = resolveImageSrc(artist.image); img.alt = artist.name || 'artist'; img.loading = 'lazy';
  img.onerror = function(){ this.onerror = null; this.src = PERSON_PLACEHOLDER; };

  const body = document.createElement('div'); body.className = 'card-body';
  const title = document.createElement('h5'); title.className='card-title'; title.textContent = artist.name;
  const p = document.createElement('p'); p.className='card-text'; p.textContent = `${artist.genre || '—'} • ${artist.country || '—'}`;
  const listeners = artist.monthly_listeners ?? artist.popularity ?? null;
  const meta = document.createElement('p'); meta.className='small text-muted'; meta.textContent = `Monthly listeners: ${listeners ? formatNumber(listeners) : '—'}`;

  body.append(title,p,meta);
  card.append(img, body);
  li.appendChild(card);

  const go = ()=> window.location.href = `artist.html?id=${encodeURIComponent(artist.id)}`;
  card.addEventListener('click', go);
  card.addEventListener('keydown', (e)=> { if(e.key==='Enter' || e.key===' ') { e.preventDefault(); go(); } });

  return li;
}

export async function initArtistsList(containerId='artist-list', opts = {}){
  const container = document.getElementById(containerId);
  if(!container) return;
  const all = await loadArtistsData();
  const genreSelect = document.getElementById('genre');
  if(genreSelect){
    const genres = Array.from(new Set(all.map(a => a.genre).filter(Boolean))).sort();
    genres.forEach(g => { const o = document.createElement('option'); o.value = g; o.textContent = g; genreSelect.append(o); });
  }
  const sortSelect = document.getElementById('sort');
  if(sortSelect){
    if(!Array.from(sortSelect.options).some(o=>o.value==='monthly_listeners')){
      const o=document.createElement('option'); o.value='monthly_listeners'; o.text='Sort by listeners'; sortSelect.append(o);
    }
    if(!Array.from(sortSelect.options).some(o=>o.value==='genre')){
      const o=document.createElement('option'); o.value='genre'; o.text='Sort by genre'; sortSelect.append(o);
    }
  }

  let filtered = all.slice();
  const globalQ = localStorage.getItem('musehub_search_query');
  if(globalQ){
    const s = document.getElementById('search'); if(s) s.value = globalQ;
    localStorage.removeItem('musehub_search_query');
  }

  function applyFilters(){
    const q = (document.getElementById('search')?.value || '').toLowerCase().trim();
    const genre = document.getElementById('genre')?.value || '';
    const sort = document.getElementById('sort')?.value || 'name';

    filtered = all.filter(a => {
      const hay = (a.name + ' ' + (a.tracks||[]).join(' ') + ' ' + (a.genre||'')).toLowerCase();
      const matchesQ = !q || hay.includes(q);
      const matchesG = !genre || a.genre === genre;
      return matchesQ && matchesG;
    });

    if(sort === 'name') filtered.sort((x,y)=> x.name.localeCompare(y.name));
    else if(sort === 'monthly_listeners') filtered.sort((x,y)=> (y.monthly_listeners||y.popularity||0) - (x.monthly_listeners||x.popularity||0));
    else if(sort === 'genre') filtered.sort((x,y)=> (x.genre||'').localeCompare(y.genre||'') || x.name.localeCompare(y.name));

    container.style.opacity = '0';
    setTimeout(()=> {
      container.innerHTML = '';
      const frag = document.createDocumentFragment();
      filtered.forEach(a => frag.appendChild(makeCardElement(a)));
      container.appendChild(frag);
      container.style.transition = 'opacity .25s';
      container.style.opacity = '1';
    }, 150);
  }

  ['search','genre','sort'].forEach(id => {
    const el = document.getElementById(id);
    if(!el) return;
    const handler = (id==='search') ? debounce(applyFilters, 180) : applyFilters;
    el.addEventListener('input', handler);
    el.addEventListener('change', applyFilters);
  });

  applyFilters();
}
