const error400 = (req, res, next) => {
  res.status(400);
  res.render("error", {
    errorMessage: "Page not found",
    docTitle: "Page not found",
    path: "",
    isAuthenticated: false,
  });
};

const error500 = (req, res, next) => {
  res.status(500);
  res.render("error", {
    errorMessage: "Internal error occured",
    docTitle: "Internal error",
    path: "/500",
    isAuthenticated: false,
  });
};

module.exports = { error400, error500 };
