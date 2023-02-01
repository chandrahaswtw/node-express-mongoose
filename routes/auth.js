const express = require("express");
const Router = express.Router();
const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getForgotPassword,
  postForgotPassword,
  getResetPassword,
  postResetPassword,
} = require("./../controllers/auth");

Router.get("/login", getLogin);
Router.post("/postLogin", postLogin);
Router.post("/logout", postLogout);
Router.get("/signup", getSignup);
Router.post("/postSignup", postSignup);
Router.get("/forgotPassword", getForgotPassword);
Router.post("/postForgotPassword", postForgotPassword);
Router.get("/reset/:token", getResetPassword);
Router.post("/postReset", postResetPassword);

module.exports = Router;
