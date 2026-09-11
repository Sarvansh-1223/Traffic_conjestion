const express = require("express");

const {
    createObservation,
    createAdminObservation,
    getConfirmedObservation
} = require("../controllers/observationController");

const {
    authenticateToken,
    authenticateAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();


// ============================================================
// USER OBSERVATION
// ============================================================

router.post(
    "/observation",
    authenticateToken,
    createObservation
);


// ============================================================
// ADMIN OBSERVATION
// ============================================================

router.post(
    "/admin/observation",
    authenticateToken,
    authenticateAdmin,
    createAdminObservation
);


// ============================================================
// GET CONFIRMED OBSERVATION
// ============================================================

router.get(
    "/confirmed-observation",
    authenticateToken,
    getConfirmedObservation
);


module.exports = router;