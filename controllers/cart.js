const Product = require("./../models/products");
const User = require("./../models/user");

const getCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const result = await req.user.populate("cart.items.productId");
    let totalItems = 0;
    let totalPrice = 0;
    const cartItems = [];
    for (let item of result.cart.items) {
      totalItems += item.quantity;
      totalPrice += item.quantity * item.productId.price;
      cartItems.push({ ...item.productId.toObject(), quantity: item.quantity });
    }
    // Logic comes here
    res.render("./shop/cart", {
      cartItems,
      totalItems,
      totalPrice,
      path: "/cart",
      docTitle: "cart",
      isAuthenticated: req.session.loggedIn,
    });
  } catch (e) {
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const addCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const productId = req.body.productId;
    await req.user.addToCart(productId);
    res.redirect("/cart");
  } catch (e) {
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const deleteCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const productId = req.body.productId;
    await req.user.deleteFromcart(productId);
    res.redirect("/cart");
  } catch (e) {
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(error);
  }
};

module.exports = { addCart, getCart, deleteCart };
