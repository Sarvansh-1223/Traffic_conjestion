const trafficModel =
    require("../models/trafficModel");

const n8nService =
    require("../services/n8nService");


// ============================================================
// GET CURRENT TRAFFIC
// GET /api/current-traffic
// ============================================================

async function getCurrentTraffic(req, res) {

    try {

        const {
            road,
            date,
            time
        } = req.query;


        // Validate

        if (!road || !date || !time) {

            return res.status(400).json({
                error:
                    "Road, date and time are required."
            });
        }


        // Get sensor data

        const result =
            await trafficModel.getCurrentTraffic(
                road,
                date,
                time
            );


        if (!result) {

            return res.status(404).json({
                error:
                    "No sensor data found for the selected road, date and time."
            });
        }


        return res.json(result);

    } catch (error) {

        console.error(
            "Current traffic error:",
            error
        );

        return res.status(500).json({
            error:
                "Unable to load sensor data."
        });
    }
}


// ============================================================
// GET TRAFFIC ANALYSIS
// GET /api/traffic-analysis
// ============================================================

async function getTrafficAnalysis(req, res) {

    try {

        const {
            road,
            date,
            time
        } = req.query;


        // Validate

        if (!road || !date || !time) {

            return res.status(400).json({
                error:
                    "Road, date and time are required."
            });
        }


        // Get existing analysis

        const row =
            await trafficModel.getTrafficAnalysis(
                road,
                date,
                time
            );


        if (!row) {

            return res.status(404).json({
                found: false
            });
        }


        // Return same response structure
        // expected by frontend

        return res.json({

            found: true,

            road:
                row.road,

            average_speed:
                row.average_speed,

            vehicle_count:
                row.vehicle_count,

            congestion:
                row.congestion,

            severity:
                row.severity,

            temperature:
                row.temperature,

            humidity:
                row.humidity,

            prediction:
                row.prediction,

            reason:
                row.reason,

            recommended_action:
                row.recommended_action,

            summary:
                row.summary,

            recorded_date:
                row.analysis_date,

            recorded_time:
                row.analysis_time

        });

    } catch (error) {

        console.error(
            "Traffic analysis lookup error:",
            error
        );

        return res.status(500).json({
            error:
                "Unable to retrieve traffic analysis."
        });
    }
}


// ============================================================
// POST ANALYZE TRAFFIC
// POST /api/analyze
// ============================================================

async function analyzeTraffic(req, res) {

    try {

        const {
            road,
            average_speed,
            vehicle_count,
            recorded_date,
            recorded_time,
            temperature,
            humidity
        } = req.body;


        // ----------------------------------------------------
        // Validate
        // ----------------------------------------------------

        if (
            !road ||
            !recorded_date ||
            !recorded_time
        ) {

            return res.status(400).json({
                error:
                    "Road, date and time are required."
            });
        }


        // ----------------------------------------------------
        // Normalize date
        // ----------------------------------------------------

        let analysisDate =
            recorded_date;


        if (
            typeof analysisDate === "string" &&
            analysisDate.includes("T")
        ) {

            analysisDate =
                analysisDate.substring(0, 10);
        }


        // ----------------------------------------------------
        // Check existing analysis
        // ----------------------------------------------------

        const existing =
            await trafficModel.findAnalysis(
                road,
                analysisDate,
                recorded_time
            );


        if (existing) {

            console.log(
                "Existing traffic analysis found."
            );

            return res.json(existing);
        }


        // ----------------------------------------------------
        // No existing analysis
        // Send request to n8n
        // ----------------------------------------------------

        console.log(
            "No existing analysis found. Starting n8n workflow."
        );


        const result =
            await n8nService.analyzeTraffic({

                request_type:
                    "analysis",

                road:
                    road,

                average_speed:
                    average_speed,

                vehicle_count:
                    vehicle_count,

                recorded_date:
                    analysisDate,

                recorded_time:
                    recorded_time,

                temperature:
                    temperature,

                humidity:
                    humidity,

                user_id:
                    req.user.user_id

            });


        return res.json(result);


    } catch (error) {

        console.error(
            "Traffic analysis error:",
            error
        );

        return res.status(500).json({
            error:
                "Unable to process traffic analysis."
        });
    }
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    getCurrentTraffic,

    getTrafficAnalysis,

    analyzeTraffic

};