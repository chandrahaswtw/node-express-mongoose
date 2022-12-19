const Product = require("./../models/products");
const User = require("./../models/user");

const getCart = async (req, res) => {
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
    totalItems: 0,
    totalPrice: 0,
    path: "/cart",
    docTitle: "cart",
  });
};

const addCart = async (req, res) => {
  const userId = req.user._id;
  const productId = req.body.productId;
  await req.user.addToCart(productId);
  res.redirect("/cart");
};

const deleteCart = async (req, res) => {
  const userId = req.user._id;
  const productId = req.body.productId;
  await req.user.deleteFromcart(productId);
  res.redirect("/cart");
};

module.exports = { addCart, getCart, deleteCart };
