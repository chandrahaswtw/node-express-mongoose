const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");

// Routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorRoute = require("./routes/error");
const ordersRoute = require("./routes/orders");
const loginRoute = require("./routes/login");

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

// Auth route
app.use((req, res, next) => {
  User.findById("63960194ebfe76cc877b1b41")
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
app.use(loginRoute);
app.use(errorRoute);

mongoose
  .connect(process.env.mongoURI)
  .then(async () => {
    console.log("Successfully connected to database");
    app.listen(3000, () => {
      console.log("App started on port 3000");
    });
  })
  .catch((e) => {
    console.log("Error in connecting to DB", e);
  });
