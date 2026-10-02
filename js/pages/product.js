/**
 * LUMEN LUXE - Product Details Page (PDP) Controller
 * Manages gallery zoom, variant selection, quantity, tabs, review submissions, and related items.
 */

const ProductPage = {
  product: null,
  selectedColor: null,
  selectedSize: null,
  selectedQty: 1,

  init() {
    HeaderComponent.init();
    ChatWidget.init();

    this.loadProduct();
    this.render();
    this.renderTabs();
    this.renderRelated();

    window.addEventListener("currency:changed", () => {
      this.render();
      this.renderRelated();
    });
  },

  loadProduct() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    this.product = PRODUCTS_DATA.find(p => p.id === id) || PRODUCTS_DATA[0];

    this.selectedColor = this.product.colors[0]?.name || "Standard";
    this.selectedSize = this.product.sizes[0] || "Standard";
    this.selectedQty = 1;

    document.title = `${this.product.name} | LUMEN LUXE`;
  },

  render() {
    const p = this.product;
    if (!p) return;

    // Breadcrumbs
    const breadcrumbs = document.getElementById("pdpBreadcrumbs");
    if (breadcrumbs) {
      breadcrumbs.innerHTML = `
        <a href="index.html">Home</a>
        <span class="separator">/</span>
        <a href="shop.html">Shop</a>
        <span class="separator">/</span>
        <a href="shop.html?category=${p.category}">${p.categoryName}</a>
        <span class="separator">/</span>
        <span class="current">${p.name}</span>
      `;
    }

    // Gallery
    const galleryContainer = document.getElementById("pdpGalleryContainer");
    if (galleryContainer) {
      galleryContainer.innerHTML = `
        <img src="${p.gallery[0]}" alt="${p.name}" id="pdpMainImg" class="pdp-gallery-main" />
        <div class="pdp-gallery-thumbs">
          ${p.gallery.map((img, idx) => `
            <img src="${img}" alt="Thumbnail ${idx + 1}" class="pdp-thumb ${idx === 0 ? 'active' : ''}" 
                 onclick="ProductPage.switchImg('${img}', this)" />
          `).join("")}
        </div>
      `;
    }

    // Product Info Panel
    const infoPanel = document.getElementById("pdpInfoPanel");
    if (infoPanel) {
      const isWishlisted = WishlistManager.has(p.id);

      infoPanel.innerHTML = `
        <div class="pdp-sku">SKU: ${p.sku} • Category: ${p.categoryName}</div>
        <h1 style="font-size:2.25rem; font-weight:800; line-height:1.2;">${p.name}</h1>
        
        <div class="product-rating" style="margin-bottom:0.5rem;">
          <span class="star-icon">★</span>
          <span class="rating-score">${p.rating}</span>
          <span class="review-count">(${p.reviewsCount} verified customer ratings)</span>
        </div>

        <div class="pdp-price-row">
          <span class="pdp-current-price">${CurrencyManager.format(p.price)}</span>
          ${p.originalPrice ? `<span class="pdp-original-price">${CurrencyManager.format(p.originalPrice)}</span>` : ""}
          ${p.originalPrice ? `<span class="badge badge-sale">Save ${Math.round((1 - p.price / p.originalPrice) * 100)}%</span>` : ""}
        </div>

        <p style="color:var(--text-muted); font-size:1rem; line-height:1.6;">
          ${p.description}
        </p>

        <!-- Stock Status Tag -->
        <div style="font-size:0.875rem; font-weight:700; color:${p.stock <= 5 ? 'var(--warning)' : 'var(--success)'}; display:flex; align-items:center; gap:0.5rem;">
          <span>●</span>
          <span>${p.stock <= 5 ? `Urgent: Only ${p.stock} units remaining in warehouse!` : 'In Stock & Ready for Immediate Dispatch'}</span>
        </div>

        <!-- Color Swatch Chooser -->
        <div>
          <div style="font-size:0.875rem; font-weight:700; margin-bottom:0.5rem;">
            Finish: <span id="colorLabel" style="color:var(--primary);">${this.selectedColor}</span>
          </div>
          <div style="display:flex; gap:0.6rem;">
            ${p.colors.map((c, i) => `
              <button type="button" class="btn btn-secondary btn-sm ${i === 0 ? 'active' : ''}" 
                      style="border-radius:var(--radius-sm); border-color:${i === 0 ? 'var(--primary)' : 'var(--border-subtle)'};"
                      onclick="ProductPage.selectColor('${c.name}', this)">
                <span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:${c.hex}; margin-right:6px;"></span>
                ${c.name}
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Size / Variant Selector -->
        <div>
          <div style="font-size:0.875rem; font-weight:700; margin-bottom:0.5rem;">
            Option / Size: <span id="sizeLabel" style="color:var(--primary);">${this.selectedSize}</span>
          </div>
          <div style="display:flex; gap:0.6rem; flex-wrap:wrap;">
            ${p.sizes.map((s, i) => `
              <button type="button" class="btn btn-secondary btn-sm ${i === 0 ? 'active' : ''}" 
                      style="border-radius:var(--radius-sm); border-color:${i === 0 ? 'var(--primary)' : 'var(--border-subtle)'};"
                      onclick="ProductPage.selectSize('${s}', this)">
                ${s}
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Actions Row -->
        <div class="pdp-actions-row">
          <div class="qty-stepper">
            <button type="button" class="qty-btn" onclick="ProductPage.adjustQty(-1)">−</button>
            <input type="text" id="pdpQtyInput" class="qty-input" value="1" readonly />
            <button type="button" class="qty-btn" onclick="ProductPage.adjustQty(1)">+</button>
          </div>

          <button class="btn btn-primary" style="flex:1;" onclick="ProductPage.addToBag()">
            🛒 Add to Bag
          </button>

          <button class="btn btn-secondary" style="background:var(--primary); color:#ffffff;" onclick="ProductPage.buyNow()">
            ⚡ Buy Now
          </button>

          <button class="btn-icon" onclick="ProductPage.toggleWishlist(this)" title="Save to Wishlist">
            <span style="color:${isWishlisted ? 'var(--danger)' : 'inherit'}; font-size:1.2rem;">
              ${isWishlisted ? '♥' : '♡'}
            </span>
          </button>
        </div>

        <!-- Trust Badges List -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; border-top:1px solid var(--border-subtle); padding-top:1.25rem; margin-top:0.75rem; font-size:0.8125rem; color:var(--text-muted);">
          <div>✈️ Free Worldwide Shipping over $75</div>
          <div>🛡️ 30-Day Hassle-Free Returns</div>
          <div>🔒 Bank-Grade 256-Bit Encryption</div>
          <div>🏷️ 2-Year Official Warranty</div>
        </div>
      `;
    }
  },

  switchImg(src, thumbEl) {
    const main = document.getElementById("pdpMainImg");
    if (main) main.src = src;
    document.querySelectorAll(".pdp-thumb").forEach(t => t.classList.remove("active"));
    thumbEl.classList.add("active");
  },

  selectColor(name, btn) {
    this.selectedColor = name;
    document.getElementById("colorLabel").textContent = name;
    btn.parentElement.querySelectorAll("button").forEach(b => {
      b.classList.remove("active");
      b.style.borderColor = "var(--border-subtle)";
    });
    btn.classList.add("active");
    btn.style.borderColor = "var(--primary)";
  },

  selectSize(size, btn) {
    this.selectedSize = size;
    document.getElementById("sizeLabel").textContent = size;
    btn.parentElement.querySelectorAll("button").forEach(b => {
      b.classList.remove("active");
      b.style.borderColor = "var(--border-subtle)";
    });
    btn.classList.add("active");
    btn.style.borderColor = "var(--primary)";
  },

  adjustQty(delta) {
    this.selectedQty = Math.max(1, this.selectedQty + delta);
    const input = document.getElementById("pdpQtyInput");
    if (input) input.value = this.selectedQty;
  },

  addToBag() {
    CartManager.addItem(this.product.id, this.selectedColor, this.selectedSize, this.selectedQty);
  },

  buyNow() {
    CartManager.addItem(this.product.id, this.selectedColor, this.selectedSize, this.selectedQty);
    window.location.href = "checkout.html";
  },

  toggleWishlist(btn) {
    const added = WishlistManager.toggle(this.product.id);
    const span = btn.querySelector("span");
    if (span) {
      span.textContent = added ? "♥" : "♡";
      span.style.color = added ? "var(--danger)" : "inherit";
    }
  },

  renderTabs() {
    const container = document.getElementById("pdpTabsContainer");
    if (!container) return;

    const p = this.product;
    const reviews = Storage.get("reviews", REVIEWS_DATA);

    container.innerHTML = `
      <div class="pdp-tabs">
        <div class="pdp-tab-nav">
          <button class="pdp-tab-btn active" onclick="ProductPage.switchTab('desc', this)">Features & Highlights</button>
          <button class="pdp-tab-btn" onclick="ProductPage.switchTab('specs', this)">Technical Specs</button>
          <button class="pdp-tab-btn" onclick="ProductPage.switchTab('reviews', this)">Customer Reviews (${reviews.length})</button>
          <button class="pdp-tab-btn" onclick="ProductPage.switchTab('shipping', this)">Shipping & Warranty</button>
        </div>

        <div id="tabDesc" class="pdp-tab-content" style="display:block;">
          <h3 style="font-size:1.25rem; margin-bottom:1rem;">Key Performance Features</h3>
          <ul style="list-style:disc; padding-left:1.5rem; display:flex; flex-direction:column; gap:0.75rem; color:var(--text-muted); font-size:0.95rem;">
            ${p.features.map(f => `<li><strong>${f}</strong></li>`).join("")}
          </ul>
        </div>

        <div id="tabSpecs" class="pdp-tab-content" style="display:none;">
          <table class="pdp-specs-table">
            <tbody>
              ${Object.entries(p.specs).map(([k, v]) => `
                <tr>
                  <td>${k}</td>
                  <td><strong>${v}</strong></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <div id="tabReviews" class="pdp-tab-content" style="display:none;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:2rem;">
            <!-- Review submission form -->
            <div style="background:var(--bg-subtle); padding:1.5rem; border-radius:var(--radius-lg); border:1px solid var(--border-subtle);">
              <h4 style="font-size:1.1rem; margin-bottom:0.5rem;">Write a Review</h4>
              <p style="font-size:0.8125rem; color:var(--text-muted); margin-bottom:1rem;">Share your thoughts about this product.</p>
              
              <form onsubmit="ProductPage.submitReview(event)">
                <div class="form-group">
                  <label class="form-label">Your Name</label>
                  <input type="text" id="reviewAuthor" class="form-input" placeholder="e.g. Samuel K." required>
                </div>
                <div class="form-group">
                  <label class="form-label">Rating</label>
                  <select id="reviewRatingSelect" class="form-select">
                    <option value="5">★★★★★ (5 - Excellent)</option>
                    <option value="4">★★★★☆ (4 - Very Good)</option>
                    <option value="3">★★★☆☆ (3 - Average)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Review Headline</label>
                  <input type="text" id="reviewHeadline" class="form-input" placeholder="e.g. Unbelievable acoustic fidelity" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Review Body</label>
                  <textarea id="reviewBody" class="form-textarea" rows="3" placeholder="Tell us about the craftsmanship and daily usage..." required></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%;">Post Verified Review</button>
              </form>
            </div>

            <!-- Reviews Feed -->
            <div style="display:flex; flex-direction:column; gap:1.25rem;">
              ${reviews.slice(0, 4).map(r => `
                <div style="background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:1.25rem;">
                  <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem;">
                    <strong>${r.author}</strong>
                    <span style="color:#f59e0b; font-size:0.85rem;">★ ${r.rating}</span>
                  </div>
                  <div style="font-weight:700; font-size:0.9rem; margin-bottom:0.3rem;">"${r.title}"</div>
                  <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.5;">${r.comment}</p>
                </div>
              `).join("")}
            </div>
          </div>
        </div>

        <div id="tabShipping" class="pdp-tab-content" style="display:none; line-height:1.6; color:var(--text-muted); font-size:0.95rem;">
          <h3 style="font-size:1.15rem; color:var(--text-main); margin-bottom:0.5rem;">Worldwide Shipping & Returns</h3>
          <p style="margin-bottom:1rem;">
            All orders placed before 2:00 PM EST ship same-day from our carbon-neutral distribution facility. 
            Complimentary DHL Express tracking code provided immediately after checkout.
          </p>
          <h4 style="font-size:1rem; color:var(--text-main); margin-bottom:0.35rem;">30-Day Evaluation Period</h4>
          <p>
            Experience our instruments for 30 days. If you are not completely enchanted by the sound or craftsmanship, 
            return it in its original packaging for a 100% full refund.
          </p>
        </div>
      </div>
    `;
  },

  switchTab(tabKey, btn) {
    document.querySelectorAll(".pdp-tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".pdp-tab-content").forEach(c => c.style.display = "none");

    btn.classList.add("active");
    if (tabKey === "desc") document.getElementById("tabDesc").style.display = "block";
    if (tabKey === "specs") document.getElementById("tabSpecs").style.display = "block";
    if (tabKey === "reviews") document.getElementById("tabReviews").style.display = "block";
    if (tabKey === "shipping") document.getElementById("tabShipping").style.display = "block";
  },

  submitReview(e) {
    e.preventDefault();
    const author = document.getElementById("reviewAuthor")?.value;
    const rating = parseFloat(document.getElementById("reviewRatingSelect")?.value || 5);
    const title = document.getElementById("reviewHeadline")?.value;
    const comment = document.getElementById("reviewBody")?.value;

    const newRev = {
      id: `rev-${Date.now()}`,
      author,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      rating,
      date: "Just now",
      verified: true,
      productName: this.product.name,
      title,
      comment
    };

    const reviews = Storage.get("reviews", REVIEWS_DATA);
    reviews.unshift(newRev);
    Storage.set("reviews", reviews);

    Toast.show("Review Submitted", "Thank you for your feedback!", "🌟");
    this.renderTabs();
    this.switchTab('reviews', document.querySelectorAll(".pdp-tab-btn")[2]);
  },

  renderRelated() {
    const container = document.getElementById("pdpRelatedGrid");
    if (!container) return;

    const related = PRODUCTS_DATA
      .filter(p => p.id !== this.product.id)
      .slice(0, 4);

    container.innerHTML = related.map(p => `
      <article class="product-card">
        <div class="product-image-container">
          <a href="product.html?id=${p.id}">
            <img src="${p.image}" alt="${p.name}" class="product-thumb" loading="lazy" />
          </a>
        </div>
        <div class="product-details">
          <div class="product-category">${p.categoryName}</div>
          <h4 class="product-title"><a href="product.html?id=${p.id}">${p.name}</a></h4>
          <div class="product-footer">
            <span class="product-price">${CurrencyManager.format(p.price)}</span>
            <button class="btn btn-primary btn-sm" onclick="CartManager.addItem('${p.id}')">+ Bag</button>
          </div>
        </div>
      </article>
    `).join("");
  }
};

document.addEventListener("DOMContentLoaded", () => ProductPage.init());
