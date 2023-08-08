const mongoose = require("mongoose");
const ProductsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    title: {
      type: String,
      required: [true, "Please provide title"],
    },

    company: {
      type: String,
    },

    totalPrice: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    minPrice: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },

    catagory: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Products", ProductsSchema);
