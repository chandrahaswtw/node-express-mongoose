const getError = (req, res, next) => {
  res.status(400);
  res.render("error");
};

module.exports = { getError };
