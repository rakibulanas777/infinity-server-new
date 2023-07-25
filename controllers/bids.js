const Bids = require("../models/Bids");

const createBids = async (req, res, next) => {
	const newBids = new Bids(req.body);
	const saveBids = await newBids.save();
	res.status(200).json(saveBids);
	console.log(saveBids);
	next();
};



const getBids = async (req, res, next) => {
	const bids = await Bids.find();
	res.status(200).json(bids);
	next();
};

// const updateProduct = async (req, res, next) => {
// 	const updatedHotel = await Products.findByIdAndUpdate(
// 		req.params.id,
// 		{ $set: req.body },
// 		{ new: true }
// 	);
// 	res.status(200).json(updatedHotel);
// 	next();
// };

// const getProductById = async (req, res, next) => {
// 	console.log(req.params.id);
// 	const product = await Products.findById(req.params.id);
// 	res.status(200).json(product);
// 	next();
// };

module.exports = {
	createBids,
	getBids
};
