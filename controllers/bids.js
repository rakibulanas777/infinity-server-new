const Bid = require("../models/Bids");
const User = require("../models/Users");
const Product = require("../models/Products");

// Place a bid on a product
const placeBid = async (req, res) => {
  try {
    const { productId } = req.params;
    const { amount, userId } = req.body;

    // Check if the user is a vendor (vendors cannot place bids)
    const user = await User.findOne({ _id: userId });
    console.log(productId);
    // if (user.isSeller) {
    //   return res
    //     .status(401)
    //     .json({ message: "Seller cannot place bids", success: false });
    // }

    // // Check if the bid amount is valid (positive number)
    // if (typeof amount !== "number" || amount <= 0) {
    //   return res
    //     .status(400)
    //     .json({ message: "Invalid bid amount", success: false });
    // }

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }

    // Check if the user has already placed a bid on this product
    let existingBid = await Bid.findOne({ product: productId, user: userId });

    if (existingBid) {
      // If the user has already bid, update the bid amount
      existingBid.amount = amount;
      await existingBid.save();
      return res
        .status(200)
        .json({ message: "Bid amount updated successfully", bid: existingBid });
    }

    // If the user has not bid before, create a new bid
    const newBid = new Bid({ product: productId, user: userId, amount });
    await newBid.save();

    res.status(201).json({ message: "Bid placed successfully", bid: newBid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  placeBid,
};
