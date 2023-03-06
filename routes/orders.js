const express = require("express");
const Router = express.Router();
const {
  createOrder,
  getOrders,
  getInvoice,
} = require("./../controllers/orders");
const authMiddleware = require("./../middleware/authMiddleware");

Router.post("/createOrder", authMiddleware, createOrder);
Router.get("/orders", authMiddleware, getOrders);
Router.get("/invoice/:orderID", authMiddleware, getInvoice);

module.exports = Router;
