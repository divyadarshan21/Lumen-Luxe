/**
 * LUMEN LUXE - User Authentication & Session Engine
 * Manages user accounts, session tokens, secure update preferences, and auth events.
 */

const AuthManager = {
  // Default seeded test accounts
  DEFAULT_USERS: [
    {
      id: "usr-001",
      name: "Eleanor Vance",
      email: "eleanor@example.com",
      password: "password123",
      role: "VIP Collective Member",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      phone: "+1 (555) 349-2810",
      secureUpdates: {
        email: true,
        sms: true,
        dispatchAlerts: true
      },
      memberSince: "November 2025"
    }
  ],

  init() {
    // Seed default users if storage empty
    const existingUsers = Storage.get("users", null);
    if (!existingUsers || !Array.isArray(existingUsers) || existingUsers.length === 0) {
      Storage.set("users", this.DEFAULT_USERS);
    }
  },

  getUsers() {
    return Storage.get("users", this.DEFAULT_USERS);
  },

  getCurrentUser() {
    return Storage.get("currentUser", null);
  },

  isAuthenticated() {
    return !!this.getCurrentUser();
  },

  login(email, password) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: "Please provide both email address and password." };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { success: false, error: "Please enter a valid email address format." };
    }

    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, error: "No account found with this email address. Please register or verify spelling." };
    }

    if (user.password !== cleanPass) {
      return { success: false, error: "Incorrect password. Please try again." };
    }

    // Save active session
    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || "Member",
      avatar: user.avatar,
      phone: user.phone || "+1 (555) 000-0000",
      secureUpdates: user.secureUpdates || { email: true, sms: true, dispatchAlerts: true },
      memberSince: user.memberSince || "2026"
    };

    Storage.set("currentUser", sessionUser);
    window.dispatchEvent(new CustomEvent("auth:changed", { detail: { user: sessionUser, action: "login" } }));

    return { success: true, user: sessionUser };
  },

  register(name, email, password, secureUpdates = { email: true, sms: true, dispatchAlerts: true }) {
    const cleanName = (name || "").trim();
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    if (!cleanName) {
      return { success: false, error: "Please enter your full name." };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { success: false, error: "Please enter a valid email address." };
    }

    if (!cleanPass || cleanPass.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }

    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: "An account with this email address already exists. Please sign in." };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password: cleanPass,
      role: "Member",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=4f46e5&color=fff`,
      phone: "+1 (555) 000-0000",
      secureUpdates: {
        email: !!secureUpdates.email,
        sms: !!secureUpdates.sms,
        dispatchAlerts: !!secureUpdates.dispatchAlerts
      },
      memberSince: "Today"
    };

    users.push(newUser);
    Storage.set("users", users);

    // Auto-login new user
    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar,
      phone: newUser.phone,
      secureUpdates: newUser.secureUpdates,
      memberSince: newUser.memberSince
    };

    Storage.set("currentUser", sessionUser);
    window.dispatchEvent(new CustomEvent("auth:changed", { detail: { user: sessionUser, action: "register" } }));

    return { success: true, user: sessionUser };
  },

  logout() {
    const prevUser = this.getCurrentUser();
    Storage.remove("currentUser");
    window.dispatchEvent(new CustomEvent("auth:changed", { detail: { user: null, action: "logout", prevUser } }));
    return { success: true };
  },

  updateSecurePreferences(prefs) {
    const user = this.getCurrentUser();
    if (!user) return false;

    user.secureUpdates = { ...user.secureUpdates, ...prefs };
    Storage.set("currentUser", user);

    // Also update in users list
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx].secureUpdates = user.secureUpdates;
      Storage.set("users", users);
    }

    window.dispatchEvent(new CustomEvent("auth:changed", { detail: { user, action: "updatePreferences" } }));
    return true;
  }
};

AuthManager.init();
