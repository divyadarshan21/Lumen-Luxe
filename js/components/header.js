/**
 * LUMEN LUXE - Global Header & Navigation Component
 * Synchronizes search auto-suggest, theme, currency, auth session, and active nav states.
 */

const HeaderComponent = {
  init() {
    this.initTheme();
    this.initCurrency();
    this.updateBadges();
    this.initSearch();
    this.initAuth();
    this.highlightActiveNavLink();

    // Listen to global store events
    window.addEventListener("cart:updated", () => this.updateBadges());
    window.addEventListener("wishlist:updated", () => this.updateBadges());
    window.addEventListener("auth:changed", () => {
      this.updateAuthUI();
      if (typeof OrdersPage !== "undefined" && OrdersPage.renderOrders) {
        OrdersPage.renderOrders();
      }
    });
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
          dropdown.innerHTML = `<div style="padding: 1.25rem; text-align: center; color: var(--text-muted); font-size: 0.95rem;">No matching gear found</div>`;
        } else {
          dropdown.innerHTML = matches.slice(0, 5).map(p => `
            <a href="product.html?id=${p.id}" class="search-result-item">
              <img src="${p.image}" alt="${p.name}" class="search-result-img" />
              <div class="search-result-info">
                <div class="search-result-title">${p.name}</div>
                <div class="search-result-price">${CurrencyManager.format(p.price)}</div>
              </div>
              <span class="badge badge-new" style="font-size: 0.75rem; flex-shrink: 0; margin-left: 0.5rem;">${p.categoryName}</span>
            </a>
          `).join("") + `
            <a href="shop.html?q=${encodeURIComponent(query)}" style="display:block; padding: 0.75rem 1rem; text-align:center; background:var(--primary-light); color:var(--primary); font-size:0.9rem; font-weight:700;">
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
    const searchParams = new URLSearchParams(window.location.search);
    const category = searchParams.get("category");

    document.querySelectorAll(".nav-link").forEach(link => {
      const href = link.getAttribute("href");
      if (!href) return;

      let isActive = false;

      // When category parameter is present (Audio or Wearables)
      if (category && (category === "audio" || category === "wearables")) {
        if (href === `shop.html?category=${category}`) {
          isActive = true;
        }
      } else if (currentPath === "shop.html" || currentPath === "") {
        // General catalog without audio/wearables sub-filter
        if (href === "shop.html") {
          isActive = true;
        }
      } else {
        // Match specific html file paths (index.html, orders.html, etc.)
        if (href === currentPath || (currentPath === "" && href === "index.html")) {
          isActive = true;
        }
      }

      if (isActive) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  },

  /* ------------------------------------------------------------------------
     USER AUTHENTICATION & LOGIN MODAL
     ------------------------------------------------------------------------ */
  initAuth() {
    this.injectAuthModal();
    this.updateAuthUI();

    // Close dropdown on outside click
    document.addEventListener("click", (e) => {
      const menu = document.getElementById("headerUserDropdownMenu");
      const btn = document.getElementById("headerUserDropdownBtn");
      if (menu && menu.classList.contains("active") && !menu.contains(e.target) && (!btn || !btn.contains(e.target))) {
        menu.classList.remove("active");
      }
    });

    // Close modal on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeAuthModal();
      }
    });
  },

  updateAuthUI() {
    const actionsContainer = document.querySelector(".header-actions");
    if (!actionsContainer) return;

    let authSlot = document.getElementById("headerAuthSlot");
    if (!authSlot) {
      authSlot = document.createElement("div");
      authSlot.id = "headerAuthSlot";
      // Insert at the front of header-actions
      actionsContainer.insertBefore(authSlot, actionsContainer.firstChild);
    }

    const user = AuthManager.getCurrentUser();

    if (!user) {
      // Guest state: show sleek "Sign In" button
      authSlot.innerHTML = `
        <button id="headerAuthBtn" class="header-auth-btn" title="Sign In for Secure Order Updates">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Sign In</span>
        </button>
      `;

      const btn = document.getElementById("headerAuthBtn");
      if (btn) {
        btn.addEventListener("click", () => this.openAuthModal("login"));
      }
    } else {
      // Authenticated state: show user avatar with dropdown
      const firstName = user.name.split(" ")[0] || "Member";
      const initials = user.name
        .split(" ")
        .map(n => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

      authSlot.innerHTML = `
        <div class="header-user-menu" id="headerUserMenu">
          <button id="headerUserDropdownBtn" class="header-user-btn" title="Account & Secure Telemetry Settings">
            <div class="user-avatar-circle">${initials}</div>
            <span class="user-btn-name">${firstName}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--text-muted)">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div id="headerUserDropdownMenu" class="user-dropdown-menu">
            <div class="user-menu-header">
              <div class="user-menu-name">${user.name}</div>
              <div class="user-menu-email">${user.email}</div>
              <div class="user-menu-badge">
                <span>🔒</span> 256-Bit Secure Updates Active
              </div>
            </div>
            <div class="user-menu-links">
              <a href="orders.html" class="user-menu-link">
                <span>📦</span> Track Orders & Shipments
              </a>
              <a href="cart.html" class="user-menu-link">
                <span>🛍️</span> Shopping Bag
              </a>
              <button class="user-menu-logout-btn" id="headerLogoutBtn">
                <span>🚪</span> Sign Out
              </button>
            </div>
          </div>
        </div>
      `;

      const toggleBtn = document.getElementById("headerUserDropdownBtn");
      const dropdown = document.getElementById("headerUserDropdownMenu");
      if (toggleBtn && dropdown) {
        toggleBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          dropdown.classList.toggle("active");
        });
      }

      const logoutBtn = document.getElementById("headerLogoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          AuthManager.logout();
          Toast.show("Signed Out", "You have successfully logged out", "👋");
        });
      }
    }
  },

  injectAuthModal() {
    if (document.getElementById("authModalOverlay")) return;

    const modalHTML = `
      <div id="authModalOverlay" class="auth-modal-overlay">
        <div class="auth-modal-container" role="dialog" aria-modal="true">
          <div class="auth-modal-header">
            <button id="authModalCloseBtn" class="auth-modal-close-btn" title="Close">✕</button>
            <div class="auth-security-badge">
              <span>🔒</span> 256-Bit SSL Encrypted Updates
            </div>
            <h2 id="authModalTitle" style="font-size: 1.6rem; font-weight: 800; margin-bottom: 0.35rem;">
              Member Sign In
            </h2>
            <p id="authModalSubtitle" style="font-size: 0.925rem; color: var(--text-muted);">
              Sign in with your email ID & password to unlock real-time encrypted order updates.
            </p>
          </div>

          <!-- Auth Tab Switcher -->
          <div class="auth-tabs-nav">
            <div id="authTabLoginBtn" class="auth-tab-btn active" onclick="HeaderComponent.switchAuthTab('login')">
              Sign In
            </div>
            <div id="authTabRegisterBtn" class="auth-tab-btn" onclick="HeaderComponent.switchAuthTab('register')">
              Create Account
            </div>
          </div>

          <div class="auth-modal-body">
            <!-- Alert message banner -->
            <div id="authAlertBox" class="auth-alert-box"></div>

            <!-- 1. LOGIN FORM -->
            <form id="authLoginForm" onsubmit="HeaderComponent.handleLoginSubmit(event)">
              <div class="form-group">
                <label class="form-label" for="authLoginEmail">Email Address *</label>
                <input
                  type="email"
                  id="authLoginEmail"
                  class="form-input"
                  placeholder="name@example.com"
                  autocomplete="email"
                  required
                />
              </div>

              <div class="form-group">
                <div class="flex-between" style="margin-bottom: 0.25rem;">
                  <label class="form-label" for="authLoginPassword" style="margin-bottom: 0;">Password *</label>
                  <a href="javascript:void(0)" onclick="HeaderComponent.handleForgotPassword()" style="font-size: 0.825rem; color: var(--primary); font-weight: 600;">
                    Forgot password?
                  </a>
                </div>
                <div class="password-input-wrapper">
                  <input
                    type="password"
                    id="authLoginPassword"
                    class="form-input"
                    placeholder="Enter your password"
                    autocomplete="current-password"
                    required
                  />
                  <span
                    class="password-toggle-btn"
                    id="loginPassToggle"
                    title="Toggle password visibility"
                    onclick="HeaderComponent.togglePasswordVisibility('authLoginPassword', 'loginPassToggle')"
                  >👁️</span>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.25rem;">
                <input type="checkbox" id="authRememberMe" style="accent-color: var(--primary); width: 16px; height: 16px; cursor: pointer;" checked />
                <label for="authRememberMe" style="font-size: 0.875rem; color: var(--text-muted); cursor: pointer;">
                  Remember this device for seamless encrypted updates
                </label>
              </div>

              <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.85rem;">
                Sign In to Account →
              </button>

              <!-- One-Click Demo Login Helper -->
              <div class="demo-login-box">
                <div>
                  <div style="font-size: 0.875rem; font-weight: 700; color: var(--text-main);">Demo Account</div>
                  <span>eleanor@example.com / password123</span>
                </div>
                <button
                  type="button"
                  class="btn btn-secondary btn-sm"
                  onclick="HeaderComponent.fillDemoLogin()"
                >
                  ⚡ Fill Demo
                </button>
              </div>
            </form>

            <!-- 2. REGISTER FORM -->
            <form id="authRegisterForm" style="display: none;" onsubmit="HeaderComponent.handleRegisterSubmit(event)">
              <div class="form-group">
                <label class="form-label" for="authRegisterName">Full Name *</label>
                <input
                  type="text"
                  id="authRegisterName"
                  class="form-input"
                  placeholder="e.g. Eleanor Vance"
                  autocomplete="name"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="authRegisterEmail">Email Address *</label>
                <input
                  type="email"
                  id="authRegisterEmail"
                  class="form-input"
                  placeholder="name@example.com"
                  autocomplete="email"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="authRegisterPassword">Create Password (min 6 chars) *</label>
                <div class="password-input-wrapper">
                  <input
                    type="password"
                    id="authRegisterPassword"
                    class="form-input"
                    placeholder="Create a secure password"
                    autocomplete="new-password"
                    required
                  />
                  <span
                    class="password-toggle-btn"
                    id="regPassToggle"
                    title="Toggle password visibility"
                    onclick="HeaderComponent.togglePasswordVisibility('authRegisterPassword', 'regPassToggle')"
                  >👁️</span>
                </div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.25rem; background: var(--bg-subtle); padding: 0.75rem 0.95rem; border-radius: var(--radius-sm);">
                <div style="font-size: 0.825rem; font-weight: 700; color: var(--text-main);">
                  🔒 Encrypted Security Preferences
                </div>
                <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.825rem; color: var(--text-muted); cursor: pointer;">
                  <input type="checkbox" id="regUpdatesEmail" style="accent-color: var(--primary);" checked />
                  Send real-time carrier telemetry & receipts via Email
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.825rem; color: var(--text-muted); cursor: pointer;">
                  <input type="checkbox" id="regUpdatesSMS" style="accent-color: var(--primary);" checked />
                  Send SMS milestone dispatches (Out for Delivery alerts)
                </label>
              </div>

              <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.85rem;">
                Create Secure Account →
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const overlay = document.getElementById("authModalOverlay");
    const closeBtn = document.getElementById("authModalCloseBtn");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closeAuthModal());
    }

    if (overlay) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) this.closeAuthModal();
      });
    }
  },

  openAuthModal(defaultTab = "login") {
    const overlay = document.getElementById("authModalOverlay");
    if (!overlay) return;

    this.clearAuthAlert();
    this.switchAuthTab(defaultTab);
    overlay.classList.add("active");

    setTimeout(() => {
      if (defaultTab === "login") {
        document.getElementById("authLoginEmail")?.focus();
      } else {
        document.getElementById("authRegisterName")?.focus();
      }
    }, 100);
  },

  closeAuthModal() {
    const overlay = document.getElementById("authModalOverlay");
    if (overlay) {
      overlay.classList.remove("active");
    }
    this.clearAuthAlert();
  },

  switchAuthTab(tab) {
    const loginBtn = document.getElementById("authTabLoginBtn");
    const regBtn = document.getElementById("authTabRegisterBtn");
    const loginForm = document.getElementById("authLoginForm");
    const regForm = document.getElementById("authRegisterForm");
    const title = document.getElementById("authModalTitle");
    const subtitle = document.getElementById("authModalSubtitle");

    this.clearAuthAlert();

    if (tab === "login") {
      loginBtn?.classList.add("active");
      regBtn?.classList.remove("active");
      if (loginForm) loginForm.style.display = "block";
      if (regForm) regForm.style.display = "none";
      if (title) title.textContent = "Member Sign In";
      if (subtitle) subtitle.textContent = "Sign in with your email ID & password to unlock real-time encrypted order updates.";
    } else {
      regBtn?.classList.add("active");
      loginBtn?.classList.remove("active");
      if (loginForm) loginForm.style.display = "none";
      if (regForm) regForm.style.display = "block";
      if (title) title.textContent = "Create Member Account";
      if (subtitle) subtitle.textContent = "Register with your email to enable real-time delivery telemetry & member privileges.";
    }
  },

  togglePasswordVisibility(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);
    if (!input || !toggle) return;

    if (input.type === "password") {
      input.type = "text";
      toggle.textContent = "🙈";
    } else {
      input.type = "password";
      toggle.textContent = "👁️";
    }
  },

  fillDemoLogin() {
    const emailInput = document.getElementById("authLoginEmail");
    const passInput = document.getElementById("authLoginPassword");
    if (emailInput && passInput) {
      emailInput.value = "eleanor@example.com";
      passInput.value = "password123";
      this.showAuthAlert("Demo credentials populated! Click 'Sign In' or press Enter to continue.", "success");
    }
  },

  showAuthAlert(message, type = "error") {
    const box = document.getElementById("authAlertBox");
    if (!box) return;
    box.className = `auth-alert-box ${type}`;
    box.textContent = message;
    box.style.display = "block";
  },

  clearAuthAlert() {
    const box = document.getElementById("authAlertBox");
    if (box) {
      box.textContent = "";
      box.style.display = "none";
      box.className = "auth-alert-box";
    }
  },

  handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById("authLoginEmail")?.value;
    const password = document.getElementById("authLoginPassword")?.value;

    const res = AuthManager.login(email, password);
    if (res.success) {
      this.closeAuthModal();
      Toast.show("Welcome Back", `Signed in securely as ${res.user.name}`, "🔒");
    } else {
      this.showAuthAlert(res.error, "error");
    }
  },

  handleRegisterSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("authRegisterName")?.value;
    const email = document.getElementById("authRegisterEmail")?.value;
    const password = document.getElementById("authRegisterPassword")?.value;
    const emailUpdates = document.getElementById("regUpdatesEmail")?.checked ?? true;
    const smsUpdates = document.getElementById("regUpdatesSMS")?.checked ?? true;

    const res = AuthManager.register(name, email, password, { email: emailUpdates, sms: smsUpdates, dispatchAlerts: true });
    if (res.success) {
      this.closeAuthModal();
      Toast.show("Account Created", `Welcome to LUMEN LUXE, ${res.user.name}! Secure updates active.`, "✨");
    } else {
      this.showAuthAlert(res.error, "error");
    }
  },

  handleForgotPassword() {
    const email = document.getElementById("authLoginEmail")?.value;
    if (!email) {
      this.showAuthAlert("Please enter your email address in the field above to receive a recovery link.", "error");
      return;
    }
    this.showAuthAlert(`Password reset link dispatched to ${email}. Check your inbox.`, "success");
  }
};
