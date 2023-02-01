require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
var flash = require("connect-flash");
const User = require("./models/user");

// Routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorRoute = require("./routes/error");
const ordersRoute = require("./routes/orders");
const authRoute = require("./routes/auth");

// Express app
const app = express();

// Middleware (1) Using body-parser
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Middleware (2) Using express-session & DB Store
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
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

// Middleware (3) Get user data if session exists.
// We are doing this as session user object is not always up to date. Hence refreshing it on every route.
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
      console.log("Unable to fetch the user info", err);
    });
});

// Middleware (4) Flash messages.
app.use(flash());

// Static files
app.use(express.static(path.join(__dirname, "static")));

// EJS setup
app.set("view engine", "ejs");
const allViews = path.join(__dirname, "views");
app.set("views", allViews);

// Using routes
app.use(shopRoutes);
app.use(adminRoutes);
app.use(ordersRoute);
app.use(authRoute);
app.use(errorRoute);

mongoose
  .connect(`${process.env.MONGO_URI}?retryWrites=true&w=majority`)
  .then(async () => {
    console.log("Successfully connected to database");
    mongoose.set("debug", false); //Stop mongoose to console.log the queries
    app.listen(3000, () => {
      console.log("App started on port 3000");
    });
  })
  .catch((e) => {
    console.log("Error in connecting to DB", e);
  });
