/**
 * LUMEN LUXE - Orders & Shipment Manager
 * Manages order histories, status progressions, and checkout order placement.
 */

const DEFAULT_ORDERS = [
  {
    id: "ORD-94281",
    date: "Oct 01, 2026",
    status: "In Transit",
    statusStep: 3, // 1: Placed, 2: Processing, 3: Shipped, 4: Delivered
    carrier: "DHL Express Global",
    trackingNumber: "DHL-883920194US",
    total: 348.50,
    items: [
      { name: "Aura Pro Wireless ANC Headphones", qty: 1, price: 299.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80" },
      { name: "Artisan Ceramic Pour-Over & Kettle Set", qty: 1, price: 89.00, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80" }
    ],
    shippingAddress: "742 Evergreen Terrace, Springfield, OR 97477",
    estimatedDelivery: "Oct 05, 2026"
  }
];

const OrderManager = {
  getAll() {
    return Storage.get("orders", DEFAULT_ORDERS);
  },

  getById(id) {
    return this.getAll().find(o => o.id === id);
  },

  createOrder(shippingInfo, paymentMethod, items, totals) {
    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingCode = `DHL-${Math.floor(100000000 + Math.random() * 900000000)}US`;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);

    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Processing",
      statusStep: 2,
      carrier: "DHL Express Air",
      trackingNumber: trackingCode,
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      tax: totals.estimatedTax,
      total: totals.total,
      items: items.map(i => ({ ...i })),
      shippingAddress: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.zip}`,
      recipientName: shippingInfo.name,
      recipientEmail: shippingInfo.email,
      paymentMethod: paymentMethod,
      estimatedDelivery: deliveryDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };

    const currentOrders = this.getAll();
    currentOrders.unshift(newOrder);
    Storage.set("orders", currentOrders);

    return newOrder;
  }
};
