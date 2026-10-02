/**
 * LUMEN LUXE - Application Core & State Management
 * Complete Real-Time E-Commerce Functionality
 */

// Application State
const AppState = {
  products: PRODUCTS_DATA,
  reviews: JSON.parse(localStorage.getItem("lumen_reviews")) || REVIEWS_DATA,
  cart: JSON.parse(localStorage.getItem("lumen_cart")) || [],
  wishlist: JSON.parse(localStorage.getItem("lumen_wishlist")) || [],
  orders: JSON.parse(localStorage.getItem("lumen_orders")) || [
    {
      id: "ORD-94281",
      date: "Oct 01, 2026",
      status: "In Transit",
      carrier: "DHL Express",
      trackingNumber: "DHL-883920194US",
      total: 348.50,
      items: [
        { name: "Aura Pro Wireless ANC Headphones", qty: 1, price: 299.99 },
        { name: "Artisan Ceramic Pour-Over & Kettle Set", qty: 1, price: 89.00 }
      ],
      shippingAddress: "742 Evergreen Terrace, Springfield, OR"
    }
  ],
  currency: localStorage.getItem("lumen_currency") || "USD",
  theme: localStorage.getItem("lumen_theme") || "light",
  appliedPromo: null,
  filters: {
    search: "",
    category: "all",
    maxPrice: 1500,
    minRating: 0,
    inStockOnly: false,
    sortBy: "featured",
    viewMode: "grid"
  },
  quickViewCurrentProduct: null,
  quickViewSelectedColor: null,
  quickViewSelectedSize: null
};

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initCurrency();
  initHeaderSearch();
  initFlashDealTimer();
  renderCategoriesGrid();
  renderProducts();
  renderReviews();
  updateCartBadge();
  updateWishlistBadge();
  setupEventListeners();
  setupChatWidget();
});

// ==========================================================================
// THEME & CURRENCY HANDLING
// ==========================================================================
function initTheme() {
  document.documentElement.setAttribute("data-theme", AppState.theme);
  const themeToggle = document.getElementById("themeToggleBtn");
  if (themeToggle) {
    themeToggle.innerHTML = AppState.theme === "dark" ? "☀️" : "🌙";
  }
}

function toggleTheme() {
  AppState.theme = AppState.theme === "dark" ? "light" : "dark";
  localStorage.setItem("lumen_theme", AppState.theme);
  initTheme();
  showToast("Theme Updated", `Switched to ${AppState.theme} mode`, "🌓");
}

function initCurrency() {
  const currencySelect = document.getElementById("currencySelector");
  if (currencySelect) {
    currencySelect.value = AppState.currency;
    currencySelect.addEventListener("change", (e) => {
      AppState.currency = e.target.value;
      localStorage.setItem("lumen_currency", AppState.currency);
      renderProducts();
      renderCart();
      renderWishlist();
      showToast("Currency Changed", `Prices converted to ${AppState.currency}`, "💱");
    });
  }
}

function formatPrice(amountInUSD) {
  const config = CURRENCIES[AppState.currency] || CURRENCIES.USD;
  const converted = amountInUSD * config.rate;
  return `${config.symbol}${converted.toFixed(2)}`;
}

// ==========================================================================
// TOAST NOTIFICATIONS
// ==========================================================================
function showToast(title, message, icon = "✨") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(15px)";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================================================
// HEADER LIVE SEARCH & AUTO-SUGGEST
// ==========================================================================
function initHeaderSearch() {
  const searchInput = document.getElementById("mainSearchInput");
  const searchClear = document.getElementById("searchClearBtn");
  const searchDropdown = document.getElementById("searchDropdown");

  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();
    AppState.filters.search = query;

    if (query.length > 0) {
      searchClear.classList.add("active");
      const matched = AppState.products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.categoryName.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
      renderSearchSuggestions(matched);
      searchDropdown.classList.add("active");
    } else {
      searchClear.classList.remove("active");
      searchDropdown.classList.remove("active");
    }
    renderProducts();
  });

  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    AppState.filters.search = "";
    searchClear.classList.remove("active");
    searchDropdown.classList.remove("active");
    renderProducts();
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".header-search")) {
      searchDropdown.classList.remove("active");
    }
  });
}

function renderSearchSuggestions(results) {
  const dropdown = document.getElementById("searchDropdown");
  if (!dropdown) return;

  if (results.length === 0) {
    dropdown.innerHTML = `<div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.875rem;">No products match your search</div>`;
    return;
  }

  dropdown.innerHTML = results.slice(0, 5).map(prod => `
    <div class="search-result-item" onclick="openQuickView('${prod.id}')">
      <img src="${prod.image}" alt="${prod.name}" class="search-result-img" />
      <div class="search-result-info">
        <div class="search-result-title">${prod.name}</div>
        <div class="search-result-price">${formatPrice(prod.price)}</div>
      </div>
      <span class="badge badge-new" style="font-size: 0.65rem;">${prod.categoryName}</span>
    </div>
  `).join("");
}

// ==========================================================================
// FLASH DEAL TICKING COUNTDOWN
// ==========================================================================
function initFlashDealTimer() {
  const hoursEl = document.getElementById("dealHours");
  const minsEl = document.getElementById("dealMins");
  const secsEl = document.getElementById("dealSecs");

  if (!hoursEl) return;

  // 9 hours 45 mins countdown simulation
  let totalSeconds = 9 * 3600 + 45 * 60 + 18;

  setInterval(() => {
    if (totalSeconds <= 0) totalSeconds = 12 * 3600;
    totalSeconds--;

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    hoursEl.textContent = String(h).padStart(2, "0");
    minsEl.textContent = String(m).padStart(2, "0");
    secsEl.textContent = String(s).padStart(2, "0");
  }, 1000);
}

// ==========================================================================
// CATEGORY SHOWCASE RENDERING
// ==========================================================================
function renderCategoriesGrid() {
  const grid = document.getElementById("categoriesGrid");
  if (!grid) return;

  const categories = [
    { id: "all", name: "All Essentials", count: AppState.products.length, image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&auto=format&fit=crop&q=80" },
    { id: "audio", name: "Audio & Sound", count: 3, image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80" },
    { id: "wearables", name: "Smart Watches", count: 2, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80" },
    { id: "fashion", name: "Apparel & Gear", count: 3, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80" },
    { id: "electronics", name: "Tech & Cameras", count: 2, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80" }
  ];

  grid.innerHTML = categories.map(cat => `
    <div class="category-card" onclick="filterByCategory('${cat.id}')">
      <img src="${cat.image}" alt="${cat.name}" class="category-card-bg" />
      <div class="category-card-overlay"></div>
      <div class="category-card-content">
        <h4 class="category-card-title">${cat.name}</h4>
        <div class="category-card-items">${cat.count} items</div>
      </div>
    </div>
  `).join("");
}

function filterByCategory(categoryId) {
  AppState.filters.category = categoryId;

  // Update chip active states
  document.querySelectorAll(".filter-chip-item").forEach(el => {
    if (el.getAttribute("data-category") === categoryId) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  });

  renderProducts();

  const catalogSec = document.getElementById("catalogSection");
  if (catalogSec) {
    catalogSec.scrollIntoView({ behavior: "smooth" });
  }
}

// ==========================================================================
// PRODUCTS RENDERING & FILTERING
// ==========================================================================
function renderProducts() {
  const grid = document.getElementById("productsGrid");
  const countEl = document.getElementById("catalogCount");
  if (!grid) return;

  // Filtering pipeline
  let filtered = AppState.products.filter(item => {
    // Category match
    if (AppState.filters.category !== "all" && item.category !== AppState.filters.category) {
      return false;
    }
    // Search match
    if (AppState.filters.search) {
      const q = AppState.filters.search.toLowerCase();
      const match = item.name.toLowerCase().includes(q) ||
                    item.categoryName.toLowerCase().includes(q) ||
                    item.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    // Price match
    if (item.price > AppState.filters.maxPrice) {
      return false;
    }
    // Rating match
    if (AppState.filters.minRating > 0 && item.rating < AppState.filters.minRating) {
      return false;
    }
    // Stock status
    if (AppState.filters.inStockOnly && item.stock <= 0) {
      return false;
    }
    return true;
  });

  // Sorting
  switch (AppState.filters.sortBy) {
    case "price-low":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "reviews":
      filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
      break;
    default:
      // featured
      break;
  }

  if (countEl) countEl.textContent = filtered.length;

  // Empty state
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-catalog">
        <div class="empty-icon">🔍</div>
        <h3>No matching products found</h3>
        <p style="color: var(--text-muted); margin-top: 0.5rem; font-size: 0.9rem;">
          Try adjusting your search terms, price filters, or category.
        </p>
        <button class="btn btn-primary" style="margin-top: 1.25rem;" onclick="resetAllFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  grid.className = `products-grid ${AppState.filters.viewMode === "list" ? "list-view" : ""}`;

  grid.innerHTML = filtered.map(product => {
    const isWishlisted = AppState.wishlist.includes(product.id);
    const stockClass = product.stock <= 5 ? "low" : "in";
    const stockText = product.stock <= 5 ? `Only ${product.stock} left in stock!` : "In Stock";

    return `
      <div class="product-card" id="card-${product.id}">
        <div class="product-image-container">
          <img src="${product.image}" alt="${product.name}" class="product-thumb" loading="lazy" />
          <div class="product-badges">
            ${product.badge ? `<span class="badge badge-${product.badgeType || 'hot'}">${product.badge}</span>` : ""}
          </div>
          <button class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" 
                  onclick="toggleWishlist('${product.id}')" 
                  title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}">
            ${isWishlisted ? '♥' : '♡'}
          </button>
          <button class="quick-view-overlay-btn" onclick="openQuickView('${product.id}')">
            Quick View
          </button>
        </div>

        <div class="product-details">
          <div class="product-category-row">
            <span class="product-category">${product.categoryName}</span>
            <span class="product-stock-tag ${stockClass}">● ${stockText}</span>
          </div>

          <h3 class="product-title" onclick="openQuickView('${product.id}')">${product.name}</h3>
          <p class="product-tagline">${product.tagline}</p>

          <div class="product-rating">
            <span class="star-icon">★</span>
            <span class="rating-score">${product.rating}</span>
            <span class="review-count">(${product.reviewsCount} reviews)</span>
          </div>

          <div class="product-swatches">
            ${product.colors.map(col => `
              <span class="swatch-circle" style="background-color: ${col.hex};" title="${col.name}"></span>
            `).join("")}
          </div>

          <div class="product-footer">
            <div class="price-wrapper">
              <span class="product-price">${formatPrice(product.price)}</span>
              ${product.originalPrice ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ""}
            </div>
            <button class="btn btn-primary add-cart-btn" onclick="addToCart('${product.id}')">
              <span>+ Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function resetAllFilters() {
  AppState.filters.search = "";
  AppState.filters.category = "all";
  AppState.filters.maxPrice = 1500;
  AppState.filters.minRating = 0;
  AppState.filters.inStockOnly = false;
  AppState.filters.sortBy = "featured";

  const searchInput = document.getElementById("mainSearchInput");
  if (searchInput) searchInput.value = "";
  const priceSlider = document.getElementById("priceSlider");
  if (priceSlider) priceSlider.value = 1500;
  const priceMaxLabel = document.getElementById("priceMaxVal");
  if (priceMaxLabel) priceMaxLabel.textContent = formatPrice(1500);

  document.querySelectorAll(".rating-item input").forEach(r => r.checked = false);
  const stockCheckbox = document.getElementById("inStockOnlyCheckbox");
  if (stockCheckbox) stockCheckbox.checked = false;

  filterByCategory("all");
  showToast("Filters Cleared", "Displaying full catalog", "🔄");
}

// ==========================================================================
// QUICK VIEW MODAL
// ==========================================================================
function openQuickView(productId) {
  const product = AppState.products.find(p => p.id === productId);
  if (!product) return;

  AppState.quickViewCurrentProduct = product;
  AppState.quickViewSelectedColor = product.colors[0]?.name || "";
  AppState.quickViewSelectedSize = product.sizes[0] || "";

  const modal = document.getElementById("quickViewModal");
  const modalContent = document.getElementById("quickViewContent");

  modalContent.innerHTML = `
    <div class="quick-view-grid">
      <div class="modal-gallery">
        <img src="${product.gallery[0]}" alt="${product.name}" id="mainModalImg" class="modal-gallery-main" />
        <div class="modal-gallery-thumbs">
          ${product.gallery.map((img, idx) => `
            <img src="${img}" class="modal-thumb ${idx === 0 ? 'active' : ''}" 
                 onclick="switchModalImg('${img}', this)" />
          `).join("")}
        </div>
      </div>

      <div class="modal-product-info">
        <span class="badge badge-${product.badgeType || 'hot'}" style="margin-bottom: 0.5rem;">${product.badge || product.categoryName}</span>
        <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem;">${product.name}</h2>
        <div class="product-rating" style="margin-bottom: 0.75rem;">
          <span class="star-icon">★</span>
          <span class="rating-score">${product.rating}</span>
          <span class="review-count">(${product.reviewsCount} customer reviews)</span>
        </div>

        <div style="font-size: 1.6rem; font-weight: 800; color: var(--primary); margin-bottom: 1rem;">
          ${formatPrice(product.price)}
          ${product.originalPrice ? `<span style="font-size: 1rem; text-decoration: line-through; color: var(--text-subtle); margin-left: 0.5rem;">${formatPrice(product.originalPrice)}</span>` : ""}
        </div>

        <p style="font-size: 0.875rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.25rem;">
          ${product.description}
        </p>

        <!-- Color Selector -->
        <div class="variant-picker">
          <div class="variant-title">Color: <span id="selectedColorName" style="color: var(--primary); font-weight: 700;">${AppState.quickViewSelectedColor}</span></div>
          <div class="variant-options">
            ${product.colors.map((c, i) => `
              <button class="variant-btn ${i === 0 ? 'active' : ''}" onclick="selectModalColor('${c.name}', this)">
                <span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:${c.hex}; margin-right:4px;"></span>
                ${c.name}
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Size / Option Selector -->
        <div class="variant-picker">
          <div class="variant-title">Configuration / Size: <span id="selectedSizeName" style="color: var(--primary); font-weight: 700;">${AppState.quickViewSelectedSize}</span></div>
          <div class="variant-options">
            ${product.sizes.map((s, i) => `
              <button class="variant-btn ${i === 0 ? 'active' : ''}" onclick="selectModalSize('${s}', this)">
                ${s}
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Specifications Snippet -->
        <div style="background: var(--bg-subtle); padding: 0.85rem; border-radius: var(--radius-md); margin-bottom: 1.5rem; font-size: 0.8125rem;">
          ${Object.entries(product.specs).map(([key, val]) => `
            <div style="display: flex; justify-content: space-between; padding: 0.25rem 0; border-bottom: 1px dashed var(--border-subtle);">
              <span style="color: var(--text-muted);">${key}:</span>
              <strong>${val}</strong>
            </div>
          `).join("")}
        </div>

        <div style="display: flex; gap: 0.75rem;">
          <button class="btn btn-primary" style="flex: 1;" onclick="addQuickViewToCart()">
            🛒 Add to Cart
          </button>
          <button class="btn btn-secondary" onclick="toggleWishlist('${product.id}')">
            ♥ Save
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add("active");
}

function switchModalImg(src, thumbEl) {
  document.getElementById("mainModalImg").src = src;
  document.querySelectorAll(".modal-thumb").forEach(t => t.classList.remove("active"));
  thumbEl.classList.add("active");
}

function selectModalColor(colorName, btn) {
  AppState.quickViewSelectedColor = colorName;
  document.getElementById("selectedColorName").textContent = colorName;
  btn.parentElement.querySelectorAll(".variant-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

function selectModalSize(sizeName, btn) {
  AppState.quickViewSelectedSize = sizeName;
  document.getElementById("selectedSizeName").textContent = sizeName;
  btn.parentElement.querySelectorAll(".variant-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

function addQuickViewToCart() {
  if (!AppState.quickViewCurrentProduct) return;
  addToCart(
    AppState.quickViewCurrentProduct.id,
    AppState.quickViewSelectedColor,
    AppState.quickViewSelectedSize
  );
  closeModal("quickViewModal");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("active");
}

// ==========================================================================
// SHOPPING CART (DRAWER & LOGIC)
// ==========================================================================
function addToCart(productId, customColor, customSize) {
  const product = AppState.products.find(p => p.id === productId);
  if (!product) return;

  const color = customColor || product.colors[0]?.name || "Standard";
  const size = customSize || product.sizes[0] || "Standard";

  const existingIndex = AppState.cart.findIndex(
    item => item.id === productId && item.color === color && item.size === size
  );

  if (existingIndex > -1) {
    AppState.cart[existingIndex].qty += 1;
  } else {
    AppState.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      color: color,
      size: size,
      qty: 1
    });
  }

  saveCart();
  renderCart();
  updateCartBadge();
  openCartDrawer();
  showToast("Added to Cart", `${product.name} (${color})`, "🛍️");
}

function updateCartQty(index, delta) {
  if (!AppState.cart[index]) return;
  AppState.cart[index].qty += delta;
  if (AppState.cart[index].qty <= 0) {
    AppState.cart.splice(index, 1);
  }
  saveCart();
  renderCart();
  updateCartBadge();
}

function removeCartItem(index) {
  const item = AppState.cart[index];
  if (!item) return;
  AppState.cart.splice(index, 1);
  saveCart();
  renderCart();
  updateCartBadge();
  showToast("Item Removed", `${item.name} was removed`, "🗑️");
}

function saveCart() {
  localStorage.setItem("lumen_cart", JSON.stringify(AppState.cart));
}

function updateCartBadge() {
  const count = AppState.cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById("cartBadgeCount");
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
  }
}

function renderCart() {
  const listEl = document.getElementById("cartItemsList");
  const subtotalEl = document.getElementById("cartSubtotal");
  const discountRow = document.getElementById("cartDiscountRow");
  const discountVal = document.getElementById("cartDiscountVal");
  const shippingVal = document.getElementById("cartShippingVal");
  const totalEl = document.getElementById("cartTotal");
  const freeShipBar = document.getElementById("freeShippingMeter");
  const freeShipText = document.getElementById("freeShippingText");

  if (!listEl) return;

  if (AppState.cart.length === 0) {
    listEl.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🛍️</div>
        <h4>Your Shopping Cart is Empty</h4>
        <p style="font-size: 0.85rem; margin: 0.5rem 0 1.25rem;">Looks like you haven't added anything yet.</p>
        <button class="btn btn-primary" onclick="closeCartDrawer()">Start Shopping</button>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = formatPrice(0);
    if (totalEl) totalEl.textContent = formatPrice(0);
    if (freeShipBar) freeShipBar.style.width = "0%";
    if (freeShipText) freeShipText.innerHTML = `Add <strong>${formatPrice(75)}</strong> more for <strong>FREE Express Shipping</strong>!`;
    return;
  }

  // Render items
  listEl.innerHTML = AppState.cart.map((item, idx) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-thumb" />
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-variant">${item.color} • ${item.size}</div>
        <div class="cart-item-bottom">
          <div class="qty-stepper">
            <button class="qty-btn" onclick="updateCartQty(${idx}, -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="updateCartQty(${idx}, 1)">+</button>
          </div>
          <div style="display: flex; align-items: center;">
            <span class="cart-item-price">${formatPrice(item.price * item.qty)}</span>
            <span class="cart-item-remove" onclick="removeCartItem(${idx})" title="Remove item">✕</span>
          </div>
        </div>
      </div>
    </div>
  `).join("");

  // Subtotal & Free Shipping Progress
  const subtotal = AppState.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const freeShippingThreshold = 75;
  const remainingForFreeShip = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (freeShipBar) freeShipBar.style.width = `${progressPercent}%`;
  if (freeShipText) {
    if (remainingForFreeShip === 0) {
      freeShipText.innerHTML = `🎉 <strong>Congratulations!</strong> You qualified for <strong>FREE Express Shipping!</strong>`;
    } else {
      freeShipText.innerHTML = `Add <strong>${formatPrice(remainingForFreeShip)}</strong> more for <strong>FREE Express Shipping</strong>!`;
    }
  }

  // Calculations
  let discount = 0;
  if (AppState.appliedPromo) {
    if (AppState.appliedPromo.discountPercent) {
      discount = (subtotal * AppState.appliedPromo.discountPercent) / 100;
    }
  }

  let shippingCost = (subtotal >= freeShippingThreshold || AppState.appliedPromo?.freeShipping) ? 0 : 9.99;
  const total = Math.max(0, subtotal - discount + shippingCost);

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (shippingVal) shippingVal.textContent = shippingCost === 0 ? "FREE" : formatPrice(shippingCost);

  if (discount > 0 && discountRow && discountVal) {
    discountRow.style.display = "flex";
    discountVal.textContent = `-${formatPrice(discount)}`;
  } else if (discountRow) {
    discountRow.style.display = "none";
  }

  if (totalEl) totalEl.textContent = formatPrice(total);
}

function applyCoupon() {
  const input = document.getElementById("couponInput");
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (PROMO_CODES[code]) {
    AppState.appliedPromo = PROMO_CODES[code];
    renderCart();
    showToast("Promo Code Applied", PROMO_CODES[code].description, "🏷️");
  } else {
    showToast("Invalid Promo", "Try codes SAVE20 or WELCOME10", "⚠️");
  }
}

function openCartDrawer() {
  renderCart();
  const drawer = document.getElementById("cartDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  if (drawer && backdrop) {
    backdrop.classList.add("active");
    drawer.classList.add("active");
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  if (drawer && backdrop) {
    backdrop.classList.remove("active");
    drawer.classList.remove("active");
  }
}

// ==========================================================================
// WISHLIST FUNCTIONALITY
// ==========================================================================
function toggleWishlist(productId) {
  const index = AppState.wishlist.indexOf(productId);
  const product = AppState.products.find(p => p.id === productId);

  if (index > -1) {
    AppState.wishlist.splice(index, 1);
    showToast("Removed from Wishlist", product ? product.name : "", "🤍");
  } else {
    AppState.wishlist.push(productId);
    showToast("Saved to Wishlist", product ? product.name : "", "❤️");
  }

  localStorage.setItem("lumen_wishlist", JSON.stringify(AppState.wishlist));
  updateWishlistBadge();
  renderProducts();
  renderWishlist();
}

function updateWishlistBadge() {
  const badge = document.getElementById("wishlistBadgeCount");
  if (badge) {
    badge.textContent = AppState.wishlist.length;
    badge.style.display = AppState.wishlist.length > 0 ? "flex" : "none";
  }
}

function openWishlistDrawer() {
  renderWishlist();
  const drawer = document.getElementById("wishlistDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  if (drawer && backdrop) {
    backdrop.classList.add("active");
    drawer.classList.add("active");
  }
}

function closeWishlistDrawer() {
  const drawer = document.getElementById("wishlistDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  if (drawer && backdrop) {
    backdrop.classList.remove("active");
    drawer.classList.remove("active");
  }
}

function renderWishlist() {
  const listEl = document.getElementById("wishlistItemsList");
  if (!listEl) return;

  const wishlistedProducts = AppState.products.filter(p => AppState.wishlist.includes(p.id));

  if (wishlistedProducts.length === 0) {
    listEl.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🤍</div>
        <h4>Your Wishlist is Empty</h4>
        <p style="font-size: 0.85rem; margin-top: 0.5rem;">Explore our curated gear and tap the heart icon to save favorites.</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = wishlistedProducts.map(p => `
    <div class="cart-item">
      <img src="${p.image}" alt="${p.name}" class="cart-item-thumb" />
      <div class="cart-item-info">
        <div class="cart-item-name">${p.name}</div>
        <div class="cart-item-variant">${p.categoryName}</div>
        <div class="cart-item-bottom">
          <span class="cart-item-price">${formatPrice(p.price)}</span>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-primary" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;" onclick="addToCart('${p.id}')">
              Move to Cart
            </button>
            <button class="btn btn-secondary" style="padding: 0.35rem 0.55rem; font-size: 0.75rem;" onclick="toggleWishlist('${p.id}')">
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

// ==========================================================================
// CHECKOUT EXPERIENCE (3-STEP MODAL)
// ==========================================================================
let currentCheckoutStep = 1;

function openCheckout() {
  if (AppState.cart.length === 0) {
    showToast("Empty Cart", "Add items to your cart before proceeding to checkout", "🛍️");
    return;
  }
  closeCartDrawer();
  currentCheckoutStep = 1;
  showCheckoutStep(1);

  // Populate checkout summary
  const subtotal = AppState.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  let discount = AppState.appliedPromo?.discountPercent ? (subtotal * AppState.appliedPromo.discountPercent) / 100 : 0;
  let shipping = (subtotal >= 75 || AppState.appliedPromo?.freeShipping) ? 0 : 9.99;
  let total = subtotal - discount + shipping;

  const checkoutSubtotal = document.getElementById("checkoutSubtotal");
  const checkoutShipping = document.getElementById("checkoutShipping");
  const checkoutTotal = document.getElementById("checkoutTotal");

  if (checkoutSubtotal) checkoutSubtotal.textContent = formatPrice(subtotal);
  if (checkoutShipping) checkoutShipping.textContent = shipping === 0 ? "FREE" : formatPrice(shipping);
  if (checkoutTotal) checkoutTotal.textContent = formatPrice(total);

  const modal = document.getElementById("checkoutModal");
  if (modal) modal.classList.add("active");
}

function showCheckoutStep(step) {
  currentCheckoutStep = step;
  document.querySelectorAll(".checkout-step").forEach((el, idx) => {
    if (idx + 1 === step) el.classList.add("active");
    else el.classList.remove("active");
  });

  const step1 = document.getElementById("checkoutStep1");
  const step2 = document.getElementById("checkoutStep2");
  const step3 = document.getElementById("checkoutStep3");

  if (step1) step1.style.display = step === 1 ? "block" : "none";
  if (step2) step2.style.display = step === 2 ? "block" : "none";
  if (step3) step3.style.display = step === 3 ? "block" : "none";
}

function nextCheckoutStep() {
  if (currentCheckoutStep === 1) {
    // Validate inputs
    const fname = document.getElementById("shippingName")?.value;
    const address = document.getElementById("shippingAddress")?.value;
    if (!fname || !address) {
      showToast("Required Fields", "Please enter your name and delivery address", "⚠️");
      return;
    }
    showCheckoutStep(2);
  } else if (currentCheckoutStep === 2) {
    processOrderPlacement();
  }
}

function prevCheckoutStep() {
  if (currentCheckoutStep > 1) {
    showCheckoutStep(currentCheckoutStep - 1);
  }
}

function processOrderPlacement() {
  const newOrderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
  const subtotal = AppState.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  let discount = AppState.appliedPromo?.discountPercent ? (subtotal * AppState.appliedPromo.discountPercent) / 100 : 0;
  let shipping = (subtotal >= 75 || AppState.appliedPromo?.freeShipping) ? 0 : 9.99;
  let finalTotal = subtotal - discount + shipping;

  const newOrder = {
    id: newOrderId,
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    status: "Processing",
    carrier: "DHL Express",
    trackingNumber: `DHL-${Math.floor(100000000 + Math.random() * 900000000)}US`,
    total: finalTotal,
    items: [...AppState.cart],
    shippingAddress: document.getElementById("shippingAddress")?.value || "Springfield, OR"
  };

  AppState.orders.unshift(newOrder);
  localStorage.setItem("lumen_orders", JSON.stringify(AppState.orders));

  // Display confirmation receipt
  const receiptOrderId = document.getElementById("receiptOrderId");
  const receiptTotal = document.getElementById("receiptTotal");
  if (receiptOrderId) receiptOrderId.textContent = newOrderId;
  if (receiptTotal) receiptTotal.textContent = formatPrice(finalTotal);

  // Clear cart
  AppState.cart = [];
  AppState.appliedPromo = null;
  saveCart();
  updateCartBadge();

  showCheckoutStep(3);
  showToast("Order Confirmed!", `Order #${newOrderId} is now being prepared`, "🎉");
}

// ==========================================================================
// ORDER TRACKING & HISTORY MODAL
// ==========================================================================
function openOrdersModal() {
  const modal = document.getElementById("ordersModal");
  const listEl = document.getElementById("ordersList");
  if (!modal || !listEl) return;

  if (AppState.orders.length === 0) {
    listEl.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--text-muted);">No orders found.</div>`;
  } else {
    listEl.innerHTML = AppState.orders.map(order => `
      <div style="background: var(--bg-subtle); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1rem; border: 1px solid var(--border-subtle);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <div>
            <strong>Order #${order.id}</strong>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${order.date}</div>
          </div>
          <span class="badge badge-sale">${order.status}</span>
        </div>

        <div style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 0.75rem;">
          <div>Carrier: <strong>${order.carrier}</strong> (Tracking: <code>${order.trackingNumber}</code>)</div>
          <div>Ship to: ${order.shippingAddress}</div>
        </div>

        <div style="border-top: 1px dashed var(--border-subtle); padding-top: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 0.8125rem; font-weight: 700;">Total: ${formatPrice(order.total)}</div>
          <button class="btn btn-secondary" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;" onclick="trackLiveOrder('${order.id}')">
            📍 Track Live Status
          </button>
        </div>
      </div>
    `).join("");
  }

  modal.classList.add("active");
}

function trackLiveOrder(orderId) {
  const order = AppState.orders.find(o => o.id === orderId);
  if (!order) return;

  alert(`Live Shipment Tracking for ${order.id}:\n\n` +
        `• Carrier: ${order.carrier}\n` +
        `• Tracking Code: ${order.trackingNumber}\n` +
        `• Current Status: Out for regional distribution\n` +
        `• Estimated Delivery: In 2 Business Days\n` +
        `• Destination: ${order.shippingAddress}`);
}

// ==========================================================================
// REVIEWS & TESTIMONIALS
// ==========================================================================
function renderReviews() {
  const container = document.getElementById("reviewsGrid");
  if (!container) return;

  container.innerHTML = AppState.reviews.map(r => `
    <div class="review-card">
      <div class="reviewer-meta">
        <img src="${r.avatar}" alt="${r.author}" class="reviewer-avatar" />
        <div>
          <div class="reviewer-name">${r.author}</div>
          <div class="verified-tag">✓ Verified Buyer</div>
        </div>
      </div>
      <div class="review-stars">
        ${"★".repeat(Math.floor(r.rating))} (${r.rating})
      </div>
      <div class="review-title">"${r.title}"</div>
      <div class="review-comment">${r.comment}</div>
      <div class="review-product-link">Purchased: ${r.productName}</div>
    </div>
  `).join("");
}

function openAddReviewModal() {
  const modal = document.getElementById("addReviewModal");
  const productSelect = document.getElementById("reviewProductSelect");
  if (productSelect) {
    productSelect.innerHTML = AppState.products.map(p => `
      <option value="${p.name}">${p.name}</option>
    `).join("");
  }
  if (modal) modal.classList.add("active");
}

function submitNewReview(e) {
  e.preventDefault();
  const name = document.getElementById("reviewerName")?.value;
  const rating = parseFloat(document.getElementById("reviewerRating")?.value || 5);
  const title = document.getElementById("reviewTitle")?.value;
  const comment = document.getElementById("reviewComment")?.value;
  const productName = document.getElementById("reviewProductSelect")?.value;

  if (!name || !title || !comment) {
    showToast("Missing Information", "Please fill in all review fields", "⚠️");
    return;
  }

  const newRev = {
    id: `rev-${Date.now()}`,
    author: name,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    rating: rating,
    date: "Just now",
    verified: true,
    productName: productName,
    title: title,
    comment: comment
  };

  AppState.reviews.unshift(newRev);
  localStorage.setItem("lumen_reviews", JSON.stringify(AppState.reviews));
  renderReviews();
  closeModal("addReviewModal");
  showToast("Review Published!", "Thank you for your valuable feedback", "🌟");
}

// ==========================================================================
// LIVE CHAT CONCIERGE ASSISTANT
// ==========================================================================
function setupChatWidget() {
  const chatToggle = document.getElementById("chatWidgetToggle");
  const chatPanel = document.getElementById("chatPanel");
  const chatClose = document.getElementById("chatCloseBtn");
  const chatSend = document.getElementById("chatSendBtn");
  const chatInput = document.getElementById("chatInput");

  if (!chatToggle || !chatPanel) return;

  chatToggle.addEventListener("click", () => {
    chatPanel.classList.toggle("active");
  });

  if (chatClose) {
    chatClose.addEventListener("click", () => {
      chatPanel.classList.remove("active");
    });
  }

  if (chatSend && chatInput) {
    const sendMessage = () => {
      const txt = chatInput.value.trim();
      if (!txt) return;
      appendChatMessage("user", txt);
      chatInput.value = "";
      simulateBotReply(txt);
    };

    chatSend.addEventListener("click", sendMessage);
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  }
}

function appendChatMessage(sender, text) {
  const messagesContainer = document.getElementById("chatMessages");
  if (!messagesContainer) return;

  const msgDiv = document.createElement("div");
  msgDiv.className = `chat-msg ${sender}`;
  msgDiv.textContent = text;
  messagesContainer.appendChild(msgDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function handleQuickChatPill(topic) {
  appendChatMessage("user", topic);
  simulateBotReply(topic);
}

function simulateBotReply(userQuery) {
  const q = userQuery.toLowerCase();
  let reply = "I'm your Lumen AI Concierge! I can help you with product recommendations, discount coupons, or shipping information.";

  if (q.includes("discount") || q.includes("promo") || q.includes("coupon")) {
    reply = "Use coupon code 'SAVE20' at checkout for 20% off your entire order, or 'WELCOME10' for 10% off!";
  } else if (q.includes("shipping") || q.includes("delivery")) {
    reply = "We offer free Express Worldwide Shipping on all orders over $75. Typical delivery takes 2 to 4 business days.";
  } else if (q.includes("track") || q.includes("order")) {
    reply = "You can view and track your orders in real-time by clicking the Account or Orders icon in the top header!";
  } else if (q.includes("return") || q.includes("warranty")) {
    reply = "All products come with a 30-Day Hassle-Free Money-Back Guarantee and a 2-Year Official Manufacturer Warranty.";
  } else if (q.includes("headphones") || q.includes("audio")) {
    reply = "Our #1 best-selling product is the Aura Pro Wireless ANC Headphones with 45-hour battery life and spatial audio!";
  }

  setTimeout(() => {
    appendChatMessage("bot", reply);
  }, 500);
}

// ==========================================================================
// EVENT LISTENERS & SETUP
// ==========================================================================
function setupEventListeners() {
  // Theme toggle
  const themeToggle = document.getElementById("themeToggleBtn");
  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);

  // Price Slider
  const priceSlider = document.getElementById("priceSlider");
  const priceMaxLabel = document.getElementById("priceMaxVal");
  if (priceSlider && priceMaxLabel) {
    priceSlider.addEventListener("input", (e) => {
      AppState.filters.maxPrice = parseFloat(e.target.value);
      priceMaxLabel.textContent = formatPrice(AppState.filters.maxPrice);
      renderProducts();
    });
  }

  // Rating Filters
  document.querySelectorAll(".rating-item input").forEach(radio => {
    radio.addEventListener("change", (e) => {
      AppState.filters.minRating = parseFloat(e.target.value);
      renderProducts();
    });
  });

  // In Stock Filter
  const inStockCheckbox = document.getElementById("inStockOnlyCheckbox");
  if (inStockCheckbox) {
    inStockCheckbox.addEventListener("change", (e) => {
      AppState.filters.inStockOnly = e.target.checked;
      renderProducts();
    });
  }

  // Sort Select
  const sortSelect = document.getElementById("catalogSortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      AppState.filters.sortBy = e.target.value;
      renderProducts();
    });
  }

  // View Mode Toggles
  const gridViewBtn = document.getElementById("gridViewBtn");
  const listViewBtn = document.getElementById("listViewBtn");
  if (gridViewBtn && listViewBtn) {
    gridViewBtn.addEventListener("click", () => {
      AppState.filters.viewMode = "grid";
      gridViewBtn.classList.add("active");
      listViewBtn.classList.remove("active");
      renderProducts();
    });
    listViewBtn.addEventListener("click", () => {
      AppState.filters.viewMode = "list";
      listViewBtn.classList.add("active");
      gridViewBtn.classList.remove("active");
      renderProducts();
    });
  }

  // Newsletter Form
  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = document.getElementById("newsletterEmail");
      if (emailInput && emailInput.value) {
        showToast("Subscribed!", "Check your inbox for coupon code WELCOME10", "💌");
        emailInput.value = "";
      }
    });
  }

  // Backdrop click to close drawers
  const backdrop = document.getElementById("drawerBackdrop");
  if (backdrop) {
    backdrop.addEventListener("click", () => {
      closeCartDrawer();
      closeWishlistDrawer();
    });
  }
}
