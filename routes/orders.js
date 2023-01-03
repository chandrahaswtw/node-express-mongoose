const express = require("express");
const Router = express.Router();
const { createOrder, getOrders } = require("./../controllers/orders");
const authMiddleware = require("./../middleware/authMiddleware");

Router.post("/createOrder", authMiddleware, createOrder);
Router.get("/orders", authMiddleware, getOrders);

module.exports = Router;
