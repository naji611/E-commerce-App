const express = require("express");
const mongoose = require("mongoose");
const adminRouts = require("./routes/admin");
const shopRouts = require("./routes/shop");
const errorRouts = require("./controllers/error");

const path = require("path");

const bodyParser = require("body-parser");

const User = require("./models/user");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  User.findById("65c3a241e86401662e3b5f61")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});
app.use("/admin", adminRouts);
app.use(shopRouts);
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
