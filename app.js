/* ==========================================================
   HEPPLE — application script
   - Hash router (/ /story /estate /cocktails /visit /shop /shop/:slug)
   - Monotonic forward-only scroll-scrubbed intro video (desktop smooth)
   - Product catalogue + fake cart
   - Product carousels (prev/next)
   - Process stepper (Our Story)
   - Animated number counters (IntersectionObserver)
   - Clicking the Hepple logo always returns to `/` and replays the intro
   ========================================================== */
(() => {
  'use strict';

  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  // ---------- Year stamp ----------
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // =============================================
  // PRODUCT CATALOGUE
  // =============================================
  const PRODUCTS = [
    {
      slug: 'hepple-gin',
      name: 'Hepple Gin',
      tagline: 'A Wildly Modern Classic',
      price: 39.95,
      meta: { size: '70cl', abv: '45%', origin: 'Northumbria' },
      image: '/assets/products/hepple-gin.jpg',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Quisque velit nisi, pretium ut lacinia in, elementum id enim. Donec rutrum congue leo eget malesuada.'
    },
    {
      slug: 'douglas-fir',
      name: 'Douglas Fir Vodka',
      tagline: 'Flavoured Vodka',
      price: 39.95,
      meta: { size: '70cl', abv: '40%', origin: 'Northumbria' },
      image: '/assets/products/douglas-fir.jpg',
      desc: 'Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Donec sollicitudin molestie malesuada. Nulla porttitor accumsan tincidunt. Proin eget tortor risus. Donec rutrum congue leo eget malesuada.'
    },
    {
      slug: 'wheat-vodka',
      name: 'Wheat Vodka',
      tagline: 'Clean & Modern',
      price: 34.95,
      meta: { size: '70cl', abv: '40%', origin: 'Northumbria' },
      image: '/assets/products/wheat-vodka.jpg',
      desc: 'Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Nulla porttitor accumsan tincidunt. Proin eget tortor risus. Donec rutrum congue leo eget malesuada. Pellentesque in ipsum id orci porta dapibus.'
    },
    {
      slug: 'aquavit',
      name: 'Hepple Aquavit',
      tagline: 'Northumbrian Nordic',
      price: 39.95,
      meta: { size: '70cl', abv: '40%', origin: 'Northumbria' },
      image: '/assets/products/aquavit.jpg',
      desc: 'Vivamus suscipit tortor eget felis porttitor volutpat. Nulla porttitor accumsan tincidunt. Cras ultricies ligula sed magna dictum porta. Sed porttitor lectus nibh. Donec rutrum congue leo eget malesuada.'
    },
    {
      slug: 'negroni',
      name: 'Juniper Aged Negroni',
      tagline: 'Bottled & Barrel-Aged',
      price: 32.50,
      meta: { size: '50cl', abv: '24%', origin: 'Northumbria' },
      image: '/assets/products/negroni.jpg',
      desc: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia. Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula. Vivamus magna justo, lacinia eget consectetur sed.'
    },
    {
      slug: 'gift-box',
      name: 'Hepple Gin Gift Box',
      tagline: 'The Ultimate Hepple Gift',
      price: 62.99,
      meta: { size: '50cl + glassware', abv: '45%', origin: 'Northumbria' },
      image: '/assets/products/gin-giftbox.jpg',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Features a 50cl bottle, two etched cocktail glasses with juniper design, and a selection of cocktail cards. Aliquam erat volutpat. Sed porttitor lectus nibh.'
    }
  ];
  const productBySlug = Object.fromEntries(PRODUCTS.map(p => [p.slug, p]));

  // =============================================
  // CART STATE (persisted in localStorage)
  // =============================================
  const CART_KEY = 'hepple:cart';
  let cart = (() => {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
    catch(_) { return []; }
  })();
  const saveCart = () => localStorage.setItem(CART_KEY, JSON.stringify(cart));

  function addToCart(slug, qty=1){
    const existing = cart.find(i => i.slug === slug);
    if (existing) existing.qty += qty;
    else cart.push({ slug, qty });
    saveCart();
    renderCart();
    showToast(`Added to cart`);
    bumpCart();
  }
  function removeFromCart(slug){
    cart = cart.filter(i => i.slug !== slug);
    saveCart();
    renderCart();
  }
  function cartCount(){ return cart.reduce((s, i) => s + i.qty, 0); }
  function cartTotal(){
    return cart.reduce((s, i) => {
      const p = productBySlug[i.slug];
      return s + (p ? p.price * i.qty : 0);
    }, 0);
  }

  function renderCart(){
    const body = $('#cartBody');
    const foot = $('#cartFoot');
    const count = cartCount();
    const btn = $('#cartBtn');
    const countEl = $('#cartCount');

    if (countEl) countEl.textContent = count;
    if (btn) btn.classList.toggle('has-items', count > 0);

    if (count === 0){
      body.innerHTML = `<p class="cart-panel__empty">Your cart is empty — <em>still room for a bottle</em>.</p>`;
      foot.hidden = true;
      return;
    }

    body.innerHTML = cart.map(i => {
      const p = productBySlug[i.slug];
      if (!p) return '';
      return `
        <div class="cart-item">
          <div class="cart-item__img"><img src="${p.image}" alt="${p.name}" /></div>
          <div class="cart-item__info">
            <h4>${p.name}</h4>
            <div class="qty">Qty ${i.qty} · £${p.price.toFixed(2)} ea</div>
            <button class="cart-item__remove" data-remove="${p.slug}">Remove</button>
          </div>
          <div class="cart-item__price">£${(p.price * i.qty).toFixed(2)}</div>
        </div>
      `;
    }).join('');
    foot.hidden = false;
    $('#cartTotal').textContent = `£${cartTotal().toFixed(2)}`;
  }

  function bumpCart(){
    const btn = $('#cartBtn');
    if (!btn) return;
    btn.animate([
      { transform:'scale(1)' },
      { transform:'scale(1.2)' },
      { transform:'scale(1)' }
    ], { duration: 400, easing: 'cubic-bezier(.34,1.56,.64,1)' });
  }

  function showToast(msg){
    let t = $('.toast');
    if (!t){
      t = document.createElement('div');
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('is-visible');
    clearTimeout(t._hideTimer);
    t._hideTimer = setTimeout(() => t.classList.remove('is-visible'), 2200);
  }

  // =============================================
  // ROUTER
  // =============================================
  const intro   = $('#intro');
  const nav     = $('#nav');
  const content = $('#content');
  const video   = $('#heroVideo');

  function getRoute(){
    const h = location.hash.replace(/^#/, '') || '/';
    return h.startsWith('/') ? h : '/' + h;
  }

  function matchPage(route){
    // exact match or "/shop/:slug" wildcard
    const pages = $$('.page');
    let matched = pages.find(p => p.dataset.page === route);
    if (matched) return matched;
    if (/^\/shop\/[\w-]+$/.test(route)){
      matched = pages.find(p => p.dataset.page === '/shop/*');
    }
    return matched || pages.find(p => p.dataset.page === '/');
  }

  function setActivePage(route){
    $$('.page').forEach(p => p.classList.remove('is-active'));
    const page = matchPage(route);
    if (page) page.classList.add('is-active');

    // Active nav link
    $$('[data-route]').forEach(a => {
      const r = a.getAttribute('data-route');
      let active = r === route;
      if (!active && r === '/shop' && route.startsWith('/shop')) active = true;
      a.classList.toggle('is-active', active);
    });

    // If on /shop, render grid
    if (route === '/shop') renderShopGrid();
    // If product detail
    if (/^\/shop\/[\w-]+$/.test(route)){
      const slug = route.split('/')[2];
      renderProductDetail(slug);
    }
  }

  function showIntroOrNot(route, forceIntro=false){
    const onHome = route === '/';
    if (onHome){
      const hasSeenIntro = sessionStorage.getItem('hepple:seenIntro') === '1';
      if (hasSeenIntro && !forceIntro){
        intro.style.display = 'none';
        content.classList.add('is-visible');
        nav.classList.add('is-visible');
      } else {
        intro.style.display = '';
        content.classList.remove('is-visible');
        nav.classList.remove('is-visible');
        // reset intro state
        intro.classList.remove('is-ready', 'is-complete');
        introComplete = false;
        currentScrollProgress = 0;
        maxScrollProgress = 0;
        targetTime = 0;
        currentTime = 0;
        if (video){
          try { video.currentTime = 0; } catch(_){}
        }
        window.scrollTo(0, 0);
      }
    } else {
      intro.style.display = 'none';
      content.classList.add('is-visible');
      nav.classList.add('is-visible');
      window.scrollTo(0, 0);
    }
  }

  function route(forceIntro = false){
    const r = getRoute();
    setActivePage(r);
    showIntroOrNot(r, forceIntro);
  }

  // Click interception
  document.addEventListener('click', (e) => {
    // Cart remove buttons
    const removeBtn = e.target.closest('[data-remove]');
    if (removeBtn){
      e.preventDefault();
      removeFromCart(removeBtn.dataset.remove);
      return;
    }

    // Add to cart
    const addBtn = e.target.closest('[data-add-to-cart]');
    if (addBtn){
      e.preventDefault();
      const slug = addBtn.dataset.addToCart;
      const qtyInput = $('#pdQty');
      const qty = qtyInput ? Math.max(1, parseInt(qtyInput.value || '1', 10)) : 1;
      addToCart(slug, qty);
      addBtn.classList.add('is-added');
      addBtn.textContent = 'Added ✓';
      setTimeout(() => {
        addBtn.classList.remove('is-added');
        addBtn.textContent = 'Add to cart';
      }, 1800);
      return;
    }

    // Qty stepper
    const stepBtn = e.target.closest('[data-qty]');
    if (stepBtn){
      e.preventDefault();
      const input = $('#pdQty');
      if (!input) return;
      let v = parseInt(input.value || '1', 10);
      if (stepBtn.dataset.qty === '+') v++;
      if (stepBtn.dataset.qty === '-') v = Math.max(1, v - 1);
      input.value = v;
      return;
    }

    // Route links
    const a = e.target.closest('[data-route]');
    if (!a) return;
    const target = a.getAttribute('data-route');
    if (!target) return;
    e.preventDefault();
    closeDrawers();

    // If clicking the brand logo, always return home AND replay intro
    const isBrand = a.hasAttribute('data-brand');
    if (isBrand){
      sessionStorage.removeItem('hepple:seenIntro');
    }

    if (location.hash === '#' + target){
      // Already there — re-fire state (for brand clicks to re-trigger intro)
      route(isBrand);
    } else {
      // When navigating via brand, also force intro on arrival
      if (isBrand){
        // Setting flag the router will check
        window._hepple_forceIntro = true;
      }
      location.hash = '#' + target;
    }
  });

  window.addEventListener('hashchange', () => {
    const force = !!window._hepple_forceIntro;
    window._hepple_forceIntro = false;
    route(force);
  });

  function closeDrawers(){
    $('#drawer')?.classList.remove('is-open');
    $('#cartPanel')?.classList.remove('is-open');
    $('#overlay')?.classList.remove('is-active');
  }

  // =============================================
  // VIDEO SCROLL SCRUB — monotonic, smooth
  // =============================================
  let videoDuration    = 5.2;
  let targetTime       = 0;
  let currentTime      = 0;
  let introComplete    = false;
  let currentScrollProgress = 0;
  let maxScrollProgress     = 0; // monotonic — never decreases during a session

  if (video){
    video.addEventListener('loadedmetadata', () => {
      if (isFinite(video.duration) && video.duration > 0){
        videoDuration = video.duration;
      }
    });

    const primeVideo = async () => {
      try { await video.play(); video.pause(); video.currentTime = 0; }
      catch(_){}
    };
    if (video.readyState >= 1) primeVideo();
    else video.addEventListener('loadedmetadata', primeVideo, { once:true });
  }

  // Smoothing loop — low lerp = smoother; high = tighter-to-scroll
  // Desktop: 0.09; Mobile: 0.18 (feels snappier on touch)
  const isTouch = matchMedia('(pointer: coarse)').matches;
  const LERP = isTouch ? 0.18 : 0.09;

  function animate(){
    currentTime += (targetTime - currentTime) * LERP;
    if (Math.abs(targetTime - currentTime) < 0.003) currentTime = targetTime;

    if (video && video.readyState >= 2 && isFinite(currentTime)){
      if (Math.abs(video.currentTime - currentTime) > 0.025){
        try { video.currentTime = currentTime; } catch(_){}
      }
    }
    requestAnimationFrame(animate);
  }

  function onScroll(){
    if (getRoute() !== '/' || !intro || intro.style.display === 'none') return;

    const rect       = intro.getBoundingClientRect();
    const introH     = intro.offsetHeight;
    const viewport   = window.innerHeight;
    const scrollable = Math.max(1, introH - viewport);
    const scrolled   = Math.min(Math.max(-rect.top, 0), scrollable);
    const rawProgress = scrolled / scrollable;

    // MONOTONIC — only allow progress to increase, never decrease mid-session
    if (rawProgress > maxScrollProgress){
      maxScrollProgress = rawProgress;
    }
    currentScrollProgress = maxScrollProgress;

    // Map progress → video time (forward only)
    targetTime = Math.max(0, Math.min(videoDuration * currentScrollProgress, videoDuration - 0.05));

    // Reveal states — based on monotonic max
    if (currentScrollProgress > 0.08) intro.classList.add('is-ready');

    if (currentScrollProgress >= 0.95 && !introComplete){
      introComplete = true;
      intro.classList.add('is-complete');
      nav.classList.add('is-visible');
      content.classList.add('is-visible');
      sessionStorage.setItem('hepple:seenIntro', '1');
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
  }, { passive: true });

  window.addEventListener('resize', onScroll, { passive: true });

  // =============================================
  // DRAWER + CART
  // =============================================
  $('#menuBtn')?.addEventListener('click', () => {
    $('#drawer').classList.add('is-open');
    $('#overlay').classList.add('is-active');
  });
  $('#drawerClose')?.addEventListener('click', closeDrawers);
  $('#cartBtn')?.addEventListener('click', () => {
    $('#cartPanel').classList.add('is-open');
    $('#overlay').classList.add('is-active');
  });
  $('#cartClose')?.addEventListener('click', closeDrawers);
  $('#overlay')?.addEventListener('click', closeDrawers);

  // =============================================
  // CAROUSELS (prev/next scrolling)
  // =============================================
  function initCarousel(root){
    const track = root.querySelector('[data-carousel-track]');
    const prev  = root.querySelector('[data-carousel-prev]');
    const next  = root.querySelector('[data-carousel-next]');
    if (!track) return;

    const step = () => {
      const firstCard = track.children[0];
      if (!firstCard) return 320;
      const rect = firstCard.getBoundingClientRect();
      const style = getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap || 16);
      return rect.width + gap;
    };

    const updateDisabled = () => {
      const atStart = track.scrollLeft < 4;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      if (prev) prev.disabled = atStart;
      if (next) next.disabled = atEnd;
    };

    prev?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior:'smooth' }));
    next?.addEventListener('click', () => track.scrollBy({ left:  step(), behavior:'smooth' }));
    track.addEventListener('scroll', updateDisabled, { passive:true });
    window.addEventListener('resize', updateDisabled);
    setTimeout(updateDisabled, 200);
  }
  $$('[data-carousel]').forEach(initCarousel);

  // =============================================
  // PROCESS STEPPER (Story page)
  // =============================================
  function initProcess(){
    const root = $('[data-process]');
    if (!root) return;
    const steps = $$('.process__step', root);
    const dots  = $$('[data-dot]', root);
    const prev  = $('[data-process-prev]', root);
    const next  = $('[data-process-next]', root);
    let idx = 0;

    function goTo(i){
      if (i < 0 || i >= steps.length) return;
      idx = i;
      steps.forEach((s, si) => {
        s.classList.remove('is-active', 'is-prev');
        if (si === idx) s.classList.add('is-active');
        else if (si < idx) s.classList.add('is-prev');
      });
      dots.forEach((d, di) => d.classList.toggle('is-active', di === idx));
      if (prev) prev.disabled = idx === 0;
      if (next) next.disabled = idx === steps.length - 1;
    }

    prev?.addEventListener('click', () => goTo(idx - 1));
    next?.addEventListener('click', () => goTo(idx + 1));
    dots.forEach((d, di) => d.addEventListener('click', () => goTo(di)));

    goTo(0);
  }

  // =============================================
  // NUMBER COUNTERS (IntersectionObserver)
  // =============================================
  function animateNumber(el){
    const target = parseFloat(el.dataset.countTo || '0');
    const format = el.dataset.countFormat || '';
    const suffix = el.dataset.countSuffix || '';
    const duration = 1600; // ms
    const start = performance.now();
    const startVal = 0;

    function easeOutExpo(t){ return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

    function tick(now){
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const e = easeOutExpo(t);
      const current = Math.round(startVal + (target - startVal) * e);
      let out = current.toString();
      if (format === 'comma') out = current.toLocaleString('en-GB');
      el.textContent = out + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else {
        let final = target.toString();
        if (format === 'comma') final = target.toLocaleString('en-GB');
        el.textContent = final + suffix;
      }
    }
    requestAnimationFrame(tick);
  }

  function initCounters(){
    const nums = $$('.stat__number[data-count-to]');
    if (!nums.length) return;
    if (!('IntersectionObserver' in window)){
      nums.forEach(animateNumber);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted){
          entry.target.dataset.counted = '1';
          animateNumber(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    nums.forEach(n => io.observe(n));
  }

  // =============================================
  // SHOP RENDERING
  // =============================================
  function renderShopGrid(){
    const grid = $('#shopGrid');
    if (!grid) return;
    grid.innerHTML = PRODUCTS.map(p => `
      <a href="#/shop/${p.slug}" data-route="/shop/${p.slug}" class="shop-card">
        <div class="shop-card__img">
          <img src="${p.image}" alt="${p.name}" loading="lazy" />
        </div>
        <h3>${p.name}</h3>
        <div class="shop-card__meta">${p.meta.size} · ${p.meta.abv}</div>
        <div class="shop-card__price">£${p.price.toFixed(2)}</div>
        <div class="shop-card__actions">
          <span class="btn btn--tiny">View</span>
        </div>
      </a>
    `).join('');
  }

  function renderProductDetail(slug){
    const root = $('#productDetail');
    const p = productBySlug[slug];
    if (!root || !p){
      if (root) root.innerHTML = `<div class="wrap"><p style="padding:6rem 0;text-align:center;">Product not found. <a href="#/shop" data-route="/shop" style="border-bottom:1px solid;">Back to shop</a>.</p></div>`;
      return;
    }
    root.innerHTML = `
      <div class="product-detail__grid">
        <div class="product-detail__img">
          <img src="${p.image}" alt="${p.name}" />
        </div>
        <div class="product-detail__body">
          <div class="product-detail__crumbs">
            <a href="#/shop" data-route="/shop">Shop</a> / ${p.name}
          </div>
          <h1 class="product-detail__title">${p.name}</h1>
          <div class="product-detail__price">£${p.price.toFixed(2)}</div>
          <p class="product-detail__desc">${p.desc}</p>
          <div class="product-detail__meta">
            <div><strong>${p.meta.size}</strong>Size</div>
            <div><strong>${p.meta.abv}</strong>ABV</div>
            <div><strong>${p.meta.origin}</strong>Origin</div>
          </div>
          <div class="product-detail__qty">
            <label for="pdQty">Qty</label>
            <div class="qty-stepper">
              <button type="button" data-qty="-" aria-label="Decrease">−</button>
              <input id="pdQty" type="number" value="1" min="1" />
              <button type="button" data-qty="+" aria-label="Increase">+</button>
            </div>
          </div>
          <button class="product-detail__add" data-add-to-cart="${p.slug}">Add to cart</button>
        </div>
      </div>
    `;

    // Populate related carousel
    const track = $('#relatedTrack');
    if (track){
      const related = PRODUCTS.filter(x => x.slug !== slug);
      track.innerHTML = related.map(rp => `
        <a href="#/shop/${rp.slug}" data-route="/shop/${rp.slug}" class="product-card">
          <div class="product-card__img">
            <img src="${rp.image}" alt="${rp.name}" loading="lazy" />
          </div>
          <div class="product-card__body">
            <h3>${rp.name}</h3>
            <div class="product-card__actions">
              <span class="btn btn--tiny">Buy Now</span>
              <span class="product-card__about">About</span>
            </div>
          </div>
        </a>
      `).join('');
    }
  }

  // =============================================
  // BOOT
  // =============================================
  renderCart();
  animate();
  route();
  onScroll();
  initProcess();
  initCounters();
})();
