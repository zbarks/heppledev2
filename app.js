/* ==========================================================
   HEPPLE — app.js
   - Pinned scroll-scrub intro (monotonic, text persists)
   - Embla-style single-card carousel
   - 3 products, EACH with its own gift box (on product pages only)
   - £2.50 gift box add-on available on all 3 products
   ========================================================== */
(() => {
  'use strict';

  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // AGE GATE
  (function initAgeGate(){
    const gate = $('#ageGate');
    if (!gate) return;
    if (localStorage.getItem('hepple:ageOk') === '1'){
      gate.classList.add('is-hidden');
      gate.remove();
      document.body.classList.remove('age-gated');
      return;
    }
    document.body.classList.add('age-gated');
    $('#ageGateYes')?.addEventListener('click', () => {
      localStorage.setItem('hepple:ageOk', '1');
      gate.classList.add('is-hidden');
      document.body.classList.remove('age-gated');
      setTimeout(() => gate.remove(), 700);
    });
    $('#ageGateNo')?.addEventListener('click', () => {
      const panel = gate.querySelector('.age-gate__panel');
      if (panel){
        panel.innerHTML = `
          <img src="/assets/brand/hepple-logotype-blue.png" alt="Hepple" class="age-gate__logo" />
          <p class="age-gate__eyebrow">Come back soon.</p>
          <h1 class="age-gate__title">YOU MUST BE 18 OR OVER<br>TO ENTER THIS SITE</h1>
          <p class="age-gate__body">WE LOOK FORWARD TO WELCOMING YOU WHEN YOU'RE OF LEGAL DRINKING AGE.</p>
        `;
      }
    });
  })();

  // =============================================
  // PRODUCT CATALOGUE
  // Each product has its own giftBoxImage — shown ONLY on product detail page.
  // Gift box add-on (£2.50) available on ALL products.
  // =============================================
  const GIFT_BOX_PRICE = 2.50;

  const PRODUCTS = [
    {
      slug:   'hepple-wild-juniper-gin',
      name:   'HEPPLE WILD JUNIPER GIN',
      short:  'Wild Juniper Gin',
      kicker: 'In pursuit of deliciousness.',
      price:  39.95,
      meta:   { size:'70CL', abv:'45%', origin:'NORTHUMBERLAND' },
      image:  '/assets/products/hepple-gin.jpg',
      giftBoxImage: '/assets/products/giftbox-wild-juniper-gin.jpg',
      desc: "A RICH, JUNIPER-FORWARD GIN DISTILLED THREE WAYS FROM BOTANICALS GROWN ON OUR ESTATE. FRESH, COMPLEX, AND UNASHAMEDLY MODERN — THE ONE WE'D BRING TO EVERY MARTINI, EVERY TIME."
    },
    {
      slug:   'hepple-douglas-fir-vodka',
      name:   'HEPPLE DOUGLAS FIR VODKA',
      short:  'Douglas Fir Vodka',
      kicker: 'Forest in a glass.',
      price:  39.95,
      meta:   { size:'70CL', abv:'40%', origin:'NORTHUMBERLAND' },
      image:  '/assets/products/douglas-fir.jpg',
      giftBoxImage: '/assets/products/giftbox-douglas-fir-vodka.jpg',
      desc: "ZESTY, TROPICAL, UNMISTAKABLY PINE. HAND-HARVESTED DOUGLAS FIR NEEDLES DISTILLED IN A GLASS VACUUM TO KEEP EVERY BRIGHT, RESINOUS NOTE INTACT."
    },
    {
      slug:   'hepple-moorland-vodka',
      name:   'HEPPLE MOORLAND VODKA',
      short:  'Moorland Vodka',
      kicker: 'Pure, clean, Northumbrian.',
      price:  34.95,
      meta:   { size:'70CL', abv:'40%', origin:'NORTHUMBERLAND' },
      image:  '/assets/products/wheat-vodka.jpg',
      giftBoxImage: '/assets/products/giftbox-moorland-vodka.jpg',
      desc: "DISTILLED FROM ENGLISH WHEAT AND CUT WITH THE CLEANEST WATER IN ENGLAND — FILTERED THROUGH PEAT, SANDSTONE AND LIMESTONE BENEATH THE MOOR."
    }
  ];
  const productBySlug = Object.fromEntries(PRODUCTS.map(p => [p.slug, p]));

  // CART
  const CART_KEY = 'hepple:cart';
  let cart = (() => {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
    catch(_) { return []; }
  })();
  const saveCart = () => localStorage.setItem(CART_KEY, JSON.stringify(cart));

  function addToCart(slug, qty=1, giftBox=false){
    const key = slug + (giftBox ? ':gift' : '');
    const existing = cart.find(i => i.key === key);
    if (existing) existing.qty += qty;
    else cart.push({ key, slug, qty, giftBox });
    saveCart();
    renderCart();
    showToast('ADDED TO CART');
    bumpCart();
  }
  function removeFromCart(key){
    cart = cart.filter(i => i.key !== key);
    saveCart();
    renderCart();
  }
  function cartCount(){ return cart.reduce((s, i) => s + i.qty, 0); }
  function cartTotal(){
    return cart.reduce((s, i) => {
      const p = productBySlug[i.slug];
      if (!p) return s;
      const unit = p.price + (i.giftBox ? GIFT_BOX_PRICE : 0);
      return s + unit * i.qty;
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
    if (!body) return;

    if (count === 0){
      body.innerHTML = `<p class="cart-panel__empty">YOUR CART IS EMPTY</p>`;
      if (foot) foot.hidden = true;
      return;
    }
    body.innerHTML = cart.map(i => {
      const p = productBySlug[i.slug];
      if (!p) return '';
      const unit = p.price + (i.giftBox ? GIFT_BOX_PRICE : 0);
      const thumb = i.giftBox && p.giftBoxImage ? p.giftBoxImage : p.image;
      return `
        <div class="cart-item">
          <div class="cart-item__img"><img src="${thumb}" alt="${p.name}" /></div>
          <div class="cart-item__info">
            <h4>${p.name}${i.giftBox ? ' + GIFT BOX' : ''}</h4>
            <div class="qty">QTY ${i.qty} · £${unit.toFixed(2)} EA</div>
            <button class="cart-item__remove" data-remove="${i.key}">REMOVE</button>
          </div>
          <div class="cart-item__price">£${(unit * i.qty).toFixed(2)}</div>
        </div>
      `;
    }).join('');
    if (foot) foot.hidden = false;
    const totalEl = $('#cartTotal');
    if (totalEl) totalEl.textContent = `£${cartTotal().toFixed(2)}`;
  }

  function bumpCart(){
    const btn = $('#cartBtn');
    if (!btn || !btn.animate) return;
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

  // ROUTER
  const intro   = $('#intro');
  const nav     = $('#nav');
  const content = $('#content');
  const video   = $('#heroVideo');

  function getRoute(){
    const h = location.hash.replace(/^#/, '') || '/';
    return h.startsWith('/') ? h : '/' + h;
  }
  function matchPage(route){
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

    $$('[data-route]').forEach(a => {
      const r = a.getAttribute('data-route');
      let active = r === route;
      if (!active && r === '/shop' && route.startsWith('/shop')) active = true;
      a.classList.toggle('is-active', active);
    });

    if (route === '/shop') renderShopGrid();
    if (/^\/shop\/[\w-]+$/.test(route)){
      const slug = route.split('/')[2];
      renderProductDetail(slug);
    }
    if (route === '/') renderHomeRange();
  }
  function showIntroOrNot(route, forceIntro=false){
    const onHome = route === '/';
    if (onHome){
      const hasSeen = sessionStorage.getItem('hepple:seenIntro') === '1';
      if (hasSeen && !forceIntro){
        if (intro) intro.style.display = 'none';
        nav.classList.add('is-visible');
      } else {
        if (intro){
          intro.style.display = '';
          intro.classList.remove('is-text-revealed', 'is-complete');
        }
        introComplete = false;
        maxProgress = 0;
        targetTime = 0;
        currentTime = 0;
        lastWriteTime = -1;
        textRevealed = false;
        if (video){ try { video.currentTime = 0; } catch(_){} }
        nav.classList.remove('is-visible');
        window.scrollTo(0, 0);
      }
    } else {
      if (intro) intro.style.display = 'none';
      nav.classList.add('is-visible');
      window.scrollTo(0, 0);
    }
  }
  function route(forceIntro = false){
    const r = getRoute();
    setActivePage(r);
    showIntroOrNot(r, forceIntro);
  }

  document.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('[data-remove]');
    if (removeBtn){
      e.preventDefault();
      removeFromCart(removeBtn.dataset.remove);
      return;
    }
    const addBtn = e.target.closest('[data-add-to-cart]');
    if (addBtn){
      e.preventDefault();
      const slug = addBtn.dataset.addToCart;
      const qtyInput = $('#pdQty');
      const qty = qtyInput ? Math.max(1, parseInt(qtyInput.value || '1', 10)) : 1;
      const giftBox = $('#pdGift')?.checked || false;
      addToCart(slug, qty, giftBox);
      addBtn.classList.add('is-added');
      addBtn.textContent = 'ADDED ✓';
      setTimeout(() => {
        addBtn.classList.remove('is-added');
        addBtn.textContent = 'ADD TO CART';
      }, 1800);
      return;
    }
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
    const giftToggle = e.target.closest('[data-gift-toggle]');
    if (giftToggle){
      e.preventDefault();
      const cb = $('#pdGift');
      if (cb){
        cb.checked = !cb.checked;
        giftToggle.classList.toggle('is-checked', cb.checked);
        // Jump gallery to the gift box slide when adding; back to bottle when removing
        const galleryBtn = cb.checked
          ? $('[data-pd-next]')
          : $('[data-pd-prev]');
        // noop — purely visual preference, leave gallery state to user
      }
      return;
    }

    const a = e.target.closest('[data-route]');
    if (!a) return;
    const target = a.getAttribute('data-route');
    if (!target) return;
    e.preventDefault();
    closeDrawers();

    const isBrand = a.hasAttribute('data-brand');
    if (isBrand) sessionStorage.removeItem('hepple:seenIntro');

    if (location.hash === '#' + target){
      route(isBrand);
    } else {
      if (isBrand) window._hepple_forceIntro = true;
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

  // SCROLL SCRUB
  let videoDuration = 5.2;
  let targetTime    = 0;
  let currentTime   = 0;
  let lastWriteTime = -1;
  let introComplete = false;
  let maxProgress   = 0;
  let textRevealed  = false;

  const LERP            = 0.12;
  const WRITE_THRESHOLD = 1/28;
  const REVEAL_THRESHOLD = 0.10;
  const COMPLETE_THRESHOLD = 0.92;

  if (video){
    video.addEventListener('loadedmetadata', () => {
      if (isFinite(video.duration) && video.duration > 0) videoDuration = video.duration;
    });
    const prime = async () => {
      try { await video.play(); video.pause(); video.currentTime = 0; } catch(_){}
    };
    if (video.readyState >= 1) prime();
    else video.addEventListener('loadedmetadata', prime, { once:true });
  }

  function tick(){
    computeScrollProgress();
    const diff = targetTime - currentTime;
    if (Math.abs(diff) > 0.001) currentTime += diff * LERP;
    else currentTime = targetTime;

    if (video && video.readyState >= 2 && isFinite(currentTime)){
      if (Math.abs(currentTime - lastWriteTime) > WRITE_THRESHOLD){
        try { video.currentTime = currentTime; lastWriteTime = currentTime; }
        catch(_){}
      }
    }
    requestAnimationFrame(tick);
  }

  function computeScrollProgress(){
    if (getRoute() !== '/' || !intro || intro.style.display === 'none') return;

    const rect       = intro.getBoundingClientRect();
    const introH     = intro.offsetHeight;
    const viewport   = window.innerHeight;
    const scrollable = Math.max(1, introH - viewport);
    const scrolled   = Math.min(Math.max(-rect.top, 0), scrollable);
    const raw        = scrolled / scrollable;

    if (raw > maxProgress) maxProgress = raw;
    targetTime = Math.max(0, Math.min(videoDuration * maxProgress, videoDuration - 0.05));

    if (!textRevealed && maxProgress >= REVEAL_THRESHOLD){
      textRevealed = true;
      intro.classList.add('is-text-revealed');
    }

    if (maxProgress >= COMPLETE_THRESHOLD && !introComplete){
      introComplete = true;
      intro.classList.add('is-complete');
      nav.classList.add('is-visible');
      sessionStorage.setItem('hepple:seenIntro', '1');
    }
  }

  // DRAWERS
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

  // EMBLA
  function initEmbla(root){
    if (!root || root._emblaInit) return;
    root._emblaInit = true;

    const viewport  = root.querySelector('[data-embla-viewport]');
    const container = root.querySelector('[data-embla-container]');
    const prev      = root.querySelector('[data-embla-prev]');
    const next      = root.querySelector('[data-embla-next]');
    const dotsEl    = root.querySelector('[data-embla-dots]');
    if (!viewport || !container) return;

    const slides = Array.from(container.children);
    if (!slides.length) return;

    let idx = 0;

    if (dotsEl){
      dotsEl.innerHTML = slides.map((_, i) =>
        `<button class="embla__dot${i === 0 ? ' is-active' : ''}" data-embla-dot="${i}" aria-label="Slide ${i+1}"></button>`
      ).join('');
    }

    function goTo(i, smooth=true){
      idx = (i + slides.length) % slides.length;
      const x = -idx * 100;
      container.style.transition = smooth ? 'transform .6s cubic-bezier(.16,1,.3,1)' : 'none';
      container.style.transform = `translateX(${x}%)`;
      update();
    }

    function update(){
      if (prev) prev.disabled = idx === 0;
      if (next) next.disabled = idx === slides.length - 1;
      if (dotsEl){
        dotsEl.querySelectorAll('[data-embla-dot]').forEach((d, i) => {
          d.classList.toggle('is-active', i === idx);
        });
      }
    }

    prev?.addEventListener('click', () => goTo(idx - 1));
    next?.addEventListener('click', () => goTo(idx + 1));
    dotsEl?.addEventListener('click', e => {
      const d = e.target.closest('[data-embla-dot]');
      if (d) goTo(parseInt(d.dataset.emblaDot, 10));
    });

    let startX = 0, currentX = 0, dragging = false;
    viewport.addEventListener('touchstart', e => { startX = e.touches[0].clientX; dragging = true; }, { passive:true });
    viewport.addEventListener('touchmove',  e => { if (dragging) currentX = e.touches[0].clientX; }, { passive:true });
    viewport.addEventListener('touchend',   () => {
      if (!dragging) return;
      dragging = false;
      const delta = currentX - startX;
      if (Math.abs(delta) > 40) goTo(delta < 0 ? idx + 1 : idx - 1);
    });
    root.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft'){ e.preventDefault(); goTo(idx - 1); }
      else if (e.key === 'ArrowRight'){ e.preventDefault(); goTo(idx + 1); }
    });

    goTo(0, false);
  }
  function initAllEmbla(){ $$('[data-embla]').forEach(initEmbla); }

  // PROCESS
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

  // COUNTERS
  function animateNumber(el){
    const target = parseFloat(el.dataset.countTo || '0');
    const format = el.dataset.countFormat || '';
    const suffix = el.dataset.countSuffix || '';
    const duration = 1800;
    const start = performance.now();
    function easeOutExpo(t){ return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
    function frame(now){
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const e = easeOutExpo(t);
      const current = Math.round(target * e);
      el.textContent = (format === 'comma' ? current.toLocaleString('en-GB') : current.toString()) + suffix;
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = (format === 'comma' ? target.toLocaleString('en-GB') : target.toString()) + suffix;
    }
    requestAnimationFrame(frame);
  }
  function initCounters(){
    const nums = $$('.stat__number[data-count-to]');
    if (!nums.length) return;
    if (!('IntersectionObserver' in window)){ nums.forEach(animateNumber); return; }
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

  // HOME RANGE (shows ONLY the 3 bottles, NO gift boxes)
  function renderHomeRange(){
    const track = $('#homeRangeTrack');
    if (!track || track._rendered) return;
    track._rendered = true;
    track.innerHTML = PRODUCTS.map(p => `
      <div class="embla__slide">
        <a href="#/shop/${p.slug}" data-route="/shop/${p.slug}" class="product-card">
          <div class="product-card__img">
            <img src="${p.image}" alt="${p.name}" loading="lazy" />
          </div>
          <div class="product-card__body">
            <h3>${p.name}</h3>
            <div class="product-card__price">£${p.price.toFixed(2)}</div>
            <div class="product-card__actions">
              <span class="btn btn--tiny">BUY NOW</span>
              <span class="product-card__about">ABOUT</span>
            </div>
          </div>
        </a>
      </div>
    `).join('');
    initAllEmbla();
  }

  // SHOP GRID (shows ONLY the 3 bottles, NO gift boxes)
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
          <span class="btn btn--tiny">VIEW</span>
        </div>
      </a>
    `).join('');
  }

  // PRODUCT DETAIL — bottle + gift box in carousel (2 slides), £2.50 add-on
  function renderProductDetail(slug){
    const root = $('#productDetail');
    const p = productBySlug[slug];
    if (!root) return;
    if (!p){
      root.innerHTML = `<div class="wrap" style="padding:6rem 0; text-align:center;">
        <p>PRODUCT NOT FOUND.</p>
        <a href="#/shop" data-route="/shop" style="border-bottom:1px solid; font-weight:700; letter-spacing:.2em; font-size:.7rem;">BACK TO SHOP →</a>
      </div>`;
      return;
    }

    // Slides: bottle first, gift box second
    const galleryImgs = [
      { src: p.image,        label: `${p.name} bottle` },
      { src: p.giftBoxImage, label: `${p.name} gift box` }
    ];

    const slidesHtml = galleryImgs.map((img, i) =>
      `<div class="pd-gallery__slide ${i === 0 ? 'is-active' : ''}" data-slide="${i}">
        <img src="${img.src}" alt="${img.label}" />
      </div>`
    ).join('');
    const dotsHtml = galleryImgs.map((_, i) =>
      `<button class="pd-gallery__dot ${i === 0 ? 'is-active' : ''}" data-goto-slide="${i}" aria-label="Image ${i+1}"></button>`
    ).join('');

    root.innerHTML = `
      <div class="product-detail__grid">
        <div class="pd-gallery" data-pd-gallery>
          <div class="pd-gallery__stage">
            ${slidesHtml}
            <button class="pd-gallery__btn pd-gallery__btn--prev" data-pd-prev aria-label="Previous image">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 6l-6 6 6 6"/></svg>
            </button>
            <button class="pd-gallery__btn pd-gallery__btn--next" data-pd-next aria-label="Next image">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 6l6 6-6 6"/></svg>
            </button>
            <div class="pd-gallery__dots">${dotsHtml}</div>
          </div>
        </div>
        <div class="product-detail__body">
          <div class="product-detail__crumbs">
            <a href="#/shop" data-route="/shop">SHOP</a> / ${p.short.toUpperCase()}
          </div>
          <p class="script-accent">${p.kicker}</p>
          <h1 class="product-detail__title">${p.name}</h1>
          <div class="product-detail__price">£${p.price.toFixed(2)}</div>
          <p class="product-detail__desc">${p.desc}</p>
          <div class="product-detail__meta">
            <div><strong>${p.meta.size}</strong>SIZE</div>
            <div><strong>${p.meta.abv}</strong>ABV</div>
            <div><strong>${p.meta.origin}</strong>ORIGIN</div>
          </div>
          <label class="gift-addon" data-gift-toggle>
            <input id="pdGift" type="checkbox" />
            <span class="gift-addon__check"></span>
            <div class="gift-addon__body">
              <span class="gift-addon__title">ADD GIFT BOX</span>
              <span class="gift-addon__sub">A HANDSOME BOX FOR THE BOTTLE</span>
            </div>
            <span class="gift-addon__price">+£${GIFT_BOX_PRICE.toFixed(2)}</span>
          </label>
          <div class="product-detail__qty">
            <label for="pdQty">QTY</label>
            <div class="qty-stepper">
              <button type="button" data-qty="-" aria-label="Decrease">−</button>
              <input id="pdQty" type="number" value="1" min="1" />
              <button type="button" data-qty="+" aria-label="Increase">+</button>
            </div>
          </div>
          <button class="product-detail__add" data-add-to-cart="${p.slug}">ADD TO CART</button>
        </div>
      </div>
    `;

    initProductGallery();

    // Related carousel — other 2 bottles only
    const track = $('#relatedTrack');
    if (track){
      const related = PRODUCTS.filter(x => x.slug !== slug);
      track.innerHTML = related.map(rp => `
        <div class="embla__slide">
          <a href="#/shop/${rp.slug}" data-route="/shop/${rp.slug}" class="product-card">
            <div class="product-card__img">
              <img src="${rp.image}" alt="${rp.name}" loading="lazy" />
            </div>
            <div class="product-card__body">
              <h3>${rp.name}</h3>
              <div class="product-card__price">£${rp.price.toFixed(2)}</div>
              <div class="product-card__actions">
                <span class="btn btn--tiny">BUY NOW</span>
                <span class="product-card__about">ABOUT</span>
              </div>
            </div>
          </a>
        </div>
      `).join('');
      const embla = track.closest('[data-embla]');
      if (embla){ embla._emblaInit = false; initEmbla(embla); }
    }
  }

  function initProductGallery(){
    const g = $('[data-pd-gallery]');
    if (!g) return;
    const slides = $$('.pd-gallery__slide', g);
    if (slides.length < 2) return;
    const dots   = $$('[data-goto-slide]', g);
    const prev   = $('[data-pd-prev]', g);
    const next   = $('[data-pd-next]', g);
    let idx = 0;

    function goTo(i){
      idx = (i + slides.length) % slides.length;
      slides.forEach((s, si) => s.classList.toggle('is-active', si === idx));
      dots.forEach((d, di) => d.classList.toggle('is-active', di === idx));
    }
    prev?.addEventListener('click', () => goTo(idx - 1));
    next?.addEventListener('click', () => goTo(idx + 1));
    dots.forEach((d, di) => d.addEventListener('click', () => goTo(di)));
  }

  // BOOT
  renderCart();
  requestAnimationFrame(tick);
  route();
  computeScrollProgress();
  initProcess();
  initCounters();
  initAllEmbla();
})();
