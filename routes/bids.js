const express = require("express");
const {
	createBids,
	getBids
} = require("../controllers/bids");

const router = express.Router();


router.post("/", createBids);
router.get("/", getBids);


module.exports = router;
