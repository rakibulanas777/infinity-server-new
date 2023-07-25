const User = require("../models/Users");

const register = async (req, res, next) => {
	const newUser = new User({
		...req.body,
	});

	await newUser.save();

	res.status(200).send("User has been created.");
	next();
};

module.exports = register;
