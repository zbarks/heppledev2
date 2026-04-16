/* Hepple — scroll-scrubbed intro + hash router + drawer */
(() => {
  'use strict';

  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  // ---------- Year stamp ----------
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Elements ----------
  const intro   = $('#intro');
  const nav     = $('#nav');
  const content = $('#content');
  const video   = $('#heroVideo');
  const drawer  = $('#drawer');

  // ---------- Router ----------
  function getRoute(){
    const h = location.hash.replace(/^#/, '') || '/';
    return h.startsWith('/') ? h : '/' + h;
  }

  function setActivePage(route){
    $$('.page').forEach(p => p.classList.toggle('is-active', p.dataset.page === route));
    $$('[data-route]').forEach(a => {
      a.classList.toggle('is-active', a.getAttribute('data-route') === route);
    });
  }

  function showIntroOrNot(route){
    const onHome = route === '/';

    if (onHome) {
      const hasSeenIntro = sessionStorage.getItem('hepple:seenIntro') === '1';
      if (hasSeenIntro){
        intro.style.display = 'none';
        document.body.style.overflow = '';
        content.classList.add('is-visible');
        nav.classList.add('is-visible');
      } else {
        intro.style.display = '';
        content.classList.remove('is-visible');
        nav.classList.remove('is-visible');
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    } else {
      intro.style.display = 'none';
      content.classList.add('is-visible');
      nav.classList.add('is-visible');
      document.body.style.overflow = '';
      window.scrollTo(0, 0);
    }
  }

  function route(){
    const r = getRoute();
    setActivePage(r);
    showIntroOrNot(r);
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-route]');
    if (!a) return;
    const target = a.getAttribute('data-route');
    if (!target) return;
    e.preventDefault();
    if (drawer) drawer.classList.remove('is-open');
    location.hash = '#' + target;
  });

  window.addEventListener('hashchange', route);

  // ---------- Video scrub ----------
  let videoDuration = 5.2;
  let targetTime    = 0;
  let currentTime   = 0;
  let introComplete = false;

  if (video){
    video.addEventListener('loadedmetadata', () => {
      if (isFinite(video.duration) && video.duration > 0) {
        videoDuration = video.duration;
      }
    });

    const primeVideo = async () => {
      try {
        await video.play();
        video.pause();
        video.currentTime = 0;
      } catch(_){ /* autoplay may be blocked; scrubbing still works */ }
    };
    if (video.readyState >= 1) primeVideo();
    else video.addEventListener('loadedmetadata', primeVideo, { once:true });
  }

  // rAF loop — lerp toward targetTime for smoothness
  function animate(){
    currentTime += (targetTime - currentTime) * 0.12;
    if (Math.abs(targetTime - currentTime) < 0.002) currentTime = targetTime;

    if (video && video.readyState >= 2 && isFinite(currentTime)) {
      if (Math.abs(video.currentTime - currentTime) > 0.03){
        try { video.currentTime = currentTime; } catch(_){}
      }
    }
    requestAnimationFrame(animate);
  }

  function onScroll(){
    if (getRoute() !== '/' || !intro || intro.style.display === 'none') return;

    const introRect   = intro.getBoundingClientRect();
    const introHeight = intro.offsetHeight;
    const viewport    = window.innerHeight;
    const scrollable  = introHeight - viewport;
    const scrolled    = Math.min(Math.max(-introRect.top, 0), scrollable);
    const progress    = scrollable > 0 ? scrolled / scrollable : 1;

    targetTime = Math.max(0, Math.min(videoDuration * progress, videoDuration - 0.05));

    if (progress > 0.08) intro.classList.add('is-ready');
    else intro.classList.remove('is-ready');

    if (progress >= 0.96 && !introComplete){
      introComplete = true;
      intro.classList.add('is-complete');
      nav.classList.add('is-visible');
      content.classList.add('is-visible');
      sessionStorage.setItem('hepple:seenIntro', '1');
    } else if (progress < 0.9 && introComplete){
      introComplete = false;
      intro.classList.remove('is-complete');
      nav.classList.remove('is-visible');
      content.classList.remove('is-visible');
    }
  }

  let scrollScheduled = false;
  window.addEventListener('scroll', () => {
    if (!scrollScheduled){
      scrollScheduled = true;
      requestAnimationFrame(() => {
        onScroll();
        scrollScheduled = false;
      });
    }
  }, { passive:true });

  window.addEventListener('resize', onScroll, { passive:true });

  // ---------- Drawer ----------
  const menuBtn     = $('#menuBtn');
  const drawerClose = $('#drawerClose');
  if (menuBtn && drawer)     menuBtn.addEventListener('click', () => drawer.classList.add('is-open'));
  if (drawerClose && drawer) drawerClose.addEventListener('click', () => drawer.classList.remove('is-open'));

  // ---------- Boot ----------
  animate();
  route();
  onScroll();
})();
