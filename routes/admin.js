const express = require("express");
const Router = express.Router();
const {
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} = require("../controllers/admin");

Router.get("/addProduct", getAddProduct);

Router.post("/addProduct", postAddProduct);

Router.get("/editProduct/:id", getEditProduct);

Router.post("/editProduct", postEditProduct);

Router.post("/deleteProduct", postDeleteProduct);

module.exports = Router;
