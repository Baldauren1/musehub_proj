export const PERSON_PLACEHOLDER = "data:image/svg+xml;utf8," + encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'>
    <rect width='100%' height='100%' fill='%23e6e6e6'/>
    <g fill='%23999'>
      <circle cx='300' cy='200' r='110'/>
      <path d='M120 460c30-60 360-60 420 0v40H120z'/>
    </g>
  </svg>`
);

export function debounce(fn, ms=180){
  let t;
  return (...args)=>{ clearTimeout(t); t = setTimeout(()=> fn(...args), ms); };
}

export function formatNumber(n){
  if(n === null || n === undefined) return '—';
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function resolveImageSrc(imageVal){
  if(!imageVal) return PERSON_PLACEHOLDER;
  const v = String(imageVal).trim();
  if(/^data:|^https?:|^\/\//i.test(v)) return v;
  if (v.startsWith('assets/images/')) return v;
  if (!v.includes('/')) return `assets/images/${v}`;
  if (v.startsWith('images/') || v.startsWith('./images/')) {
    return 'assets/' + v.replace(/^(\.\/)?images\//, 'images/');
  }
  return PERSON_PLACEHOLDER;
}

export async function fetchJsonAny(paths){
  for(const p of paths){
    try{
      const r = await fetch(p);
      if(!r.ok) throw new Error('HTTP ' + r.status);
      return await r.json();
    }catch(e){}
  }
  return [];
}
