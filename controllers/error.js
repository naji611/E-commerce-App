exports.errorPage404 = (req, res) => {
  res.status(404).render("404", {
    pageTitle: "Not Found",
    layout: false,
    path: "/404",
    isAuthenticated: req.session.isLogged,
  });
};
exports.errorPage500 = (req, res) => {
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLogged,
  });
};
