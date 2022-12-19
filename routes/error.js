const express = require("express");
const Router = express.Router();
const { getError } = require("./../controllers/error");

Router.use(getError);

module.exports = Router;
