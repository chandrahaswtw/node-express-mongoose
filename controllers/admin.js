const Product = require("./../models/products");
const { validationResult } = require("express-validator");

const getAddProduct = (req, res, next) => {
  res.render("./admin/editProduct", {
    docTitle: "Add products",
    path: "/addProduct",
    docTitle: "Add products",
    edit: false,
    hasError: false,
    isAuthenticated: req.session.loggedIn,
    alertMessage: null,
    prod: {
      title: "",
      image: "",
      description: "",
      price: "",
    },
    validationErrors: [],
  });
};

const postAddProduct = async (req, res, next) => {
  const { title, description, price } = req.body;
  const image = req?.file?.path;
  const { errors } = validationResult(req);
  // First checking the form errors
  if (errors.length) {
    return res.status(422).render("./admin/editProduct", {
      docTitle: "Add products",
      path: "/addProduct",
      isAuthenticated: req.session.loggedIn,
      edit: false,
      alertMessage: null,
      hasError: true,
      prod: {
        title,
        description,
        price,
      },
      validationErrors: errors,
    });
  }
  // Check if image is uploaded
  if (!image) {
    return res.status(422).render("./admin/editProduct", {
      docTitle: "Add products",
      path: "/addProduct",
      isAuthenticated: req.session.loggedIn,
      edit: false,
      alertMessage: {
        type: "danger",
        message:
          "Enter a valid image. Only formats jpeg/png/jpg format allowed",
      },
      hasError: true,
      prod: {
        title,
        description,
        price,
      },
      validationErrors: [],
    });
  }

  const userId = req.user._id;
  try {
    const product = new Product({ title, image, description, price, userId });
    await product.save();
  } catch (e) {
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(error);
  }
  return res.redirect("/");
};

const getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const id = req.params.id;
  const productData = await Product.findById(id);
  if (!productData) {
    return res.redirect("/");
  }
  res.render("./admin/editProduct", {
    docTitle: "Add products",
    path: "/editProduct",
    docTitle: "Add products",
    prod: productData,
    edit: editMode,
    hasError: false,
    alertMessage: null,
    isAuthenticated: req.session.loggedIn,
    validationErrors: [],
  });
};

const postEditProduct = async (req, res, next) => {
  const { id, title, description, price } = req.body;
  const image = req?.file?.path;
  const { errors } = validationResult(req);
  if (errors.length) {
    return res.status(422).render("./admin/editProduct", {
      docTitle: "Add products",
      path: "/addProduct",
      isAuthenticated: req.session.loggedIn,
      edit: true,
      alertMessage: null,
      hasError: true,
      prod: {
        title,
        imageUrl,
        description,
        price,
        _id: id,
      },
      validationErrors: errors,
    });
  }
  const userId = req.user._id;
  const modifiedProduct = {
    title,
    description,
    price,
    userId,
  };
  if (image) {
    modifiedProduct.image = image;
  }
  try {
    await Product.updateOne({ _id: id }, modifiedProduct);
    res.redirect("/");
  } catch (e) {
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const postDeleteProduct = async (req, res, next) => {
  const { id } = req.body;
  try {
    await Product.findByIdAndDelete(id);
  } catch (e) {
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(error);
  }
  res.redirect("/");
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
};
