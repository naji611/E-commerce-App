const express = require("express");
const { check, body } = require("express-validator");
const authController = require("../controllers/auth");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const router = express.Router();

router.get("/login", authController.getLogin);
router.post(
  "/login",
  [
    check("email")
      .notEmpty()
      .withMessage("please enter a email.")
      .isEmail()
      .withMessage("please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (!user) {
            return Promise.reject("E-mail dose not exists.");
          }
        });
      })
      .normalizeEmail(),

    body("password")
      .notEmpty()
      .withMessage("please enter a password.")
      .isAlphanumeric()
      .withMessage("please enter a password with only numbers or  letters..")
      .isLength({ min: 4 })
      .withMessage("please enter a password with at least 4 characters.")
      .trim(),
  ],
  authController.postLogin
);
router.post("/logout", authController.postLogout);
router.get("/signup", authController.getSignUp);
router.post(
  "/signup",
  [
    check("email")
      .normalizeEmail()
      .isEmail()
      .withMessage("please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email Is Already Exists.");
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .notEmpty()
      .withMessage("please enter a password with only numbers or  letters.")
      .isLength({ min: 4 })
      .withMessage("please enter a password with at least 4 characters.")
      .trim(),
    body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match.");
        }
        return true;
      })
      .notEmpty()
      .withMessage(
        "please enter a Confirm password with only numbers or  letters."
      )
      .trim(),
  ],
  authController.postSignUp
);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getUpdatePassword);
router.post("/new-password", authController.postNewPassword);
module.exports = router;
