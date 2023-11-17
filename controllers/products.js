const Products = require("../models/Products");
const Bid = require("../models/Bids");
const createProduct = async (req, res, next) => {
  const newProduct = new Products(req.body);
  const saveProduct = await newProduct.save();
  res.status(200).json(saveProduct);

  next();
};

const deleteProduct = async (req, res) => {
  try {
    await Products.findByIdAndDelete(req.params.id);
    return res.status(201).send({
      message: `Product has been deleted.`,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `You are not autorized`,
    });
  }
};

const getProductsController = async (req, res) => {
  try {
    const products = await Products.find();

    const productsWithBids = await Promise.all(
      products.map(async (product) => {
        const bidCount = await Bid.countDocuments({ product: product._id });
        return { ...product._doc, bidCount }; // Merge bid count into product data
      })
    );

    return res.status(201).send({
      message: `all products`,
      success: true,
      data: {
        products: productsWithBids,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `You are not autorized`,
    });
  }
};

// Mark product as delivered
const markDelivered = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Products.findById(productId).populate("winner");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.delivered) {
      return res
        .status(400)
        .json({ message: "Product already marked as delivered" });
    }

    product.delivered = true;
    await product.save();

    res.status(200).json({ message: "Product marked as delivered" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProductController = async (req, res) => {
  try {
    const products = await Products.find({ userId: req.body.userId });

    return res.status(201).send({
      message: `your products`,
      success: true,
      data: {
        products,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `You are not autorized`,
    });
  }
};

const getNewProducts = async (req, res) => {
  try {
    const products = await Products.find({}).sort({ createdAt: -1 }).limit(8);

    res.status(200).json({
      message: `your products`,
      success: true,
      data: {
        products,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getMostBidsProducts = async (req, res) => {
  try {
    const mostBidsProducts = await Products.find({
      bidCount: { $exists: true },
    })
      .sort({ bidCount: -1 })
      .limit(4);

    res.status(200).json({
      message: `your products`,
      success: true,
      data: {
        products: mostBidsProducts,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getEndingSoonProducts = async (req, res) => {
  try {
    const currentDateTime = new Date();

    const endTimeRange = new Date(currentDateTime);
    endTimeRange.setHours(currentDateTime.getHours() + 24);

    const endingSoonProducts = await Products.find({})
      .sort({ endTime: 1 }) // Sort by endTime in ascending order
      .limit(4);

    res.status(200).json({
      message: `your products`,
      success: true,
      data: {
        products: endingSoonProducts,
      },
    });
  } catch (error) {
    console.error("Error fetching ending soon products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updatedproduct = await Products.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res.status(201).send({
      message: `your products`,
      success: true,
      data: {
        updateProduct,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `You are not autorized`,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id).populate("winner");

    return res.status(201).send({
      message: `your products`,
      success: true,
      data: {
        product,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `You are not autorized`,
    });
  }
};

const getProductsForVendor = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    const products = await Products.find({ vendor: vendorId });

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const selectWinner = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Products.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.status !== "active") {
      return res.status(400).json({ message: "Product is not active" });
    }

    const highestBid = await Bid.findOne({ product: product._id }).sort({
      amount: -1,
    });
    if (highestBid) {
      product.winner = highestBid.user;
      product.winningBidAmount = highestBid.amount;
      product.status = "ended";
      await product.save();

      res.status(200).json({ message: "Winner selected successfully" });
    } else {
      res.status(404).json({ message: "No bids found for the product" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getProductById,
  selectWinner,
  getProductsForVendor,
  getProductController,
  deleteProduct,
  getMostBidsProducts,
  getProductsController,
  updateProduct,
  getEndingSoonProducts,
  getNewProducts,
  markDelivered,
  createProduct,
};
