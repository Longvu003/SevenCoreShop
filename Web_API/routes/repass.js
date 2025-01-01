// routes/repass.js
const express = require("express");
const router = express.Router();
const resetPasswordController = require("../controllers/RepassController");

router.post("/resetPassword", resetPasswordController.resetPassword);

module.exports = router;
