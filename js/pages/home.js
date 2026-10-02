/**
 * LUMEN LUXE - Home Page Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  HeaderComponent.init();
  ChatWidget.init();
  initFlashDealTimer();
  renderFeaturedProducts();
  renderTestimonials();
  initNewsletter();

  // Listen to currency changes to refresh prices
  window.addEventListener("currency:changed", () => {
    renderFeaturedProducts();
  });
});

function initFlashDealTimer() {
  const hEl = document.getElementById("dealHours");
  const mEl = document.getElementById("dealMins");
  const sEl = document.getElementById("dealSecs");
  if (!hEl) return;

  let totalSeconds = 9 * 3600 + 42 * 60 + 25;
  setInterval(() => {
    if (totalSeconds <= 0) totalSeconds = 12 * 3600;
    totalSeconds--;
    hEl.textContent = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    mEl.textContent = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    sEl.textContent = String(totalSeconds % 60).padStart(2, "0");
  }, 1000);
}

function renderFeaturedProducts() {
  const container = document.getElementById("featuredProductsGrid");
  if (!container) return;

  const featured = PRODUCTS_DATA.slice(0, 6);

  container.innerHTML = featured.map(p => {
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

function toggleWishlistBtn(productId, btn) {
  const added = WishlistManager.toggle(productId);
  if (btn) {
    btn.classList.toggle("active", added);
    btn.innerHTML = added ? "♥" : "♡";
  }
}

function renderTestimonials() {
  const container = document.getElementById("homeReviewsGrid");
  if (!container) return;

  container.innerHTML = REVIEWS_DATA.map(r => `
    <div class="review-card">
      <div class="reviewer-meta">
        <img src="${r.avatar}" alt="${r.author}" class="reviewer-avatar" />
        <div>
          <div style="font-weight:700; font-size:0.9375rem;">${r.author}</div>
          <div class="verified-tag">✓ Verified Buyer</div>
        </div>
      </div>
      <div style="color:#f59e0b; font-size:0.85rem;">${"★".repeat(Math.floor(r.rating))} (${r.rating})</div>
      <div style="font-weight:700; font-size:0.95rem;">"${r.title}"</div>
      <div style="font-size:0.875rem; color:var(--text-muted); line-height:1.5;">${r.comment}</div>
      <div style="font-size:0.75rem; color:var(--primary); font-weight:700; margin-top:auto;">
        Gear: ${r.productName}
      </div>
    </div>
  `).join("");
}

function initNewsletter() {
  const form = document.getElementById("homeNewsletterForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("homeNewsletterEmail");
      if (input && input.value) {
        Toast.show("Welcome to the VIP Club!", "Use coupon WELCOME10 for 10% off", "💌");
        input.value = "";
      }
    });
  }
}
