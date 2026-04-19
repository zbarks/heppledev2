/* ==========================================================
   HEPPLE — app.js
   Per 18 April feedback: real product copy, 9 cocktails grouped by SKU,
   team showcase placeholder, flip cards with hover-stays-flipped
   ========================================================== */
(() => {
  'use strict';

  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // =============================================
  // AGE GATE
  // =============================================
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
          <img src="assets/brand/hepple-logotype-blue.png" alt="Hepple" class="age-gate__logo" />
          <p class="age-gate__eyebrow">Come back soon.</p>
          <h1 class="age-gate__title">YOU MUST BE 18 OR OVER<br>TO ENTER THIS SITE</h1>
          <p class="age-gate__body">WE LOOK FORWARD TO WELCOMING YOU WHEN YOU'RE OF LEGAL DRINKING AGE.</p>
        `;
      }
    });
  })();

  // =============================================
  // PRODUCT CATALOGUE — per 18 April feedback
  // Each product has its own giftBoxImage; gift box is £2.50 add-on
  // =============================================
  const GIFT_BOX_PRICE = 2.50;

  const PRODUCTS = [
    {
      slug:    'hepple-wild-juniper-gin',
      name:    'HEPPLE WILD JUNIPER GIN',
      nameTop: 'HEPPLE',
      nameRest:'WILD JUNIPER GIN',
      short:   'Wild Juniper Gin',
      tagline: 'BRIGHT. WILD. ELEGANT',
      kicker:  'THE HEART OF HEPPLE',
      price:   39.95,
      meta:    { size: '70CL', abv: '45%', origin: 'NORTHUMBERLAND' },
      sku:     'juniper-pink',
      image:   'assets/products/hepple-gin.jpg',
      giftBoxImage: 'assets/products/giftbox-wild-juniper-gin.jpg',
      body: [
        "ON THE HEPPLE ESTATE, ANCIENT JUNIPER BUSHES GROW WILD ACROSS THE NORTHUMBERLAND MOORLAND — SHAPED BY WIND, WEATHER AND TIME.",
        "EACH SUMMER, WE HARVEST THE BERRIES BY HAND WHILE THEY ARE STILL BRIGHT GREEN. AT THIS STAGE, JUNIPER IS FRESHER, MORE VIBRANT AND MORE ALIVE — FULL OF CITRUS LIFT, NATURAL ZEST AND A QUIET ELEGANCE YOU DON'T FIND IN THE DRIED BERRY ALONE.",
        "THAT FRESHNESS SITS AT THE HEART OF THIS GIN. DRIED JUNIPER IS USED CAREFULLY, TO BRING DEPTH AND STRUCTURE. BUT IT'S THE WILD GREEN JUNIPER PICKED FRESH FROM THE ESTATE THAT DEFINES THE CHARACTER: BRIGHT, LIFTED AND UNMISTAKABLY HEPPLE.",
        "AROUND IT SITS A CAREFULLY SELECTED GROUP OF BOTANICALS — DOUGLAS FIR, BLACKCURRANT LEAF, LOVAGE, CHAMOMILE, CORIANDER SEED, ANGELICA ROOT, ORRIS ROOT, CASSIA BARK, LIQUORICE ROOT, AND GRAINS OF PARADISE — EACH CHOSEN AND TESTED REPEATEDLY FOR HOW IT SUPPORTS AND EXTENDS THE CHARACTER OF JUNIPER, RATHER THAN COMPETING WITH IT.",
        "NOTHING IS THERE BY ACCIDENT. EVERYTHING IS THERE TO MAKE A BETTER DRINK."
      ],
      tasting: {
        nose:   'SPICY JUNIPER, FRESH GREEN APPLE, BRIGHT GRAPEFRUIT',
        palate: 'CLEAN, BRIGHT CITRUS, DEVELOPING INTO SOFT CANTALOUPE MELON AND LIFTED ZESTY JUNIPER',
        finish: 'LONG AND BALANCED, WITH SUBTLE NOTES OF CEDAR AND SANDALWOOD BENEATH A VIBRANT RICH JUNIPER POP'
      },
      howToEnjoy: {
        lead: "OUR FAVOURITE WAY TO TRULY EXPERIENCE THE FULL SPECTRUM OF FLAVOUR IS AN ICY COLD MARTINI WITH A FRESH LEMON ZEST.",
        recipe: [
          "5 PARTS (75ML) HEPPLE WILD JUNIPER GIN",
          "1 PART (15ML) DRY VERMOUTH",
          "STIR WITH CUBED ICE IN A MIXING GLASS OR JUG UNTIL COLD AS THE ARCTIC (20–30 SECONDS).",
          "STRAIN INTO A CHILLED GLASS.",
          "FINISH WITH A LEMON TWIST."
        ],
        alt: "ALSO WORKS BEAUTIFULLY IN A G&T OR A TOM COLLINS."
      }
    },
    {
      slug:    'hepple-douglas-fir-vodka',
      name:    'HEPPLE DOUGLAS FIR VODKA',
      nameTop: 'HEPPLE',
      nameRest:'DOUGLAS FIR VODKA',
      short:   'Douglas Fir Vodka',
      tagline: 'FRESH. LIFTED. UNEXPECTED',
      kicker:  'WHERE FOREST BECOMES FLAVOUR',
      price:   39.95,
      meta:    { size: '70CL', abv: '41%', origin: 'NORTHUMBERLAND' },
      sku:     'doug-fir-green',
      image:   'assets/products/douglas-fir.jpg',
      giftBoxImage: 'assets/products/giftbox-douglas-fir-vodka.jpg',
      body: [
        "HIGH ABOVE THE HEPPLE ESTATE, ANCIENT DOUGLAS FIR TREES RISE THROUGH THE VALLEY — SOME MORE THAN TWO HUNDRED YEARS OLD. EVERGREEN THROUGH WINTER, SHARP WITH RESIN AND ALIVE WITH SCENT, THEY CARRY A CLARITY YOU DON'T EXPECT TO FIND IN A VODKA.",
        "WE HARVEST THE YOUNG NEEDLES BY HAND, WORKING TO CAPTURE THAT MOMENT WHEN THE FLAVOUR IS AT ITS BRIGHTEST — GREEN, CITRUS-LED AND QUIETLY AROMATIC. IT'S A CHARACTER THAT'S SURPRISINGLY DELICATE: FRESH RATHER THAN HEAVY, LIFTED RATHER THAN OVERTLY PINE.",
        "THIS TOOK TIME TO UNDERSTAND. THROUGH EXTENSIVE TRIALS AND CAREFUL EXTRACTION, WE WORKED TO EXPRESS THE COMPLEXITIES OF DOUGLAS FIR IN FULL — NOT JUST AS AN IDEA, BUT AS A COMPLETE FLAVOUR. THE RESULT IS A VODKA WITH DEFINITION AND LENGTH, CHOSEN AT 41% ABV WHERE EVERYTHING COMES INTO BALANCE.",
        "WE MADE IT TO BRING SOMETHING NEW AND TRULY UNIQUE TO THE GLASS — A VODKA WITH REAL PRESENCE, DESIGNED TO BRING A REFINED COMPLEXITY AND SAVOURY POP TO YOUR COCKTAILS."
      ],
      tasting: {
        nose:   'FRESH, DELICATE DOUGLAS FIR UNDERPINNED BY SOUR LEMON AND RICHER CITRUS OIL',
        palate: 'RIPE JUICY MELON, DEVELOPING INTO BRIGHT GRAPEFRUIT PEEL AND GENTLE TROPICAL NOTES',
        finish: 'DEEP, CLEAN AND LINGERING, WITH PINE, WHITE GRAPEFRUIT AND A SOFT, ROUNDED LENGTH'
      },
      howToEnjoy: {
        lead: "SIP NEAT, OR OVER ICE.",
        recipe: [
          "GREAT IN A MARTINI WITH A PINK GRAPEFRUIT ZEST.",
          "REFRESHING SERVED LONG WITH SODA AND A SQUEEZE OF PINK GRAPEFRUIT."
        ]
      }
    },
    {
      slug:    'hepple-moorland-vodka',
      name:    'HEPPLE MOORLAND VODKA',
      nameTop: 'HEPPLE',
      nameRest:'MOORLAND VODKA',
      short:   'Moorland Vodka',
      tagline: 'PURE, CRISP, SMOOTH',
      kicker:  'PRECISION IN RESTRAINT',
      price:   34.95,
      meta:    { size: '70CL', abv: '41%', origin: 'NORTHUMBERLAND' },
      sku:     'moorland-teal',
      image:   'assets/products/wheat-vodka.jpg',
      giftBoxImage: 'assets/products/giftbox-moorland-vodka.jpg',
      body: [
        "MADE FROM ENGLISH WHEAT AND BLENDED WITH OUR OWN SPRING WATER — FILTERED SLOWLY THROUGH PEAT, SANDSTONE AND LIMESTONE — IT BEGINS WITH CLARITY. NOT BY STRIPPING EVERYTHING AWAY, BUT BY KEEPING ONLY WHAT MATTERS.",
        "USING OUR COPPER POT STILL, WE WORKED CAREFULLY TO REFINE THE SPIRIT WITHOUT LOSING ITS NATURAL CHARACTER. THROUGH CONTROLLED DISTILLATION AND PRECISE CUTS, WE REMOVE HEAVINESS WHILE PRESERVING TEXTURE, SOFTNESS AND A GENTLE GRAIN AND MINERALLY WARMTH THAT CARRIES THROUGH THE GLASS.",
        "THE RESULT IS A VODKA THAT IS CLEAN, BUT NOT EMPTY. BALANCED, BUT NEVER FLAT.",
        "WE MADE OUR VODKA TO BE THE QUIET FOUNDATION OF A GREAT DRINK — RESOLVING, LIFTING AND BRINGING EVERYTHING INTO PLACE."
      ],
      tasting: {
        nose:   'CLEAN AND ROUNDED, WITH SOFT CEREAL NOTES AND A GENTLE HINT OF SPICE',
        palate: 'FULL AND SMOOTH, WITH A CLEAN MINERAL EARTH MID-PALATE AND NOTES OF TOASTED CEREAL',
        finish: 'LONG AND COMPOSED, WITH SOFT CEREAL SWEETNESS AND A CLEAN, SLIGHTLY SALINE LINGERING LENGTH'
      },
      howToEnjoy: {
        lead: "BEST ENJOYED IN AN ICY COLD MARTINI, WITH A LEMON ZEST OR WITH YOUR FAVOURITE OLIVES. WE LIKE IT DIRTY TOO, BUT THAT'S OUR LITTLE SECRET, OK?",
        recipe: [
          "GREAT STRAIGHT FROM THE FREEZER WITH FOOD OR FRIENDS.",
          "THE PERFECT INGREDIENT IN YOUR FAVOURITE VODKA COCKTAIL."
        ]
      }
    }
  ];
  const productBySlug = Object.fromEntries(PRODUCTS.map(p => [p.slug, p]));

  // =============================================
  // COCKTAILS — 9 drinks grouped by SKU per feedback
  // Images pulled from hepplespirits.com CDN
  // Recipes are Latin placeholders (per feedback: all text Latin unless specified)
  // =============================================
  const LATIN = "LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT. SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE MAGNA ALIQUA.";
  const LATIN_SHORT = "LOREM IPSUM DOLOR SIT AMET.";

  const COCKTAILS = [
    // ── HEPPLE WILD JUNIPER GIN ──
    {
      id:       'classic-martini',
      name:     'CLASSIC MARTINI',
      sku:      'hepple-wild-juniper-gin',
      image:    'https://hepplespirits.com/cdn/shop/articles/Screenshot_2022-09-05_at_15.11.14.png?v=1662387258&width=800',
      source:   'https://hepplespirits.com/blogs/cocktail-recipes/hepple-martini',
      ingredients: [
        '75ML HEPPLE WILD JUNIPER GIN',
        '15ML DRY VERMOUTH',
        'LEMON TWIST'
      ],
      method:   'STIR WITH CUBED ICE UNTIL ICE COLD. STRAIN INTO A CHILLED GLASS. FINISH WITH A LEMON TWIST.'
    },
    {
      id:       'gin-basil-smash',
      name:     'GIN BASIL SMASH',
      sku:      'hepple-wild-juniper-gin',
      image:    'https://hepplespirits.com/cdn/shop/articles/IMG_2414.jpg?v=1678366307&width=800',
      source:   'https://hepplespirits.com/blogs/cocktail-recipes/hepple-gin-basil-smash',
      ingredients: [
        '60ML HEPPLE WILD JUNIPER GIN',
        '25ML FRESH LEMON JUICE',
        '15ML SUGAR SYRUP',
        'LARGE HANDFUL OF FRESH BASIL'
      ],
      method:   'MUDDLE THE BASIL WITH THE SYRUP. ADD GIN AND LEMON, SHAKE HARD WITH ICE, DOUBLE-STRAIN INTO A ROCKS GLASS OVER FRESH ICE.'
    },
    {
      id:       'cherry-negroni',
      name:     'CHERRY NEGRONI',
      sku:      'hepple-wild-juniper-gin',
      image:    'https://hepplespirits.com/cdn/shop/articles/KLJ_Hepple_May2022_Shot_09_206_working-v2_sRGB.jpg?v=1662390195&width=800',
      source:   'https://hepplespirits.com/blogs/cocktail-recipes/cherry-and-chocolate-negroni',
      ingredients: [
        '30ML HEPPLE WILD JUNIPER GIN',
        '30ML CAMPARI',
        '30ML SWEET VERMOUTH',
        'DASH OF CHERRY BITTERS'
      ],
      method:   'STIR ALL INGREDIENTS WITH ICE UNTIL WELL CHILLED. STRAIN OVER A LARGE ICE CUBE. GARNISH WITH A ZEST OF ORANGE.'
    },
    // ── HEPPLE DOUGLAS FIR VODKA ──
    {
      id:       'bergamot-martini',
      name:     'BERGAMOT MARTINI',
      sku:      'hepple-douglas-fir-vodka',
      image:    'https://hepplespirits.com/cdn/shop/articles/Screenshot_2022-09-08_at_09.53.25.png?v=1662627213&width=800',
      source:   'https://hepplespirits.com/blogs/cocktail-recipes/bergamot-martini',
      ingredients: [
        '60ML HEPPLE DOUGLAS FIR VODKA',
        '10ML BERGAMOT LIQUEUR',
        '5ML DRY VERMOUTH',
        'BERGAMOT ZEST'
      ],
      method:   'STIR ALL INGREDIENTS WITH ICE UNTIL ICE COLD. STRAIN INTO A CHILLED GLASS AND GARNISH WITH BERGAMOT ZEST.'
    },
    {
      id:       'shooting-star',
      name:     'SHOOTING STAR',
      sku:      'hepple-douglas-fir-vodka',
      image:    'https://hepplespirits.com/cdn/shop/articles/Screenshot_2022-09-05_at_15.21.21.png?v=1662387729&width=800',
      source:   'https://hepplespirits.com/blogs/cocktail-recipes/shooting-star-cocktail',
      ingredients: [
        '50ML HEPPLE DOUGLAS FIR VODKA',
        '25ML PINK GRAPEFRUIT JUICE',
        '10ML LIME JUICE',
        '10ML STAR ANISE SYRUP'
      ],
      method:   'SHAKE ALL INGREDIENTS WITH ICE, DOUBLE-STRAIN INTO A COUPE. GARNISH WITH A STAR ANISE POD.'
    },
    {
      id:       'forest-sour',
      name:     'FOREST SOUR',
      sku:      'hepple-douglas-fir-vodka',
      image:    'https://hepplespirits.com/cdn/shop/articles/Screenshot_2022-09-05_at_15.17.46.png?v=1662387595&width=800',
      source:   'https://hepplespirits.com/blogs/cocktail-recipes/douglas-fir-sour',
      ingredients: [
        '60ML HEPPLE DOUGLAS FIR VODKA',
        '25ML LEMON JUICE',
        '15ML SUGAR SYRUP',
        '1 EGG WHITE'
      ],
      method:   'DRY SHAKE WITHOUT ICE. ADD ICE, SHAKE AGAIN HARD. STRAIN INTO A CHILLED COUPE. BITTERS ON THE FOAM.'
    },
    // ── HEPPLE MOORLAND VODKA ──
    {
      id:       'dirty-martini',
      name:     'DIRTY MARTINI (OUR LITTLE SECRET)',
      sku:      'hepple-moorland-vodka',
      image:    'assets/cocktails/dirty-martini-clink.jpg',
      source:   null,
      ingredients: [
        '60ML HEPPLE MOORLAND VODKA',
        '10ML DRY VERMOUTH',
        '10ML OLIVE BRINE',
        'GREEN OLIVES'
      ],
      method:   'STIR WITH ICE UNTIL WELL CHILLED. STRAIN INTO A CHILLED MARTINI GLASS. GARNISH WITH OLIVES. LOREM IPSUM.'
    },
    {
      id:       'moorland-cooler',
      name:     'MOORLAND COOLER',
      sku:      'hepple-moorland-vodka',
      image:    'https://hepplespirits.com/cdn/shop/articles/KLJ_Hepple_May2022_Shot_12_023.jpg?v=1665590025&width=800',
      source:   null,
      ingredients: [
        '50ML HEPPLE MOORLAND VODKA',
        '25ML LEMON JUICE',
        '15ML SUGAR SYRUP',
        'SODA TO TOP',
        'CUCUMBER RIBBON'
      ],
      method:   'BUILD IN A HIGHBALL OVER ICE. TOP WITH SODA. GARNISH WITH CUCUMBER. LOREM IPSUM DOLOR SIT AMET.'
    },
    {
      id:       'butterfly',
      name:     'BUTTERFLY',
      sku:      'hepple-moorland-vodka',
      image:    'https://hepplespirits.com/cdn/shop/articles/KLJ_Hepple_26.04.21_Shot_05-046_working.jpg?v=1662717442&width=800',
      source:   null,
      ingredients: [
        '30ML HEPPLE MOORLAND VODKA',
        '20ML GREEN CHARTREUSE',
        '20ML MARASCHINO',
        '20ML LIME JUICE'
      ],
      method:   'SHAKE HARD WITH ICE UNTIL ICE COLD. DOUBLE-STRAIN INTO A CHILLED COUPE. LOREM IPSUM.'
    }
  ];

  // =============================================
  // TEAM — placeholder only (no photos yet per feedback)
  // =============================================
  const TEAM_MEMBERS = [
    { id: '1', name: 'Lorem Ipsum',     role: 'FOUNDER & MASTER DISTILLER' },
    { id: '2', name: 'Dolor Sit Amet',  role: 'HEAD OF PRODUCTION' },
    { id: '3', name: 'Consectetur',     role: 'BOTANIST' },
    { id: '4', name: 'Adipiscing Elit', role: 'HEAD OF BRAND' },
    { id: '5', name: 'Sed Eiusmod',     role: 'OPERATIONS' },
    { id: '6', name: 'Tempor Incididunt', role: 'HOSPITALITY' }
  ];

  // Tiny inline SVG placeholder — works without external images
  function placeholderAvatar(seed){
    const colors = ['#E3DDD1', '#d7d0c3', '#CFE0DE', '#f6f2ea', '#EDE8E0', '#E8DFD1'];
    const c = colors[seed % colors.length];
    return `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 140'><rect width='120' height='140' fill='${c}'/><circle cx='60' cy='56' r='22' fill='%231b1a2e' opacity='.25'/><path d='M20,140 C20,100 40,84 60,84 C80,84 100,100 100,140 Z' fill='%231b1a2e' opacity='.25'/></svg>`
    )}`;
  }

  // =============================================
  // CART
  // =============================================
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

    if (route === '/shop'){ renderShopGrid(); renderShopCocktails(); }
    if (/^\/shop\/[\w-]+$/.test(route)){
      const slug = route.split('/')[2];
      renderProductDetail(slug);
    }
    if (route === '/'){ renderHomeRange(); renderHomeCocktails(); }
    if (route === '/cocktails') renderCocktailsPage();
    if (route === '/story') renderTeam();
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

  // =============================================
  // SCROLL SCRUB + MOBILE FALLBACK (unchanged from last build)
  // =============================================
  let videoDuration = 5.2;
  let targetTime    = 0;
  let currentTime   = 0;
  let lastWriteTime = -1;
  let introComplete = false;
  let maxProgress   = 0;
  let textRevealed  = false;

  const IS_TOUCH =
    (typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches) ||
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0);

  const LERP              = 0.18;
  const WRITE_THRESHOLD   = 1/15;
  const REVEAL_THRESHOLD  = 0.08;
  const COMPLETE_THRESHOLD = 0.90;

  if (video){
    video.addEventListener('loadedmetadata', () => {
      if (isFinite(video.duration) && video.duration > 0) videoDuration = video.duration;
    });

    if (IS_TOUCH){
      video.loop = true;
      video.muted = true;
      video.setAttribute('muted', '');
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      const startPlayback = () => {
        const p = video.play();
        if (p && typeof p.catch === 'function'){
          p.catch(() => {
            const resume = () => {
              video.play().catch(()=>{});
              document.removeEventListener('touchstart', resume);
              document.removeEventListener('click', resume);
            };
            document.addEventListener('touchstart', resume, { once:true, passive:true });
            document.addEventListener('click',      resume, { once:true });
          });
        }
      };
      if (video.readyState >= 2) startPlayback();
      else video.addEventListener('loadeddata', startPlayback, { once:true });
    } else {
      const prime = async () => {
        try { await video.play(); video.pause(); video.currentTime = 0; } catch(_){}
      };
      if (video.readyState >= 1) prime();
      else video.addEventListener('loadedmetadata', prime, { once:true });
    }
  }

  function tick(){
    computeScrollProgress();
    if (IS_TOUCH){
      requestAnimationFrame(tick);
      return;
    }
    const diff = targetTime - currentTime;
    if (Math.abs(diff) > 0.002) currentTime += diff * LERP;
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
    if (!IS_TOUCH){
      targetTime = Math.max(0, Math.min(videoDuration * maxProgress, videoDuration - 0.05));
    }

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

  // =============================================
  // EMBLA — single-card-centred carousel
  // =============================================
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

  // =============================================
  // PROCESS STEPPER
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
  // NUMBER COUNTERS
  // =============================================
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

  // =============================================
  // HOME RANGE CAROUSEL
  // =============================================
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
            <h3 class="product-card__title"><span class="product-card__brand">${p.nameTop}</span><span class="product-card__variant">${p.nameRest}</span></h3>
            <div class="product-card__kicker">${p.kicker}</div>
            <div class="product-card__tagline">${p.tagline}</div>
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

  // =============================================
  // SHOP GRID
  // =============================================
  function renderShopGrid(){
    const grid = $('#shopGrid');
    if (!grid) return;
    grid.innerHTML = PRODUCTS.map(p => `
      <a href="#/shop/${p.slug}" data-route="/shop/${p.slug}" class="shop-card">
        <div class="shop-card__img">
          <img src="${p.image}" alt="${p.name}" loading="lazy" />
        </div>
        <h3 class="shop-card__title"><span class="shop-card__brand">${p.nameTop}</span><span class="shop-card__variant">${p.nameRest}</span></h3>
        <div class="shop-card__kicker">${p.kicker}</div>
        <div class="shop-card__tagline">${p.tagline}</div>
        <div class="shop-card__meta">${p.meta.size} · ${p.meta.abv}</div>
        <div class="shop-card__price">£${p.price.toFixed(2)}</div>
        <div class="shop-card__actions">
          <span class="btn btn--tiny">VIEW</span>
        </div>
      </a>
    `).join('');
  }

  // =============================================
  // PRODUCT DETAIL — with full body, tasting notes, how-to-enjoy
  // =============================================
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

    const bodyHtml = p.body.map(para => `<p>${para}</p>`).join('');
    const howHtml = p.howToEnjoy ? `
      <div class="product-detail__section">
        <h4>HOW TO ENJOY</h4>
        <p>${p.howToEnjoy.lead}</p>
        ${p.howToEnjoy.recipe ? `<ul>${p.howToEnjoy.recipe.map(r => `<li>${r}</li>`).join('')}</ul>` : ''}
        ${p.howToEnjoy.alt ? `<p>${p.howToEnjoy.alt}</p>` : ''}
      </div>
    ` : '';

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
          <p class="product-detail__kicker">${p.kicker}</p>
          <h1 class="product-detail__title"><span class="product-detail__brand">${p.nameTop}</span><span class="product-detail__variant">${p.nameRest}</span></h1>
          <div class="product-detail__tagline">${p.tagline}</div>
          <div class="product-detail__price">£${p.price.toFixed(2)}</div>
          <div class="product-detail__body-copy">${bodyHtml}</div>
          <div class="product-detail__section">
            <h4>TASTING NOTES</h4>
            <div class="product-detail__tasting">
              <div><strong>NOSE</strong> ${p.tasting.nose}</div>
              <div><strong>PALATE</strong> ${p.tasting.palate}</div>
              <div><strong>FINISH</strong> ${p.tasting.finish}</div>
            </div>
          </div>
          ${howHtml}
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
              <h3 class="product-card__title"><span class="product-card__brand">${rp.nameTop}</span><span class="product-card__variant">${rp.nameRest}</span></h3>
              <div class="product-card__kicker">${rp.kicker}</div>
              <div class="product-card__tagline">${rp.tagline}</div>
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

  // =============================================
  // FLIP CARDS (cocktails) — hover stays flipped, flips back on mouse-leave
  // =============================================
  function cocktailCardHtml(c){
    const ingredientsHtml = c.ingredients.map(ing => `<li>${ing}</li>`).join('');
    return `
      <div class="flip-card" data-flip-card tabindex="0">
        <div class="flip-card__inner">
          <div class="flip-card__face flip-card__front">
            <img src="${c.image}" alt="${c.name}" loading="lazy" />
            <div class="flip-card__front-label">
              <h4>${c.name}</h4>
              <span class="flip-card__front-hint">HOVER FOR RECIPE</span>
            </div>
          </div>
          <div class="flip-card__face flip-card__back">
            <h4>${c.name}</h4>
            <h5>INGREDIENTS</h5>
            <ul>${ingredientsHtml}</ul>
            <h5>METHOD</h5>
            <p>${c.method}</p>
          </div>
        </div>
      </div>
    `;
  }

  // Init flip card touch support — tap to flip, tap again elsewhere to un-flip.
  // CSS handles hover via :hover. For touch devices, we add .is-flipped on tap.
  function initFlipCards(scope=document){
    $$('[data-flip-card]', scope).forEach(card => {
      if (card._flipInit) return;
      card._flipInit = true;
      card.addEventListener('click', (e) => {
        // On touch, toggle
        if (IS_TOUCH){
          const wasFlipped = card.classList.contains('is-flipped');
          // Un-flip all others first
          $$('[data-flip-card].is-flipped').forEach(c => c.classList.remove('is-flipped'));
          if (!wasFlipped) card.classList.add('is-flipped');
        }
      });
    });
  }

  // Render cocktails on HOME (a single row of 3 representative drinks — one per SKU)
  function renderHomeCocktails(){
    const grid = $('#cocktailsGrid');
    if (!grid || grid._rendered) return;
    grid._rendered = true;

    // Pick one cocktail per SKU for the home preview
    const picks = [
      COCKTAILS.find(c => c.sku === 'hepple-wild-juniper-gin'),
      COCKTAILS.find(c => c.sku === 'hepple-douglas-fir-vodka'),
      COCKTAILS.find(c => c.sku === 'hepple-moorland-vodka')
    ].filter(Boolean);

    grid.className = 'flip-row';
    grid.innerHTML = picks.map(cocktailCardHtml).join('');
    initFlipCards(grid);
  }

  // Render the full cocktails page — 3 groups, 3 cards each
  function renderCocktailsPage(){
    const root = $('#cocktailsPage');
    if (!root || root._rendered) return;
    root._rendered = true;

    const groups = PRODUCTS.map(p => ({
      sku: p.slug,
      name: p.name,
      tagline: p.tagline,
      color: `var(--${p.sku})`,
      cocktails: COCKTAILS.filter(c => c.sku === p.slug)
    }));

    root.innerHTML = `
      <div class="wrap">
        <div class="cocktails-home__head">
          <h2>LET'S MAKE<br>COCKTAILS</h2>
          <p class="cocktails-home__sub">DELICIOUS DRINKS START HERE</p>
          <p class="cocktails-home__lede" style="max-width:52ch; margin:0 auto; font-size:.9rem; line-height:1.8; letter-spacing:.06em; opacity:.7;">
            THREE SKUS, NINE WAYS TO ENJOY THEM. HOVER A CARD TO REVEAL THE RECIPE.
          </p>
        </div>

        ${groups.map(g => `
          <div class="cocktails-group">
            <div class="cocktails-group__head">
              <span class="cocktails-group__dot" style="background:${g.color};"></span>
              <h3>${g.name}</h3>
              <span class="cocktails-group__tagline">${g.tagline}</span>
            </div>
            <div class="flip-row">
              ${g.cocktails.map(cocktailCardHtml).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    initFlipCards(root);
  }

  // Render cocktails carousel below shop
  function renderShopCocktails(){
    const track = $('#shopCocktailsTrack');
    if (!track || track._rendered) return;
    track._rendered = true;

    track.innerHTML = COCKTAILS.map(c => `
      <div class="embla__slide">
        <div style="padding: 0 .25rem;">
          ${cocktailCardHtml(c)}
        </div>
      </div>
    `).join('');

    const embla = track.closest('[data-embla]');
    if (embla){ embla._emblaInit = false; initEmbla(embla); }
    initFlipCards(track);
  }

  // =============================================
  // TEAM SHOWCASE
  // =============================================
  function renderTeam(){
    const root = $('#teamShowcase');
    if (!root || root._rendered) return;
    root._rendered = true;

    // Split 6 members into 3 staggered columns (per user's component)
    const cols = [[], [], []];
    TEAM_MEMBERS.forEach((m, i) => cols[i % 3].push(m));

    const colsHtml = cols.map((col, colIdx) => `
      <div class="team__col ${colIdx === 1 ? 'team__col--2' : colIdx === 2 ? 'team__col--3' : ''}">
        ${col.map(m => `
          <div class="team-photo" data-team-id="${m.id}">
            <img src="${placeholderAvatar(parseInt(m.id))}" alt="${m.name}" />
          </div>
        `).join('')}
      </div>
    `).join('');

    const listHtml = TEAM_MEMBERS.map(m => `
      <div class="team-row" data-team-id="${m.id}">
        <div class="team-row__line">
          <span class="team-row__dash"></span>
          <span class="team-row__name">${m.name}</span>
        </div>
        <div class="team-row__role">${m.role}</div>
      </div>
    `).join('');

    root.innerHTML = `
      <div class="team__grid">${colsHtml}</div>
      <div class="team__list">${listHtml}</div>
    `;

    // Hover sync: photo <-> name row
    const photos = $$('.team-photo', root);
    const rows   = $$('.team-row', root);

    function activate(id){
      root.classList.toggle('has-active', !!id);
      photos.forEach(p => p.classList.toggle('is-active', p.dataset.teamId === id));
      rows.forEach(r => r.classList.toggle('is-active', r.dataset.teamId === id));
    }

    [...photos, ...rows].forEach(el => {
      el.addEventListener('mouseenter', () => activate(el.dataset.teamId));
      el.addEventListener('mouseleave', () => activate(null));
      el.addEventListener('focus',      () => activate(el.dataset.teamId));
      el.addEventListener('blur',       () => activate(null));
    });
  }

  // =============================================
  // BOOT
  // =============================================
  renderCart();
  requestAnimationFrame(tick);
  route();
  computeScrollProgress();
  initProcess();
  initCounters();
  initAllEmbla();
})();
