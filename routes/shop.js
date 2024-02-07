const express = require("express");

const adminData = require("./admin");

const router = express.Router();

const shopRouts = require("../controllers/shop");

router.get("/", shopRouts.getIndex);
router.get("/products", shopRouts.getProducts);
router.get("/products/:productId", shopRouts.getProductDetails);
router.get("/cart", shopRouts.getCart);
router.post("/cart", shopRouts.postCart);
router.post("/cart-delete-item", shopRouts.postCartDeleteProduct);
router.get("/orders", shopRouts.getOrders);
router.post("/create-order", shopRouts.postOrders);
// //router.get("/checkout", shopRouts.getCheckout);

module.exports = router;
