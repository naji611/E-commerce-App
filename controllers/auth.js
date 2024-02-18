const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "koonohashop@gmail.com",
    pass: "ygut lhlx jlsv cgjd",
  },
});

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (!message.length > 0) {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
    },
    validationError: [],
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "login",
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
      validationError: errors.array(),
    });
  }
  User.findOne({ email: email }).then((user) => {
    bcrypt.compare(password, user.password).then((doMatch) => {
      if (doMatch) {
        req.session.user = user;
        req.session.isLoggedIn = true;
        return req.session.save((err) => {
          console.log(err);
          res.redirect("/");
        });
      }

      req.flash("error", "Invalid username or password");
      console.log(errors.array());
      return res.status(422).render("auth/login", {
        path: "/login",
        pageTitle: "login",
        isAuthenticated: false,
        errorMessage: "Invalid Password",
        oldInput: {
          email: email,
          password: password,
        },
        validationError: [{ path: "password" }],
      });
    });
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getSignUp = (req, res, next) => {
  let message = req.flash("error");
  if (!message.length > 0) {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "SignUp",
    isAuthenticated: false,
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationError: [],
  });
};

exports.postSignUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "SignUp",
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      validationError: errors.array(),
    });
  }

  var mailOptions = {
    from: "koonohashop@gmail.com",
    to: email,
    subject: "Welcome to Koonoha Shop!",
    html: `
        <p>Dear Customer,</p>
        <p>Welcome to Koonoha Shop! We are thrilled to have you as a new member of our community. As you embark on this journey with us, expect nothing but the best in terms of products, service, and overall experience.</p>
        <p><img src="https://drive.google.com/uc?export=download&id=1-YgkDu3oNGL4s3jmeUBBkS5EhvN0pCLD" alt="Welcome Image" style="max-width: 100%; height: auto;"></p>
        <p>If you have any questions or need assistance, feel free to reach out to us. We're here to make your shopping experience seamless and enjoyable.</p>
        <p>Once again, welcome aboard!</p>
        <p>Best regards,<br>The Koonoha Shop Team</p>
      `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  return bcrypt
    .hash(password, 12)
    .then((hashedPass) => {
      const user = new User({
        email: email,
        password: hashedPass,
        cart: { items: [] },
      });
      return user.save();
    })
    .then(() => {
      res.redirect("/login");
    })
    .catch((err) => console.log(err));
};
exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (!message.length > 0) {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "reset",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email address exists.");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; //1 hour from now
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        mailOptions = {
          from: "koonohashop@gmail.com",
          to: req.body.email,
          subject: "Password Reset!",
          html: `
            <p>Dear Customer,You requested a password reset!</p>
            <p>Please click on the following link to reset password:</p>
            <a href="http://localhost:3000/reset/${token}"
           
          `,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      })
      .catch((err) => console.log(err));
  });
};
exports.getUpdatePassword = (req, res, next) => {
  let token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() }, //i check if the token expired or not //gt==> grater than
  })
    .then((user) => {
      let message = req.flash("error");
      if (!message.length > 0) {
        message = null;
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "Update Password",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => console.log(err));
};
exports.postNewPassword = (req, res, next) => {
  let resetUser;
  const { userId, passwordToken, newPassword } = req.body;

  console.log(userId);
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  }).then((user) => {
    console.log(user);
    resetUser = user;
    return bcrypt
      .hash(newPassword, 12)
      .then((hashedPassword) => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
      })
      .then((result) => {
        res.redirect("/login");
      })
      .catch((err) => console.log(err));
  });
};
