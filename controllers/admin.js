const Product = require("./../models/products");

const getAddProduct = (req, res, next) => {
  res.render("./admin/editProduct", {
    docTitle: "Add products",
    path: "/addProduct",
    docTitle: "Add products",
    edit: false,
    isAuthenticated: req.session.loggedIn,
  });
};

const postAddProduct = async (req, res, next) => {
  const { title, imageUrl, description, price } = req.body;
  const userId = req.user._id;
  const product = new Product({ title, imageUrl, description, price, userId });
  await product.save();
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
    isAuthenticated: req.session.loggedIn,
  });
};

const postEditProduct = async (req, res, next) => {
  const { id, title, imageUrl, description, price } = req.body;
  const userId = req.user._id;
  await Product.updateOne({
    _id: id,
    title,
    imageUrl,
    description,
    price,
    userId,
  });
  res.redirect("/");
};

const postDeleteProduct = async (req, res, next) => {
  const { id } = req.body;
  await Product.findByIdAndDelete(id);
  res.redirect("/");
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
};
