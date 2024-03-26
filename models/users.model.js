const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username must be provided"],
  },
  password: {
    type: String,
    required: [true, "password must be provided"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("users", userSchema);

module.exports = User;
