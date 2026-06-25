/* ==========================================================
   HEPPLE — app.js
   Per 18 April feedback: real product copy, 9 cocktails grouped by SKU,
   team showcase placeholder, flip cards with hover-stays-flipped
   ========================================================== */
(() => {
  'use strict';

  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  // ---------------------------------------------
  // ANALYTICS — thin, always-safe PostHog wrapper.
  // The PostHog snippet in <head> stubs every method even before
  // (or without) init, so these calls are no-ops when analytics is
  // disabled and never throw. See index.html → window.__HEPPLE_POSTHOG__.
  // ---------------------------------------------
  function capture(event, props){
    try { if (window.posthog && typeof posthog.capture === 'function') posthog.capture(event, props || {}); }
    catch (_) { /* analytics must never break the site */ }
  }
  function phDistinctId(){
    try { if (window.posthog && typeof posthog.get_distinct_id === 'function') return posthog.get_distinct_id(); }
    catch (_) {}
    return undefined;
  }

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
  // PRODUCT CATALOGUE
  // =============================================

  const PRODUCTS = [
    {
      slug:    'hepple-wild-juniper-gin',
      name:    'HEPPLE WILD JUNIPER GIN',
      nameTop: 'HEPPLE',
      nameRest:'WILD JUNIPER GIN',
      short:   'Wild Juniper Gin',
      tagline: 'BRIGHT. WILD. ELEGANT.',
      kicker:  'THE HEART OF HEPPLE',
      price:   39.95,
      meta:    { size: '70CL', abv: '45%', origin: 'NORTHUMBERLAND' },
      sku:     'juniper-pink',
      image:   'assets/products/hepple-gin.jpg',
      sceneImage: 'assets/products/gin-scene.jpg',
      body: [
        "The spirit that started it all.",
        "On the Hepple Estate, ancient juniper bushes grow wild across the Northumberland moorland, shaped by wind, weather and time. Each summer, we harvest the berries by hand while they are still bright green. At this stage, juniper is fresher, more vibrant and more alive, bringing citrus lift, natural zest and a remarkable brightness that ripe juniper berries alone cannot deliver.",
        "That bright flavour note is the starting point for Hepple Wild Juniper Gin, but it is only part of the story. To capture the fullest expression of juniper, we build flavour using all three of our extraction methods: traditional copper pot distillation for depth and structure, vacuum distillation for freshness and aromatic lift, and supercritical CO₂ extraction for the delicate oils and finer details that would otherwise be lost. Together, they create a more vivid, layered and complete picture of juniper than any one technique could achieve alone.",
        "Around the juniper sits a carefully selected group of botanicals, chosen to support and extend the character of juniper rather than compete with it. Douglas fir, lovage, blackcurrant leaf, angelica root and bog myrtle all play their part, bringing lift, freshness, depth and length to the final spirit.",
        "The result is a multi-dimensional, elegant gin with juniper at its heart. Bright and vivid in the glass, it retains its freshness, structure and unmistakable juniper character when mixed, making it exceptional in a Martini and perfect for classic gin cocktails."
      ],
      tasting: {
        nose:   'SPICY JUNIPER, FRESH GREEN APPLE, BRIGHT GRAPEFRUIT',
        palate: 'CLEAN, BRIGHT CITRUS, DEVELOPING INTO SOFT CANTALOUPE MELON AND LIFTED ZESTY JUNIPER',
        finish: 'LONG AND BALANCED, WITH SUBTLE NOTES OF CEDAR AND SANDALWOOD BENEATH A VIBRANT RICH JUNIPER POP'
      },
      howToEnjoy: {
        lead: "Our favourite way to experience the full spectrum of flavour is an icy cold Martini with a fresh lemon twist.",
        recipe: [
          "5 parts Hepple Wild Juniper Gin",
          "1 part dry vermouth",
          "Stir with cubed ice until cold as the Arctic, then strain into a chilled glass and finish with lemon zest."
        ]
      }
    },
    {
      slug:    'hepple-douglas-fir-vodka',
      name:    'HEPPLE DOUGLAS FIR VODKA',
      nameTop: 'HEPPLE',
      nameRest:'DOUGLAS FIR VODKA',
      short:   'Douglas Fir Vodka',
      tagline: 'VIBRANT. LIFTED. DISTINCTIVE.',
      kicker:  'DOUGLAS FIR, REIMAGINED',
      price:   39.95,
      meta:    { size: '70CL', abv: '41%', origin: 'NORTHUMBERLAND' },
      sku:     'doug-fir-green',
      image:   'assets/products/douglas-fir.jpg',
      sceneImage: 'assets/products/douglas-fir-scene.jpg',
      body: [
        "A vodka with a completely different point of view.",
        "Each spring, the Douglas fir trees on the Hepple Estate produce bright green tips packed with aroma and flavour. We harvest them at just the right moment, when the shoots are young, vivid and full of life, then use all three of our extraction methods to capture as much of their character as possible.",
        "Traditional copper pot distillation brings weight and structure. Vacuum distillation preserves the fir's brightest, most delicate aromatics. Supercritical CO₂ extraction draws out the deeper, more nuanced notes that would otherwise be left behind. Used together, the three methods allow us to build a fuller, more expressive picture of Douglas fir than any one technique could deliver on its own.",
        "The result is not a piney novelty vodka or a walk through a conifer forest, but a botanical vodka with remarkable complexity built from a single ingredient. Clean, bright and full of character, it carries notes of citrus, fresh fir and flashes of tropical fruit and ripe melon, and is delicious served ice cold from the freezer, over ice, or mixed into long drinks and cocktails."
      ],
      tasting: {
        nose:   'FRESH, DELICATE DOUGLAS FIR UNDERPINNED BY SOUR LEMON AND RICHER CITRUS OIL',
        palate: 'RIPE JUICY MELON, DEVELOPING INTO BRIGHT GRAPEFRUIT PEEL AND GENTLE TROPICAL NOTES',
        finish: 'DEEP, CLEAN AND LINGERING, WITH PINE, WHITE GRAPEFRUIT AND A SOFT, ROUNDED LENGTH'
      },
      howToEnjoy: {
        lead: "Our favourite way to enjoy Douglas Fir Vodka is long with tonic, plenty of ice and a slice of pink grapefruit.",
        recipe: [
          "50ml Hepple Douglas Fir Vodka",
          "Top with chilled tonic water",
          "Finish with pink grapefruit"
        ],
        alt: "Also works beautifully in a Paloma, Collins or other bright, citrus-led serves."
      }
    },
    {
      slug:    'hepple-moorland-vodka',
      name:    'HEPPLE MOORLAND VODKA',
      nameTop: 'HEPPLE',
      nameRest:'MOORLAND VODKA',
      short:   'Moorland Vodka',
      tagline: 'PURE. SMOOTH. BALANCED.',
      kicker:  'BUILT FOR GREAT DRINKS',
      price:   34.95,
      meta:    { size: '70CL', abv: '41%', origin: 'NORTHUMBERLAND' },
      sku:     'moorland-teal',
      image:   'assets/products/wheat-vodka.jpg',
      sceneImage: 'assets/products/wheat-vodka-scene.jpg',
      body: [
        "Moorland Vodka is made from 100% English wheat and Hepple spring water, drawn from the estate and filtered slowly through the Northumberland landscape before it reaches us. Like everything we make, it begins with ingredients chosen for the quality of flavour they can deliver, then refined with patience and care until every element feels in balance.",
        "The spring water is an important part of the character of the spirit. It brings a softness, clarity and a gentle mineral edge that gives Moorland Vodka more presence than a neutral vodka, while keeping the finish clean and composed.",
        "The result is a balanced vodka with subtle cereal notes, a smooth finish and a gentle mineral edge from the spring water. Great for mixing, delicious in an icy Martini, and excellent in a very cold vodka soda with a squeeze of lime."
      ],
      tasting: {
        nose:   'CLEAN AND ROUNDED, WITH SOFT CEREAL NOTES AND A GENTLE HINT OF SPICE',
        palate: 'FULL AND SMOOTH, WITH A CLEAN MINERAL EARTH MID-PALATE AND NOTES OF TOASTED CEREAL',
        finish: 'LONG AND COMPOSED, WITH SOFT CEREAL SWEETNESS AND A CLEAN, SLIGHTLY SALINE LINGERING LENGTH'
      },
      howToEnjoy: {
        lead: "Our favourite way to enjoy Moorland Vodka is in an icy cold Martini or a simple highball.",
        recipe: [
          "For a Martini, stir 5 parts Moorland Vodka with 1 part dry vermouth and strain into a chilled glass."
        ]
      }
    }
  ];

  // =============================================
  // ADDITIONAL / LIMITED EXPRESSIONS
  // Sold on a separate, clearly-marked line in the shop. NOT part of the
  // core range carousels (home / related / cocktails). Client PDF copy used
  // verbatim. Product photos to be dropped into /assets/products by Zach —
  // filenames named *-main.jpg below.
  // =============================================
  const EXTRA_PRODUCTS = [
    {
      slug:    'hepple-sloe-hawthorn',
      name:    'HEPPLE SLOE & HAWTHORN',
      nameTop: 'HEPPLE',
      nameRest:'SLOE & HAWTHORN',
      short:   'Sloe & Hawthorn',
      tagline: 'DARK. WILD. GENEROUS.',
      kicker:  'A DARKER SIDE OF HEPPLE',
      price:   32.50,
      meta:    { size: '50CL', abv: '29.9%', origin: 'NORTHUMBERLAND' },
      sku:     'sloe-hawthorn',
      image:   'assets/products/sloe-hawthorn-main.jpg',
      body: [
        "NOT EVERY FLAVOUR ON THE ESTATE IS BRIGHT AND GREEN. AS AUTUMN ARRIVES, THE LANDSCAPE SHIFTS TOWARDS DARKER NOTES OF FRUIT, SPICE AND HEDGEROW BERRIES. SLOE & HAWTHORN WAS CREATED TO CAPTURE THAT SIDE OF HEPPLE.",
        "RATHER THAN BEGINNING WITH FINISHED GIN, WE SELECT DISTILLATE FROM THE COPPER STILL, CHOSEN FOR ITS DEPTH, STRUCTURE AND ABILITY TO CARRY FRUIT. IT IS THEN RESTED ON CAREFULLY SELECTED SLOE AND HAWTHORN BERRIES FOR MORE THAN SIX MONTHS, ALLOWING FLAVOUR TO DEVELOP SLOWLY AND NATURALLY OVER TIME.",
        "THE FRESHNESS OF JUNIPER REMAINS AT ITS HEART, LAYERED WITH NOTES OF RIPE PLUM, DARK CHERRY, BITTER ALMOND AND GENTLE SPICE. RICH ENOUGH FOR WINTER EVENINGS, BRIGHT ENOUGH TO ENJOY THROUGHOUT THE YEAR.",
        "LIKE EVERYTHING WE MAKE AT HEPPLE, IT IS GUIDED BY FLAVOUR FIRST AND MADE IN PURSUIT OF DELICIOUSNESS."
      ],
      tasting: {
        nose:   'BITTER ALMOND, RIPE JUNIPER AND STONE FRUIT WITH THE FAINTEST HINT OF COCOA',
        palate: 'RICH PLUM AND CHERRY WITH LAYERS OF ALMOND AND WARMING SPICE',
        finish: 'LONG AND GENEROUS, WITH LINGERING NOTES OF JUNIPER, SOUR CHERRY AND DARK FRUIT'
      },
      howToEnjoy: {
        lead: "OUR FAVOURITE WAY TO ENJOY SLOE & HAWTHORN IS SIMPLY OVER ICE WITH A TWIST OF ORANGE.",
        recipe: [
          "50ML HEPPLE SLOE & HAWTHORN",
          "SERVE OVER PLENTY OF ICE",
          "FINISH WITH A STRIP OF ORANGE ZEST"
        ],
        alt: "ALSO WORKS BEAUTIFULLY WITH TONIC, SPARKLING WINE OR IN A WINTER NEGRONI."
      }
    },
    {
      slug:    'hepple-aquavit',
      name:    'HEPPLE AQUAVIT',
      nameTop: 'HEPPLE',
      nameRest:'AQUAVIT',
      short:   'Aquavit',
      tagline: 'SAVOURY. BRIGHT. DISTINCTIVE.',
      kicker:  'A SCANDINAVIAN CLASSIC, THE HEPPLE WAY',
      price:   39.95,
      meta:    { size: '70CL', abv: '40%', origin: 'NORTHUMBERLAND' },
      sku:     'aquavit',
      image:   'assets/products/aquavit-main.jpg',
      body: [
        "AQUAVIT BEGAN WITH A SUGGESTION FROM AWARD WINNING BARTENDER MONICA BERG, WHO BELIEVED HEPPLE'S APPROACH TO FLAVOUR COULD BRING SOMETHING NEW TO ONE OF SCANDINAVIA'S MOST DISTINCTIVE SPIRITS.",
        "WHAT FOLLOWED WAS A YEAR OF EXPERIMENTATION, COLLABORATION AND TASTING. THE PROJECT EVENTUALLY FOUND A HOME WITH SWEDISH CHEF AND RESTAURATEUR ALEX NIETOSVUORI, PROPRIETOR OF MICHELIN-STARRED HJEM IN NORTHUMBERLAND, WHOSE DEEP APPRECIATION FOR AQUAVIT HELPED SHAPE THE FINAL SPIRIT.",
        "AT ITS HEART ARE CARAWAY AND DILL SEED, THE DEFINING FLAVOURS OF TRADITIONAL AQUAVIT. AROUND THEM SITS A CAREFULLY SELECTED BLEND OF ANGELICA ROOT, CORIANDER, STAR ANISE AND BITTER ORANGE, BRINGING FRESHNESS, COMPLEXITY AND LENGTH.",
        "AS WITH ALL HEPPLE SPIRITS, DIFFERENT BOTANICALS ARE TREATED IN DIFFERENT WAYS. TRADITIONAL COPPER POT DISTILLATION PROVIDES DEPTH AND STRUCTURE, WHILE VACUUM DISTILLATION HELPS PRESERVE FRESHNESS AND AROMATIC DETAIL.",
        "THE RESULT IS AN AQUAVIT THAT FEELS BOTH ROOTED IN TRADITION AND UNMISTAKABLY HEPPLE. BRIGHT, SAVOURY AND WONDERFULLY VERSATILE, WHETHER SERVED FROM THE FREEZER, ALONGSIDE FOOD OR STIRRED INTO A COCKTAIL."
      ],
      tasting: {
        nose:   'FRESH DILL, WARM SPICE, BRIGHT CITRUS AND AROMATIC CARAWAY',
        palate: 'LAYERS OF CARAWAY, HERBACEOUS DILL AND DELICATE CITRUS, BALANCED BY GENTLE SPICE AND SAVOURY DEPTH',
        finish: 'CLEAN, LONG AND REFRESHING WITH LINGERING NOTES OF CARAWAY, ANGELICA AND EARTHY BOTANICALS'
      },
      howToEnjoy: {
        lead: "OUR FAVOURITE WAY TO ENJOY AQUAVIT IS ICE COLD FROM THE FREEZER, SERVED ALONGSIDE SMOKED FISH, CHEESES, CURED MEATS OR A GENEROUS TABLE OF GOOD FOOD WITH FRIENDS.",
        recipe: [
          "50ML HEPPLE AQUAVIT",
          "SERVE STRAIGHT FROM THE FREEZER IN A SMALL CHILLED GLASS"
        ],
        alt: "ALSO WORKS WELL ON ICE WITH TONIC WATER AND A SLICE OF LEMON, OR IN A VESPER."
      }
    },
    {
      slug:    'hepple-negroni',
      name:    'HEPPLE NEGRONI',
      nameTop: 'HEPPLE',
      nameRest:'NEGRONI',
      short:   'Hepple Negroni',
      tagline: 'BITTERSWEET. BRIGHT. ELEGANT.',
      kicker:  'READY TO POUR',
      price:   32.50,
      meta:    { size: '70CL', abv: '24%', origin: 'NORTHUMBERLAND' },
      sku:     'negroni',
      image:   'assets/products/negroni-main.jpg',
      body: [
        "THE NEGRONI IS ONE OF THE WORLD'S GREAT COCKTAILS. EQUAL PARTS GIN, BITTER APERITIF AND SWEET VERMOUTH, IT HAS BEEN ENJOYED FOR MORE THAN A CENTURY FOR ITS BALANCE OF BITTERNESS, SWEETNESS AND SPICE.",
        "OUR VERSION BEGINS WITH HEPPLE WILD JUNIPER GIN. NICK STRANGEWAY HAS REWORKED THE CLASSIC RECIPE TO PLACE GREATER EMPHASIS ON JUNIPER, CREATING A BRIGHTER, FRESHER EXPRESSION OF THE DRINK WHILE REMAINING TRUE TO THE ORIGINAL.",
        "TO ADD ANOTHER LAYER OF COMPLEXITY, THE FINISHED COCKTAIL IS RAPIDLY AGED ON JUNIPER WOOD USING ULTRASONIC INFUSION. THIS PROCESS DRAWS FLAVOUR FROM THE WOOD IN A MATTER OF DAYS RATHER THAN MONTHS, ADDING SUBTLE SPICE, WARMTH AND DEPTH WHILE AMPLIFYING THE CHARACTER OF THE GIN.",
        "THE RESULT IS A READY-TO-DRINK NEGRONI WITH REMARKABLE BALANCE. BRIGHT JUNIPER, BITTERSWEET CITRUS, GENTLE SPICE AND A LONG, ELEGANT FINISH."
      ],
      tasting: {
        nose:   'BRIGHT JUNIPER, ORANGE PEEL AND FRESH CITRUS LAYERED WITH GENTLE SPICE AND BITTERSWEET HERBS',
        palate: 'VIBRANT JUNIPER, BITTER ORANGE AND RICH VERMOUTH BALANCED BY WARMING SPICE AND SUBTLE NOTES OF WOOD',
        finish: 'LONG AND COMPLEX WITH LINGERING CITRUS, GENTLE BITTERNESS AND A DISTINCTIVE JUNIPER FRESHNESS'
      },
      howToEnjoy: {
        lead: "OUR FAVOURITE WAY TO ENJOY THE HEPPLE NEGRONI IS SIMPLY OVER PLENTY OF ICE WITH A TWIST OF ORANGE.",
        recipe: [
          "75ML HEPPLE NEGRONI",
          "POUR OVER ICE IN A ROCKS GLASS",
          "FINISH WITH A STRIP OF ORANGE ZEST"
        ],
        alt: "NO MIXING. NO MEASURING. JUST A PERFECTLY BALANCED NEGRONI, READY TO POUR."
      }
    }
  ];

  // =============================================
  // GIFT ADD-ON — handwritten card (£5)
  // An add-on only: it can never be the only thing in the cart (see the
  // gift-card rules in the CART section). Price is enforced server-side in
  // api/_catalogue.js; this client entry is only for display + totals.
  // =============================================
  const GIFT_SLUG = 'handwritten-card';
  const GIFT_CARD = {
    slug:    GIFT_SLUG,
    name:    'GIFT WRAP & HANDWRITTEN CARD',
    nameTop: 'MAKE IT',
    nameRest:'A GIFT',
    short:   'Gift Wrap & Card',
    tagline: 'HAND-WRAPPED WITH A PERSONAL NOTE',
    kicker:  'ADD A PERSONAL MESSAGE',
    price:   5.00,
    isAddon: true,
    image:   '' // no asset — rendered with an inline mark in the cart
  };

  // Core range (unchanged) drives the home/related/cocktails displays.
  // The combined lookup also resolves the extras + the gift card so the
  // cart, totals and product-detail pages work for everything.
  const productBySlug = Object.fromEntries(
    PRODUCTS.concat(EXTRA_PRODUCTS).concat([GIFT_CARD]).map(p => [p.slug, p])
  );

  // =============================================
  // COCKTAILS — 9 drinks grouped by SKU per feedback
  // Images pulled from hepplespirits.com CDN
  // =============================================

  const COCKTAILS = [
    // ── HEPPLE WILD JUNIPER GIN ──
    {
      id: 'classic-martini',
      name: 'HEPPLE CLASSIC MARTINI',
      sku: 'hepple-wild-juniper-gin',
      image: 'assets/cocktails/classic-martini.jpg',
      tagline: 'THE ULTIMATE CLASSIC, WITH ENDLESS VARIATIONS.',
      blurb: 'The classic gin martini: bright, cold, elegant and beautifully direct. Hepple Wild Juniper Gin brings vivid freshness, structure and a long, clean finish. Best served before dinner, after work, or whenever the moment calls for something properly cold and quietly magnificent.',
      ingredients: ['60ML HEPPLE WILD JUNIPER GIN', '10ML GOOD QUALITY DRY VERMOUTH'],
      garnish: 'LEMON ZEST OR GREEN OLIVE',
      glass: 'MARTINI GLASS OR COUPE',
      equipment: 'MIXING GLASS, BAR SPOON, STRAINER',
      steps: [
        'Chill your glass in the freezer, or fill it with ice while you make the drink.',
        'Measure the gin and vermouth into a mixing glass filled with plenty of good ice. Stir until very cold, around 30 to 45 seconds. The outside of your glass should be frosty.',
        'Empty your chilled glass, then strain the martini into it.',
        'Cut a neat strip of lemon zest, hold it shiny side down over the drink and twist to release the lemon oils, then drop it in.',
        'If you prefer olives, spray the lemon oils over the drink, discard the peel, then add one or two very green olives. We love Castelvetrano.'
      ],
      note: 'A martini is personal. Make it drier with less vermouth, wetter with a little more, but always serve it ice cold.'
    },
    {
      id: 'gin-basil-smash',
      name: 'GIN BASIL SMASH',
      sku: 'hepple-wild-juniper-gin',
      image: 'assets/cocktails/gin-basil-smash.jpg',
      tagline: 'GREEN, BRIGHT AND WONDERFULLY ALIVE.',
      blurb: 'A fresh, herbaceous drink that shows Hepple Wild Juniper Gin in a more relaxed mood. Basil brings perfume and vivid green freshness, lemon adds lift, and the gin gives the drink its structure and snap. Created by Joerg Meyer, founder of Le Lion Bar, Hamburg and a dear friend of Hepple.',
      ingredients: ['60ML HEPPLE WILD JUNIPER GIN', '25ML FRESHLY SQUEEZED LEMON JUICE', '15ML SUGAR SYRUP', 'LARGE HANDFUL OF FRESH BASIL LEAVES'],
      garnish: 'BASIL SPRIG OR LEAF & LEMON WHEEL',
      glass: 'ROCKS GLASS',
      equipment: 'COCKTAIL SHAKER, MUDDLER, STRAINER',
      steps: [
        'Add the basil leaves and lemon juice to a cocktail shaker and gently muddle to release the basil oils.',
        'Add the gin, sugar syrup and plenty of ice.',
        'Shake super hard until properly cold and bright green.',
        'Double strain through a tea strainer into a rocks glass filled with fresh ice.',
        'Garnish with a basil sprig or leaf and a lemon wheel.'
      ],
      note: 'Be gentle with the basil. You want fresh green perfume, not bruised bitterness. Also delicious with Thai basil.'
    },
    {
      id: 'cherry-negroni',
      name: 'CHERRY NEGRONI',
      sku: 'hepple-wild-juniper-gin',
      image: 'assets/cocktails/cherry-negroni.jpg',
      tagline: 'BITTERSWEET, POLISHED AND JUST A LITTLE DECADENT.',
      blurb: 'A darker, fruit-nuanced take on the classic Negroni. Hepple Wild Juniper Gin brings freshness and structure, while Campari, sweet vermouth and cherry bitters build depth, spice and a lovely bitter red glow. Perfect for aperitivo hour, late afternoon plotting, or the first drink of the evening.',
      ingredients: ['25ML HEPPLE WILD JUNIPER GIN', '25ML CAMPARI', '25ML SWEET VERMOUTH', '25ML CHERRY JUICE', 'DASH OF CHERRY BITTERS'],
      garnish: 'ORANGE ZEST AND A COCKTAIL CHERRY',
      glass: 'ROCKS GLASS',
      equipment: 'MIXING GLASS, BAR SPOON, STRAINER',
      steps: [
        'Add the gin, Campari, sweet vermouth and cherry bitters to a mixing glass filled with plenty of ice.',
        'Stir until very cold, smooth and properly diluted.',
        'Strain into a rocks glass over fresh ice.',
        'Cut a strip of orange zest, twist it shiny side down over the drink to release the oils, then drop it into the glass with a cocktail cherry.'
      ],
      note: 'Choose a good sweet vermouth and keep it in the fridge once opened. It makes all the difference.'
    },

    // ── HEPPLE DOUGLAS FIR VODKA ──
    {
      id: 'douglas-fir-sour',
      name: 'DOUGLAS FIR SOUR',
      sku: 'hepple-douglas-fir-vodka',
      image: 'assets/cocktails/douglas-fir-sour.jpg',
      tagline: 'BRIGHT, SHARP AND SILKY.',
      blurb: 'A clean, lifted sour that lets Douglas Fir Vodka show its subtle botanical character. Lemon brings the snap, sugar gives it softness, and the foam makes it feel properly elegant. A lovely one for aperitif hour, after dinner, or whenever you want something crisp, cold and beautifully balanced.',
      ingredients: ['60ML HEPPLE DOUGLAS FIR VODKA', '25ML FRESHLY SQUEEZED LEMON JUICE', '15ML SUGAR SYRUP', '15ML EGG WHITE OR AQUAFABA', 'OPTIONAL: DASH OF ORANGE BITTERS'],
      garnish: 'LEMON ZEST',
      glass: 'COUPE',
      equipment: 'COCKTAIL SHAKER, STRAINER',
      steps: [
        'Add all ingredients to a shaker without ice and shake hard to build the foam.',
        'Add plenty of ice and shake again until very cold.',
        'Strain into a chilled coupe.',
        'Cut a neat strip of lemon zest, hold it shiny side down over the drink and twist to release the oils.'
      ],
      note: 'A good sour is all about balance. If you like it sharper, add a touch more lemon. If you prefer it softer, add a little more syrup.'
    },
    {
      id: 'forest-collins',
      name: 'FOREST COLLINS',
      sku: 'hepple-douglas-fir-vodka',
      image: 'assets/cocktails/forest-collins.jpg',
      tagline: 'TALL, BRIGHT AND PROPERLY REFRESHING.',
      blurb: 'A crisp Collins with a Hepple twist. Douglas Fir Vodka brings clean structure and subtle botanical lift, while lemon, sugar and soda keep it sharp, sparkling and wonderfully easy to drink. Perfect for long lunches, garden drinks and any moment that calls for something tall, cold and generous.',
      ingredients: ['50ML HEPPLE DOUGLAS FIR VODKA', '25ML FRESHLY SQUEEZED LEMON JUICE', '10ML SUGAR SYRUP', 'SODA WATER, TO TOP'],
      garnish: 'LEMON WHEEL OR CHERRY',
      glass: 'COLLINS GLASS OR HIGHBALL',
      equipment: 'COCKTAIL SHAKER, STRAINER',
      steps: [
        'Fill a Collins glass or highball with ice.',
        'Add the vodka, lemon juice and sugar syrup to a shaker with plenty of ice.',
        'Shake until very cold, then strain into the glass.',
        'Top with soda water and stir gently to combine.',
        'Garnish with a lemon wheel or fresh cherry.'
      ],
      note: 'For a softer serve, add a little more sugar syrup. For something sharper and brighter, keep the lemon high and the soda cold.'
    },
    {
      id: 'douglas-fir-paloma',
      name: 'DOUGLAS FIR PALOMA',
      sku: 'hepple-douglas-fir-vodka',
      image: 'assets/cocktails/douglas-fir-paloma.jpg',
      tagline: 'TALL, SHARP AND BEAUTIFULLY PINK.',
      blurb: 'A lighter take on the classic Paloma. Traditionally made with tequila, this version uses Douglas Fir Vodka for a cleaner, more delicate serve. The vodka subtle botanical notes work beautifully with pink grapefruit and lime, making the drink bright, crisp and refreshing without the weight of the original. Perfect for sunny afternoons, early evening drinks and long, lazy lunches.',
      ingredients: ['50ML HEPPLE DOUGLAS FIR VODKA', '50ML FRESHLY SQUEEZED PINK GRAPEFRUIT JUICE', '15ML FRESHLY SQUEEZED LIME JUICE', '10ML AGAVE SYRUP', 'SODA WATER, TO TOP'],
      garnish: 'PINK GRAPEFRUIT WEDGE OR BLOOD ORANGE WHEEL',
      glass: 'ROCKS GLASS',
      equipment: 'COCKTAIL SHAKER, STRAINER',
      steps: [
        'Fill a rocks glass with ice.',
        'Add the vodka, pink grapefruit juice, lime juice and agave syrup to a shaker with plenty of ice.',
        'Shake until very cold, then strain into the glass.',
        'Top with soda water and stir gently to combine.',
        'Garnish with pink grapefruit.'
      ],
      note: 'If you want an even simpler version, swap the fresh pink grapefruit juice and soda for a good pink grapefruit soda. Keep the lime for brightness.'
    },

    // ── HEPPLE MOORLAND VODKA ──
    {
      id: 'honey-trap',
      name: 'HONEY TRAP',
      sku: 'hepple-moorland-vodka',
      image: 'assets/cocktails/honey-trap.jpg',
      tagline: 'SUNNY, ELEGANT AND SLIGHTLY UNEXPECTED.',
      blurb: 'A silky vodka cocktail with honeyed softness, fresh lemon and a little apricot glow. Easy to make, lovely in a coupe, and perfect when you want something sunny, elegant and slightly unexpected.',
      ingredients: ['50ML HEPPLE MOORLAND VODKA', '25ML FRESHLY SQUEEZED LEMON JUICE', '15ML HONEY SYRUP', '15ML APRICOT JAM OR APRICOT CONSERVE', 'OPTIONAL: DASH OF ORANGE BITTERS'],
      garnish: 'LEMON ZEST',
      glass: 'COUPE',
      equipment: 'COCKTAIL SHAKER, FINE STRAINER',
      steps: [
        'Add the vodka, lemon juice, honey syrup and apricot jam to a shaker.',
        'Stir briefly to loosen the jam, then add plenty of ice.',
        'Shake hard until very cold.',
        'Fine strain into a chilled coupe.',
        'Cut a strip of lemon zest, twist it shiny side down over the drink to release the oils.'
      ],
      note: 'To make honey syrup, stir equal parts honey and hot water until smooth, then chill before using. Use a good apricot conserve if you can. It gives the drink more depth and a better golden colour.'
    },
    {
      id: 'coming-up-roses',
      name: 'COMING UP ROSES',
      sku: 'hepple-moorland-vodka',
      image: 'assets/cocktails/coming-up-roses.jpg',
      tagline: 'BRIGHT, TART AND LIGHTLY FLORAL.',
      blurb: 'A fresh raspberry vodka martini with a delicate rose lift. Hepple Moorland Vodka keeps the drink clean and beautifully cold, while muddled raspberries bring colour, sharpness and a little summer drama. Perfect for aperitif hour, garden drinks or when the evening needs something with a bit of charm.',
      ingredients: ['50ML HEPPLE MOORLAND VODKA', '6 TO 8 FRESH RASPBERRIES', '20ML FRESHLY SQUEEZED LEMON JUICE', '15ML SUGAR SYRUP', '2 DROPS ROSEWATER'],
      garnish: 'FRESH RASPBERRY OR LEMON TWIST',
      glass: 'COUPE',
      equipment: 'COCKTAIL SHAKER, MUDDLER, FINE STRAINER',
      steps: [
        'Chill your coupe in the freezer, or fill it with ice while you make the drink.',
        'Add the raspberries, lemon juice and sugar syrup to a shaker and muddle gently.',
        'Add the vodka, rosewater and plenty of ice.',
        'Shake hard until very cold.',
        'Fine strain into the chilled coupe.',
        'Garnish with a fresh raspberry or lemon twist.'
      ],
      note: 'Rosewater is powerful, so go lightly. You want a delicate floral lift, not a bubble bath.'
    },
    {
      id: 'extra-dirty',
      name: 'EXTRA DIRTY',
      sku: 'hepple-moorland-vodka',
      image: 'assets/cocktails/extra-dirty.jpg',
      tagline: 'COLD, BRINY AND ABSOLUTELY NO NONSENSE.',
      blurb: 'A vodka martini for olive lovers. Hepple Moorland Vodka keeps the drink clean, crisp and beautifully cold, while a generous splash of olive brine gives it savoury depth and proper bite. Best served icy, direct and with more olives than is strictly necessary.',
      ingredients: ['60ML HEPPLE MOORLAND VODKA', '10ML GOOD QUALITY DRY VERMOUTH', '15ML OLIVE BRINE'],
      garnish: 'GREEN OLIVES',
      glass: 'MARTINI GLASS',
      equipment: 'MIXING GLASS, BAR SPOON, STRAINER',
      steps: [
        'Chill your martini glass in the freezer, or fill it with ice while you make the drink.',
        'Add the vodka, vermouth and olive brine to a mixing glass filled with plenty of good ice.',
        'Stir until very cold, smooth and properly diluted.',
        'Empty your chilled glass, then strain the martini into it.',
        'Garnish generously with green olives.'
      ],
      note: 'Use the best olives you can find. Castelvetrano are excellent if you like something bright, green and buttery.'
    }
  ];

  // =============================================
  // TEAM — real board bios from HEPPLE_BOARD_BIOS PDF.
  // Photos to be added later — placeholder SVG avatars in the meantime.
  // =============================================
  const TEAM_MEMBERS = [
    {
      id: 'walter',
      name: 'Walter Riddell',
      role: 'FOUNDER, HEPPLE ESTATE',
      photo: 'assets/team/walter.jpg',
      bio: "Walter grew up at Hepple and is the custodian of the estate, a wild, beautiful corner of Northumberland that has shaped both his life and the spirits made there. After leaving a career in investment, he returned to Hepple with a desire to build something rooted in the land, not imposed upon it. As co-founder of the Hepple Spirits Company, Walter brings together estate stewardship, hospitality and a deep love of martinis, helping turn the remarkable wildness of Hepple into spirits with genuine character, place and purpose."
    },
    {
      id: 'valentine',
      name: 'Valentine Warner',
      role: 'FOUNDER, CHEF',
      photo: 'assets/team/valentine.jpg',
      bio: "Valentine is a chef, food writer, broadcaster and lifelong lover of the wild larder. As co-founder of the Hepple Spirits Company, he brings a cook's instinct to the distillery, reading the landscape through flavour, seasonality and ingredients. His deep knowledge of foraging, cooking and the natural world helped shape Hepple's distinctive botanical character, from wild juniper and Douglas fir to the herbs and plants that grow across the estate. Generous, curious and wonderfully instinctive, Valentine helps translate the raw beauty of Hepple into spirits that feel alive, expressive and rooted in place."
    },
    {
      id: 'nick',
      name: 'Nick Strangeway',
      role: 'FOUNDER, COCKTAILS',
      photo: 'assets/team/nick.jpg',
      bio: "Nick is one of the world's most respected bartenders and drinks thinkers, with a career spanning some of the most influential bars, hotels and restaurants in London and beyond. As co-founder of the Hepple Spirits Company, he brings a bartender's precision to the heart of the distillery, shaping spirits not just for how they taste neat, but for how beautifully they perform in a glass. His deep understanding of classic cocktails, flavour balance and serve ritual has helped make Hepple a spirit house built for exceptional drinks, from perfectly judged Martinis to drinks with real character, clarity and sense of occasion."
    },
    {
      id: 'chris',
      name: 'Chris Garden',
      role: 'FOUNDER & MASTER DISTILLER',
      photo: 'assets/team/chris.jpg',
      // Self-hosted MP4 — same approach as the estate hero, but this one is a
      // proper player (visible controls + sound). Drop the file in here later.
      video: 'assets/team/chris_video.mp4',
      bio: "Chris is Hepple's master distiller and the technical mind behind the liquid. With over 20 years distilling experience, including time at Sipsmith, he brings deep knowledge of flavour extraction, botanical precision and spirit production. Working closely with the founders, Chris helped develop Hepple's distinctive three-part approach to flavour, combining traditional copper pot distillation with modern techniques to capture brightness, texture and aromatic detail. His craft sits at the heart of every bottle, bringing discipline, balance and quiet brilliance to Hepple's wildness."
    },
    {
      id: 'hani',
      name: 'Hani Farsi',
      role: 'CHAIRMAN',
      photo: 'assets/team/hani.jpg',
      bio: "Hani brings entrepreneurial energy, commercial instinct and a global perspective to Hepple. As a board member, he helps shape the bigger opportunity for the brand, bringing experience across investment, culture, hospitality and creative ventures. His role is to challenge, support and help open doors, ensuring Hepple grows with ambition while staying true to the character of the estate. With a sharp eye for what makes brands distinctive and desirable, Hani brings valuable perspective to Hepple's next chapter, helping turn a remarkable Northumberland spirit house into a business with wider cultural reach."
    },
    {
      id: 'jennie',
      name: 'Jennie Baernreuther',
      role: 'BOARD',
      photo: 'assets/team/jennie.jpg',
      bio: "Jennie brings a strong commercial background to Hepple, with experience supporting premium drinks and hospitality businesses as they grow. Her role is focused on commercial planning, sales support and helping the team turn strategy into clear, practical action. Organised, thoughtful and commercially sharp, Jennie helps bring structure and momentum to the business, supporting the wider team as Hepple builds visibility, strengthens trade presence and prepares for its next stage of growth."
    },
    {
      id: 'miranda',
      name: 'Miranda Dickson',
      role: 'BOARD',
      photo: 'assets/team/miranda.jpg',
      bio: "Miranda brings global brand-building, creative strategy and a little bit of magic to Hepple. With deep experience across premium spirits, hospitality and culture, she helps shape the way the brand looks, sounds and shows up in the world. Her work spans brand strategy, storytelling, packaging, trade activation, visitor experience and the little details that make a brand feel distinctive, desirable and alive. With a sharp eye for what makes people care, Miranda helps translate the wildness of Hepple into a brand with more confidence, clarity and charm."
    }
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

  // ---- Gift card (handwritten note) ----------------------------------------
  // Rules enforced here AND server-side (api/checkout.js):
  //   • the card is an add-on; the cart can never contain ONLY the card
  //   • removing the last real product also removes the card
  //   • the message is capped at 250 characters
  const GIFT_MSG_KEY = 'hepple:giftMessage';
  const GIFT_MSG_MAX = 250;
  const getGiftMessage = () => { try { return localStorage.getItem(GIFT_MSG_KEY) || ''; } catch(_){ return ''; } };
  const setGiftMessage = (v) => { try { localStorage.setItem(GIFT_MSG_KEY, (v || '').slice(0, GIFT_MSG_MAX)); } catch(_){} };
  const hasRealItems = () => cart.some(i => i.slug !== GIFT_SLUG);
  const hasGiftCard  = () => cart.some(i => i.slug === GIFT_SLUG);

  // ---- Promo code -----------------------------------------------------------
  // The code STRING is not secret (it's on marketing material), so the browser
  // is allowed to know which codes exist for instant feedback. The actual money
  // (the % + free shipping) is applied authoritatively by api/checkout.js — the
  // client only forwards the code. Keep this list in step with PROMOS in
  // api/_catalogue.js.
  const PROMO_KEY = 'hepple:promo';
  const PROMO_CODES = {
    MYSCHOOL10: { label: '10% OFF + FREE UK DELIVERY', percentOff: 10, freeShipping: true },
  };
  const validPromo = (code) => PROMO_CODES[(code || '').trim().toUpperCase()] || null;
  const getPromo = () => { try { return (localStorage.getItem(PROMO_KEY) || '').toUpperCase(); } catch(_){ return ''; } };
  const setPromo = (v) => { try { localStorage.setItem(PROMO_KEY, (v || '').toUpperCase()); } catch(_){} };
  const clearPromo = () => { try { localStorage.removeItem(PROMO_KEY); } catch(_){} };

  function addGiftCard(){
    if (!hasRealItems()){ showToast('ADD A PRODUCT FIRST'); return false; }
    if (!hasGiftCard()){ cart.push({ key: GIFT_SLUG, slug: GIFT_SLUG, qty: 1 }); saveCart(); }
    return true;
  }
  function removeGiftCard(){
    cart = cart.filter(i => i.slug !== GIFT_SLUG);
    saveCart();
  }
  // Belt-and-braces: a card can never survive on its own.
  function enforceGiftCardRule(){
    if (hasGiftCard() && !hasRealItems()){ removeGiftCard(); }
  }

  // Escape user-supplied text before it ever touches innerHTML.
  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, c => (
      { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]
    ));
  }

  function addToCart(slug, qty=1){
    const key = slug;
    const existing = cart.find(i => i.key === key);
    if (existing) existing.qty += qty;
    else cart.push({ key, slug, qty });
    saveCart();
    renderCart();
    showToast('ADDED TO CART');
    bumpCart();
    const p = productBySlug[slug];
    capture('product_added_to_cart', {
      slug, qty,
      name: p ? p.name : slug,
      price: p ? p.price : null,
      cart_count: cartCount(),
      cart_value: cartTotal(),
    });
  }
  function removeFromCart(key){
    const removed = cart.find(i => i.key === key);
    cart = cart.filter(i => i.key !== key);
    saveCart();
    renderCart();
    capture('product_removed_from_cart', {
      slug: removed ? removed.slug : key,
      cart_count: cartCount(),
      cart_value: cartTotal(),
    });
  }

  // ---- Stripe checkout: hand the cart to /api/checkout and redirect ----
  let _checkoutInFlight = false;
  async function startCheckout(btn){
    if (_checkoutInFlight) return;
    if (!cart.length){ showToast('YOUR CART IS EMPTY'); return; }
    // Client-side guard (the server enforces this too): a handwritten card can
    // never be checked out on its own — there must be at least one product.
    enforceGiftCardRule();
    if (hasGiftCard() && !hasRealItems()){
      showToast('ADD A PRODUCT TO SEND A CARD');
      renderCart();
      return;
    }

    const items = cart.map(i => ({ slug: i.slug, qty: i.qty }));
    const giftMessage = hasGiftCard() ? getGiftMessage().slice(0, GIFT_MSG_MAX) : '';
    const promoCode = validPromo(getPromo()) ? getPromo() : '';
    capture('checkout_started', {
      item_count: cartCount(),
      cart_value: cartTotal(),
      has_gift_card: hasGiftCard(),
      promo_code: promoCode,
      items,
    });

    _checkoutInFlight = true;
    const original = btn ? btn.textContent : '';
    if (btn){ btn.disabled = true; btn.textContent = 'STARTING…'; }

    try {
      const resp = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, ph_id: phDistinctId(), gift_message: giftMessage, promo_code: promoCode }),
      });
      const data = await resp.json().catch(() => ({}));
      // Server backstop: the code was already redeemed by this visitor.
      if (resp.status === 409 && data.code === 'PROMO_USED'){
        clearPromo();
        renderCart();
        showToast('CODE ALREADY USED — REMOVED');
        if (btn){ btn.disabled = false; btn.textContent = original || 'CHECKOUT'; }
        _checkoutInFlight = false;
        return;
      }
      if (!resp.ok || !data.url) throw new Error(data.error || 'Checkout is unavailable right now.');
      // Off to Stripe's hosted checkout.
      window.location.href = data.url;
    } catch (err){
      showToast(((err && err.message) || 'CHECKOUT UNAVAILABLE').toUpperCase());
      if (btn){ btn.disabled = false; btn.textContent = original || 'CHECKOUT'; }
      _checkoutInFlight = false;
    }
  }
  function cartCount(){ return cart.reduce((s, i) => s + i.qty, 0); }
  function cartTotal(){
    return cart.reduce((s, i) => {
      const p = productBySlug[i.slug];
      if (!p) return s;
      const unit = p.price;
      return s + unit * i.qty;
    }, 0);
  }

  function renderCart(){
    enforceGiftCardRule();
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
      renderGift();
      return;
    }
    body.innerHTML = cart.map(i => {
      const p = productBySlug[i.slug];
      if (!p) return '';
      // Handwritten card renders as a special add-on line (no thumbnail).
      if (i.slug === GIFT_SLUG){
        const msg = getGiftMessage();
        return `
          <div class="cart-item cart-item--gift">
            <div class="cart-item__img cart-item__img--gift" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 7h16v12H4z"/><path d="M4 7l8 6 8-6"/></svg>
            </div>
            <div class="cart-item__info">
              <h4>MAKE IT A GIFT</h4>
              ${msg
                ? `<div class="cart-item__msg">&ldquo;${escapeHtml(msg)}&rdquo;</div>`
                : `<div class="qty">Gift-wrapped + handwritten card</div>`}
              <button class="cart-item__remove" data-remove-gift>REMOVE</button>
            </div>
            <div class="cart-item__price">£${p.price.toFixed(2)}</div>
          </div>
        `;
      }
      const unit = p.price;
      const thumb = p.image;
      return `
        <div class="cart-item">
          <div class="cart-item__img"><img src="${thumb}" alt="${p.name}" /></div>
          <div class="cart-item__info">
            <h4>${p.name}</h4>
            <div class="qty">QTY ${i.qty} · £${unit.toFixed(2)} EA</div>
            <button class="cart-item__remove" data-remove="${i.key}">REMOVE</button>
          </div>
          <div class="cart-item__price">£${(unit * i.qty).toFixed(2)}</div>
        </div>
      `;
    }).join('');
    if (foot) foot.hidden = false;
    renderGift();
    renderPromo();
    renderSummary();
    const noteEl = $('#cartNote');
    if (noteEl){
      const info = validPromo(getPromo());
      noteEl.textContent = info
        ? 'FINAL TOTAL CONFIRMED SECURELY AT CHECKOUT'
        : 'SHIPPING CALCULATED AT CHECKOUT';
    }
  }

  // ---- Cart money breakdown ----
  const money = (n) => `£${n.toFixed(2)}`;

  // Mirrors the server's per-line discount rounding (api/checkout.js) so the
  // figures shown here match what Stripe charges, to the penny.
  function promoTotals(){
    const info = validPromo(getPromo());
    const pct = info ? (info.percentOff || 0) : 0;
    let subtotal = 0, discounted = 0;
    cart.forEach(i => {
      const p = productBySlug[i.slug];
      if (!p) return;
      subtotal += p.price * i.qty;
      const unit = pct ? Math.round(p.price * 100 * (1 - pct / 100)) / 100 : p.price;
      discounted += unit * i.qty;
    });
    return { info, pct, subtotal, discounted, discount: subtotal - discounted };
  }

  function renderSummary(){
    const el = $('#cartSummary');
    if (!el) return;
    const { info, pct, subtotal, discounted, discount } = promoTotals();
    if (info && pct){
      el.innerHTML = `
        <div class="cart-sum__row"><span>SUBTOTAL</span><span>${money(subtotal)}</span></div>
        <div class="cart-sum__row cart-sum__row--promo">
          <span>${escapeHtml(getPromo())} (−${pct}%)</span><span>−${money(discount)}</span>
        </div>
        <div class="cart-sum__row"><span>SHIPPING</span><span>FREE</span></div>
        <div class="cart-sum__row cart-sum__row--total"><span>TOTAL</span><strong>${money(discounted)}</strong></div>`;
    } else {
      el.innerHTML = `
        <div class="cart-sum__row cart-sum__row--total"><span>SUBTOTAL</span><strong>${money(subtotal)}</strong></div>`;
    }
  }

  // ---- Handwritten-card add-on UI (lives between cart body and footer) ----
  function renderGift(){
    const wrap = $('#cartGift');
    if (!wrap) return;
    // Only offer the card when there's a real product to attach it to.
    if (!hasRealItems()){ wrap.hidden = true; wrap.innerHTML = ''; return; }
    wrap.hidden = false;
    const on  = hasGiftCard();
    const msg = getGiftMessage();
    wrap.innerHTML = `
      <div class="cart-gift__head">
        <div class="cart-gift__label">
          <span class="cart-gift__title">MAKE IT A GIFT</span>
          <span class="cart-gift__price">£5.00</span>
        </div>
        <button type="button" class="cart-gift__toggle ${on ? 'is-on' : ''}" data-gift-toggle aria-pressed="${on}">
          ${on ? 'ADDED ✓' : 'ADD'}
        </button>
      </div>
      <p class="cart-gift__note">Beautifully hand-wrapped and finished with a handwritten card carrying your message.</p>
      ${on ? `
        <div class="cart-gift__field">
          <textarea id="giftMsgInput" maxlength="${GIFT_MSG_MAX}" rows="3"
            placeholder="Write your gift message…">${escapeHtml(msg)}</textarea>
          <div class="cart-gift__count"><span id="giftMsgCount">${msg.length}</span>/${GIFT_MSG_MAX}</div>
        </div>` : ''}
    `;
  }

  // ---- Promo code input + applied state (lives above the cart total) ----
  function renderPromo(){
    const wrap = $('#cartPromo');
    if (!wrap) return;
    const code = getPromo();
    const info = validPromo(code);
    if (info){
      wrap.innerHTML = `
        <div class="cart-promo__applied">
          <div class="cart-promo__applied-info">
            <span class="cart-promo__code">${escapeHtml(code)}</span>
            <span class="cart-promo__label">${escapeHtml(info.label)}</span>
          </div>
          <button type="button" class="cart-promo__remove" data-promo-remove aria-label="Remove promo code">✕</button>
        </div>`;
    } else {
      wrap.innerHTML = `
        <div class="cart-promo__row">
          <input id="promoInput" class="cart-promo__input" type="text"
                 placeholder="PROMO CODE" autocomplete="off" spellcheck="false" maxlength="40" />
          <button type="button" class="cart-promo__apply" data-promo-apply>APPLY</button>
        </div>
        <div class="cart-promo__msg" id="promoMsg" hidden></div>`;
    }
  }

  function showPromoMsg(text){
    const msg = $('#promoMsg');
    if (msg){ msg.hidden = false; msg.textContent = text; }
  }

  async function applyPromoFromInput(){
    const input = $('#promoInput');
    const val = (input ? input.value : '').trim().toUpperCase();
    if (!val) return;
    if (!validPromo(val)){
      showPromoMsg('CODE NOT RECOGNISED');
      capture('promo_rejected', { code: val, reason: 'unknown' });
      return;
    }

    // Ask the server whether this visitor (PostHog id) has already used it.
    const btn = $('[data-promo-apply]');
    if (btn){ btn.disabled = true; btn.textContent = 'CHECKING…'; }
    let used = false;
    try {
      const resp = await fetch('/api/promo-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: val, ph_id: phDistinctId() }),
      });
      const data = await resp.json().catch(() => ({}));
      used = !!data.used;
    } catch (_) { used = false; } // fail open — never block on a network blip

    if (used){
      showPromoMsg("YOU'VE ALREADY USED THIS CODE");
      capture('promo_rejected', { code: val, reason: 'already_used' });
      if (btn){ btn.disabled = false; btn.textContent = 'APPLY'; }
      return;
    }

    setPromo(val);
    renderCart();
    showToast('PROMO APPLIED');
    capture('promo_applied', { code: val });
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
  const canvas  = $('#heroCanvas');

  // ---- Estate hero: self-hosted MP4 (native <video>) ----
  function initEstateHeroVideo(){
    const video = document.getElementById('estateHeroVideo');
    if (!video) return;
    // The autoplay attribute handles initial start; this just ensures playback
    // resumes if user returned to /estate after navigating away (we pause on leave).
    video.play().catch(()=>{});
  }
  function pauseEstateHeroVideo(){
    const video = document.getElementById('estateHeroVideo');
    if (!video) return;
    try { video.pause(); } catch(_){}
  }


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

    if (route === '/shop'){ renderShopGrid(); renderShopExtras(); renderShopCocktails(); }
    if (route === '/estate'){ initEstateHeroVideo(); }
    else { pauseEstateHeroVideo(); }
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
        // Skip intro — but make sure the page below is clean and visible
        if (intro){
          intro.style.display = 'none';
          intro.classList.remove('is-complete');
        }
        if (canvas) canvas.style.display = 'none';
        document.body.classList.add('intro-off');
        document.body.classList.remove('is-loading');
        nav.classList.add('is-visible');
        window.scrollTo(0, 0);
      } else {
        // Show intro fresh — fully reset state in case we're returning after completion
        if (intro){
          intro.style.display = '';
          intro.classList.remove('is-complete');
          intro.classList.remove('is-text-revealed');
        }
        if (canvas) canvas.style.display = '';
        document.body.classList.remove('intro-off');
        // Reset frame-scrub state
        introComplete = false;
        textRevealed = false;
        currentFrame = 0;
        targetFrame = 0;
        // Restart rAF loop if it was cancelled
        if (!rafId) tick();
        nav.classList.remove('is-visible');
        window.scrollTo(0, 0);
      }
    } else {
      if (intro) intro.style.display = 'none';
      if (canvas) canvas.style.display = 'none';
      document.body.classList.add('intro-off');
      nav.classList.add('is-visible');
      window.scrollTo(0, 0);
    }
  }
  function route(forceIntro = false){
    const r = getRoute();
    setActivePage(r);
    showIntroOrNot(r, forceIntro);
    // Virtual pageview for the hash router so PostHog's Pages report works.
    capture('$pageview', { $current_url: location.href, route: r });
  }

  document.addEventListener('click', (e) => {
    const checkoutBtn = e.target.closest('.cart-panel__checkout');
    if (checkoutBtn){
      e.preventDefault();
      startCheckout(checkoutBtn);
      return;
    }
    const removeBtn = e.target.closest('[data-remove]');
    if (removeBtn){
      e.preventDefault();
      removeFromCart(removeBtn.dataset.remove);
      return;
    }
    const giftToggle = e.target.closest('[data-gift-toggle]');
    if (giftToggle){
      e.preventDefault();
      if (hasGiftCard()) removeGiftCard();
      else addGiftCard();
      renderCart();
      // Keep the cart drawer open and focus the message field if just added.
      if (hasGiftCard()){ const t = $('#giftMsgInput'); if (t) t.focus(); }
      return;
    }
    const removeGiftBtn = e.target.closest('[data-remove-gift]');
    if (removeGiftBtn){
      e.preventDefault();
      removeGiftCard();
      renderCart();
      return;
    }
    const promoApply = e.target.closest('[data-promo-apply]');
    if (promoApply){
      e.preventDefault();
      applyPromoFromInput();
      return;
    }
    const promoRemove = e.target.closest('[data-promo-remove]');
    if (promoRemove){
      e.preventDefault();
      clearPromo();
      renderCart();
      return;
    }
    const addBtn = e.target.closest('[data-add-to-cart]');
    if (addBtn){
      e.preventDefault();
      const slug = addBtn.dataset.addToCart;
      // Product-detail button reads the qty stepper; shop-card quick-add is
      // always 1 (and must NOT read a stale #pdQty from a hidden detail page).
      const qty = addBtn.classList.contains('product-detail__add')
        ? Math.max(1, parseInt(($('#pdQty') || {}).value || '1', 10))
        : 1;
      addToCart(slug, qty);
      if (!addBtn.dataset.label) addBtn.dataset.label = addBtn.textContent.trim();
      addBtn.classList.add('is-added');
      addBtn.textContent = 'ADDED ✓';
      setTimeout(() => {
        addBtn.classList.remove('is-added');
        addBtn.textContent = addBtn.dataset.label || 'ADD TO CART';
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

    const a = e.target.closest('[data-route]');
    if (!a) return;
    const target = a.getAttribute('data-route');
    if (!target) return;
    e.preventDefault();
    closeDrawers();

    const isBrand = a.hasAttribute('data-brand');
    if (isBrand) sessionStorage.removeItem('hepple:seenIntro');

    if (location.hash === '#' + target){
      transitionThen(() => route(isBrand));
    } else {
      if (isBrand) window._hepple_forceIntro = true;
      location.hash = '#' + target;
    }
  });

  // Keyboard support for the span-based shop-card ADD control (Enter / Space).
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
    const addEl = e.target.closest && e.target.closest('[data-add-to-cart][role="button"]');
    if (!addEl) return;
    e.preventDefault();
    addEl.click();
  });
  // the counter, without re-rendering the cart (keeps the textarea focused).
  document.addEventListener('input', (e) => {
    const t = e.target.closest('#giftMsgInput');
    if (!t) return;
    if (t.value.length > GIFT_MSG_MAX) t.value = t.value.slice(0, GIFT_MSG_MAX);
    setGiftMessage(t.value);
    const counter = $('#giftMsgCount');
    if (counter) counter.textContent = String(t.value.length);
  });

  // Enter inside the promo field applies the code (mirrors the APPLY button).
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    if (!e.target.closest || !e.target.closest('#promoInput')) return;
    e.preventDefault();
    applyPromoFromInput();
  });

  // Page transition: show loader → wait for cover → swap page → wait → fade out
  // This guarantees the user never sees the old/new pages flash through;
  // the swap happens entirely BEHIND the loader.
  let _transitionInFlight = false;
  function transitionThen(work){
    const t = document.getElementById('pageTransition');
    if (!t || _transitionInFlight){
      // Already mid-transition — just do the work
      work && work();
      return;
    }
    _transitionInFlight = true;
    t.classList.add('is-active');
    // Wait for loader to fully cover (matches CSS fade-in .15s + small margin)
    setTimeout(() => {
      work && work();
      // Hold the loader visible for a beat so the swap is invisible
      setTimeout(() => {
        t.classList.remove('is-active');
        // Match CSS fade-out duration
        setTimeout(() => { _transitionInFlight = false; }, 250);
      }, 350);
    }, 200);
  }

  window.addEventListener('hashchange', () => {
    const force = !!window._hepple_forceIntro;
    window._hepple_forceIntro = false;
    transitionThen(() => route(force));
  });

  function closeDrawers(){
    $('#drawer')?.classList.remove('is-open');
    $('#cartPanel')?.classList.remove('is-open');
    $('#overlay')?.classList.remove('is-active');
  }

  // =============================================
  // INTRO — FRAME-BASED SCROLL SCRUB (canvas)
  //   - Preload sequential JPG frames extracted from the hero video
  //   - Scroll progress through the intro section directly indexes the frame
  //   - rAF + lerp for smooth interpolation between frames
  //   - Works identically across all browsers/devices (no video codec quirks)
  // =============================================
  const FRAME_COUNT = 26;
  const FRAME_PATH  = (n) => `assets/hero-frames/frame-${String(n).padStart(3, '0')}.jpg`;

  let introComplete = false;
  let textRevealed  = false;
  let framesReady   = 0;
  const frames      = [];
  let targetFrame   = 0;   // where we WANT to be (scroll-derived)
  let currentFrame  = 0;   // where it actually is (lerped towards target)
  let rafId         = null;

  function fallbackToPoster(reason){
    console.warn('[Hepple] Hero fallback:', reason);
    const stage = intro?.querySelector('.intro__stage');
    if (stage){
      stage.style.backgroundImage = 'url(assets/hero-poster.jpg)';
      stage.style.backgroundSize = 'cover';
      stage.style.backgroundPosition = 'center';
    }
    if (canvas) canvas.style.display = 'none';
    if (intro){
      intro.classList.add('is-text-revealed');
      intro.classList.add('is-complete');
    }
    if (nav) nav.classList.add('is-visible');
    introComplete = true;
  }

  function markIntroComplete(){
    if (introComplete) return;
    introComplete = true;
    if (intro) intro.classList.add('is-complete');
    if (nav) nav.classList.add('is-visible');
    sessionStorage.setItem('hepple:seenIntro', '1');
    if (rafId){ cancelAnimationFrame(rafId); rafId = null; }
  }

  // ---- preload all frames ----
  if (canvas && intro){
    const ctx = canvas.getContext('2d', { alpha: true });
    let frameW = 1280, frameH = 720;

    function resizeCanvas(){
      // Set canvas pixel size to its CSS-displayed size × DPR for crispness
      const rect = canvas.getBoundingClientRect();
      const dpr  = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = Math.round(rect.width  * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.imageSmoothingQuality = 'high';
      drawFrame(currentFrame, true);
    }

    function drawFrame(idx, force){
      const i = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(idx)));
      const img = frames[i];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      // Cover-fit the frame into the canvas
      const cw = canvas.width, ch = canvas.height;
      const iw = img.naturalWidth, ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih);
      const w = iw * scale, h = ih * scale;
      const x = (cw - w) / 2;
      const y = (ch - h) / 2;
      ctx.drawImage(img, x, y, w, h);
    }

    for (let i = 1; i <= FRAME_COUNT; i++){
      const img = new Image();
      img.onload = () => {
        framesReady++;
        if (i === 1){
          frameW = img.naturalWidth;
          frameH = img.naturalHeight;
          resizeCanvas();
        }
      };
      img.onerror = () => {
        // If any frame fails, fall through gracefully — others still work
        framesReady++;
      };
      img.src = FRAME_PATH(i);
      frames.push(img);
    }

    // If after 6s zero frames loaded, fall back to poster
    setTimeout(() => {
      if (framesReady === 0) fallbackToPoster('no frames loaded');
    }, 6000);

    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 150), { passive: true });
  } else {
    fallbackToPoster('no canvas');
  }

  // ---- scroll progress through the intro section (0 → 1) ----
  function getIntroProgress(){
    if (!intro) return 0;
    const rect = intro.getBoundingClientRect();
    const introH = intro.offsetHeight;
    const viewport = window.innerHeight;
    const scrollable = Math.max(1, introH - viewport);
    const scrolled = Math.min(Math.max(-rect.top, 0), scrollable);
    return scrolled / scrollable;
  }

  // ---- continuous rAF loop: lerp currentFrame → targetFrame, draw ----
  function tick(){
    rafId = requestAnimationFrame(tick);
    if (!canvas || introComplete) return;
    const ease = 0.18;
    currentFrame += (targetFrame - currentFrame) * ease;
    const ctx = canvas.getContext('2d', { alpha: true });
    const i = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(currentFrame)));
    const img = frames[i];
    if (img && img.complete && img.naturalWidth > 0){
      const cw = canvas.width, ch = canvas.height;
      const iw = img.naturalWidth, ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih);
      const w = iw * scale, h = ih * scale;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    }
    if (!textRevealed && targetFrame > 0.5){
      intro?.classList.add('is-text-revealed');
      textRevealed = true;
    }
  }

  function handleIntroScroll(){
    if (!intro || introComplete) return;
    const progress = getIntroProgress();
    // Map scroll progress to frame index
    targetFrame = progress * (FRAME_COUNT - 1);
    // Complete only when user has scrolled essentially to the end of the section
    if (progress > 0.99) markIntroComplete();
  }

  window.addEventListener('scroll', (() => {
    let queued = false;
    return () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        handleIntroScroll();
      });
    };
  })(), { passive: true });

  tick();
  setTimeout(handleIntroScroll, 100);


  // DRAWERS
  $('#menuBtn')?.addEventListener('click', () => {
    $('#drawer').classList.add('is-open');
    $('#overlay').classList.add('is-active');
  });
  $('#drawerClose')?.addEventListener('click', closeDrawers);
  $('#cartBtn')?.addEventListener('click', () => {
    $('#cartPanel').classList.add('is-open');
    $('#overlay').classList.add('is-active');
    renderCart();
    capture('cart_opened', { cart_count: cartCount(), cart_value: cartTotal() });
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
          <span class="btn btn--tiny shop-card__add" data-add-to-cart="${p.slug}" role="button" tabindex="0">ADD</span>
          <span class="btn btn--tiny shop-card__view">VIEW</span>
        </div>
      </a>
    `).join('');
  }

  // =============================================
  // SHOP — ADDITIONAL / LIMITED EXPRESSIONS (separate marked line)
  // =============================================
  function renderShopExtras(){
    const grid = $('#shopExtrasGrid');
    if (!grid) return;
    grid.innerHTML = EXTRA_PRODUCTS.map(p => `
      <a href="#/shop/${p.slug}" data-route="/shop/${p.slug}" class="shop-card shop-card--limited">
        <span class="shop-card__badge">LIMITED</span>
        <div class="shop-card__img">
          <img src="${p.image}" alt="${p.name}" loading="lazy" />
        </div>
        <h3 class="shop-card__title"><span class="shop-card__brand">${p.nameTop}</span><span class="shop-card__variant">${p.nameRest}</span></h3>
        <div class="shop-card__kicker">${p.kicker}</div>
        <div class="shop-card__tagline">${p.tagline}</div>
        <div class="shop-card__meta">${p.meta.size} · ${p.meta.abv}</div>
        <div class="shop-card__price">£${p.price.toFixed(2)}</div>
        <div class="shop-card__actions">
          <span class="btn btn--tiny shop-card__add" data-add-to-cart="${p.slug}" role="button" tabindex="0">ADD</span>
          <span class="btn btn--tiny shop-card__view">VIEW</span>
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
    if (!p || p.isAddon || !Array.isArray(p.body)){
      root.innerHTML = `<div class="wrap" style="padding:6rem 0; text-align:center;">
        <p>PRODUCT NOT FOUND.</p>
        <a href="#/shop" data-route="/shop" style="border-bottom:1px solid; font-weight:700; letter-spacing:.2em; font-size:.7rem;">BACK TO SHOP →</a>
      </div>`;
      return;
    }

    // Single image only (gift box removed per feedback)
    // Use the scene image if available, fall back to bottle card image.
    const sceneImg = p.sceneImage || p.image;
    const galleryImgs = [
      { src: sceneImg, label: `${p.name}` }
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

    capture('product_viewed', {
      slug: p.slug, name: p.name, price: p.price,
      sku: (p.meta && p.meta.sku) || null,
    });

    const track = $('#relatedTrack');
    if (track){
      const related = PRODUCTS.concat(EXTRA_PRODUCTS).filter(x => x.slug !== slug && !x.isAddon);
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
    const ingredientsHtml = (c.ingredients || []).map(ing => `<li>${ing}</li>`).join('');
    const stepsHtml = (c.steps || []).map(s => `<li>${s}</li>`).join('');
    const noteHtml = c.note ? `<div class="flip-card__note"><span class="flip-card__note-label">NOTE</span><p>${c.note}</p></div>` : '';
    const blurbHtml = c.blurb ? `<p class="flip-card__blurb">${c.blurb}</p>` : '';
    const taglineHtml = c.tagline ? `<p class="flip-card__tagline">${c.tagline}</p>` : '';
    return `
      <div class="flip-card" data-flip-card tabindex="0">
        <div class="flip-card__inner">
          <div class="flip-card__face flip-card__front">
            <img src="${c.image}" alt="${c.name}" loading="lazy" />
            <div class="flip-card__front-label">
              <h4>${c.name}</h4>
              <span class="flip-card__front-hint">TAP FOR RECIPE</span>
            </div>
          </div>
          <div class="flip-card__face flip-card__back">
            <div class="flip-card__back-inner">
              <header class="flip-card__back-head">
                <h4>${c.name}</h4>
                ${taglineHtml}
              </header>
              ${blurbHtml}
              <div class="flip-card__meta">
                ${c.glass ? `<div class="flip-card__meta-row"><span class="flip-card__meta-label">GLASS</span><span class="flip-card__meta-val">${c.glass}</span></div>` : ''}
                ${c.equipment ? `<div class="flip-card__meta-row"><span class="flip-card__meta-label">EQUIPMENT</span><span class="flip-card__meta-val">${c.equipment}</span></div>` : ''}
                ${c.garnish ? `<div class="flip-card__meta-row"><span class="flip-card__meta-label">GARNISH</span><span class="flip-card__meta-val">${c.garnish}</span></div>` : ''}
              </div>
              <div class="flip-card__cols">
                <section class="flip-card__col">
                  <h5>INGREDIENTS</h5>
                  <ul class="flip-card__ingredients">${ingredientsHtml}</ul>
                </section>
                <section class="flip-card__col">
                  <h5>METHOD</h5>
                  <ol class="flip-card__steps">${stepsHtml}</ol>
                </section>
              </div>
              ${noteHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Init flip card: tap to toggle. Flipping ANY card auto-unflips all others.
  function initFlipCards(scope=document){
    function flipExclusive(card){
      const willFlip = !card.classList.contains('is-flipped');
      // Unflip every flip card on the page (in any scope)
      $$('[data-flip-card]').forEach(other => other.classList.remove('is-flipped'));
      // Then flip THIS one if it wasn't already flipped
      if (willFlip) card.classList.add('is-flipped');
    }
    $$('[data-flip-card]', scope).forEach(card => {
      if (card._flipInit) return;
      card._flipInit = true;
      card.addEventListener('click', () => flipExclusive(card));
      // Keyboard support: Enter/Space toggles
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          flipExclusive(card);
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
        ${groups.map(g => `
          <div class="cocktails-group">
            <div class="cocktails-group__head">
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
          <div class="team-photo" data-team-id="${m.id}" tabindex="0" role="button" aria-label="Read ${m.name}'s bio">
            <img src="${m.photo || placeholderAvatar(0)}" alt="${m.name}" loading="lazy" />
          </div>
        `).join('')}
      </div>
    `).join('');

    const listHtml = TEAM_MEMBERS.map(m => `
      <div class="team-row" data-team-id="${m.id}" tabindex="0" role="button" aria-label="Read ${m.name}'s bio">
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
      // CLICK → open bio modal
      el.addEventListener('click', () => openBio(el.dataset.teamId));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          openBio(el.dataset.teamId);
        }
      });
    });
  }

  // =============================================
  // BIO MODAL — opens when a board member is clicked
  // =============================================

  // Holds the "is the video taking too long?" timer so we can clear it on close.
  let bioVideoWatchdog = null;

  // Build a <source> list from the single mp4 path in the data.
  // We list the original mp4 first (it definitely exists), then optional
  // sibling files the browser can fall back to if the mp4 can't be decoded.
  // A browser silently skips any <source> it can't load or play, so listing
  // files that may not exist (e.g. a .webm) is harmless — it just gives
  // desktop browsers (which often can't decode iPhone HEVC) another shot.
  function bioVideoSources(mp4){
    const base = mp4.replace(/\.(mp4|m4v|mov)$/i, '');
    return [
      `<source src="${mp4}" type="video/mp4" />`,
      `<source src="${base}.webm" type="video/webm" />`,
      `<source src="${base}-h264.mp4" type="video/mp4" />`,
    ].join('\n             ');
  }

  // Wire up resilient playback for the bio video: detect when it can't play
  // and swap in a fallback that opens the clip directly (which uses a
  // different, more forgiving playback path / lets the OS handle it).
  function initBioVideo(member){
    const wrap = $('#bioModal [data-bio-video]');
    if (!wrap) return;
    const video    = $('.bio-modal__video', wrap);
    const fallback = $('.bio-modal__video-fallback', wrap);
    if (!video || !fallback) return;

    let settled = false;
    const stop = () => { if (bioVideoWatchdog){ clearTimeout(bioVideoWatchdog); bioVideoWatchdog = null; } };

    const showFallback = (reason) => {
      if (settled) return;
      settled = true; stop();
      try { video.pause(); } catch(_){}
      video.style.display = 'none';
      fallback.classList.add('is-shown');
      try { if (typeof capture === 'function') capture('bio_video_fallback', { member: member && member.id, reason }); } catch(_){}
    };
    const markOk = () => { if (settled) return; settled = true; stop(); };

    // Header parsed = the browser can read the file → treat as playable.
    video.addEventListener('loadedmetadata', markOk);
    video.addEventListener('canplay', markOk);
    video.addEventListener('playing', markOk);

    // Hard decode/network error on the <video> itself → fall back.
    video.addEventListener('error', () => showFallback('video-error'));
    // If every <source> failed, the element reports NO_SOURCE.
    $$('source', video).forEach((s) => s.addEventListener('error', () => {
      if (video.networkState === 3 /* NETWORK_NO_SOURCE */) showFallback('no-source');
    }));

    // Backstop: if nothing at all has loaded after 8s, assume it won't.
    stop();
    bioVideoWatchdog = setTimeout(() => {
      if (!settled && video.readyState === 0 /* HAVE_NOTHING */) showFallback('timeout');
    }, 8000);

    // (Re)load the chosen source and make a best-effort attempt to start.
    // A blocked-autoplay rejection is NOT a failure — controls are visible,
    // so we deliberately ignore it rather than showing the fallback.
    try { video.load(); } catch(_){}
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  }

  function openBio(id){
    const m = TEAM_MEMBERS.find(x => x.id === id);
    if (!m) return;
    let modal = $('#bioModal');
    if (!modal){
      modal = document.createElement('div');
      modal.id = 'bioModal';
      modal.className = 'bio-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.innerHTML = `
        <div class="bio-modal__backdrop" data-bio-close></div>
        <div class="bio-modal__panel" role="document">
          <button class="bio-modal__close" data-bio-close aria-label="Close">✕</button>
          <div class="bio-modal__body" id="bioModalBody"></div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.addEventListener('click', (e) => {
        if (e.target.closest('[data-bio-close]')) closeBio();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) closeBio();
      });
    }
    const body = $('#bioModalBody', modal);

    // If this member has a video, show a real player (controls + sound),
    // poster falls back to their still photo. Otherwise just the photo.
    const mediaHtml = m.video
      ? `<div class="bio-modal__media bio-modal__media--video" data-bio-video>
           <video class="bio-modal__video"
                  controls playsinline preload="metadata"
                  poster="${m.photo}"
                  aria-label="${m.name} — video">
             ${bioVideoSources(m.video)}
           </video>
           <div class="bio-modal__video-fallback">
             <img class="bio-modal__video-fallback-img" src="${m.photo}" alt="${m.name}" aria-hidden="true" />
             <div class="bio-modal__video-fallback-inner">
               <p class="bio-modal__video-fallback-text">This clip won’t play inline in this browser.</p>
               <a class="bio-modal__video-fallback-btn" href="${m.video}" target="_blank" rel="noopener">▶&nbsp; Open the video</a>
             </div>
           </div>
         </div>`
      : `<div class="bio-modal__photo">
           <img src="${m.photo}" alt="${m.name}" />
         </div>`;

    body.innerHTML = `
      ${mediaHtml}
      <div class="bio-modal__content">
        <p class="bio-modal__role">${m.role}</p>
        <h2 class="bio-modal__name">${m.name}</h2>
        <p class="bio-modal__text">${m.bio}</p>
      </div>
    `;
    modal.classList.add('is-open');
    document.body.classList.add('no-scroll');
    if (m.video) initBioVideo(m);
  }
  function closeBio(){
    const modal = $('#bioModal');
    if (!modal) return;
    // Stop any playing video so its audio doesn't continue after closing,
    // and cancel the load watchdog so it can't fire after we've closed.
    if (bioVideoWatchdog){ clearTimeout(bioVideoWatchdog); bioVideoWatchdog = null; }
    const vid = $('.bio-modal__video', modal);
    if (vid){ try { vid.pause(); } catch(_){} }
    modal.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  // =============================================
  // STRIPE RETURN — success / cancel handling
  // Stripe sends the buyer back to:
  //   /?checkout=success&session_id=cs_...     (paid)
  //   /?checkout=cancel#/shop                  (abandoned at Stripe)
  // The webhook is the source of truth for orders; the success event
  // fired here is a client-side backup, deduped server-side by order id.
  // =============================================
  function handleCheckoutReturn(){
    let params;
    try { params = new URLSearchParams(window.location.search); }
    catch (_) { return; }
    const status = params.get('checkout');
    if (!status) return;

    if (status === 'success'){
      const sid = params.get('session_id') || null;
      capture('purchase', { order_id: sid, source: 'client-return' });
      cart = []; saveCart(); clearPromo(); renderCart();
      showCheckoutConfirmation();
    } else if (status === 'cancel'){
      showToast('CHECKOUT CANCELLED');
    }

    // Strip the query string so a refresh can't replay the event.
    const clean = window.location.pathname + (window.location.hash || '');
    try { window.history.replaceState({}, document.title, clean); } catch (_) {}
  }

  function showCheckoutConfirmation(){
    if ($('.checkout-confirm')) return;
    const el = document.createElement('div');
    el.className = 'checkout-confirm';
    el.innerHTML = `
      <div class="checkout-confirm__backdrop" data-cc-close></div>
      <div class="checkout-confirm__panel" role="dialog" aria-modal="true" aria-label="Order confirmed">
        <div class="checkout-confirm__mark" aria-hidden="true">✓</div>
        <p class="checkout-confirm__kicker">ORDER CONFIRMED</p>
        <h2 class="checkout-confirm__title">THANK YOU</h2>
        <p class="checkout-confirm__text">Your order is confirmed and a receipt is on its way to your inbox. We’ll be in touch the moment it ships from the estate.</p>
        <button class="checkout-confirm__btn" data-cc-close>CONTINUE</button>
      </div>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('is-open'));
    el.addEventListener('click', (e) => {
      if (e.target.closest('[data-cc-close]')){
        el.classList.remove('is-open');
        setTimeout(() => el.remove(), 320);
      }
    });
  }

  // =============================================
  // BROKEN IMAGE GUARD
  // On mobile (esp. iOS Safari) a failed/empty <img> inside a fixed-height
  // box renders as a dark "broken image" block — the black boxes reported on
  // the shop. We catch load failures globally (capture phase, since error
  // events don't bubble) and hide the broken image + flag its wrapper so the
  // cream background shows through instead of a black box.
  // =============================================
  function initBrokenImageGuard(){
    document.addEventListener('error', (e) => {
      const el = e.target;
      if (!el || el.tagName !== 'IMG') return;
      el.style.display = 'none';
      const wrap = el.closest('.shop-card__img, .product-card__img, .bio-modal__photo, .embla__slide, [class*="__img"], [class*="__bg"]');
      if (wrap) wrap.classList.add('img-failed');
    }, true);
  }

  // =============================================
  // COOKIE CONSENT — analytics stay off until accepted
  // =============================================
  function initCookieConsent(){
    const banner = document.getElementById('cookieConsent');
    if (!banner) return;
    const KEY = 'hepple:cookie-consent';

    function apply(accepted){
      try {
        if (!window.posthog) return;
        if (accepted && typeof posthog.opt_in_capturing === 'function') posthog.opt_in_capturing();
        else if (!accepted && typeof posthog.opt_out_capturing === 'function') posthog.opt_out_capturing();
      } catch (_) {}
    }

    let choice = null;
    try { choice = localStorage.getItem(KEY); } catch (_) {}

    if (choice === 'accepted'){ apply(true);  return; }
    if (choice === 'declined'){ apply(false); return; }

    // Undecided — show the banner.
    banner.hidden = false;
    requestAnimationFrame(() => banner.classList.add('is-visible'));

    banner.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-cookie]');
      if (!btn) return;
      const accepted = btn.dataset.cookie === 'accept';
      try { localStorage.setItem(KEY, accepted ? 'accepted' : 'declined'); } catch (_) {}
      apply(accepted);
      // If they just accepted, record the pageview we held back this session.
      if (accepted){
        try { capture('$pageview', { $current_url: location.href, route: getRoute() }); } catch (_) {}
      }
      banner.classList.remove('is-visible');
      setTimeout(() => { banner.hidden = true; }, 500);
    });
  }

  // =============================================
  // BOOT
  // =============================================
  initBrokenImageGuard();
  initCookieConsent();
  renderCart();
  route();
  initProcess();
  initCounters();
  initAllEmbla();
  handleCheckoutReturn();

})();
