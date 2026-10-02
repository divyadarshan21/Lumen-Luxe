/**
 * LUMEN LUXE - Professional Checkout Page Controller
 * Validates shipping details, simulates payment gateway authorization, and records confirmed orders.
 */

const CheckoutPage = {
  selectedPayment: "card",
  shippingSpeed: "express",

  init() {
    HeaderComponent.init();
    ChatWidget.init();

    // Guard: if cart is empty, redirect back to shop
    if (CartManager.getItems().length === 0) {
      Toast.show("Empty Cart", "Please add items to your bag before checking out", "🛍️");
      setTimeout(() => window.location.href = "shop.html", 1500);
      return;
    }

    this.renderOrderReview();
    this.bindPaymentTabs();
    this.bindCardFormatting();

    window.addEventListener("currency:changed", () => this.renderOrderReview());
  },

  renderOrderReview() {
    const listEl = document.getElementById("checkoutItemsList");
    if (!listEl) return;

    const items = CartManager.getItems();
    const totals = CartManager.getTotals();

    listEl.innerHTML = items.map(item => `
      <div style="display:flex; align-items:center; gap:0.75rem; padding:0.75rem 0; border-bottom:1px solid var(--border-subtle);">
        <img src="${item.image}" alt="${item.name}" style="width:48px; height:48px; border-radius:var(--radius-sm); object-fit:cover; background:var(--bg-subtle);" />
        <div style="flex:1;">
          <div style="font-size:0.875rem; font-weight:700;">${item.name}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${item.color} • Qty: ${item.qty}</div>
        </div>
        <div style="font-weight:700; font-size:0.875rem;">
          ${CurrencyManager.format(item.price * item.qty)}
        </div>
      </div>
    `).join("");

    const subtotalEl = document.getElementById("checkoutSubtotal");
    const discountEl = document.getElementById("checkoutDiscount");
    const discountRow = document.getElementById("checkoutDiscountRow");
    const shippingEl = document.getElementById("checkoutShipping");
    const taxEl = document.getElementById("checkoutTax");
    const totalEl = document.getElementById("checkoutTotal");

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
  },

  bindPaymentTabs() {
    document.querySelectorAll(".payment-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".payment-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.selectedPayment = btn.getAttribute("data-method");

        const cardFields = document.getElementById("cardFieldsWrapper");
        if (cardFields) {
          cardFields.style.display = this.selectedPayment === "card" ? "block" : "none";
        }
      });
    });
  },

  bindCardFormatting() {
    const cardInput = document.getElementById("cardNumberInput");
    const expiryInput = document.getElementById("cardExpiryInput");

    if (cardInput) {
      cardInput.addEventListener("input", (e) => {
        let v = e.target.value.replace(/\D/g, '').substring(0, 16);
        let formatted = v.match(/.{1,4}/g)?.join(' ') || v;
        e.target.value = formatted;
      });
    }

    if (expiryInput) {
      expiryInput.addEventListener("input", (e) => {
        let v = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2);
        e.target.value = v;
      });
    }
  },

  handleSubmitOrder(e) {
    e.preventDefault();

    const name = document.getElementById("checkoutName")?.value.trim();
    const email = document.getElementById("checkoutEmail")?.value.trim();
    const address = document.getElementById("checkoutAddress")?.value.trim();
    const city = document.getElementById("checkoutCity")?.value.trim();
    const zip = document.getElementById("checkoutZip")?.value.trim();

    if (!name || !email || !address || !city || !zip) {
      Toast.show("Incomplete Form", "Please fill in all required shipping fields", "⚠️");
      return;
    }

    const items = CartManager.getItems();
    const totals = CartManager.getTotals();

    // Create Order in domain
    const order = OrderManager.createOrder(
      { name, email, address, city, zip },
      this.selectedPayment,
      items,
      totals
    );

    // Clear user cart
    CartManager.clearCart();

    // Show Confirmation Modal
    const modal = document.getElementById("orderConfirmedModal");
    const modalOrderId = document.getElementById("modalOrderId");
    const modalTotal = document.getElementById("modalTotal");
    const modalDelivery = document.getElementById("modalDelivery");

    if (modalOrderId) modalOrderId.textContent = order.id;
    if (modalTotal) modalTotal.textContent = CurrencyManager.format(order.total);
    if (modalDelivery) modalDelivery.textContent = order.estimatedDelivery;

    if (modal) {
      modal.classList.add("active");
    } else {
      // Fallback
      window.location.href = `orders.html?confirmed=${order.id}`;
    }
  }
};

document.addEventListener("DOMContentLoaded", () => CheckoutPage.init());
