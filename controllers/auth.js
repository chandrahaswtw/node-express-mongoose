const User = require("./../models/user");
const bcrypt = require("bcrypt");

const getLogin = async (req, res) => {
  res.render("./auth/login.ejs", {
    path: "/login",
    docTitle: "Login",
    isAuthenticated: req.session.loggedIn,
  });
};

const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    console.log("No user with the email ", email);
    return res.redirect("/login");
  }
  const { password: hash } = user;
  const isPasswordValid = bcrypt.compare(password, hash);
  if (isPasswordValid) {
    req.session.loggedIn = true;
    req.session.user = user;
    req.session.save(() => {
      res.redirect("/");
    });
  }
};

const postLogout = async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

const getSignup = async (req, res) => {
  res.render("./auth/signup.ejs", {
    path: "/signup",
    docTitle: "Signup",
    isAuthenticated: req.session.loggedIn,
  });
};

const postSignup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isExistingUser = await User.findOne({ email });
    if (isExistingUser) {
      console.log("User already exists");
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
