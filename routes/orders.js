const express = require("express");
const Router = express.Router();
const { createOrder, getOrders } = require("./../controllers/orders");

Router.post("/createOrder", createOrder);
Router.get("/orders", getOrders);

module.exports = Router;
