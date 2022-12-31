const mongoose = require("mongoose");
const { Schema } = mongoose;

const loginSchema = new Schema({
  userName: {
    type: String,
  },
  password: {
    type: String,
  },
});

module.exports = mongoose.model("Login", loginSchema);
