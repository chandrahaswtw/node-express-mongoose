const User = require("./../models/user");
const bcrypt = require("bcrypt");

const getLogin = async (req, res) => {
  const messages = req.flash("error");
  const message = messages.length ? messages[0] : null;
  res.render("./auth/login.ejs", {
    path: "/login",
    docTitle: "Login",
    isAuthenticated: req.session.loggedIn,
    errorMessage: message,
  });
};

const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    req.flash("error", "Incorrect email id or password");
    return res.redirect("/login");
  }
  const { password: hash } = user;
  const isPasswordValid = await bcrypt.compare(password, hash);
  console.log(isPasswordValid);
  if (!isPasswordValid) {
    req.flash("error", "Incorrect email id or password");
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
  const messages = req.flash("error");
  const message = messages.length ? messages[0] : null;
  res.render("./auth/signup.ejs", {
    path: "/signup",
    docTitle: "Signup",
    isAuthenticated: req.session.loggedIn,
    errorMessage: message,
  });
};

const postSignup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isExistingUser = await User.findOne({ email });
    if (isExistingUser) {
      req.flash("error", "User already exists, sign in instead");
      return res.redirect("/signup");
    }
    console.log(password);
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      cart: { items: [] },
    });
    await user.save();
    res.redirect("/login");
  } catch (e) {
    console.log("Error during signup ", e);
  }
};

module.exports = { getLogin, postLogin, postLogout, getSignup, postSignup };
