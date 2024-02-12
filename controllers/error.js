exports.errorPage = (req, res) => {
  res.status(404).render("404", {
    pageTitle: "Not Found",
    layout: false,
    path: "",
    isAuthenticated: req.session.isLogged,
  });
};
