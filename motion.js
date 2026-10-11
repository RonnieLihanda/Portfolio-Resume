(function(){
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root=document.documentElement;
  // theme toggle (remembered per browser when storage is available)
  var saved=null;try{saved=localStorage.getItem('theme')}catch(e){}
  if(saved==='dark'||saved==='light')root.setAttribute('data-theme',saved);
  function isDark(){var t=root.getAttribute('data-theme');return t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches}
  var tg=document.querySelector('.theme-toggle');
  function lab(){if(tg)tg.textContent=isDark()?'Light':'Dark'}
  if(tg){tg.addEventListener('click',function(){var n=isDark()?'light':'dark';root.setAttribute('data-theme',n);try{localStorage.setItem('theme',n)}catch(e){}lab()});lab()}
  // progress bar and sticky header state
  var bar=document.querySelector('.progress'),top=document.querySelector('.topbar'),tick=false;
  function onScroll(){tick=false;var h=root.scrollHeight-innerHeight;if(bar)bar.style.transform='scaleX('+(h>0?Math.min(1,scrollY/h):0)+')';if(top)top.classList.toggle('scrolled',scrollY>24);if(scrollY<80)[].forEach.call(document.querySelectorAll('.topbar nav a.active'),function(a){a.classList.remove('active')})}
  addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();
  // scroll reveal
  var sel='.hero .lede,.hero .who,.hero .cta-row,.flow-wrap,.stats li,section .section-head,.work-list li,.facts dt,.facts dd,.case-head,.stage,.prose h2,.prose h3,.prose p,.prose li,.panel,details.tech';
  var els=[].slice.call(document.querySelectorAll(sel));
  if(!reduce&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    els.filter(function(el){return !el.closest('details')}).forEach(function(el,i){el.classList.add('rv');var sib=el.parentNode?[].indexOf.call(el.parentNode.children,el):0;el.style.setProperty('--d',Math.min(sib,6)*.06+'s');io.observe(el)});
  }
  // count-up numbers in stats
  [].forEach.call(document.querySelectorAll('.stats b'),function(b){
    var t=b.textContent.trim();if(!/^\d+$/.test(t)||reduce)return;var n=parseInt(t,10);b.textContent='0';
    if(!('IntersectionObserver' in window)){b.textContent=t;return}
    var o=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;o.disconnect();var s=null;(function step(ts){if(s===null)s=ts;var p=Math.min(1,(ts-s)/900);b.textContent=Math.round(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step)})(performance.now())},{threshold:.6});o.observe(b)});
  // scroll spy for in-page nav
  var links=[].slice.call(document.querySelectorAll('.topbar nav a[href^="#"]'));
  if(links.length&&'IntersectionObserver' in window){
    var map={};links.forEach(function(a){var s=document.querySelector(a.getAttribute('href'));if(s)map[s.id]=a});
    var spy=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.remove('active')});if(map[e.target.id])map[e.target.id].classList.add('active')}})},{rootMargin:'-35% 0px -55% 0px'});
    Object.keys(map).forEach(function(id){spy.observe(document.getElementById(id))});
  }
  // replay the hero workflow pulse while it is on screen
  var flow=document.querySelector('.flow');
  if(flow&&!reduce&&'IntersectionObserver' in window){
    var vis=false,pulses=[].slice.call(flow.querySelectorAll('.pulse'));
    new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(flow);
    setInterval(function(){if(!vis||document.hidden)return;pulses.forEach(function(p){p.style.animation='none'});void flow.getBoundingClientRect();pulses.forEach(function(p){p.style.animation=''})},6500);
  }
})();
