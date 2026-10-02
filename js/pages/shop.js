/**
 * LUMEN LUXE - Shop / Catalog Page Controller
 * Supports faceted search, category filtering, price sliders, sorting, and URL search params.
 */

const ShopPage = {
  state: {
    category: "all",
    search: "",
    maxPrice: 1500,
    minRating: 0,
    inStockOnly: false,
    sortBy: "featured",
    viewMode: "grid"
  },

  init() {
    HeaderComponent.init();
    ChatWidget.init();

    this.parseURLParams();
    this.bindControls();
    this.render();

    window.addEventListener("currency:changed", () => this.render());
  },

  parseURLParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("category")) this.state.category = params.get("category");
    if (params.has("q")) this.state.search = params.get("q");
    if (params.has("sort")) this.state.sortBy = params.get("sort");
    if (params.has("maxPrice")) this.state.maxPrice = parseFloat(params.get("maxPrice")) || 1500;
  },

  syncURLParams() {
    const params = new URLSearchParams();
    if (this.state.category !== "all") params.set("category", this.state.category);
    if (this.state.search) params.set("q", this.state.search);
    if (this.state.sortBy !== "featured") params.set("sort", this.state.sortBy);
    if (this.state.maxPrice < 1500) params.set("maxPrice", this.state.maxPrice);

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  },

  bindControls() {
    // Category chips
    document.querySelectorAll(".filter-chip-item").forEach(chip => {
      const cat = chip.getAttribute("data-category");
      if (cat === this.state.category) chip.classList.add("active");
      else chip.classList.remove("active");

      chip.addEventListener("click", () => {
        this.state.category = cat;
        document.querySelectorAll(".filter-chip-item").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        this.syncURLParams();
        this.render();
      });
    });

    // Price Slider
    const priceSlider = document.getElementById("priceSlider");
    const priceMaxVal = document.getElementById("priceMaxVal");
    if (priceSlider && priceMaxVal) {
      priceSlider.value = this.state.maxPrice;
      priceMaxVal.textContent = CurrencyManager.format(this.state.maxPrice);

      priceSlider.addEventListener("input", (e) => {
        this.state.maxPrice = parseFloat(e.target.value);
        priceMaxVal.textContent = CurrencyManager.format(this.state.maxPrice);
        this.syncURLParams();
        this.render();
      });
    }

    // Rating Filter
    document.querySelectorAll(".rating-item input").forEach(radio => {
      radio.addEventListener("change", (e) => {
        this.state.minRating = parseFloat(e.target.value);
        this.render();
      });
    });

    // In Stock Only Checkbox
    const stockCheck = document.getElementById("inStockOnlyCheckbox");
    if (stockCheck) {
      stockCheck.addEventListener("change", (e) => {
        this.state.inStockOnly = e.target.checked;
        this.render();
      });
    }

    // Sorting Dropdown
    const sortSelect = document.getElementById("catalogSortSelect");
    if (sortSelect) {
      sortSelect.value = this.state.sortBy;
      sortSelect.addEventListener("change", (e) => {
        this.state.sortBy = e.target.value;
        this.syncURLParams();
        this.render();
      });
    }

    // View Toggles
    const gridBtn = document.getElementById("gridViewBtn");
    const listBtn = document.getElementById("listViewBtn");
    if (gridBtn && listBtn) {
      gridBtn.addEventListener("click", () => {
        this.state.viewMode = "grid";
        gridBtn.classList.add("active");
        listBtn.classList.remove("active");
        this.render();
      });
      listBtn.addEventListener("click", () => {
        this.state.viewMode = "list";
        listBtn.classList.add("active");
        gridBtn.classList.remove("active");
        this.render();
      });
    }

    // Search header fill
    const mainSearchInput = document.getElementById("mainSearchInput");
    if (mainSearchInput && this.state.search) {
      mainSearchInput.value = this.state.search;
    }
  },

  resetFilters() {
    this.state.category = "all";
    this.state.search = "";
    this.state.maxPrice = 1500;
    this.state.minRating = 0;
    this.state.inStockOnly = false;
    this.state.sortBy = "featured";

    document.querySelectorAll(".filter-chip-item").forEach(c => {
      c.classList.toggle("active", c.getAttribute("data-category") === "all");
    });

    const priceSlider = document.getElementById("priceSlider");
    const priceMaxVal = document.getElementById("priceMaxVal");
    if (priceSlider) priceSlider.value = 1500;
    if (priceMaxVal) priceMaxVal.textContent = CurrencyManager.format(1500);

    document.querySelectorAll(".rating-item input").forEach(r => r.checked = false);
    const stockCheck = document.getElementById("inStockOnlyCheckbox");
    if (stockCheck) stockCheck.checked = false;

    const sortSelect = document.getElementById("catalogSortSelect");
    if (sortSelect) sortSelect.value = "featured";

    const mainSearchInput = document.getElementById("mainSearchInput");
    if (mainSearchInput) mainSearchInput.value = "";

    this.syncURLParams();
    this.render();
    Toast.show("Filters Cleared", "Showing all catalog items", "🔄");
  },

  render() {
    const grid = document.getElementById("productsGrid");
    const countEl = document.getElementById("catalogCount");
    if (!grid) return;

    let items = PRODUCTS_DATA.filter(item => {
      if (this.state.category !== "all" && item.category !== this.state.category) return false;
      if (this.state.search) {
        const q = this.state.search.toLowerCase();
        const m = item.name.toLowerCase().includes(q) ||
                  item.categoryName.toLowerCase().includes(q) ||
                  item.description.toLowerCase().includes(q);
        if (!m) return false;
      }
      if (item.price > this.state.maxPrice) return false;
      if (this.state.minRating > 0 && item.rating < this.state.minRating) return false;
      if (this.state.inStockOnly && item.stock <= 0) return false;
      return true;
    });

    switch (this.state.sortBy) {
      case "price-low":
        items.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        items.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        items.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        items.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
      default:
        break;
    }

    if (countEl) countEl.textContent = items.length;

    if (items.length === 0) {
      grid.innerHTML = `
        <div class="empty-catalog">
          <div style="font-size:3rem; margin-bottom:1rem;">🔍</div>
          <h3>No products match your active filters</h3>
          <p style="color:var(--text-muted); margin:0.5rem 0 1.5rem; font-size:0.9rem;">
            Try broadening your price range or clearing selected categories.
          </p>
          <button class="btn btn-primary" onclick="ShopPage.resetFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    grid.className = `products-grid ${this.state.viewMode === "list" ? "list-view" : ""}`;

    grid.innerHTML = items.map(p => {
      const isWishlisted = WishlistManager.has(p.id);
      const stockClass = p.stock <= 5 ? "low" : "in";
      const stockText = p.stock <= 5 ? `Only ${p.stock} left!` : "In Stock";

      return `
        <article class="product-card" id="card-${p.id}">
          <div class="product-image-container">
            <a href="product.html?id=${p.id}">
              <img src="${p.image}" alt="${p.name}" class="product-thumb" loading="lazy" />
            </a>
            <div class="product-badges">
              ${p.badge ? `<span class="badge badge-${p.badgeType || 'hot'}">${p.badge}</span>` : ""}
            </div>
            <button class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" 
                    onclick="toggleWishlistBtn('${p.id}', this)" 
                    title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}">
              ${isWishlisted ? '♥' : '♡'}
            </button>
            <button class="quick-view-overlay-btn" onclick="QuickViewModal.open('${p.id}')">
              Quick View
            </button>
          </div>

          <div class="product-details">
            <div class="product-category-row">
              <span class="product-category">${p.categoryName}</span>
              <span class="product-stock-tag ${stockClass}">● ${stockText}</span>
            </div>

            <h3 class="product-title">
              <a href="product.html?id=${p.id}">${p.name}</a>
            </h3>
            <p class="product-tagline">${p.tagline}</p>

            <div class="product-rating">
              <span class="star-icon">★</span>
              <span class="rating-score">${p.rating}</span>
              <span class="review-count">(${p.reviewsCount} reviews)</span>
            </div>

            <div class="product-swatches">
              ${p.colors.map(col => `
                <span class="swatch-circle" style="background-color: ${col.hex};" title="${col.name}"></span>
              `).join("")}
            </div>

            <div class="product-footer">
              <div>
                <span class="product-price">${CurrencyManager.format(p.price)}</span>
                ${p.originalPrice ? `<span class="original-price">${CurrencyManager.format(p.originalPrice)}</span>` : ""}
              </div>
              <button class="btn btn-primary btn-sm" onclick="CartManager.addItem('${p.id}')">
                <span>+ Add to Bag</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }
};

document.addEventListener("DOMContentLoaded", () => ShopPage.init());
