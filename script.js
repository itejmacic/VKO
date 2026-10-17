const toggle=document.querySelector('.nav-toggle'),links=document.querySelector('.nav-links');
toggle.addEventListener('click',()=>{const o=links.classList.toggle('open');toggle.setAttribute('aria-expanded',o)});
links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{links.classList.remove('open');toggle.setAttribute('aria-expanded',false)}));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
const lb=document.getElementById('lightbox'),lbI=lb.querySelector('.lb-img'),lbC=lb.querySelector('.lb-caption');
document.querySelectorAll('.tile').forEach(t=>t.addEventListener('click',()=>{const i=t.querySelector('img');lbI.src=i.src;lbI.alt=i.alt;lbC.textContent=t.dataset.caption;lb.hidden=false}));
const close=()=>lb.hidden=true;
lb.addEventListener('click',e=>{if(e.target===lb||e.target.classList.contains('lb-close'))close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
const form=document.getElementById('contact-form'),status=form.querySelector('.form-status');
form.addEventListener('submit',e=>{e.preventDefault();let ok=true;
 form.querySelectorAll('input:not([type=hidden]):not([name=_honey]),textarea').forEach(f=>{const err=f.nextElementSibling;let m='';
  if(!f.value.trim())m='Ovo polje je obavezno.';
  else if(f.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value))m='Unesite ispravnu e-mail adresu.';
  else if(f.minLength>0&&f.value.trim().length<f.minLength)m=`Unesite barem ${f.minLength} znakova.`;
  err.textContent=m;f.classList.toggle('invalid',!!m);if(m)ok=false});
 if(!ok){status.textContent='';return}
 status.textContent='Šaljem…';
 fetch('https://formsubmit.co/ajax/andelkoilcic@gmail.com',{method:'POST',headers:{'Accept':'application/json'},body:new FormData(form)})
  .then(r=>r.json()).then(d=>{if(d.success==='true'||d.success===true){status.textContent='Hvala na poruci.';form.reset()}else status.textContent='Poruka nije poslana. Pokušajte ponovno.'})
  .catch(()=>{status.textContent='Poruka nije poslana. Pokušajte ponovno.'})});

document.querySelectorAll('.toggle-btn').forEach(btn=>{
  const panel=document.getElementById(btn.getAttribute('aria-controls'));
  const label=btn.querySelector('.tb-text');
  panel.setAttribute('inert','');
  btn.addEventListener('click',()=>{
    const open=btn.getAttribute('aria-expanded')!=='true';
    btn.setAttribute('aria-expanded',String(open));
    panel.classList.toggle('open',open);
    if(open)panel.removeAttribute('inert');else panel.setAttribute('inert','');
    label.textContent=open?btn.dataset.open:btn.dataset.closed;
  });
});

document.querySelectorAll('.show-toggle').forEach(btn=>{
  const panel=document.getElementById(btn.getAttribute('aria-controls'));
  btn.addEventListener('click',()=>{
    const open=btn.getAttribute('aria-expanded')!=='true';
    btn.setAttribute('aria-expanded',String(open));
    if(open) panel.removeAttribute('hidden'); else panel.setAttribute('hidden','');
  });
});

// soloist slide-out drawer
(()=>{const dr=document.getElementById('solo-drawer'),bd=document.getElementById('drawer-backdrop');if(!dr)return;
const body=dr.querySelector('.drawer-body');let last=null;
const slugOf=a=>{const h=a.getAttribute('href')||'';const m=h.match(/solisti\/([a-z0-9-]+)\.html$/)||h.match(/^#solist-([a-z0-9-]+)$/);return m&&m[1]};
const open=s=>{const t=document.getElementById('tpl-'+s);if(!t)return false;body.replaceChildren(t.content.cloneNode(true));
 dr.hidden=bd.hidden=false;dr.classList.add('open');requestAnimationFrame(()=>bd.classList.add('open'));document.body.classList.add('drawer-lock');dr.scrollTop=0;
 anim(true);dr.querySelector('.drawer-close').focus({preventScroll:true});return true};
const fromT=()=>{const r=dr.getBoundingClientRect();const src=(last&&last.getBoundingClientRect())||{left:r.left,top:r.top,width:40,height:40};
 const sx=Math.max(src.width/r.width,.04),sy=Math.max(src.height/r.height,.04);return `translate(${src.left-r.left}px,${src.top-r.top}px) scale(${sx},${sy})`};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const anim=inn=>{if(reduce||!dr.animate)return null;const f=[{transform:fromT(),opacity:.2,borderRadius:'40px'},{transform:'none',opacity:1,borderRadius:'8px'}];
 return dr.animate(inn?f:f.reverse(),{duration:inn?420:340,easing:inn?'cubic-bezier(.2,.8,.2,1)':'cubic-bezier(.5,0,.75,0)',fill:'both'})};
const shut=()=>{if(dr.hidden||dr.dataset.closing)return;dr.dataset.closing=1;bd.classList.remove('open');document.body.classList.remove('drawer-lock');
 const done=()=>{dr.classList.remove('open');dr.hidden=bd.hidden=true;delete dr.dataset.closing;dr.getAnimations&&dr.getAnimations().forEach(a=>a.cancel());if(last)last.focus({preventScroll:true})};
 const a=anim(false);if(a)a.onfinish=done;else setTimeout(done,280)};
document.addEventListener('click',e=>{const a=e.target.closest('a[href*="solisti/"],a[href^="#solist-"]');if(!a)return;const s=slugOf(a);
 if(s&&document.getElementById('tpl-'+s)){e.preventDefault();e.stopPropagation();last=a;open(s)}},true);
dr.querySelector('.drawer-close').addEventListener('click',shut);bd.addEventListener('click',shut);
document.addEventListener('keydown',e=>{if(e.key==='Escape')shut()});})();

/* Automatska izmjena fotografija ispod naslovne slike (sinkrono, svakih 10 s) */
(()=>{const pool=Array.from({length:27},(_,i)=>`img/koncert-${String(i+1).padStart(2,'0')}.jpg`);
pool.forEach(u=>{const p=new Image();p.src=u});
const imgs=[...document.querySelectorAll('figure.photo:not(.no-rot) img')].filter(i=>!i.closest('.season-pics')).filter(i=>/img\/koncert-\d+\.jpg/.test(i.getAttribute('src')));
const ks=imgs.map((img,n)=>{const k=pool.indexOf(img.getAttribute('src'));img.classList.add('rot-img');return k<0?n:k});
setInterval(()=>{imgs.forEach(img=>img.classList.add('rot-out'));window.dispatchEvent(new Event('vko-rotate'));
 setTimeout(()=>{imgs.forEach((img,n)=>{ks[n]=(ks[n]+imgs.length)%pool.length;img.src=pool[ks[n]]});
  setTimeout(()=>imgs.forEach(img=>img.classList.remove('rot-out')),80)},1200)},10000);
})();

/* Ring carousel uz program sezone (vertikalni kotač na desktopu, horizontalni na mobitelu) */
(()=>{const box=document.querySelector('.season-pics');if(!box)return;
const pool=Array.from({length:27},(_,i)=>`img/koncert-${String(i+1).padStart(2,'0')}.jpg`);
const init=[...box.querySelectorAll('img')].map(i=>pool.indexOf(i.getAttribute('src'))).filter(k=>k>=0);
const order=[...init];for(let i=0;order.length<pool.length;i++){const k=((init[0]||0)+i)%pool.length;if(!order.includes(k))order.push(k)}
const N=order.length;box.innerHTML='';box.classList.add('ring');
const cards=order.map(k=>{const f=document.createElement('figure');f.className='ring-card';const im=document.createElement('img');im.alt='';im.decoding='async';im.src=pool[k];f.appendChild(im);box.appendChild(f);return{f,im,k}});
const RAD=Math.PI/180;let vert,w,h,R,step,span,lim;
function size(){const grid=box.parentElement;vert=box.offsetWidth<grid.clientWidth*.6;box.classList.toggle('vert',vert);
 box.style.height='';const W=box.clientWidth;
 if(vert){const H=box.clientHeight||600;w=Math.min(220,W*.56);h=w*4/3;step=h*1.08;lim=H/2+h;
  cards.forEach(c=>{const s=c.f.style;s.width=w+'px';s.height=h+'px';s.left=((W-w)/2)+'px';s.marginLeft='0';s.top=(H/2-h/2)+'px';s.borderRadius=(w*.1)+'px';s.transformOrigin='50% 50%'})}
 else{w=Math.max(90,Math.min(220,W*.33));h=w*4/3;R=(w*1.08)/(12*RAD);step=12;lim=52;
  box.style.height=Math.ceil(h+R*(1-Math.cos(24*RAD))+w*.15+12)+'px';
  cards.forEach(c=>{const s=c.f.style;s.width=w+'px';s.height=h+'px';s.left='50%';s.marginLeft=(-w/2)+'px';s.top='8px';s.borderRadius=(w*.1)+'px';s.transformOrigin=`50% ${R}px`})}
 span=N*step}
const red=matchMedia('(prefers-reduced-motion: reduce)');let off=0,last=null;
function draw(){cards.forEach((c,i)=>{const a=((i*step+off+span/2)%span+span)%span-span/2;const v=Math.abs(a)<lim;
 c.f.style.visibility=v?'visible':'hidden';if(v)c.f.style.transform=vert?`translate3d(0,${a.toFixed(2)}px,0)`:`rotate(${a.toFixed(3)}deg)`})}
function tick(t){if(last!=null&&!red.matches)off+=(t-last)/1000*step/4;last=t;draw();requestAnimationFrame(tick)}
size();draw();addEventListener('resize',()=>{size();draw()});
if(window.ResizeObserver)new ResizeObserver(()=>{const p=box.parentElement.clientHeight;if(p!==box._ph){box._ph=p;size();draw()}}).observe(box.parentElement);
requestAnimationFrame(tick);
addEventListener('vko-rotate',()=>{cards.forEach(c=>{c.k=(c.k+1)%pool.length;const n=new Image();n.alt='';n.src=pool[c.k];n.style.opacity=0;c.f.appendChild(n);
 const o=c.im;requestAnimationFrame(()=>requestAnimationFrame(()=>{n.style.opacity=1}));setTimeout(()=>o.remove(),1300);c.im=n})});
})();

/* Galerija: horizontalni karusel (strelice, povlačenje mišem, swipe, trackpad) */
(()=>{const g=document.querySelector('.gal-car .gallery');if(!g)return;const car=g.parentElement;
const step=()=>Math.max(g.clientWidth*.8,200);
car.querySelector('.gal-nav.prev').addEventListener('click',()=>g.scrollBy({left:-step(),behavior:'smooth'}));
car.querySelector('.gal-nav.next').addEventListener('click',()=>g.scrollBy({left:step(),behavior:'smooth'}));
g.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){g.scrollBy({left:step(),behavior:'smooth'});e.preventDefault()}if(e.key==='ArrowLeft'){g.scrollBy({left:-step(),behavior:'smooth'});e.preventDefault()}});
const upd=()=>{car.querySelector('.prev').disabled=g.scrollLeft<4;car.querySelector('.next').disabled=g.scrollLeft+g.clientWidth>=g.scrollWidth-4};
g.addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();
let down=false,sx=0,sl=0,moved=false;
g.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;down=true;moved=false;sx=e.clientX;sl=g.scrollLeft});
addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-sx;if(Math.abs(dx)>5&&!moved){moved=true;g.classList.add('dragging')}if(moved)g.scrollLeft=sl-dx});
addEventListener('pointerup',()=>{if(!down)return;down=false;if(moved){g.classList.remove('dragging');const t=g.querySelector('.tile');}});
g.addEventListener('click',e=>{if(moved){e.stopPropagation();e.preventDefault();moved=false}},true);
})();
/* Galerija: konkavni 3D izgled (izračun po kartici pri skrolanju) */
(()=>{const g=document.querySelector('.gal-car .gallery');if(!g)return;const tiles=[...g.querySelectorAll('.tile')];
const red=matchMedia('(prefers-reduced-motion: reduce)');let q=false;
function upd(){q=false;if(red.matches){tiles.forEach(t=>t.style.transform='');return}
 const r=g.getBoundingClientRect(),cx=r.left+r.width/2,half=r.width/2;
 tiles.forEach(t=>{const b=t.getBoundingClientRect();if(b.right<r.left-200||b.left>r.right+200)return;
  let d=(b.left+b.width/2-cx)/half;d=Math.max(-1.4,Math.min(1.4,d));const a=Math.abs(d);
  const w=t.offsetWidth,rot=-d*32,sc=1+a*a*.26,tx=d*a*w*Math.min(.2,half/2800);
  t.style.transform=`translateX(${tx.toFixed(1)}px) perspective(900px) rotateY(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)})`})}
const req=()=>{if(!q){q=true;requestAnimationFrame(upd)}};
g.addEventListener('scroll',req,{passive:true});addEventListener('resize',req);red.addEventListener?.('change',req);
upd();requestAnimationFrame(()=>{g.scrollLeft=(g.scrollWidth-g.clientWidth)/2*0.35;upd()});})();
/* Lightbox: prethodna/sljedeća fotografija galerije (strelice, tipkovnica, swipe) */
(()=>{const lb=document.getElementById('lightbox');if(!lb)return;const img=lb.querySelector('.lb-img');
const tiles=[...document.querySelectorAll('.gallery .tile')];if(!tiles.length)return;let cur=-1;
const mk=(c,l,t)=>{const b=document.createElement('button');b.type='button';b.className='lb-nav '+c;b.setAttribute('aria-label',l);b.innerHTML=t;lb.appendChild(b);return b};
const prev=mk('prev','Prethodna fotografija','&#8249;'),next=mk('next','Sljedeća fotografija','&#8250;');
const cnt=document.createElement('div');cnt.className='lb-count';cnt.setAttribute('aria-live','polite');lb.appendChild(cnt);
const show=i=>{cur=(i+tiles.length)%tiles.length;const im=tiles[cur].querySelector('img');img.src=im.src;img.alt=im.alt;cnt.textContent=(cur+1)+' / '+tiles.length};
const nav=on=>{prev.hidden=next.hidden=cnt.hidden=!on};
document.addEventListener('click',e=>{const t=e.target.closest('.tile');if(!t)return;const i=tiles.indexOf(t);if(i<0){nav(false);cur=-1;return}setTimeout(()=>{show(i);nav(true)},0)});
prev.addEventListener('click',e=>{e.stopPropagation();show(cur-1)});next.addEventListener('click',e=>{e.stopPropagation();show(cur+1)});
document.addEventListener('keydown',e=>{if(lb.hidden||cur<0)return;if(e.key==='ArrowLeft'){show(cur-1);e.preventDefault()}else if(e.key==='ArrowRight'){show(cur+1);e.preventDefault()}});
let sx=null,sy=0;lb.addEventListener('touchstart',e=>{if(e.touches.length===1){sx=e.touches[0].clientX;sy=e.touches[0].clientY}},{passive:true});
lb.addEventListener('touchend',e=>{if(sx==null||cur<0)return;const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;sx=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.3)show(cur+(dx<0?1:-1))});
})();
