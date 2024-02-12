const express = require("express");
const mongoose = require("mongoose");
const adminRouts = require("./routes/admin");
const shopRouts = require("./routes/shop");
const errorRouts = require("./controllers/error");
const authRouts = require("./routes/auth");
const path = require("path");

const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
//const MONGODB_URI=
const User = require("./models/user");
const app = express();
const store = new MongoDbStore({
  uri: "mongodb+srv://najiassi13:naji3123@cluster0.lfudb4r.mongodb.net/shop?retryWrites=true&w=majority",
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
); //secret key for encrypting
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      console.log(user);
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});
app.use("/admin", adminRouts);
app.use(shopRouts);
app.use(authRouts);
app.use(errorRouts.errorPage);
mongoose
  .connect(
    "mongodb+srv://najiassi13:naji3123@cluster0.lfudb4r.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then((results) => {
    User.findOne().then((u) => {
      if (!u) {
        const user = new User({
          username: "naji",
          email: "naji@gmail.com",
          cart: { items: [] },
        });
        user.save();
      }
    });

    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
