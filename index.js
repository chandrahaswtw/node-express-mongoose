require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
var flash = require("connect-flash");
const User = require("./models/user");
const multer = require("multer");
const helmet = require("helmet");
const compression = require("compression");
var morgan = require("morgan");
const fs = require("fs");
// Routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorRoutes = require("./routes/errors");
const ordersRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");

// Express app
const app = express();

// Middleware (1) Using body-parser
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname
      // Windows doesn't accept : in file names and we are doing the stuff.
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Middleware (2) Using multer
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));

// Middleware (3) Using express-session & DB Store
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

// Middleware (4) Get user data if session exists.
// We are doing this as session user object is not always up to date. Hence refreshing it on every route.
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  // Skip authentication check for static files
  if (/\.(css|js|jpg|jpeg|png|gif|svg|ico)$/i.test(req.url)) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
});

// Middleware (5) Flash messages.
app.use(flash());

// Static files
app.use(express.static(path.join(__dirname, "static")));
app.use("/images", express.static(path.join(__dirname, "images")));

// EJS setup
app.set("view engine", "ejs");
const allViews = path.join(__dirname, "views");
app.set("views", allViews);

// app.use(helmet());
app.use(compression());
var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
app.use(morgan("combined", { stream: accessLogStream }));

// Using routes
app.use(shopRoutes);
app.use(adminRoutes);
app.use(ordersRoutes);
app.use(authRoutes);

// Error route
app.use((err, req, res, next) => {
  console.log("ERROR OCCURED ", err);
  res.status(500);
  res.render("error", {
    errorMessage: "Internal error occured",
    docTitle: "Internal error",
    path: "/500",
    isAuthenticated: req.session.loggedIn,
  });
});

app.use(errorRoutes);

mongoose
  .connect(`${process.env.MONGO_URI}?retryWrites=true&w=majority`)
  .then(async () => {
    console.log("Successfully connected to database");
    mongoose.set("debug", false); //Stop mongoose to console.log the queries
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log("App started on port 3000");
    });
  })
  .catch((e) => {
    console.log("Error in connecting to DB", e);
  });
