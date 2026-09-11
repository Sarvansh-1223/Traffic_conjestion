// ============================================================
// IMPORTS
// ============================================================

const {
    submitUserObservation,
    submitAdminObservation
} = require("../services/observationService");

const observationModel =
    require("../models/observationModel");


// ============================================================
// GET CONFIRMED OBSERVATION
// GET /api/confirmed-observation
// ============================================================

const getConfirmedObservation = async (
    req,
    res
) => {

    try {

        const {
            road,
            recorded_date,
            recorded_time
        } = req.query;


        // ----------------------------------------------------
        // Validate
        // ----------------------------------------------------

        if (
            !road ||
            !recorded_date ||
            !recorded_time
        ) {

            return res.status(400).json({

                confirmed: false,

                error:
                    "Road, date and time are required."
            });
        }


        console.log(
            "Searching confirmed observation:",
            {
                road,
                recorded_date,
                recorded_time
            }
        );


        // ----------------------------------------------------
        // Search confirmed_observations table
        // ----------------------------------------------------

        const result =
            await observationModel.getConfirmedObservation(
                road,
                recorded_date,
                recorded_time
            );


        // ----------------------------------------------------
        // No observation found
        // ----------------------------------------------------

        if (!result) {

            console.log(
                "No confirmed observation found."
            );

            return res.json({

                confirmed: false,

                observation: null,

                user_count: 0,

                road:
                    road,

                recorded_date:
                    recorded_date,

                recorded_time:
                    recorded_time
            });
        }


        // ----------------------------------------------------
        // Observation found
        // ----------------------------------------------------

        console.log(
            "Confirmed observation found:",
            result
        );


        return res.json({

            confirmed: true,

            observation:
                result.observation,

            user_count:
                result.user_count,

            road:
                result.road,

            recorded_date:
                result.recorded_date,

            recorded_time:
                result.recorded_time
        });


    } catch (error) {

        console.error(
            "Confirmed observation error:",
            error
        );


        return res.status(500).json({

            confirmed: false,

            error:
                "Unable to load confirmed observation."
        });
    }
};


// ============================================================
// CREATE USER OBSERVATION
// POST /observation
// ============================================================

const createObservation = async (
    req,
    res
) => {

    try {

        const {
            road,
            recorded_date,
            recorded_time,
            observation
        } = req.body;


        // ----------------------------------------------------
        // Validate
        // ----------------------------------------------------

        if (
            !road ||
            !recorded_date ||
            !recorded_time ||
            !observation
        ) {

            return res.status(400).json({

                error:
                    "All observation fields are required."
            });
        }


        console.log(
            "Submitting user observation:",
            {
                user_id:
                    req.user.user_id,

                road,
                recorded_date,
                recorded_time,
                observation
            }
        );


        // ----------------------------------------------------
        // Send observation to n8n
        // ----------------------------------------------------

        const result =
            await submitUserObservation({

                user_id:
                    req.user.user_id,

                road,

                recorded_date,

                recorded_time,

                observation
            });


        console.log(
            "User observation sent successfully."
        );


        return res.json({

            success: true,

            observation_result:
                result
        });


    } catch (error) {

        console.error(
            "Observation error:",
            error
        );


        return res.status(
            error.status || 500
        ).json({

            error:
                error.message ||
                "Unable to send observation to n8n."
        });
    }
};


// ============================================================
// CREATE ADMIN OBSERVATION
// POST /admin/observation
// ============================================================

const createAdminObservation = async (
    req,
    res
) => {

    try {

        const {
            road,
            recorded_date,
            recorded_time,
            observation
        } = req.body;


        // ----------------------------------------------------
        // Validate
        // ----------------------------------------------------

        if (
            !road ||
            !recorded_date ||
            !recorded_time ||
            !observation
        ) {

            return res.status(400).json({

                error:
                    "All observation fields are required."
            });
        }


        console.log(
            "Submitting admin observation:",
            {
                user_id:
                    req.user.user_id,

                road,
                recorded_date,
                recorded_time,
                observation
            }
        );


        // ----------------------------------------------------
        // Send admin observation to n8n
        // ----------------------------------------------------

        const result =
            await submitAdminObservation({

                user_id:
                    req.user.user_id,

                road,

                recorded_date,

                recorded_time,

                observation
            });


        console.log(
            "Admin observation sent successfully."
        );


        return res.json({

            success: true,

            message:
                "Admin observation submitted successfully.",

            result
        });


    } catch (error) {

        console.error(
            "Admin observation error:",
            error
        );


        return res.status(
            error.status || 500
        ).json({

            error:
                error.message ||
                "Unable to submit admin observation."
        });
    }
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    createObservation,

    createAdminObservation,

    getConfirmedObservation

};