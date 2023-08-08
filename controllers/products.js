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
    const product = await Products.findById(req.params.id);

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

module.exports = {
  getProductById,
  getProductController,
  deleteProduct,
  getProductsController,
  updateProduct,
  createProduct,
};
