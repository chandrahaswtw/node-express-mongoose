const getLogin = async (req, res) => {
  console.log("COOKIES ARE: ", req.get("Cookie"));
  res.render("./login/login.ejs", { path: "/login", docTitle: "Login" });
};

const postLogin = async (req, res) => {
  res.setHeader("Set-Cookie", "loggedIn=true");
  res.redirect("/");
};

module.exports = { getLogin, postLogin };
