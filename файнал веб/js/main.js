import { loadArtistsData } from './data.js';
import { initBackToTop, initScrollSpy, initRightbarActions, initAOS } from './ui.js';
import { initTopMusic } from './topMusic.js';
import { initArtistsList } from './artists.js';
import { initArtistDetail } from './artistDetail.js';
import { initPlayer, bindPlayerAPI } from './player.js';

async function boot(){
  const data = await loadArtistsData();
  initBackToTop();
  initScrollSpy();
  initRightbarActions();
  initAOS();

  const player = initPlayer();
  bindPlayerAPI(player);

  await initTopMusic('top-music-list', data);

  initArtistsList('artist-list');

  initArtistDetail();

  const el = document.getElementById('global-search');
  if(el){
    el.setAttribute('aria-label','Global search');
    el.addEventListener('keydown', (e) => {
      if(e.key === 'Enter'){
        const q = el.value.trim();
        try{ localStorage.setItem('musehub_search_query', q); }catch(e){}
        window.location.href = 'artists.html';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', boot);


// Back-to-top helper 
(function(){
  function domReady(fn){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  domReady(function(){
    const btn = document.getElementById('back-to-top');
    if(!btn) return;

    // When user scrolls > threshold — show button
    const SHOW_AT = 300;
    function onScroll(){
      if(window.scrollY > SHOW_AT) {
        btn.classList.add('show');
      } else {
        btn.classList.remove('show');
      }
    }

    // Position button above footer.player if present
    function updateButtonBottom(){
      const player = document.querySelector('footer.player');
      const baseGap = 18;
      if(player){
        const h = player.offsetHeight || 0;
        // place button above player
        btn.style.bottom = (h + baseGap) + 'px';
      } else {
        btn.style.bottom = baseGap + 'px';
      }
    }

    // Smooth scroll to top
    btn.addEventListener('click', function(e){
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // init
    onScroll();
    updateButtonBottom();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateButtonBottom);
    // also observe player size changes 
    const player = document.querySelector('footer.player');
    if(player && 'ResizeObserver' in window){
      try {
        const ro = new ResizeObserver(updateButtonBottom);
        ro.observe(player);
      } catch(e){}
    }
  });
})();
