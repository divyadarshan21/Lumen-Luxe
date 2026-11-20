/**
 * LUMEN LUXE - Currency & Exchange Engine
 * Manages active currency conversions and real-time formatting across pages.
 */

const CurrencyManager = {
  activeCurrency: Storage.get("currency", "USD"),

  getCurrencyConfig() {
    return CURRENCIES[this.activeCurrency] || CURRENCIES.USD;
  },

  setCurrency(code) {
    if (CURRENCIES[code]) {
      this.activeCurrency = code;
      Storage.set("currency", code);
      window.dispatchEvent(new CustomEvent("currency:changed", { detail: { currency: code } }));
    }
  },

  format(usdAmount) {
    const config = this.getCurrencyConfig();
    const converted = usdAmount * config.rate;
    if (this.activeCurrency === "INR") {
      return `${config.symbol}${Math.round(converted).toLocaleString("en-IN")}`;
    }
    return `${config.symbol}${converted.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};
