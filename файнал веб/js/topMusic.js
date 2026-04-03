import { resolveImageSrc } from './utils.js';
import { playerAPI } from './player.js';

async function loadTracksExternal() {
  try {
    const res = await fetch('assets/top-music.json');
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json) && json.length) return json;
    }
  } catch (e) {
  }
  return [
    { id:'t1', title:'Memories — Maroon 5', artist:'Maroon 5', duration:'04:20', art:'assets/images/memories.jpg' },
    { id:'t2', title:'Anti-Hero — Taylor Swift', artist:'Taylor Swift', duration:'03:54', art:'assets/images/anti-hero.jpg' },
    { id:'t3', title:'Blinding Lights — The Weeknd', artist:'The Weeknd', duration:'03:20', art:'assets/images/blinding-lights.jpg' }
  ];
}

function makeRow(track){
  const row = document.createElement('div');
  row.className = 'track-row';
  row.dataset.trackId = track.id || '';

  const left = document.createElement('div'); left.className = 'track-left';
  const img = document.createElement('img');
  img.src = resolveImageSrc(track.art || track.image || '');
  img.alt = track.title || 'track';
  img.loading = 'lazy';
  img.onerror = function(){ this.onerror = null; this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="%230b0b0b"/></svg>'; };

  const tt = document.createElement('div'); tt.className = 'track-title';
  const t = document.createElement('div'); t.className = 'title'; t.textContent = track.title || '—';
  const m = document.createElement('div'); m.className = 'meta'; m.textContent = `${track.artist || 'Unknown'} • ${track.duration || '—'}`;

  tt.append(t,m);
  left.append(img, tt);

  const controls = document.createElement('div'); controls.className = 'track-controls';
  const btnPlay = document.createElement('button'); btnPlay.className='btn-play'; btnPlay.setAttribute('aria-label','Play');
  btnPlay.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#icon-play"></use></svg>`;
  const btnLike = document.createElement('button'); btnLike.className='btn-like'; btnLike.setAttribute('aria-label','Like');
  btnLike.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#icon-heart"></use></svg>`;

  controls.append(btnPlay, btnLike);
  row.append(left, controls);

  btnPlay.addEventListener('click', (e)=> {
    e.stopPropagation();
    document.querySelectorAll('.track-row').forEach(r=> r.classList.remove('active'));
    row.classList.add('active');
    if(playerAPI && playerAPI.setNowPlaying) playerAPI.setNowPlaying(track.title || '—');
    const footerUse = document.querySelector('#svg-play-state use');
    if(footerUse) footerUse.setAttribute('href', '#icon-pause');
    const useEl = btnPlay.querySelector('use'); if(useEl) useEl.setAttribute('href', '#icon-pause');
    document.querySelectorAll('.track-row .btn-play use').forEach(u => {
      if(u !== useEl) u.setAttribute('href', '#icon-play');
    });
  });

  btnLike.addEventListener('click', (e)=> { e.stopPropagation(); const liked = btnLike.classList.toggle('liked'); btnLike.setAttribute('aria-pressed', String(liked)); });

  row.addEventListener('click', ()=> btnPlay.click());

  return row;
}

export async function initTopMusic(containerId='top-music-list', data=[]){
  const container = document.getElementById(containerId);
  if(!container) return;

  let tracks = [];
  if(Array.isArray(data) && data.length){
    tracks = data.slice(0,12).map((a,idx)=>({
      id: a.id || `t-${idx}`,
      title: (a.tracks && a.tracks[0]) || (a.name ? `${a.name} — Best` : `Track ${idx+1}`),
      artist: a.name || 'Unknown',
      duration: a.duration || '03:30',
      art: a.image || a.art || 'assets/images/placeholder-track.jpg'
    }));
  } else {
    tracks = await loadTracksExternal();
  }

  if(!Array.isArray(tracks)) tracks = [];

  container.innerHTML = '';
  tracks.forEach(t => container.appendChild(makeRow(t)));
}
