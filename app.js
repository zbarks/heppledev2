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
  // PRODUCT CATALOGUE
  // =============================================

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
      sceneImage: 'assets/products/gin-scene.jpg',
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
      sceneImage: 'assets/products/douglas-fir-scene.jpg',
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
      name:    'HEPPLE WHEAT VODKA',
      nameTop: 'HEPPLE',
      nameRest:'WHEAT VODKA',
      short:   'Wheat Vodka',
      tagline: 'PURE, CRISP, SMOOTH',
      kicker:  'PRECISION IN RESTRAINT',
      price:   34.95,
      meta:    { size: '70CL', abv: '41%', origin: 'NORTHUMBERLAND' },
      sku:     'moorland-teal',
      image:   'assets/products/wheat-vodka.jpg',
      sceneImage: 'assets/products/wheat-vodka-scene.jpg',
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

    // ── HEPPLE WHEAT VODKA (formerly Moorland) ──
    {
      id: 'honey-trap',
      name: 'HONEY TRAP',
      sku: 'hepple-moorland-vodka',
      image: 'assets/cocktails/honey-trap.jpg',
      tagline: 'SUNNY, ELEGANT AND SLIGHTLY UNEXPECTED.',
      blurb: 'A silky vodka cocktail with honeyed softness, fresh lemon and a little apricot glow. Easy to make, lovely in a coupe, and perfect when you want something sunny, elegant and slightly unexpected.',
      ingredients: ['50ML HEPPLE WHEAT VODKA', '25ML FRESHLY SQUEEZED LEMON JUICE', '15ML HONEY SYRUP', '15ML APRICOT JAM OR APRICOT CONSERVE', 'OPTIONAL: DASH OF ORANGE BITTERS'],
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
      blurb: 'A fresh raspberry vodka martini with a delicate rose lift. Hepple Wheat Vodka keeps the drink clean and beautifully cold, while muddled raspberries bring colour, sharpness and a little summer drama. Perfect for aperitif hour, garden drinks or when the evening needs something with a bit of charm.',
      ingredients: ['50ML HEPPLE WHEAT VODKA', '6 TO 8 FRESH RASPBERRIES', '20ML FRESHLY SQUEEZED LEMON JUICE', '15ML SUGAR SYRUP', '2 DROPS ROSEWATER'],
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
      blurb: 'A vodka martini for olive lovers. Hepple Wheat Vodka keeps the drink clean, crisp and beautifully cold, while a generous splash of olive brine gives it savoury depth and proper bite. Best served icy, direct and with more olives than is strictly necessary.',
      ingredients: ['60ML HEPPLE WHEAT VODKA', '10ML GOOD QUALITY DRY VERMOUTH', '15ML OLIVE BRINE'],
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

  function addToCart(slug, qty=1){
    const key = slug;
    const existing = cart.find(i => i.key === key);
    if (existing) existing.qty += qty;
    else cart.push({ key, slug, qty });
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
      const unit = p.price;
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
  const canvas  = $('#heroCanvas');

  // ---- Estate hero: HLS via hls.js (Safari plays HLS natively) ----
  let estateHlsState = 'idle'; // idle | loading | ready | failed
  let estateHlsScriptPromise = null;
  function loadHlsScript(){
    if (estateHlsScriptPromise) return estateHlsScriptPromise;
    estateHlsScriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.13/dist/hls.min.js';
      s.async = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return estateHlsScriptPromise;
  }
  function initEstateHeroVideo(){
    if (estateHlsState === 'ready' || estateHlsState === 'loading') return;
    const video = document.getElementById('estateHeroVideo');
    if (!video) return;
    const src = video.dataset.hls;
    if (!src) return;
    estateHlsState = 'loading';

    // Safari (iOS/macOS) can play HLS natively — no hls.js needed
    if (video.canPlayType('application/vnd.apple.mpegurl')){
      // Hint Safari to grab high quality
      video.setAttribute('preload', 'auto');
      video.src = src;
      const onCanPlay = () => {
        estateHlsState = 'ready';
        video.play().catch(()=>{});
        video.removeEventListener('loadedmetadata', onCanPlay);
      };
      video.addEventListener('loadedmetadata', onCanPlay);
      return;
    }

    // Other browsers: lazy-load hls.js
    loadHlsScript().then(() => {
      if (typeof Hls === 'undefined' || !Hls.isSupported()){
        estateHlsState = 'failed';
        // Poster (already on the <video>) stays visible — graceful fallback
        return;
      }
      const hls = new Hls({
        // Quality config — drive to the HIGHEST available rendition
        capLevelToPlayerSize: false,   // do NOT downscale to player CSS size
        autoStartLoad: true,
        startLevel: -1,                // start with auto pick; we force max on manifest parse
        abrBandWidthFactor: 1.0,
        abrBandWidthUpFactor: 1.0,
        maxBufferLength: 30,
        maxMaxBufferLength: 60
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Lock to the highest rendition Bunny provides (no ABR step-down)
        if (hls.levels && hls.levels.length){
          hls.currentLevel = hls.levels.length - 1;
          hls.loadLevel = hls.levels.length - 1;
        }
        estateHlsState = 'ready';
        video.play().catch(()=>{});
      });
      hls.on(Hls.Events.ERROR, (e, data) => {
        if (data && data.fatal){
          estateHlsState = 'failed';
          try { hls.destroy(); } catch(_){}
        }
      });
    }).catch(() => {
      estateHlsState = 'failed';
    });
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

    if (route === '/shop'){ renderShopGrid(); renderShopCocktails(); }
    if (route === '/estate'){ initEstateHeroVideo(); }
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
      addToCart(slug, qty);
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

    const a = e.target.closest('[data-route]');
    if (!a) return;
    const target = a.getAttribute('data-route');
    if (!target) return;
    e.preventDefault();
    closeDrawers();

    const isBrand = a.hasAttribute('data-brand');
    if (isBrand) sessionStorage.removeItem('hepple:seenIntro');

    if (location.hash === '#' + target){
      showPageTransition();
      route(isBrand);
    } else {
      if (isBrand) window._hepple_forceIntro = true;
      location.hash = '#' + target;
    }
  });

  // Page transition loader — brief flash on every navigation
  function showPageTransition(){
    const t = document.getElementById('pageTransition');
    if (!t) return;
    t.classList.add('is-active');
    // Always show for at least 500ms for consistency
    setTimeout(() => { t.classList.remove('is-active'); }, 500);
  }

  window.addEventListener('hashchange', () => {
    const force = !!window._hepple_forceIntro;
    window._hepple_forceIntro = false;
    showPageTransition();
    route(force);
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
    const ctx = canvas.getContext('2d', { alpha: false });
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
    const ctx = canvas.getContext('2d', { alpha: false });
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
    body.innerHTML = `
      <div class="bio-modal__photo">
        <img src="${m.photo}" alt="${m.name}" />
      </div>
      <div class="bio-modal__content">
        <p class="bio-modal__role">${m.role}</p>
        <h2 class="bio-modal__name">${m.name}</h2>
        <p class="bio-modal__text">${m.bio}</p>
      </div>
    `;
    modal.classList.add('is-open');
    document.body.classList.add('no-scroll');
  }
  function closeBio(){
    const modal = $('#bioModal');
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  // =============================================
  // BOOT
  // =============================================
  renderCart();
  route();
  initProcess();
  initCounters();
  initAllEmbla();
})();
