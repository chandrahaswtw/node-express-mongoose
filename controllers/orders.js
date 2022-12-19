const Order = require("./../models/order");

const createOrder = async (req, res, next) => {
  const { _id: userId } = req.user;
  const items = req.user.cart.items;
  const order = new Order({
    userId,
    items,
  });
  await order.save();
  await req.user.clearCart();
  res.redirect("/orders");
};

const getOrders = async (req, res, next) => {
  const { _id: userId } = req.user;
  let orders = await Order.find({ userId }).populate("items.productId").exec();

  for (let order of orders) {
    let orderCost = 0;
    for (let item of order.items) {
      orderCost += item.quantity * item.productId.price;
      order.orderCost = orderCost;
    }
  }
  res.render("./shop/orders", {
    docTitle: "Orders",
    path: "/orders",
    docTitle: "My orders",
    orders,
  });
};

module.exports = { createOrder, getOrders };
