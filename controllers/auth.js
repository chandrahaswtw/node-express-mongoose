const User = require("./../models/user");
const bcrypt = require("bcrypt");
const { sendMail } = require("./../utils/sendEmail");
const crypto = require("crypto");

const getLogin = async (req, res) => {
  const messages = req.flash("alertMessage");
  const message = messages.length ? messages[0] : null;
  res.render("./auth/login.ejs", {
    path: "/login",
    docTitle: "Login",
    isAuthenticated: req.session.loggedIn,
    alertMessage: message,
  });
};

const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    req.flash("alertMessage", {
      message: "Incorrect email id or password",
      type: "danger",
    });
    return res.redirect("/login");
  }
  const { password: hash } = user;
  const isPasswordValid = await bcrypt.compare(password, hash);
  if (!isPasswordValid) {
    req.flash("alertMessage", {
      message: "Incorrect email id or password",
      type: "danger",
    });
    return res.redirect("/login");
  }

  req.session.loggedIn = true;
  req.session.user = user;
  req.session.save(() => {
    res.redirect("/");
  });
};

const postLogout = async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

const getSignup = async (req, res) => {
  const messages = req.flash("alertMessage");
  const message = messages.length ? messages[0] : null;
  res.render("./auth/signup.ejs", {
    path: "/signup",
    docTitle: "Signup",
    isAuthenticated: req.session.loggedIn,
    alertMessage: message,
  });
};

const postSignup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isExistingUser = await User.findOne({ email });
    if (isExistingUser) {
      req.flash("alertMessage", {
        message: "User already exists, sign in instead",
        type: "danger",
      });
      return res.redirect("/signup");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      cart: { items: [] },
    });
    await user.save();
    res.redirect("/login");
    await sendMail(
      email,
      "Congratulations, Signed up successfully",
      "<p>You got signed up successfully into online-store.</p><p>We can't wait to see you purchase amazing products on this website</p>"
    );
  } catch (e) {
    console.log("Error during signup ", e);
  }
};

const getForgotPassword = async (req, res) => {
  const messages = req.flash("alertMessage");
  const message = messages.length ? messages[0] : null;
  res.render("./auth/forgetPassword.ejs", {
    path: "/reset",
    docTitle: "Reset password",
    alertMessage: message,
    isAuthenticated: false,
  });
};

const postForgotPassword = async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    req.flash("error", "User doesn't exist with this email id.");
    return res.redirect("/forgotPassword");
  }
  crypto.randomBytes(32, async (err, buff) => {
    if (err) throw err;
    const token = buff.toString("hex");
    // Save token under the user database
    existingUser.resetToken = {
      token,
      expirationDate: Date.now() + 3600000,
    };
    await existingUser.save();
    // Send mail to user
    await sendMail(
      email,
      "Password reset - Online store",
      `
      <p>You've requested a password reset.</p>
      <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
      `
    );
    req.flash("alertMessage", {
      message: "Check your inbox for password reset url & proceed further.",
      type: "success",
    });
    return res.redirect("/forgotPassword");
  });
};

const getResetPassword = async (req, res) => {
  const { token } = req.params;
  const matchedUser = await User.findOne({
    "resetToken.token": token,
    "resetToken.expirationDate": { $gt: Date.now() },
  });
  if (!matchedUser) {
    req.flash("alertMessage", {
      message: "Session is expired, please try again!",
      type: "danger",
    });
    return res.redirect("/forgotPassword");
  }
  const messages = req.flash("alertMessage");
  const message = messages.length ? messages[0] : null;

  // We are storing the token in an invisible field as we cannot track it until it's posted.
  // We can see on query params on the /reset/:token route, but we can't access as form is posting data to a new route.

  res.render("./auth/resetPassword.ejs", {
    path: "/reset",
    docTitle: "Reset password",
    alertMessage: message,
    token,
    isAuthenticated: false,
  });
};

const postResetPassword = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  // Check the matched user and check if token is expired.
  // This happens when user opened the page but did't reset it for an hour.
  const matchedUser = await User.findOne({
    "resetToken.token": token,
    "resetToken.expirationDate": { $gt: Date.now() },
  });
  if (!matchedUser) {
    req.flash("alertMessage", {
      message:
        "Password reset failed as reset url is timed out, please try again!",
      type: "danger",
    });
    return res.redirect("/forgotPassword");
  }

  // Hashing the password and removing the token information.
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  matchedUser.password = hashedPassword;
  matchedUser.set("resetToken", undefined);
  await matchedUser.save();

  // Flash success message and redirect to /login
  req.flash("alertMessage", {
    message: "Password changes successfully, please login to continue.",
    type: "success",
  });
  res.redirect("/login");
};

module.exports = {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getForgotPassword,
  postForgotPassword,
  getResetPassword,
  postResetPassword,
};
