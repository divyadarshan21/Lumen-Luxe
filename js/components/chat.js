/**
 * LUMEN LUXE - 24/7 AI Concierge Component
 * Instant interactive customer assistant for order tracking, recommendations, and shipping queries.
 */

const ChatWidget = {
  init() {
    const toggleBtn = document.getElementById("chatWidgetToggle");
    const panel = document.getElementById("chatPanel");
    const closeBtn = document.getElementById("chatCloseBtn");
    const sendBtn = document.getElementById("chatSendBtn");
    const input = document.getElementById("chatInput");

    if (!toggleBtn || !panel) return;

    toggleBtn.addEventListener("click", () => panel.classList.toggle("active"));
    if (closeBtn) closeBtn.addEventListener("click", () => panel.classList.remove("active"));

    const handleSend = () => {
      const txt = input.value.trim();
      if (!txt) return;
      this.appendMessage("user", txt);
      input.value = "";
      this.respond(txt);
    };

    if (sendBtn && input) {
      sendBtn.addEventListener("click", handleSend);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleSend();
      });
    }
  },

  appendMessage(sender, text) {
    const container = document.getElementById("chatMessages");
    if (!container) return;

    const div = document.createElement("div");
    div.className = `chat-msg ${sender}`;
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  },

  handleQuickPrompt(query) {
    this.appendMessage("user", query);
    this.respond(query);
  },

  respond(query) {
    const q = query.toLowerCase();
    let reply = "I'm your Lumen AI Concierge! I can assist with product specs, promo codes, or shipping policies.";

    if (q.includes("discount") || q.includes("promo") || q.includes("coupon")) {
      reply = "Use coupon code 'SAVE20' for 20% off your entire order, or 'WELCOME10' for 10% off your first purchase!";
    } else if (q.includes("shipping") || q.includes("delivery") || q.includes("fast")) {
      reply = "We offer free Express Worldwide Shipping on all orders over $75. Orders typically arrive within 2 to 4 business days.";
    } else if (q.includes("track") || q.includes("order")) {
      reply = "You can view and track your shipments anytime by visiting our Orders page or clicking 'Orders' in the header!";
    } else if (q.includes("return") || q.includes("warranty")) {
      reply = "All products come with a 30-Day Hassle-Free Money-Back Guarantee and an official 2-Year Manufacturer Warranty.";
    } else if (q.includes("headphone") || q.includes("audio")) {
      reply = "Our flagship model is the Aura Pro Wireless ANC with 45 hours battery life and titanium drivers!";
    }

    setTimeout(() => {
      this.appendMessage("bot", reply);
    }, 450);
  }
};
