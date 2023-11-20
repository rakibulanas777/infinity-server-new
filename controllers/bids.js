const Bid = require("../models/Bids");
const User = require("../models/Users");
const Products = require("../models/Products");
const socketIO = require("../socket");
const http = require("http");
const io = require("../socket");
const stripe = require("stripe")(
  "sk_test_51LM2J1SIiDyURhxDcwcDsr2pkYCLeu8MVqvXDNb5Dgap0qkfEBn1O8H0GHos3NHaS68eWsR1ocBhbniPOLgHG5AL00WDJsrnCf"
);
// Place a bid on a product
const placeBid = async (req, res) => {
  try {
    const { productId } = req.params;
    const { amount, userId, vendor } = req.body;

    console.log(userId);
    console.log(vendor);
    // Check if the user is a vendor (vendors cannot place bids)
    const user = await User.findOne({ _id: userId });

    if (!user.bankAccount) {
      return res
        .status(400)
        .json({ message: "Please provide your bank account information." });
    }

    // Check if the product exists
    const product = await Products.findById(productId);

    if (user.role === "vendor") {
      return res.json({ message: "Vendor cannot place bids", success: false });
    }

    if (vendor === userId) {
      return res.json({ message: "Vendors cannot bid on their own products" });
    }

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }

    // Check if the user has already placed a bid on this product
    let existingBid = await Bid.findOne({ product: productId, user: userId });

    // Check if user has provided bank account information

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

const getAllBidsForProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const bids = await Bid.find({ product: productId }).populate("user");

    res.status(200).json({
      bids,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getBidsForProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const bids = await Bid.find({ product: productId })
      .populate("user")
      .sort({ amount: -1 }) // Sort by bid amount in descending order
      .limit(5);

    res.status(200).json({
      bids,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const approveBid = async (req, res) => {
  try {
    const { bidId } = req.params;

    const bid = await Bid.findById(bidId).populate("product");

    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    const product = bid.product;

    if (!bid.approved) {
      bid.approved = true;
      await bid.save();

      product.status = "ended";

      // Set the winner information in the product
      product.winner = bid.user;
      product.winningBidAmount = bid.amount;
      product.winningBid = bidId;

      await product.save();

      res.status(200).json({
        message: "Bid approved, product ended, and winner selected",
        success: true,
        bid,
      });
    } else {
      res.status(400).json({ message: "Bid already approved" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const winBidAndPay = async (req, res) => {
  try {
    const { bidId } = req.params;

    const bid = await Bid.findById(bidId).populate("product");

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: "Bid not found",
      });
    }

    // Check if the bid is already paid
    if (bid.payment) {
      return res.status(400).json({
        success: false,
        message: "Bid is already paid",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: bid.product.title, // Product name
            },
            unit_amount: bid.amount * 100, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/success", // Redirect URL after successful payment
      cancel_url: "http://localhost:3000/cancel", // Redirect URL if payment is canceled
    });

    // bid.approved = true;

    await bid.save();
    const product = bid.product;
    product.status = "ended";
    product.payment = true;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Payment successful. Bid is marked as paid.",
      id: session.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  approveBid,
  placeBid,
  getBidsForProduct,
  winBidAndPay,
  getAllBidsForProduct,
};
