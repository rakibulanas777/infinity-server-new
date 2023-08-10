const Bid = require("../models/Bids");
const User = require("../models/Users");
const Products = require("../models/Products");
const socketIO = require("../socket");
const http = require("http");
const io = require("../socket");
// Place a bid on a product
const placeBid = async (req, res) => {
  try {
    const { productId } = req.params;
    const { amount, userId, vendor } = req.body;

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
    const product = await Products.findById(productId);
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

    const vendorId = vendor;

    io.getIO().emit("newBid", { vendorId, productId, newBid });

    const server = http.createServer(app);

    const io = socketIO.init(server);

    io.on("connection", (socket) => {
      socket.on("joinVendorRoom", (vendorId) => {
        socket.join(vendorId);
      });
    });

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

// Approve a bid and mark product as sold
const approveBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    console.log(bidId);
    const bid = await Bid.findById(bidId).populate("product");

    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    const product = bid.product;

    if (!bid.approved) {
      bid.approved = true;
      await bid.save();

      // Notify the bidder that their bid is approved

      res.status(200).json({ message: "Bid approved", success: true });
    } else {
      res.status(400).json({ message: "Bid already approved" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  approveBid,
  placeBid,
  getAllBidsForProduct,
};
