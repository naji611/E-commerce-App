const Product = require("../models/Product");
const User = require("../models/user");
const mongodb = require("mongodb");
const Order = require("../models/order");
exports.getCart = (req, res) => {
  req.user
    .populate("cart.items.productId")

    .then((user) => {
      console.log(user);
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((results) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.prodId;

  req.user
    .deleteFromCart(prodId)
    .then((results) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getOrders = (req, res) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      console.log(orders);

      res.render("shop/orders", {
        pageTitle: "Your Orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postOrders = (req, res) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          username: req.user.username,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })

    .then((result) => {
      return req.user.clearCart();
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = (req, res) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProductDetails = (req, res) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        pageTitle: "Product Details",
        product: product,
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
