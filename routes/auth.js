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
const { body } = require("express-validator");
const User = require("./../models/user");

// Signup routes
Router.get("/signup", getSignup);
Router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Invalid email")
      .bail()
      .normalizeEmail(),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password cannot be empty")
      .bail()
      .isLength({ min: 4 })
      .withMessage("Minimum password length is 4 charecters"),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        const { password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
          throw new Error("Passwords don't match");
        }
        return true; //mandatory even after throwing an error.
      }),
  ],
  postSignup
);

// Login routes
Router.get("/login", getLogin);
Router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Invalid email")
      .bail()
      .normalizeEmail(),
    body("password").trim().notEmpty().withMessage("Password cannot be empty"),
  ],
  postLogin
);

// Login routes
Router.post("/logout", postLogout);

// Forget password routes
Router.get("/forgotPassword", getForgotPassword);
Router.post(
  "/forgotPassword",
  [
    body("email")
      .isEmail()
      .bail()
      .normalizeEmail()
      .withMessage("Invalid email")
      .bail() //It aborts from going to next validator if the before one fails.
      .custom((email, { req }) => {
        return User.findOne({ email })
          .then((user) => {
            if (!user) {
              return Promise.reject("User doesn't exist with this email id.");
            }
            // Passing the user data along the request, avoiding to fetch tha data again from DB in main controller.
            req.user = user;
          })
          .catch((e) => {
            // Since we are returning the Promise.reject from above then block, it comes to this catch block
            return Promise.reject(e);
          });
      }),
  ],
  postForgotPassword
);

// Reset password routes
Router.get("/reset/:token", getResetPassword);
Router.post(
  "/reset",
  [
    body("newPassword").notEmpty().withMessage("Password cannot be empty"),
    body("confirmPassword").custom((value, { req }) => {
      const { newPassword, confirmPassword } = req.body;
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords don't match");
      }
      return true; //mandatory even after throwing an error.
    }),
  ],
  postResetPassword
);

module.exports = Router;
