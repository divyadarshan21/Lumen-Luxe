/**
 * LUMEN LUXE - Wishlist Domain Manager
 * Manages user saved items and heart states.
 */

const WishlistManager = {
  getItems() {
    return Storage.get("wishlist", []);
  },

  getCount() {
    return this.getItems().length;
  },

  has(productId) {
    return this.getItems().includes(productId);
  },

  toggle(productId) {
    const list = this.getItems();
    const index = list.indexOf(productId);
    const product = PRODUCTS_DATA.find(p => p.id === productId);

    let added = false;
    if (index > -1) {
      list.splice(index, 1);
      Toast.show("Removed from Wishlist", product ? product.name : "", "🤍");
    } else {
      list.push(productId);
      added = true;
      Toast.show("Saved to Wishlist", product ? product.name : "", "❤️");
    }

    Storage.set("wishlist", list);
    window.dispatchEvent(new CustomEvent("wishlist:updated", { detail: { count: list.length, added, productId } }));
    return added;
  }
};
