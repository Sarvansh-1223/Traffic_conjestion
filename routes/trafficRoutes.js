const express = require("express");

const trafficController =
    require("../controllers/trafficController");

const {
    authenticateToken
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/current-traffic",
    authenticateToken,
    trafficController.getCurrentTraffic
);

router.get(
    "/traffic-analysis",
    authenticateToken,
    trafficController.getTrafficAnalysis
);

router.post(
    "/analyze",
    authenticateToken,
    trafficController.analyzeTraffic
);

module.exports = router;