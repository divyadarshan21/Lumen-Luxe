/**
 * LUMEN LUXE - Shopping Cart Page Controller
 * Manages full cart tabular view, quantity steppers, promo code validation, and checkout routing.
 */

const CartPage = {
  init() {
    HeaderComponent.init();
    ChatWidget.init();

    this.render();

    window.addEventListener("cart:updated", () => this.render());
    window.addEventListener("currency:changed", () => this.render());
  },

  render() {
    const tableBody = document.getElementById("cartTableBody");
    const emptyState = document.getElementById("cartEmptyState");
    const cartWrapper = document.getElementById("cartTableWrapper");
    const summaryCard = document.getElementById("cartSummaryCard");

    if (!tableBody || !emptyState) return;

    const items = CartManager.getItems();

    if (items.length === 0) {
      emptyState.style.display = "block";
      if (cartWrapper) cartWrapper.style.display = "none";
      if (summaryCard) summaryCard.style.display = "none";
      return;
    }

    emptyState.style.display = "none";
    if (cartWrapper) cartWrapper.style.display = "block";
    if (summaryCard) summaryCard.style.display = "block";

    // Populate line items
    tableBody.innerHTML = items.map((item, idx) => `
      <tr>
        <td>
          <div class="cart-product-cell">
            <a href="product.html?id=${item.id}">
              <img src="${item.image}" alt="${item.name}" class="cart-thumb-img" />
            </a>
            <div>
              <a href="product.html?id=${item.id}" style="font-weight:700; font-size:0.95rem; color:var(--text-main);">
                ${item.name}
              </a>
              <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.2rem;">
                Color: ${item.color} • Size: ${item.size}
              </div>
              <div style="font-size:0.75rem; color:var(--text-subtle);">SKU: ${item.sku || 'LL-PROD'}</div>
            </div>
          </div>
        </td>
        <td style="font-weight:600;">
          ${CurrencyManager.format(item.price)}
        </td>
        <td>
          <div class="qty-stepper" style="border:1px solid var(--border-subtle); border-radius:var(--radius-sm);">
            <button class="qty-btn" style="width:30px; height:30px;" onclick="CartManager.updateQty(${idx}, ${item.qty - 1})">−</button>
            <span class="qty-input" style="width:34px; font-size:0.85rem;">${item.qty}</span>
            <button class="qty-btn" style="width:30px; height:30px;" onclick="CartManager.updateQty(${idx}, ${item.qty + 1})">+</button>
          </div>
        </td>
        <td style="font-weight:800; color:var(--text-main);">
          ${CurrencyManager.format(item.price * item.qty)}
        </td>
        <td style="text-align:right;">
          <button class="btn-icon" style="width:32px; height:32px; color:var(--danger);" onclick="CartManager.removeItem(${idx})" title="Remove item">
            ✕
          </button>
        </td>
      </tr>
    `).join("");

    this.renderSummary();
  },

  renderSummary() {
    const totals = CartManager.getTotals();

    // Free Shipping Progress
    const meterFill = document.getElementById("freeShipMeterFill");
    const meterText = document.getElementById("freeShipMeterText");
    if (meterFill && meterText) {
      meterFill.style.width = `${totals.freeShippingProgress}%`;
      if (totals.isFreeShipping) {
        meterText.innerHTML = `🎉 <strong>Congratulations!</strong> You unlocked <strong>FREE Express Shipping</strong>!`;
      } else {
        meterText.innerHTML = `Add <strong>${CurrencyManager.format(totals.remainingForFreeShipping)}</strong> more to get <strong>FREE Express Shipping</strong>!`;
      }
    }

    // Totals Breakdown
    const subtotalEl = document.getElementById("summarySubtotal");
    const discountRow = document.getElementById("summaryDiscountRow");
    const discountEl = document.getElementById("summaryDiscount");
    const shippingEl = document.getElementById("summaryShipping");
    const taxEl = document.getElementById("summaryTax");
    const totalEl = document.getElementById("summaryTotal");

    if (subtotalEl) subtotalEl.textContent = CurrencyManager.format(totals.subtotal);
    if (shippingEl) shippingEl.textContent = totals.shipping === 0 ? "FREE" : CurrencyManager.format(totals.shipping);
    if (taxEl) taxEl.textContent = CurrencyManager.format(totals.estimatedTax);
    if (totalEl) totalEl.textContent = CurrencyManager.format(totals.total);

    if (totals.discount > 0 && discountRow && discountEl) {
      discountRow.style.display = "flex";
      discountEl.textContent = `-${CurrencyManager.format(totals.discount)}`;
    } else if (discountRow) {
      discountRow.style.display = "none";
    }

    // Active Promo Tag
    const promoTag = document.getElementById("activePromoTag");
    if (promoTag) {
      if (totals.promo) {
        promoTag.style.display = "flex";
        promoTag.innerHTML = `
          <span>🏷️ Code <strong>${totals.promo.code}</strong> applied (${totals.promo.description})</span>
          <button style="color:var(--danger); cursor:pointer; font-weight:700; margin-left:0.5rem;" onclick="CartManager.removePromo()">✕</button>
        `;
      } else {
        promoTag.style.display = "none";
      }
    }
  },

  handleApplyPromo() {
    const input = document.getElementById("cartPromoInput");
    if (!input) return;
    const res = CartManager.applyPromo(input.value);
    if (res.success) {
      input.value = "";
    }
  }
};

document.addEventListener("DOMContentLoaded", () => CartPage.init());
