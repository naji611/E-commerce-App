const express = require("express");
const fs = require("fs");
const https = require("https");

const mongoose = require("mongoose");
const adminRouts = require("./routes/admin");
const shopRouts = require("./routes/shop");
const errorRouts = require("./controllers/error");
const authRouts = require("./routes/auth");
const path = require("path");
const flash = require("connect-flash");
const Csrf = require("csurf"); // I added this line to solve the problem of csrf attack.
const bodyParser = require("body-parser");
const multer = require("multer");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
//const MONGODB_URI=
const User = require("./models/user");
const helmet = require("helmet");

const compression = require("compression");
const compressible = require("compressible");
const app = express();

const store = new MongoDbStore({
  uri: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.lfudb4r.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`,
});
console.log(process.env.MONGO_DATABASE);
const csrfProtection = Csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});
fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.set("view engine", "ejs");
app.set("views", "views");

app.use(helmet());
app.use(compression());

console.log(compressible("text/html"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
); //secret key for encrypting

app.use(csrfProtection);

const privateKey = fs.readFileSync("server.key");
const certificate = fs.readFileSync("server.cert");

app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use("/admin", adminRouts);
app.use(shopRouts);
app.use(authRouts);
app.get("/500", errorRouts.errorPage500);
app.use(errorRouts.errorPage404);
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose
  .connect(
    "mongodb+srv://************************************************"
  )
  .then((results) => {
    //https.createServer({ key: privateKey, cert: certificate }, app)
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });
