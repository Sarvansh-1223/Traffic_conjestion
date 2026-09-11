const db = require("../config/database");


// ============================================================
// GET CONFIRMED OBSERVATION
// ============================================================

async function getConfirmedObservation(
    road,
    recordedDate,
    recordedTime
) {

    const [rows] = await db.execute(
        `
        SELECT
            id,
            road,
            recorded_date,
            recorded_time,
            observation,
            user_count
        FROM confirmed_observations
        WHERE road = ?
          AND recorded_date = ?
          AND TIME_FORMAT(
                recorded_time,
                '%H:%i'
              ) = TIME_FORMAT(
                ?,
                '%H:%i'
              )
        ORDER BY
            user_count DESC,
            id DESC
        LIMIT 1
        `,
        [
            road,
            recordedDate,
            recordedTime
        ]
    );

    return rows[0] || null;
}


module.exports = {
    getConfirmedObservation
};