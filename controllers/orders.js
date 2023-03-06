const Order = require("./../models/order");

const createOrder = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const items = req.user.cart.items;
    const order = new Order({
      userId,
      items,
    });
    await order.save();
    await req.user.clearCart();
    res.redirect("/orders");
  } catch (e) {
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    let orders = await Order.find({ userId })
      .populate("items.productId")
      .exec();
    for (let order of orders) {
      let orderCost = 0;
      for (let item of order.items) {
        orderCost += item.quantity * item.productId.price;
        order.orderCost = orderCost;
      }
    }
    res.render("./shop/orders", {
      path: "/orders",
      docTitle: "My orders",
      orders,
      isAuthenticated: req.session.loggedIn,
    });
  } catch (e) {
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(error);
  }
};

module.exports = { createOrder, getOrders };
