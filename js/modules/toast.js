/**
 * LUMEN LUXE - Toast Notification System
 * Non-blocking floating status alerts.
 */

const Toast = {
  container: null,

  init() {
    if (!this.container) {
      let el = document.getElementById("toastContainer");
      if (!el) {
        el = document.createElement("div");
        el.id = "toastContainer";
        el.className = "toast-container";
        document.body.appendChild(el);
      }
      this.container = el;
    }
  },

  show(title, message, icon = "✨") {
    this.init();
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${message}</div>
      </div>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(15px)";
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }
};
