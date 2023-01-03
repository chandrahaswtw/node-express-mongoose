const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const User = require("./models/user");

// Routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorRoute = require("./routes/error");
const ordersRoute = require("./routes/orders");
const authRoute = require("./routes/auth");

// Using body-parser
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Static files
app.use(express.static(path.join(__dirname, "static")));

// EJS setup
app.set("view engine", "ejs");
const allViews = path.join(__dirname, "views");
app.set("views", allViews);

// Session
const store = new MongoDBStore({
  uri: process.env.mongoURI,
  collection: "session",
});
app.use(
  session({
    secret: "My secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

// GET USER DATA FROM SESSION IF EXISTS
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

// Using routes
app.use(shopRoutes);
app.use(adminRoutes);
app.use(ordersRoute);
app.use(authRoute);
app.use(errorRoute);

mongoose
  .connect(`${process.env.mongoURI}?retryWrites=true&w=majority`)
  .then(async () => {
    console.log("Successfully connected to database");
    app.listen(3000, () => {
      console.log("App started on port 3000");
    });
  })
  .catch((e) => {
    console.log("Error in connecting to DB", e);
  });
