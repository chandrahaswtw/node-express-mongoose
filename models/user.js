const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: {
    token: {
      type: String,
    },
    expirationDate: {
      type: Schema.Types.Date,
    },
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
        _id: false,
      },
    ],
  },
});

userSchema.methods.addToCart = async function (productId) {
  const cartIndex = this.cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );
  const updatedCartItems = [...this.cart.items];
  if (cartIndex > -1) {
    const requiredItem = { ...this.cart.items[cartIndex].toObject() };
    requiredItem.quantity += 1;
    updatedCartItems[cartIndex] = requiredItem;
  } else {
    updatedCartItems.push({
      productId: productId,
      quantity: 1,
    });
  }
  this.cart.items = updatedCartItems;
  await this.save();
};

userSchema.methods.deleteFromcart = async function (productId) {
  const filteredCartItems = this.cart.items.filter(
    (item) => item.productId.toString() !== productId
  );
  this.cart.items = filteredCartItems;
  await this.save();
};

userSchema.methods.clearCart = async function () {
  this.cart.items = [];
  await this.save();
};

module.exports = mongoose.model("User", userSchema);
