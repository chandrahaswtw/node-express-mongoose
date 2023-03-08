const Product = require("../models/products");
const PRODUCTS_PER_PAGE = 1;
const getProducts = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const productCount = await Product.count();
    const products = await Product.find()
      .skip(PRODUCTS_PER_PAGE * (page - 1))
      .limit(PRODUCTS_PER_PAGE);
    res.render("./shop/allProducts", {
      prod: products,
      path: "/",
      docTitle: "Home",
      productCount,
      currentPage: page,
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
