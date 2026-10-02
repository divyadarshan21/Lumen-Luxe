/**
 * LUMEN LUXE - Master Product Catalog & Metadata
 * Production-ready e-commerce catalog dataset with specifications, variants, and reviews.
 */

const PRODUCTS_DATA = [
  {
    id: "prod-001",
    sku: "LL-AUD-4001",
    name: "Aura Pro Wireless ANC Headphones",
    tagline: "Studio-fidelity acoustics with hybrid active noise cancellation",
    category: "audio",
    categoryName: "Audio & Sound",
    price: 299.99,
    originalPrice: 379.99,
    rating: 4.9,
    reviewsCount: 142,
    badge: "Bestseller",
    badgeType: "hot",
    stock: 8,
    isFlashDeal: true,
    colors: [
      { name: "Space Black", hex: "#1c1d21" },
      { name: "Platinum Silver", hex: "#d8d9de" },
      { name: "Midnight Navy", hex: "#1e293b" }
    ],
    sizes: ["Standard Fit"],
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Engineered with custom 40mm titanium drivers and 8 microphones for unparalleled noise reduction. Experience 45-hour battery life, lossless spatial audio, and cloud-soft memory foam earcups.",
    features: [
      "Hybrid Active Noise Cancellation with Transparency Mode",
      "45 Hours Playtime on Single Fast Charge",
      "Multipoint Bluetooth 5.3 connection with LDAC codec support",
      "Bespoke Spatial Audio with dynamic head tracking"
    ],
    specs: {
      "Driver Size": "40mm Custom Titanium Diaphragm",
      "Battery Life": "Up to 45 hours (ANC on) / 60 hours (ANC off)",
      "Charging": "USB-C Fast Charge (10 min charge = 5 hours playback)",
      "Weight": "250 grams",
      "Warranty": "2 Years Official Manufacturer Warranty"
    }
  },
  {
    id: "prod-002",
    sku: "LL-WAT-2002",
    name: "Chronos Heritage Minimalist Watch",
    tagline: "Swiss quartz precision enclosed in surgical-grade stainless steel",
    category: "wearables",
    categoryName: "Watches & Wearables",
    price: 189.00,
    originalPrice: 249.00,
    rating: 4.8,
    reviewsCount: 98,
    badge: "Trending",
    badgeType: "new",
    stock: 14,
    isFlashDeal: false,
    colors: [
      { name: "Rose Gold / Cognac", hex: "#c68d77" },
      { name: "Matte Black", hex: "#18181b" },
      { name: "Brushed Steel", hex: "#94a3b8" }
    ],
    sizes: ["38mm Dial", "42mm Dial"],
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80"
    ],
    description: "An architectural statement piece combining scratch-resistant sapphire crystal with genuine Italian vegetable-tanned leather straps. Water-resistant up to 50 meters.",
    features: [
      "Sapphire Crystal Glass with anti-reflective interior coating",
      "Japanese Miyota Quartz Movement with date complication",
      "5 ATM Water Resistance (50m depth rating)",
      "Quick-release interchangeable Italian leather strap"
    ],
    specs: {
      "Case Material": "316L Surgical Stainless Steel",
      "Dial Diameter": "40mm",
      "Strap Width": "20mm genuine Italian leather",
      "Movement": "Miyota Super 2035",
      "Warranty": "3 Years International Warranty"
    }
  },
  {
    id: "prod-003",
    sku: "LL-FAS-1003",
    name: "Nomad Canvas & Leather Travel Backpack",
    tagline: "Weatherproof 28L commuter & weekend expedition carry-all",
    category: "fashion",
    categoryName: "Fashion & Apparel",
    price: 135.50,
    originalPrice: 165.00,
    rating: 4.7,
    reviewsCount: 84,
    badge: "-18% OFF",
    badgeType: "sale",
    stock: 5,
    isFlashDeal: true,
    colors: [
      { name: "Military Olive", hex: "#4b5320" },
      { name: "Charcoal Slate", hex: "#334155" },
      { name: "Sahara Tan", hex: "#d2b48c" }
    ],
    sizes: ["24L Standard", "30L Extended"],
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Crafted from 16oz waxed organic cotton canvas reinforced with full-grain leather trim and YKK Aquaguard zips. Features a dedicated 16-inch padded laptop sleeve and hidden passport pocket.",
    features: [
      "Waxed water-repellent organic cotton canvas exterior",
      "Suspended 16-inch fleece-lined laptop bay",
      "Luggage pass-through strap for rolling suitcases",
      "Ergonomic airflow back panel with lumbar support"
    ],
    specs: {
      "Capacity": "28 Liters",
      "Weight": "1.1 kg",
      "Dimensions": "46 x 32 x 18 cm",
      "Material": "Organic Waxed Canvas & Top-Grain Leather"
    }
  },
  {
    id: "prod-004",
    sku: "LL-ELE-5004",
    name: "Lumix Nova 4K Cinema Mirrorless Camera",
    tagline: "Full-frame sensor with 10-bit internal recording & 5-axis IBIS",
    category: "electronics",
    categoryName: "Electronics & Tech",
    price: 1249.00,
    originalPrice: 1499.00,
    rating: 4.95,
    reviewsCount: 63,
    badge: "Flagship",
    badgeType: "hot",
    stock: 4,
    isFlashDeal: false,
    colors: [
      { name: "Obsidian Black", hex: "#0f172a" }
    ],
    sizes: ["Body Only", "Kit with 24-70mm f/2.8"],
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Transform your visual storytelling with a 33MP Back-Illuminated full-frame sensor, 4K 120fps recording, and AI subject tracking autofocus with eye recognition for humans and wildlife.",
    features: [
      "33MP Full-Frame Exmor R CMOS Sensor",
      "4K 60p 10-bit 4:2:2 recording & S-Cinetone color science",
      "7.0-stop 5-axis in-body image stabilization",
      "Dual UHS-II SD / CFexpress Type A card slots"
    ],
    specs: {
      "Sensor": "Full-Frame 35.9 x 23.9 mm",
      "ISO Range": "100 - 51,200 (Expandable 50 - 204,800)",
      "Battery": "NP-FZ100 (600 shots per charge)",
      "Screen": "3.0-inch 1.03M-dot Vari-angle Touchscreen"
    }
  },
  {
    id: "prod-005",
    sku: "LL-FAS-1005",
    name: "Aerolight Boost Ultra Running Shoes",
    tagline: "Responsive nitrogen-infused cushioning for limitless energy return",
    category: "fashion",
    categoryName: "Fashion & Apparel",
    price: 145.00,
    originalPrice: 180.00,
    rating: 4.6,
    reviewsCount: 215,
    badge: "New Release",
    badgeType: "new",
    stock: 19,
    isFlashDeal: false,
    colors: [
      { name: "Ghost White / Volt", hex: "#f8fafc" },
      { name: "Cyan Teal", hex: "#06b6d4" },
      { name: "Onyx Charcoal", hex: "#1f2937" }
    ],
    sizes: ["US 8", "US 9", "US 10", "US 11", "US 12"],
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Precision-engineered jacquard mesh upper delivers targeted breathability, paired with our carbon-infused propulsion plate and continental rubber traction sole.",
    features: [
      "Nitrogen-infused dual-density midsole foam",
      "Integrated carbon fiber propulsion plate",
      "Breathable engineered jacquard knit upper",
      "Continental™ all-weather rubber outsole"
    ],
    specs: {
      "Drop": "8mm (Heel: 36mm / Forefoot: 28mm)",
      "Weight": "218g (US Men's Size 9)",
      "Terrain": "Road / Track / Daily Training",
      "Arch Support": "Neutral / Performance Cushioning"
    }
  },
  {
    id: "prod-006",
    sku: "LL-LIF-3006",
    name: "Artisan Ceramic Pour-Over & Kettle Set",
    tagline: "Handcrafted matte ceramic drip brewer with precision gooseneck",
    category: "lifestyle",
    categoryName: "Home & Lifestyle",
    price: 89.00,
    originalPrice: 110.00,
    rating: 4.85,
    reviewsCount: 52,
    badge: "Eco Choice",
    badgeType: "eco",
    stock: 12,
    isFlashDeal: false,
    colors: [
      { name: "Sand Terracotta", hex: "#c2410c" },
      { name: "Slate Grey", hex: "#475569" },
      { name: "Chalk Matte", hex: "#f1f5f9" }
    ],
    sizes: ["600ml / 2-3 Cups"],
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Elevate your morning coffee ritual. Thermally stable ceramic maintains optimum extraction temperatures, while the ergonomic counterbalance handle ensures effortless, steady pouring.",
    features: [
      "Handmade stoneware with heat-retaining glaze",
      "Compatible with standard V60-02 paper filters",
      "Includes 1L electric variable temperature gooseneck kettle",
      "Dishwasher and food-safe certified"
    ],
    specs: {
      "Capacity": "Server: 600ml | Kettle: 1000ml",
      "Kettle Power": "1200W Strix Rapid Boil",
      "Material": "Stoneware Ceramic & 304 Stainless Steel"
    }
  },
  {
    id: "prod-007",
    sku: "LL-ELE-5007",
    name: "Solis Ultra-Thin Mechanical Keyboard",
    tagline: "Low-profile optical switches with anodized aluminum top frame",
    category: "electronics",
    categoryName: "Electronics & Tech",
    price: 159.00,
    originalPrice: 199.00,
    rating: 4.75,
    reviewsCount: 118,
    badge: "-20% OFF",
    badgeType: "sale",
    stock: 11,
    isFlashDeal: true,
    colors: [
      { name: "Lunar White", hex: "#e2e8f0" },
      { name: "Carbon Grey", hex: "#1e293b" }
    ],
    sizes: ["75% Compact Layout", "Full 100% Numpad Layout"],
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Designed for supreme ergonomic comfort and snappy typing feedback. Connect up to 4 devices simultaneously via 2.4GHz low-latency wireless, Bluetooth 5.2, or wired Type-C.",
    features: [
      "Low-profile hot-swappable optical tactile switches",
      "Per-key RGB backlighting with 22 dynamic lighting animations",
      "Multi-device pairing with instant OS toggle (Mac/Windows)",
      "Up to 200 hours battery life (backlight off)"
    ],
    specs: {
      "Thickness": "16mm at highest ergonomic incline",
      "Battery": "4000mAh Lithium Polymer",
      "Keycaps": "Double-shot PBT low profile",
      "Connectivity": "2.4Ghz Wireless + Bluetooth 5.2 + Type-C"
    }
  },
  {
    id: "prod-008",
    sku: "LL-FAS-1008",
    name: "Vantage Aviator Polarized Sunglasses",
    tagline: "Ultralight titanium rim with Japanese polarized HD glass lenses",
    category: "fashion",
    categoryName: "Fashion & Apparel",
    price: 110.00,
    originalPrice: 145.00,
    rating: 4.9,
    reviewsCount: 76,
    badge: "Popular",
    badgeType: "hot",
    stock: 16,
    isFlashDeal: false,
    colors: [
      { name: "Gold / Emerald Green", hex: "#eab308" },
      { name: "Gunmetal / Smoke Grey", hex: "#475569" },
      { name: "Silver / Cobalt Mirror", hex: "#3b82f6" }
    ],
    sizes: ["Medium (55mm)", "Large (58mm)"],
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Classic aviator silhouette remastered with aerospace-grade beta-titanium wire temples, self-adjusting silicone nose pads, and 100% UV400 anti-glare polarization.",
    features: [
      "100% UVA/UVB/UVC UV400 polarized optical protection",
      "Ultra-lightweight 19g titanium construction",
      "Hydrophobic and oleophobic smudge-resistant lens coatings",
      "Includes hard magnetic leather case and microfiber cloth"
    ],
    specs: {
      "Frame Weight": "19.5 grams",
      "Lens Material": "Japanese Mineral Polarized Glass",
      "Hinge": "German OBE screwless spring hinge"
    }
  },
  {
    id: "prod-009",
    sku: "LL-AUD-4009",
    name: "EchoSphere 360 Smart Acoustic Speaker",
    tagline: "Room-filling omnidirectional Hi-Fi sound with automated room tuning",
    category: "audio",
    categoryName: "Audio & Sound",
    price: 219.00,
    originalPrice: 260.00,
    rating: 4.8,
    reviewsCount: 112,
    badge: "Staff Pick",
    badgeType: "new",
    stock: 7,
    isFlashDeal: false,
    colors: [
      { name: "Charcoal Heather", hex: "#374151" },
      { name: "Nordic Oatmeal", hex: "#e5e7eb" }
    ],
    sizes: ["Standard Studio"],
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80"
    ],
    description: "360-degree cylindrical sound stage with downward-firing subwoofer and triple neodymium tweeters. Streams via Wi-Fi 6, AirPlay 2, Spotify Connect, and Bluetooth 5.3.",
    features: [
      "Omnidirectional 360° sound field with room acoustic calibration",
      "Supports lossless 24-bit/192kHz high-resolution audio",
      "Integrated capacitive touch crown with ambient lighting ring",
      "Multi-room grouping support with AirPlay 2"
    ],
    specs: {
      "Output Power": "75W RMS Peak Power",
      "Frequency Response": "38Hz - 22,000Hz",
      "Inputs": "Wi-Fi 6, Bluetooth 5.3, Optical 3.5mm Aux",
      "Dimensions": "180mm height x 140mm diameter"
    }
  },
  {
    id: "prod-010",
    sku: "LL-WAT-2010",
    name: "Apex Pulse Smart Fitness Tracker Band",
    tagline: "Continuous HRV, SpO2, ECG, and sleep staging with 14-day battery",
    category: "wearables",
    categoryName: "Watches & Wearables",
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.7,
    reviewsCount: 167,
    badge: "Sale",
    badgeType: "sale",
    stock: 22,
    isFlashDeal: true,
    colors: [
      { name: "Carbon Black", hex: "#111827" },
      { name: "Alpine Sand", hex: "#e2e8f0" },
      { name: "Crimson Red", hex: "#ef4444" }
    ],
    sizes: ["Small / Medium (130-180mm)", "Medium / Large (160-220mm)"],
    image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=800&auto=format&fit=crop&q=80"
    ],
    description: "All-day biometric tracking in a featherlight form factor. Features blood oxygen saturation, body temperature trends, stress scoring, and 40+ athletic workout modes.",
    features: [
      "Vibrant 1.47-inch Curved AMOLED Always-On Display",
      "BioTracker 4.0 PPG Optical Sensor with 24h Heart Rate tracking",
      "5 ATM Water-resistance for swimming and open water sports",
      "14-Day Typical Usage Battery Life on single magnetic charge"
    ],
    specs: {
      "Display": "1.47\" AMOLED 368x194, 500 nits brightness",
      "Weight": "18g (without strap)",
      "Battery": "230mAh Fast Magnetic Charge",
      "Compatibility": "iOS 13+ / Android 9.0+"
    }
  },
  {
    id: "prod-011",
    sku: "LL-LIF-3011",
    name: "Nordic Minimalist Oak Desk Lamp",
    tagline: "Dimmable warm eye-comfort LED with integrated Qi wireless charge base",
    category: "lifestyle",
    categoryName: "Home & Lifestyle",
    price: 79.50,
    originalPrice: 95.00,
    rating: 4.88,
    reviewsCount: 44,
    badge: "Eco Choice",
    badgeType: "eco",
    stock: 9,
    isFlashDeal: false,
    colors: [
      { name: "Natural Oak", hex: "#b45309" },
      { name: "Walnut Dark", hex: "#451a03" }
    ],
    sizes: ["Standard Desk"],
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Sustainably harvested FSC-certified solid oak combined with brushed aluminum. Stepless touch slider allows seamless transitions from 2700K warm twilight to 5000K daylight reading.",
    features: [
      "Flicker-free CRI 95+ eye protection LEDs",
      "15W fast wireless charging pad built into weighted base",
      "Stepless brightness slider & 3 color temperature presets",
      "USB-A auxiliary charging port on rear for secondary accessories"
    ],
    specs: {
      "Max Lumens": "800 Lumens Output",
      "Color Temp": "2700K - 5000K Variable",
      "Power": "12W Lamp + 15W Qi Charger",
      "Material": "Solid FSC Oak & Anodized Aluminum"
    }
  },
  {
    id: "prod-012",
    sku: "LL-AUD-4012",
    name: "PureSound True Wireless Studio Earbuds",
    tagline: "Active spatial audio with bespoke graphene drivers & wireless case",
    category: "audio",
    categoryName: "Audio & Sound",
    price: 139.00,
    originalPrice: 179.00,
    rating: 4.65,
    reviewsCount: 189,
    badge: "Bestseller",
    badgeType: "hot",
    stock: 25,
    isFlashDeal: true,
    colors: [
      { name: "Ceramic Pearl", hex: "#f8fafc" },
      { name: "Midnight Onyx", hex: "#0f172a" },
      { name: "Sage Mist", hex: "#84a98c" }
    ],
    sizes: ["In-Ear (S/M/L Tips Included)"],
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80"
    ],
    description: "Tiny earbuds, massive soundstage. Enjoy personalized EQ profiling via our companion app, adaptive noise cancelling that auto-adjusts to your surroundings, and IPX7 sweatproofing.",
    features: [
      "11mm Graphene dynamic diaphragm drivers",
      "32 Hours Total Playback with Qi wireless charging case",
      "IPX7 waterproof and sweat resistance rating",
      "Quad beamforming microphones with AI wind noise reduction"
    ],
    specs: {
      "Battery": "8h per charge (buds) + 24h (charging case)",
      "Codecs": "LDAC, AAC, SBC",
      "Bluetooth": "5.3 with LE Audio Support",
      "Weight": "4.8g per earbud"
    }
  }
];

const REVIEWS_DATA = [
  {
    id: "rev-1",
    author: "Elena Rostova",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    date: "2 days ago",
    verified: true,
    productName: "Aura Pro Wireless ANC Headphones",
    title: "The acoustic clarity will blow you away",
    comment: "I own several flagship audiophile headphones, and the soundstage on the Aura Pro is remarkable. The noise cancellation completely hushes subway rumble. Battery easily lasts the full work week without needing a top-up!"
  },
  {
    id: "rev-2",
    author: "Marcus Vance",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    date: "5 days ago",
    verified: true,
    productName: "Chronos Heritage Minimalist Watch",
    title: "Stunning craftsmanship and sleek profile",
    comment: "Gets compliments literally every time I wear it to meetings. The Italian leather strap is supple right out of the box and the sapphire crystal remains pristine despite daily desk contact."
  },
  {
    id: "rev-3",
    author: "Sophia Chen",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    rating: 4.8,
    date: "1 week ago",
    verified: true,
    productName: "Nomad Canvas & Leather Travel Backpack",
    title: "Best travel companion I've ever owned",
    comment: "Carried this through a 2-week trip in Japan. Held my laptop, camera gear, water bottle, and a change of clothes with ease. The luggage strap on the back is a lifesaver at airports."
  },
  {
    id: "rev-4",
    author: "Liam O'Connor",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    date: "2 weeks ago",
    verified: true,
    productName: "Solis Ultra-Thin Mechanical Keyboard",
    title: "Game changer for home office ergonomics",
    comment: "Typing on low profile switches has significantly relieved wrist fatigue. The wireless latency is undetectable and switching between my Mac work laptop and gaming PC takes one key combo."
  }
];

const PROMO_CODES = {
  "SAVE20": { code: "SAVE20", discountPercent: 20, description: "20% Off Your Entire Order" },
  "WELCOME10": { code: "WELCOME10", discountPercent: 10, description: "10% Welcome Discount" },
  "FREESHIP": { code: "FREESHIP", freeShipping: true, description: "Free Express Shipping on Any Order" }
};

const CURRENCIES = {
  USD: { code: "USD", symbol: "$", rate: 1.0, label: "USD ($)" },
  EUR: { code: "EUR", symbol: "€", rate: 0.92, label: "EUR (€)" },
  GBP: { code: "GBP", symbol: "£", rate: 0.79, label: "GBP (£)" },
  INR: { code: "INR", symbol: "₹", rate: 83.5, label: "INR (₹)" }
};
