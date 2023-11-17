const mongoose = require("mongoose");
const ProductsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
    },
    delivered: {
      type: Boolean,
      default: false,
    },
    catagory: {
      type: String,
    },
    texture: {
      type: String,
    },
    weight: {
      type: String,
    },
    size: {
      type: String,
    },
    sellingPrice: {
      type: Number,
      required: false,
    },

    startPrice: {
      type: Number,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    winningBidAmount: {
      type: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", ProductsSchema);
