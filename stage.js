document.querySelectorAll('.stage').forEach(function(st){
  st.classList.add('js');
  var btns=[].slice.call(st.querySelectorAll('.stage-steps button')),
      panels=[].slice.call(st.querySelectorAll('.panel-step')),
      pp=st.querySelector('.stage-play'),
      reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,
      cur=0,timer=null,visible=false,userPaused=reduce;
  function show(i){cur=i;btns.forEach(function(b,j){b.classList.toggle('on',j===i);b.setAttribute('aria-pressed',j===i?'true':'false')});
    panels.forEach(function(p,j){p.classList.remove('on');if(j===i){void p.offsetWidth;p.classList.add('on')}})}
  function stop(){if(timer){clearInterval(timer);timer=null}}
  function go(){stop();if(userPaused||!visible)return;timer=setInterval(function(){show((cur+1)%btns.length)},5200)}
  function label(){pp.textContent=userPaused?'Play':'Pause'}
  btns.forEach(function(b,j){b.addEventListener('click',function(){userPaused=true;label();stop();show(j)})});
  pp.addEventListener('click',function(){userPaused=!userPaused;label();go()});
  if('IntersectionObserver' in window){new IntersectionObserver(function(e){visible=e[0].isIntersecting;go()},{threshold:.4}).observe(st)}else{visible=true;go()}
  label();show(0);
});
