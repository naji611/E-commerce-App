const Product = require("../models/Product");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const file = require("../util/file");
const { validationResult } = require("express-validator");
exports.getAddProducts = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
    validationError: [],
    hasError: false,
    errorMessage: null,
  });
};

exports.postAddProducts = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;

  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      errorMessage: "The attached file is not an image.",
      product: {
        title: title,

        price: price,
        description: description,
      },
      isAuthenticated: req.session.isLoggedIn,
      validationError: [],
    });
  }
  const imageUrl = image.path;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title: title,

        price: price,
        description: description,
      },
      isAuthenticated: req.session.isLoggedIn,
      validationError: errors.array(),
    });
  }
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
  });

  product
    .save()
    .then((results) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
      // console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    return res.status(400).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title: title,
        price: price,
        description: description,
        _id: id,
      },
      isAuthenticated: req.session.isLoggedIn,
      validationError: errors.array(),
    });
  }
  Product.findById(id)
    .then((product) => {
      product.title = title;
      if (image) {
        file.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }

      product.price = price;
      product.description = description;

      product.save();
    })

    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
      // console.log(err);
    });
};

exports.getEditProducts = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) return res.redirect("/");
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      if (product.userId.toString() !== req.user._id.toString()) {
        res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        product: product,
        editing: true,
        hasError: false,
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: null,
        validationError: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
      // console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
      // console.log(err);
    });
};
exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return next(new Error("no product found."));
      }
      file.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })

    .then((product) => {
      res.status(200).json({ message: "Deleted Successfully!" });
      console.log("delete success");
    })
    .then((result) => {
      return req.user.clearUserCart(prodId);
    })
    .catch((err) => {
      res.status(500).json({ message: "Deleting product failed!" });
    });
};
