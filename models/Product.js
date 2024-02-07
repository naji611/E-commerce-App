const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});
module.exports = mongoose.model("Product", productSchema);
// const res = require("express/lib/response");
// const mongodb = require("mongodb");
// const getDb = require("../util/database").getDb;
// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this._price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = userId;
//   }
//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       //update
//       dbOp = db
//         .collection("products")
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOp = db.collection("products").insertOne(this);
//     }
//     return dbOp
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//   static fetchAll() {
//     let db = getDb();
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then((res) => {
//         //  console.log("fetch all products:", res);
//         return res;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//   static findById(prodId) {
//     let db = getDb();

//     return db
//       .collection("products")
//       .find({ _id: new mongodb.ObjectId(prodId) })
//       .next()
//       .then()
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   static deleteById(prodId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .deleteOne({ _id: new mongodb.ObjectId(prodId) })
//       .then((result) => {
//         return db.collection("users").updateMany(
//           {},
//           {
//             $pull: {
//               "cart.items": { productId: new mongodb.ObjectId(prodId) },
//             },
//           }
//         );
//       })
//       .then((result) => {
//         console.log("Cart Item Deleted");
//       })
//       .then(() => {
//         console.log("Product Deleted");
//       });
//   }
// }

// module.exports = Product;
