const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((ci) => {
    return ci.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];
  if (cartProductIndex >= 0) {
    newQuantity = updatedCartItems[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id, //if i did not parse mongoose will parse to ObjectId
      quantity: 1,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};
userSchema.methods.deleteFromCart = function (prodId) {
  let updatedCartItems = this.cart.items.filter((i) => {
    return i.productId.toString() !== prodId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};
userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};
userSchema.methods.clearUserCart = function (prodId) {
  let updatedCartItems = this.cart.items.filter((i) => {
    return i.productId.toString() !== prodId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};
module.exports = mongoose.model("User", userSchema);
// const mongodb = require("mongodb");
// const getDb = require("../util/database").getDb;
// class User {
//   constructor(username, email, cart, id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db
//       .collection("users")
//       .insertOne(this)
//       .then((user) => {
//         console.log(user);
//         return user;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex((ci) => {
//       return ci.productId.toString() === product._id.toString();
//     });
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];
//     if (cartProductIndex >= 0) {
//       newQuantity = updatedCartItems[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new mongodb.ObjectId(product._id),
//         quantity: 1,
//       });
//     }
//     const updatedCart = {
//       items: updatedCartItems,
//     };
//     let db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   static findById(userId) {
//     let db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: new mongodb.ObjectId(userId) })

//       .then((user) => {
//         console.log(user);
//         return user;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//   getCart() {
//     let db = getDb();
//     const productsIds = this.cart.items.map((i) => {
//       return i.productId;
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: productsIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((p) => {
//           return {
//             ...p,
//             quantity: this.cart.items.find((i) => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity,
//           };
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//   deleteItemFromCart(prodId) {
//     let db = getDb();
//     let updatedCartItems = this.cart.items.filter((i) => {
//       return i.productId.toString() !== prodId.toString();
//     });

//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }
//   addOrder() {
//     let db = getDb();

//     return this.getCart()
//       .then((products) => {
//         console.log(products);
//         const order = {
//           items: products,
//           user: {
//             _id: new mongodb.ObjectId(this._id),
//             username: this.username,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new mongodb.ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//   getOrders() {
//     let db = getDb();
//     return db
//       .collection("orders")
//       .find({})
//       .toArray()
//       .then((orders) => {
//         return orders;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// }
// module.exports = User;
