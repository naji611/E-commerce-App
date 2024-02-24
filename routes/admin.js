const express = require("express");
const { check, body } = require("express-validator");
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.get("/add-product", isAuth, adminController.getAddProducts);
router.get("/products", isAuth, adminController.getProducts);

router.post(
  "/add-product",
  [
    check("title", "Please add a valid title.")
      .isString()
      .notEmpty()
      .isLength({ min: 3 })
      .trim(),
    check("description", "please add a valid description.")
      .isLength({ min: 5, max: 400 })

      .notEmpty()
      .trim(),
    check("price", "please add a valid price.").isFloat().notEmpty(),
  ],
  isAuth,
  adminController.postAddProducts
);
router.get("/edit-product/:productId", isAuth, adminController.getEditProducts);
router.post(
  "/edit-product",
  [
    check("title", "Please add a valid title.")
      .isString()
      .isLength({ min: 3 })
      .trim(),
    check("description", "please add a valid description.")
      .isLength({ min: 5, max: 400 })
      .trim(),
    check("price", "please add a valid price.").isFloat().notEmpty(),
  ],
  isAuth,
  adminController.postEditProduct
);
router.post("/admin/delete-product", isAuth, adminController.deleteProduct);
module.exports = router;
