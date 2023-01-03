const express = require("express");
const Router = express.Router();
const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
} = require("./../controllers/auth");

Router.get("/login", getLogin);
Router.post("/postLogin", postLogin);
Router.post("/logout", postLogout);
Router.get("/signup", getSignup);
Router.post("/postSignup", postSignup);

module.exports = Router;
