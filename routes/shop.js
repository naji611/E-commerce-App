const express = require("express");

const adminData = require("./admin");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

const shopRouts = require("../controllers/shop");

router.get("/", shopRouts.getIndex);
router.get("/products", shopRouts.getProducts);
router.get("/products/:productId", shopRouts.getProductDetails);
router.get("/cart", isAuth, shopRouts.getCart);
router.post("/cart", isAuth, shopRouts.postCart);
router.post("/cart-delete-item", isAuth, shopRouts.postCartDeleteProduct);
router.get("/checkout", isAuth, shopRouts.getCheckout);
router.get("/checkout/success", isAuth, shopRouts.getCheckoutSuccess);
router.get("/checkout/cancel", isAuth, shopRouts.getCheckout);
router.get("/orders", isAuth, shopRouts.getOrders);
//router.post("/create-order", isAuth, shopRouts.postOrders);
router.get("/orders/:orderId", isAuth, shopRouts.getInvoice);

module.exports = router;
