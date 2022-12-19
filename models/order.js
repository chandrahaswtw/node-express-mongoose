const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      _id: false,
    },
  ],
});

module.exports = mongoose.model("Order", orderSchema);
