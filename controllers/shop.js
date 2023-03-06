const Product = require("../models/products");

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render("./shop/allProducts", {
      prod: products,
      path: "/",
      docTitle: "Home",
      isAuthenticated: req.session.loggedIn,
    });
  } catch (e) {
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const viewProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const productData = await Product.findById(id);
    res.render("./shop/viewProduct", {
      prod: productData,
      path: "/",
      docTitle: productData.title,
      isAuthenticated: req.session.loggedIn,
    });
  } catch (e) {
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(error);
  }
};

module.exports = { getProducts, viewProduct };
