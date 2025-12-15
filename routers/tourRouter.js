const express = require("express");
const router = express.Router();
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
} = require("../controllers/tourControllers");
const requireAuth = require("../middleware/requireAuth");
router.use(requireAuth);

router.get("/", getAllTours);
router.post("/", createTour);
router.get("/:tourId", getTour);
router.put("/:tourId", updateTour);
router.delete("/:tourId", deleteTour);

module.exports = router;
