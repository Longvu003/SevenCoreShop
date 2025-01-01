const express = require("express");
const router = express.Router();
const PayOnlineController = require("../controllers/PayOnlineController");

// Get all pay online entries
router.get("/", async (req, res, next) => {
  try {
    const payOnlineList = await PayOnlineController.getPayOnlineList();
    return res.status(200).json({ status: true, data: payOnlineList });
  } catch (error) {
    console.log("Get pay online list error", error.message);
    res.status(500).json({ status: false, data: error.message });
  }
});
// Create a new pay online entry
router.post("/add", async (req, res, next) => {
  try {
    const { bank, acc_holder, acc_number, images } = req.body;
    const payOnline = await PayOnlineController.createPayOnline(
      bank,
      acc_holder,
      acc_number,
      images
    );
    return res.status(200).json({ status: true, data: payOnline });
  } catch (error) {
    console.log("Create pay online error", error.message);
    res.status(500).json({ status: false, data: error.message });
  }
});

// Update a pay online entry
router.post("/:id/update", async (req, res, next) => {
  try {
    const id = req.params.id;
    const { bank, acc_holder, acc_number, images } = req.body;
    const payOnline = await PayOnlineController.updatePayOnline(
      id,
      bank,
      acc_holder,
      acc_number,
      images
    );
    return res.status(200).json({ status: true, data: payOnline });
  } catch (error) {
    console.log("Update pay online error", error.message);
    res.status(500).json({ status: false, data: error.message });
  }
});

// Delete a pay online entry
router.post("/:id/delete", async (req, res, next) => {
  try {
    const id = req.params.id;
    const payOnline = await PayOnlineController.deletePayOnline(id);
    return res.status(200).json({ status: true, data: payOnline });
  } catch (error) {
    console.log("Delete pay online error", error.message);
    res.status(500).json({ status: false, data: error.message });
  }
});

// Get pay online entry by ID
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(id);
    const payOnline = await PayOnlineController.getPayOnlineById(id);

    return res.status(200).json({ status: true, data: payOnline });
  } catch (error) {
    console.log("Get pay online by id error", error.message);
    res.status(500).json({ status: false, data: error.message });
  }
});

module.exports = router;
