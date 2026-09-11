const db = require("../config/database");


// ============================================================
// GET CURRENT TRAFFIC / SENSOR DATA
// ============================================================

async function getCurrentTraffic(
    road,
    date,
    time
) {

    const [rows] = await db.execute(
        `
        SELECT
            road,
            average_speed,
            vehicle_count,
            recorded_date,
            recorded_time,
            temperature,
            humidity
        FROM traffic_data
        WHERE road = ?
          AND recorded_date = ?
          AND TIME_FORMAT(
                recorded_time,
                '%H:%i'
              ) = ?
        ORDER BY recorded_time ASC
        LIMIT 1
        `,
        [
            road,
            date,
            time
        ]
    );

    return rows[0] || null;
}


// ============================================================
// GET EXISTING TRAFFIC ANALYSIS
// ============================================================

async function getTrafficAnalysis(
    road,
    date,
    time
) {

    const [rows] = await db.execute(
        `
        SELECT
            id,
            road,
            average_speed,
            vehicle_count,
            congestion,
            severity,
            temperature,
            humidity,
            prediction,
            reason,
            recommended_action,
            summary,
            analysis_date,
            analysis_time
        FROM traffic_analysis
        WHERE road = ?
          AND analysis_date = ?
          AND TIME_FORMAT(
                analysis_time,
                '%H:%i'
              ) = ?
        ORDER BY id DESC
        LIMIT 1
        `,
        [
            road,
            date,
            time
        ]
    );

    return rows[0] || null;
}


// ============================================================
// FIND EXISTING ANALYSIS
// Used by POST /api/analyze
// ============================================================

async function findAnalysis(
    road,
    date,
    time
) {

    const [rows] = await db.execute(
        `
        SELECT
            id,
            road,
            average_speed,
            vehicle_count,
            congestion,
            severity,
            temperature,
            humidity,
            prediction,
            reason,
            recommended_action,
            summary,
            analysis_date,
            analysis_time
        FROM traffic_analysis
        WHERE road = ?
          AND analysis_date = ?
          AND TIME_FORMAT(
                analysis_time,
                '%H:%i'
              ) = TIME_FORMAT(
                ?,
                '%H:%i'
              )
        ORDER BY id DESC
        LIMIT 1
        `,
        [
            road,
            date,
            time
        ]
    );

    if (rows.length === 0) {
        return null;
    }

    const row = rows[0];

    return {
        road: row.road,

        average_speed:
            row.average_speed,

        vehicle_count:
            row.vehicle_count,

        recorded_date:
            row.analysis_date,

        recorded_time:
            row.analysis_time,

        temperature:
            row.temperature,

        humidity:
            row.humidity,

        congestion:
            row.congestion,

        severity:
            row.severity,

        prediction:
            row.prediction || "",

        reason:
            row.reason || "",

        recommended_action:
            row.recommended_action || "",

        summary:
            row.summary || ""
    };
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    getCurrentTraffic,

    getTrafficAnalysis,

    findAnalysis

};