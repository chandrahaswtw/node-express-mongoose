const express = require("express");
const Router = express.Router();
const { error400, error500 } = require("./../controllers/error");

Router.get("/500", error500);
Router.use(error400);

module.exports = Router;
