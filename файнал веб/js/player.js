export function initPlayer(){
  const playBtn = document.getElementById('btn-play');
  const svgUse = document.querySelector('#svg-play-state use');
  const nowEl = document.getElementById('now-playing');
  const likeBtn = document.getElementById('btn-like');

  function setPlayIcon(isPlaying){
    if(svgUse) svgUse.setAttribute('href', isPlaying ? '#icon-pause' : '#icon-play');
  }

  function setNowPlaying(text){
    if(nowEl) nowEl.textContent = 'Now Playing: ' + text;
  }

  if(playBtn){
    playBtn.addEventListener('click', (e) => {
      const isPlaying = (svgUse && svgUse.getAttribute('href') === '#icon-pause');
      setPlayIcon(!isPlaying);
    });
  }

  if(likeBtn){
    likeBtn.addEventListener('click', ()=> {
      likeBtn.classList.toggle('liked');
    });
  }

  return { setNowPlaying, setPlayIcon };
}

export let playerAPI = {
  setNowPlaying: (t)=>{ const el=document.getElementById('now-playing'); if(el) el.textContent='Now Playing: '+t; }
};
export function bindPlayerAPI(api){
  playerAPI = api;
}
