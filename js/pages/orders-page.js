/**
 * LUMEN LUXE - Account Orders & Tracking Dashboard Controller
 * Displays active shipments, milestone progress steps, and simulated live logistics tracking.
 */

const OrdersPage = {
  init() {
    HeaderComponent.init();
    ChatWidget.init();

    this.renderOrders();

    window.addEventListener("currency:changed", () => this.renderOrders());
  },

  renderOrders() {
    const container = document.getElementById("ordersFeedContainer");
    if (!container) return;

    const orders = OrderManager.getAll();

    if (orders.length === 0) {
      container.innerHTML = `
        <div class="empty-catalog" style="margin-top:2rem;">
          <div style="font-size:3rem; margin-bottom:1rem;">📦</div>
          <h3>No Orders Placed Yet</h3>
          <p style="color:var(--text-muted); margin:0.5rem 0 1.5rem; font-size:0.9rem;">
            When you complete an order, your real-time tracking roadmap and tax invoice will appear here.
          </p>
          <a href="shop.html" class="btn btn-primary">Start Shopping</a>
        </div>
      `;
      return;
    }

    container.innerHTML = orders.map(order => {
      const step = order.statusStep || 2;

      return `
        <article class="order-card">
          <div class="order-card-header">
            <div>
              <div style="font-size:0.8125rem; color:var(--text-muted);">Placed on ${order.date}</div>
              <h3 style="font-size:1.15rem; font-weight:800;">Order #${order.id}</h3>
            </div>
            <div style="text-align:right;">
              <span class="badge badge-sale">${order.status}</span>
              <div style="font-size:0.95rem; font-weight:800; color:var(--primary); margin-top:0.35rem;">
                ${CurrencyManager.format(order.total)}
              </div>
            </div>
          </div>

          <!-- Visual Progress Roadmap Stepper -->
          <div class="order-timeline">
            <div class="timeline-step ${step >= 1 ? 'completed' : ''}">
              <div class="step-circle">${step >= 1 ? '✓' : '1'}</div>
              <span>Confirmed</span>
            </div>
            <div style="flex:1; height:2px; background:${step >= 2 ? 'var(--primary)' : 'var(--border-subtle)'}; margin: 0 0.5rem; margin-bottom:1.2rem;"></div>
            
            <div class="timeline-step ${step >= 2 ? 'completed' : ''}">
              <div class="step-circle">${step >= 2 ? '✓' : '2'}</div>
              <span>Processing</span>
            </div>
            <div style="flex:1; height:2px; background:${step >= 3 ? 'var(--primary)' : 'var(--border-subtle)'}; margin: 0 0.5rem; margin-bottom:1.2rem;"></div>

            <div class="timeline-step ${step >= 3 ? 'completed' : ''}">
              <div class="step-circle">${step >= 3 ? '✓' : '3'}</div>
              <span>In Transit</span>
            </div>
            <div style="flex:1; height:2px; background:${step >= 4 ? 'var(--primary)' : 'var(--border-subtle)'}; margin: 0 0.5rem; margin-bottom:1.2rem;"></div>

            <div class="timeline-step ${step >= 4 ? 'completed' : ''}">
              <div class="step-circle">${step >= 4 ? '✓' : '4'}</div>
              <span>Delivered</span>
            </div>
          </div>

          <!-- Order Content & Details -->
          <div style="padding:1.5rem; border-top:1px solid var(--border-subtle);">
            <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:1.25rem; font-size:0.85rem; color:var(--text-muted);">
              <div>
                <strong>Carrier:</strong> ${order.carrier} (Tracking: <code>${order.trackingNumber}</code>)
              </div>
              <div>
                <strong>Destination:</strong> ${order.shippingAddress}
              </div>
              <div>
                <strong>Est. Arrival:</strong> ${order.estimatedDelivery || 'In 2-3 business days'}
              </div>
            </div>

            <!-- Ordered Line Items -->
            <div style="display:flex; flex-direction:column; gap:0.75rem; border-top:1px dashed var(--border-subtle); padding-top:1rem;">
              ${order.items.map(item => `
                <div style="display:flex; align-items:center; justify-content:space-between; font-size:0.875rem;">
                  <div style="display:flex; align-items:center; gap:0.75rem;">
                    ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width:40px; height:40px; border-radius:var(--radius-xs); object-fit:cover; background:var(--bg-subtle);" />` : ''}
                    <div>
                      <div style="font-weight:700;">${item.name}</div>
                      <div style="font-size:0.75rem; color:var(--text-muted);">${item.color || 'Standard'} • Qty: ${item.qty}</div>
                    </div>
                  </div>
                  <strong>${CurrencyManager.format(item.price * item.qty)}</strong>
                </div>
              `).join("")}
            </div>

            <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1.5rem; border-top:1px solid var(--border-subtle); padding-top:1rem;">
              <button class="btn btn-secondary btn-sm" onclick="OrdersPage.simulateTracking('${order.id}')">
                📍 Track Live Route
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");
  },

  simulateTracking(orderId) {
    const order = OrderManager.getById(orderId);
    if (!order) return;

    alert(
      `🛰️ LIVE SATELLITE DISPATCH ROADMAP\n\n` +
      `Order: #${order.id}\n` +
      `Carrier: ${order.carrier}\n` +
      `Tracking Code: ${order.trackingNumber}\n` +
      `Status: ${order.status}\n` +
      `Current Milestone: Regional Freight Sorting Center (Hub 4B)\n` +
      `Estimated Doorstep Delivery: ${order.estimatedDelivery}\n` +
      `Address: ${order.shippingAddress}`
    );
  }
};

document.addEventListener("DOMContentLoaded", () => OrdersPage.init());
