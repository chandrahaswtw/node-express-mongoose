const express = require("express");
const Router = express.Router();
const {
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} = require("../controllers/admin");
const authMiddleware = require("./../middleware/authMiddleware");

Router.get("/addProduct", authMiddleware, getAddProduct);

Router.post("/addProduct", authMiddleware, postAddProduct);

Router.get("/editProduct/:id", authMiddleware, getEditProduct);

Router.post("/editProduct", authMiddleware, postEditProduct);

Router.post("/deleteProduct", authMiddleware, postDeleteProduct);
authMiddleware, (module.exports = Router);
