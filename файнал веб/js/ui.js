export function initBackToTop(){
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.style.display = (window.scrollY > 100) ? 'block' : 'none';
  });

  btn.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
}

export function initScrollSpy(){
  const sidebar = document.querySelector('.sidebar');
  if(!sidebar) return;
  const sections = Array.from(document.querySelectorAll('section[id], main > section[id]'));
  if(!sections.length) return;
  function highlight(){
    const pos = window.scrollY + 120;
    let current = null;
    sections.forEach(s => { const top = s.getBoundingClientRect().top + window.scrollY; if(pos>=top) current = s; });
    sidebar.querySelectorAll('a').forEach(a => a.classList.remove('active'));
    if(current){ const id = current.id; const link = sidebar.querySelector(`a[href="#${id}"]`); if(link) link.classList.add('active'); }
  }
  window.addEventListener('scroll', highlight);
  highlight();
}

export function initRightbarActions(){
  const topItems = document.querySelectorAll('.rightbar h5 + .list-group .list-group-item');
  topItems.forEach(el => el.addEventListener('click', () => {
    const q = el.textContent.trim(); try{ localStorage.setItem('musehub_search_query', q); }catch(e){}; window.location.href = 'artists.html';
  }));
}

export function initAOS(){
  if(window.AOS) window.AOS.init({duration:600, once:true});
}
