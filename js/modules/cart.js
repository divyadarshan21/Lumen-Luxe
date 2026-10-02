/**
 * LUMEN LUXE - Shopping Cart Domain Manager
 * Encapsulates cart state, line items, promos, shipping logic, and totals.
 */

const CartManager = {
  FREE_SHIPPING_THRESHOLD: 75.00,
  STANDARD_SHIPPING_FEE: 9.99,

  getItems() {
    return Storage.get("cart", []);
  },

  getItemCount() {
    const items = this.getItems();
    return items.reduce((sum, item) => sum + item.qty, 0);
  },

  addItem(productId, variantColor, variantSize, quantity = 1) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return false;

    const color = variantColor || product.colors[0]?.name || "Standard";
    const size = variantSize || product.sizes[0] || "Standard";
    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    const items = this.getItems();
    const existingIndex = items.findIndex(
      i => i.id === productId && i.color === color && i.size === size
    );

    if (existingIndex > -1) {
      items[existingIndex].qty += qty;
    } else {
      items.push({
        id: product.id,
        sku: product.sku,
        name: product.name,
        price: product.price,
        image: product.image,
        color: color,
        size: size,
        qty: qty
      });
    }

    Storage.set("cart", items);
    this.notifyUpdate();
    Toast.show("Added to Bag", `${product.name} (${color})`, "🛍️");
    return true;
  },

  updateQty(index, newQty) {
    const items = this.getItems();
    if (!items[index]) return;

    if (newQty <= 0) {
      this.removeItem(index);
      return;
    }

    items[index].qty = newQty;
    Storage.set("cart", items);
    this.notifyUpdate();
  },

  removeItem(index) {
    const items = this.getItems();
    if (!items[index]) return;
    const removed = items.splice(index, 1)[0];
    Storage.set("cart", items);
    this.notifyUpdate();
    Toast.show("Item Removed", `${removed.name} was removed`, "🗑️");
  },

  clearCart() {
    Storage.set("cart", []);
    Storage.remove("promo");
    this.notifyUpdate();
  },

  getPromo() {
    return Storage.get("promo", null);
  },

  applyPromo(promoCode) {
    const code = promoCode.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      Storage.set("promo", PROMO_CODES[code]);
      this.notifyUpdate();
      Toast.show("Promo Applied", PROMO_CODES[code].description, "🏷️");
      return { success: true, promo: PROMO_CODES[code] };
    }
    Toast.show("Invalid Code", "Try using SAVE20 or WELCOME10", "⚠️");
    return { success: false, message: "Invalid promo code" };
  },

  removePromo() {
    Storage.remove("promo");
    this.notifyUpdate();
  },

  getTotals() {
    const items = this.getItems();
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const promo = this.getPromo();

    let discount = 0;
    if (promo && promo.discountPercent) {
      discount = (subtotal * promo.discountPercent) / 100;
    }

    const isFreeShipping = subtotal >= this.FREE_SHIPPING_THRESHOLD || (promo && promo.freeShipping);
    const shipping = (items.length > 0 && !isFreeShipping) ? this.STANDARD_SHIPPING_FEE : 0;
    const estimatedTax = (subtotal - discount) * 0.05; // 5% standard sales tax
    const total = Math.max(0, subtotal - discount + shipping + (items.length > 0 ? estimatedTax : 0));

    const remainingForFreeShipping = Math.max(0, this.FREE_SHIPPING_THRESHOLD - subtotal);
    const freeShippingProgress = Math.min(100, (subtotal / this.FREE_SHIPPING_THRESHOLD) * 100);

    return {
      subtotal,
      discount,
      shipping,
      estimatedTax,
      total,
      isFreeShipping,
      remainingForFreeShipping,
      freeShippingProgress,
      promo
    };
  },

  notifyUpdate() {
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count: this.getItemCount() } }));
  }
};
