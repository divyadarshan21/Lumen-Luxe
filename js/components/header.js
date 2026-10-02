/**
 * LUMEN LUXE - Global Header & Navigation Component
 * Synchronizes search auto-suggest, theme, currency, and real-time badges.
 */

const HeaderComponent = {
  init() {
    this.initTheme();
    this.initCurrency();
    this.updateBadges();
    this.initSearch();
    this.highlightActiveNavLink();

    // Listen to global store events
    window.addEventListener("cart:updated", () => this.updateBadges());
    window.addEventListener("wishlist:updated", () => this.updateBadges());
  },

  initTheme() {
    const currentTheme = Storage.get("theme", "light");
    document.documentElement.setAttribute("data-theme", currentTheme);

    const toggleBtn = document.getElementById("themeToggleBtn");
    if (toggleBtn) {
      toggleBtn.innerHTML = currentTheme === "dark" ? "☀️" : "🌙";
      toggleBtn.addEventListener("click", () => {
        const newTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        Storage.set("theme", newTheme);
        toggleBtn.innerHTML = newTheme === "dark" ? "☀️" : "🌙";
        Toast.show("Theme Changed", `Switched to ${newTheme} mode`, "🌓");
      });
    }
  },

  initCurrency() {
    const selector = document.getElementById("currencySelector");
    if (selector) {
      selector.value = CurrencyManager.activeCurrency;
      selector.addEventListener("change", (e) => {
        CurrencyManager.setCurrency(e.target.value);
        Toast.show("Currency Updated", `Displaying prices in ${e.target.value}`, "💱");
      });
    }
  },

  updateBadges() {
    const cartCount = CartManager.getItemCount();
    const cartBadge = document.getElementById("cartBadgeCount");
    if (cartBadge) {
      cartBadge.textContent = cartCount;
      cartBadge.style.display = cartCount > 0 ? "flex" : "none";
    }

    const wishlistCount = WishlistManager.getCount();
    const wishlistBadge = document.getElementById("wishlistBadgeCount");
    if (wishlistBadge) {
      wishlistBadge.textContent = wishlistCount;
      wishlistBadge.style.display = wishlistCount > 0 ? "flex" : "none";
    }
  },

  initSearch() {
    const input = document.getElementById("mainSearchInput");
    const clearBtn = document.getElementById("searchClearBtn");
    const dropdown = document.getElementById("searchDropdown");

    if (!input || !dropdown) return;

    let debounceTimer;
    input.addEventListener("input", (e) => {
      clearTimeout(debounceTimer);
      const query = e.target.value.trim().toLowerCase();

      if (clearBtn) {
        if (query.length > 0) clearBtn.classList.add("active");
        else clearBtn.classList.remove("active");
      }

      if (query.length < 1) {
        dropdown.classList.remove("active");
        return;
      }

      debounceTimer = setTimeout(() => {
        const matches = PRODUCTS_DATA.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.categoryName.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
          dropdown.innerHTML = `<div style="padding: 1.25rem; text-align: center; color: var(--text-muted); font-size: 0.875rem;">No matching gear found</div>`;
        } else {
          dropdown.innerHTML = matches.slice(0, 5).map(p => `
            <a href="product.html?id=${p.id}" class="search-result-item">
              <img src="${p.image}" alt="${p.name}" class="search-result-img" />
              <div class="search-result-info">
                <div class="search-result-title">${p.name}</div>
                <div class="search-result-price">${CurrencyManager.format(p.price)}</div>
              </div>
              <span class="badge badge-new" style="font-size: 0.65rem;">${p.categoryName}</span>
            </a>
          `).join("") + `
            <a href="shop.html?q=${encodeURIComponent(query)}" style="display:block; padding: 0.75rem 1rem; text-align:center; background:var(--primary-light); color:var(--primary); font-size:0.8125rem; font-weight:700;">
              View all results in Shop →
            </a>
          `;
        }
        dropdown.classList.add("active");
      }, 150);
    });

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        input.value = "";
        clearBtn.classList.remove("active");
        dropdown.classList.remove("active");
      });
    }

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && input.value.trim()) {
        window.location.href = `shop.html?q=${encodeURIComponent(input.value.trim())}`;
      }
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".header-search")) {
        dropdown.classList.remove("active");
      }
    });
  },

  highlightActiveNavLink() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link").forEach(link => {
      const href = link.getAttribute("href");
      if (href && (href === currentPath || (currentPath === "" && href === "index.html"))) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }
};
