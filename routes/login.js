const express = require("express");
const Router = express.Router();
const { getLogin, postLogin } = require("./../controllers/login");

Router.get("/login", getLogin);
Router.post("/postLogin", postLogin);

module.exports = Router;
