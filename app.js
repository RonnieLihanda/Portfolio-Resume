(function(){
  var root=document.documentElement,reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cats=['overview','automation','solutions','proposals','leadership','knowledge','onboarding','data','training','proof','contact'];
  var titles={overview:'Hillary Lihanda | AI workflow automation and operations'};
  var links=[].slice.call(document.querySelectorAll('.nav a')),main=document.getElementById('main');
  function counts(sec){[].forEach.call(sec.querySelectorAll('[data-count]'),function(b){
    var n=+b.getAttribute('data-count'),sf=b.getAttribute('data-suffix')||'';
    if(reduce){b.textContent=n.toLocaleString('en-US')+sf;return}
    var s=null;(function step(t){if(s===null)s=t;var p=Math.min(1,(t-s)/900);b.textContent=Math.round(n*(1-Math.pow(1-p,3))).toLocaleString('en-US')+(p>=1?sf:'');if(p<1)requestAnimationFrame(step)})(performance.now())})}
  function show(id,push){
    if(cats.indexOf(id)<0)id='overview';
    [].forEach.call(document.querySelectorAll('[data-cat]'),function(el){
      if(el.tagName==='A')return;
      var on=el.getAttribute('data-cat')===id;
      if(on){el.removeAttribute('hidden')}else{el.setAttribute('hidden','')}
    });
    links.forEach(function(a){if(a.getAttribute('data-cat')===id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
    var sec=document.getElementById(id);if(sec)counts(sec);
    main.scrollTop=0;window.scrollTo(0,0);
    var name=(links.filter(function(a){return a.getAttribute('data-cat')===id})[0]||{}).textContent||'';
    document.title=id==='overview'?titles.overview:name+' | Hillary Lihanda';
  }
  function route(){show((location.hash||'#overview').slice(1))}
  addEventListener('hashchange',route);
  // anchors with the same id as a section must not jump the page
  document.addEventListener('click',function(e){var a=e.target.closest('a[href^="#"]');if(!a)return;var id=a.getAttribute('href').slice(1);if(cats.indexOf(id)>=0){e.preventDefault();if(location.hash==='#'+id)show(id);else location.hash=id}});
  // keyboard: j/k or arrows on the nav move between sections
  document.querySelector('.nav').addEventListener('keydown',function(e){
    var i=links.indexOf(document.activeElement);if(i<0)return;
    if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();links[(i+1)%links.length].focus()}
    if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();links[(i-1+links.length)%links.length].focus()}});
  // solutions filter
  var sf=document.getElementById('sol-filters');
  if(sf)sf.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;[].forEach.call(sf.children,function(x){x.classList.remove('on')});b.classList.add('on');var g=b.getAttribute('data-g');[].forEach.call(document.querySelectorAll('details.sol'),function(d){d.hidden=!!g&&d.getAttribute('data-group')!==g})});
  // knowledge demo
  var kq=document.getElementById('kd-q');
  if(kq)kq.addEventListener('input',function(){var v=kq.value.trim().toLowerCase(),n=0;[].forEach.call(document.querySelectorAll('#kd-list li'),function(li){var ok=!v||li.getAttribute('data-t').indexOf(v)>-1;li.hidden=!ok;if(ok)n++});var em=document.getElementById('kd-empty');if(em)em.hidden=n>0});
  // onboarding stages
  var os=document.getElementById('onb-stages');
  if(os)os.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;[].forEach.call(os.children,function(x){x.classList.remove('on')});b.classList.add('on');var k=b.getAttribute('data-s');[].forEach.call(document.querySelectorAll('.ostage'),function(p){p.hidden=p.getAttribute('data-s')!==k})});
  // theme
  var saved=null;try{saved=localStorage.getItem('theme')}catch(e){}
  if(saved==='dark'||saved==='light')root.setAttribute('data-theme',saved);
  var tg=document.querySelector('.theme-toggle');
  function dark(){var t=root.getAttribute('data-theme');return t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches}
  function lab(){tg.textContent=dark()?'Light':'Dark'}
  tg.addEventListener('click',function(){var n=dark()?'light':'dark';root.setAttribute('data-theme',n);try{localStorage.setItem('theme',n)}catch(e){}lab()});lab();
  route();
})();
