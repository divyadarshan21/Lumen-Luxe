/**
 * LUMEN LUXE - Quick View Modal Component
 * Fast product preview modal with thumbnail switcher and variant selector.
 */

const QuickViewModal = {
  currentProduct: null,
  selectedColor: null,
  selectedSize: null,

  open(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    this.currentProduct = product;
    this.selectedColor = product.colors[0]?.name || "Standard";
    this.selectedSize = product.sizes[0] || "Standard";

    let modal = document.getElementById("quickViewModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "quickViewModal";
      modal.className = "modal-overlay";
      modal.innerHTML = `
        <div class="modal-dialog">
          <button class="modal-close-btn" onclick="QuickViewModal.close()">✕</button>
          <div id="quickViewModalBody"></div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const body = document.getElementById("quickViewModalBody");
    body.innerHTML = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:2.5rem; padding:2.5rem;">
        <div class="modal-gallery">
          <img src="${product.gallery[0]}" alt="${product.name}" id="quickViewMainImg" style="width:100%; height:380px; object-fit:cover; border-radius:var(--radius-lg); background:var(--bg-subtle); margin-bottom:0.75rem;" />
          <div style="display:flex; gap:0.5rem;">
            ${product.gallery.map((img, idx) => `
              <img src="${img}" style="width:60px; height:60px; border-radius:var(--radius-sm); object-fit:cover; cursor:pointer; border:2px solid ${idx === 0 ? 'var(--primary)' : 'transparent'};" 
                   onclick="QuickViewModal.switchImg('${img}', this)" />
            `).join("")}
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:0.85rem;">
          <span class="badge badge-${product.badgeType || 'hot'}" style="width:fit-content;">${product.badge || product.categoryName}</span>
          <h2 style="font-size:1.5rem; font-weight:800;">${product.name}</h2>
          
          <div style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem;">
            <span style="color:#f59e0b;">★</span>
            <strong>${product.rating}</strong>
            <span style="color:var(--text-subtle);">(${product.reviewsCount} reviews)</span>
          </div>

          <div style="font-size:1.6rem; font-weight:800; color:var(--primary); font-family:var(--font-heading);">
            ${CurrencyManager.format(product.price)}
            ${product.originalPrice ? `<span style="font-size:0.95rem; text-decoration:line-through; color:var(--text-subtle); margin-left:0.5rem;">${CurrencyManager.format(product.originalPrice)}</span>` : ""}
          </div>

          <p style="font-size:0.875rem; color:var(--text-muted); line-height:1.5;">${product.tagline}</p>

          <!-- Color Swatches -->
          <div style="margin-top:0.5rem;">
            <div style="font-size:0.8125rem; font-weight:700; margin-bottom:0.4rem;">Color: <span id="quickViewColorText" style="color:var(--primary);">${this.selectedColor}</span></div>
            <div style="display:flex; gap:0.5rem;">
              ${product.colors.map((c, i) => `
                <button type="button" class="btn btn-secondary btn-sm ${i === 0 ? 'active' : ''}" style="border-radius:var(--radius-sm); font-size:0.75rem;" onclick="QuickViewModal.selectColor('${c.name}', this)">
                  <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${c.hex}; margin-right:4px;"></span>
                  ${c.name}
                </button>
              `).join("")}
            </div>
          </div>

          <!-- Specs list -->
          <div style="background:var(--bg-subtle); border-radius:var(--radius-md); padding:0.75rem; margin-top:0.5rem; font-size:0.8rem;">
            ${Object.entries(product.specs).slice(0, 3).map(([k, v]) => `
              <div style="display:flex; justify-content:space-between; padding:0.2rem 0;">
                <span style="color:var(--text-muted);">${k}:</span>
                <strong>${v}</strong>
              </div>
            `).join("")}
          </div>

          <!-- Actions -->
          <div style="display:flex; gap:0.75rem; margin-top:1rem;">
            <button class="btn btn-primary" style="flex:1;" onclick="QuickViewModal.addToBag()">
              🛒 Add to Bag
            </button>
            <a href="product.html?id=${product.id}" class="btn btn-secondary" onclick="QuickViewModal.close()">
              Full Details →
            </a>
          </div>
        </div>
      </div>
    `;

    modal.classList.add("active");
  },

  switchImg(src, thumbEl) {
    document.getElementById("quickViewMainImg").src = src;
    thumbEl.parentElement.querySelectorAll("img").forEach(el => el.style.borderColor = "transparent");
    thumbEl.style.borderColor = "var(--primary)";
  },

  selectColor(colorName, btn) {
    this.selectedColor = colorName;
    document.getElementById("quickViewColorText").textContent = colorName;
    btn.parentElement.querySelectorAll("button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  },

  addToBag() {
    if (!this.currentProduct) return;
    CartManager.addItem(this.currentProduct.id, this.selectedColor, this.selectedSize, 1);
    this.close();
  },

  close() {
    const modal = document.getElementById("quickViewModal");
    if (modal) modal.classList.remove("active");
  }
};
