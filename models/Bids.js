const mongoose = require("mongoose");
const BidsSchema = new mongoose.Schema(
	{
		cuser: {

				type: mongoose.Schema.ObjectId,
				ref: "User",
		},
		product: {
				type: mongoose.Schema.ObjectId,
				ref: "Products",
		},
		bids: {
			type: Number,
			default: 0,
		},		

		price: {
			type: Number,
			required: true,
		},

		description: {
			type: String,
		},

	},
	{ timestamps: true }
);
module.exports = mongoose.model("Bids", BidsSchema);
