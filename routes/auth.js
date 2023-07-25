const express = require("express");
const register = require("../controllers/auth");
const router = express.Router();

router.get("/", (req, res) => {
	res.send("hello ");
});
router.post("/", register);

module.exports = router;
