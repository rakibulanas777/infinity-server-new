const User = require("../models/User");
const Product = require("../models/Product");
const Bid = require("../models/Bid");

const getTotalPaidProductsAndWinningAmount = async (req, res) => {
  try {
    const { vendorId } = req.params;

    // Check if the vendor exists
    const vendor = await User.findById(vendorId);
    if (!vendor || vendor.role !== "vendor") {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Count the total paid products for the vendor
    const totalPaidProducts = await Product.countDocuments({
      vendor: vendorId,
      paymentStatus: "paid", // Assuming you have a field to track payment status
    });

    // Get the winning bids for the vendor's products
    const winningBids = await Bid.find({
      product: { $in: await Product.find({ vendor: vendorId }, "_id") },
      paymentStatus: "paid", // Assuming you have a field to track payment status
    });

    // Sum the winning amounts
    const totalWinningAmount = winningBids.reduce(
      (sum, bid) => sum + bid.amount,
      0
    );

    res.status(200).json({
      success: true,
      totalPaidProducts,
      totalWinningAmount,
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
  getTotalPaidProductsAndWinningAmount,
};
