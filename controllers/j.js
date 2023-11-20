const stripe = require("stripe")("your-secret-key"); // Replace with your actual secret key
const Bid = require("../models/Bid");
const Product = require("../models/Product");

const winBidAndPay = async (req, res) => {
  try {
    const { bidId } = req.params;
    const userId = req.user.id; // Assuming the user information is available in the request

    // Find the bid
    const bid = await Bid.findById(bidId).populate("product");

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: "Bid not found",
      });
    }

    // Check if the user is the winner
    if (bid.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not the winner of this bid",
      });
    }

    // Check if the bid is already paid
    if (bid.approved) {
      return res.status(400).json({
        success: false,
        message: "Bid is already paid",
      });
    }

    // Initiate the payment using Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: bid.amount * 100, // Amount in cents
      currency: "usd",
      description: "Bid Payment",
      payment_method: req.body.payment_method, // Assuming the payment method is provided in the request body
      confirm: true,
    });

    // Check if the payment was successful
    if (paymentIntent.status === "succeeded") {
      // Mark the bid as paid
      bid.approved = true;
      await bid.save();

      // Update the product status or perform other actions as needed
      const product = bid.product;
      product.status = "ended"; // Update the status, for example
      await product.save();

      res.status(200).json({
        success: true,
        message: "Payment successful. Bid is marked as paid.",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment failed",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  winBidAndPay,
};
