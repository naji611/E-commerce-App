const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.get("/add-product", isAuth, adminController.getAddProducts);
router.get("/products", isAuth, adminController.getProducts);

router.post("/add-product", isAuth, adminController.postAddProducts);
router.get("/edit-product/:productId", isAuth, adminController.getEditProducts);
router.post("/edit-product", isAuth, adminController.postEditProduct);
router.post("/admin/delete-product", isAuth, adminController.deleteProduct);
module.exports = router;
