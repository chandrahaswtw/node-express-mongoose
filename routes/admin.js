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
const { body } = require("express-validator");

// Common validation middleware
const addEditProductMiddleware = [
  body("title").trim().notEmpty().withMessage("Product title can't be empty."),
  body("imageUrl")
    .trim()
    .notEmpty()
    .withMessage("Product URL title can't be empty.")
    .bail()
    .isURL()
    .withMessage("Enter valid URL"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description can't be empty."),
  body("price")
    .trim()
    .notEmpty()
    .withMessage("Product price can't be empty")
    .bail()
    .isFloat()
    .withMessage("Product price is not a valid number."),
];

Router.get("/addProduct", authMiddleware, getAddProduct);

Router.post(
  "/addProduct",
  authMiddleware,
  addEditProductMiddleware,
  postAddProduct
);

Router.get("/editProduct/:id", authMiddleware, getEditProduct);

Router.post(
  "/editProduct",
  authMiddleware,
  addEditProductMiddleware,
  postEditProduct
);

Router.post("/deleteProduct", authMiddleware, postDeleteProduct);
authMiddleware, (module.exports = Router);
