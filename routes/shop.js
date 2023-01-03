const express = require("express");
const Router = express.Router();
const { getProducts, viewProduct } = require("../controllers/shop");
const { addCart, getCart, deleteCart } = require("../controllers/cart");
const authMiddleware = require("./../middleware/authMiddleware");

Router.get("/", getProducts);

Router.get("/viewProduct/:id", viewProduct);

Router.get("/cart", authMiddleware, getCart);

Router.post("/addCart", authMiddleware, addCart);

Router.post("/deleteCart", authMiddleware, deleteCart);

module.exports = Router;
