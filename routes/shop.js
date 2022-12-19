const express = require("express");
const Router = express.Router();
const { getProducts, viewProduct } = require("../controllers/shop");
const { addCart, getCart, deleteCart } = require("../controllers/cart");

Router.get("/", getProducts);

Router.get("/viewProduct/:id", viewProduct);

Router.get("/cart", getCart);

Router.post("/addCart", addCart);

Router.post("/deleteCart", deleteCart);

module.exports = Router;
