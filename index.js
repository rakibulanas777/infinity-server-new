const express = require("express");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const bidsRoute = require("./routes/bids");
const productRoute = require("./routes/products");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
dotenv.config();
const port = process.env.PORT || 8000;
app.use(cors());
app.get("/", (req, res) => {
	res.send("Hello world ");
});

//connect with database
const connect = async () => {
	try {
		await mongoose.connect(process.env.MONGODB);
		console.log("Connected");
	} catch (error) {
		throw error;
	}
};

mongoose.connection.on("disconnected", () => {
	console.log("disconnected");
});
mongoose.connection.on("connected", () => {
	console.log("connected");
});

//middlewares
app.use(express.json());

app.use("/api/v1/user", express.static("./uploads"), userRoute);
// app.use("/register", authRoute);
app.use("/api/v1/product", productRoute);
app.use("/bids", bidsRoute);

app.listen(port, () => {
	connect();
	console.log(`LIstening on port ${port}`);
});
