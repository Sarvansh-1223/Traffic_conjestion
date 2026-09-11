require("dotenv").config();

const N8N_OBSERVATION_WEBHOOK_URL =
    process.env.N8N_OBSERVATION_WEBHOOK_URL;

const N8N_API_KEY =
    process.env.N8N_API_KEY;


// ============================================================
// USER OBSERVATION
// POST /observation
// ============================================================

const submitUserObservation = async ({
    user_id,
    road,
    recorded_date,
    recorded_time,
    observation
}) => {

    const data = {

        request_type:
            "observation",

        user_id:
            user_id,

        role:
            "USER",

        road:
            road,

        recorded_date:
            recorded_date,

        recorded_time:
            recorded_time,

        observation:
            observation
    };


    console.log(
        "========================================"
    );

    console.log(
        "USER OBSERVATION -> n8n"
    );

    console.log(
        "Webhook URL:",
        N8N_OBSERVATION_WEBHOOK_URL
    );

    console.log(
        "Data:",
        data
    );

    console.log(
        "========================================"
    );


    if (!N8N_OBSERVATION_WEBHOOK_URL) {

        const error =
            new Error(
                "N8N_OBSERVATION_WEBHOOK_URL is not configured."
            );

        error.status = 500;

        throw error;
    }


    try {

        const response =
            await fetch(
                N8N_OBSERVATION_WEBHOOK_URL,
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        // IMPORTANT:
                        // Send API key for USER too
                        "X-API-Key":
                            N8N_API_KEY || ""
                    },

                    body:
                        JSON.stringify(data)
                }
            );


        console.log(
            "n8n HTTP status:",
            response.status
        );


        const responseText =
            await response.text();


        console.log(
            "n8n response:",
            responseText
        );


        let result = null;


        if (responseText) {

            try {

                result =
                    JSON.parse(
                        responseText
                    );

            } catch {

                result = {
                    response:
                        responseText
                };
            }
        }


        if (!response.ok) {

            const error =
                new Error(
                    result?.message ||
                    result?.error ||
                    `n8n returned HTTP ${response.status}`
                );

            error.status =
                response.status;

            error.details =
                responseText;

            throw error;
        }


        console.log(
            "USER OBSERVATION successfully sent to n8n."
        );


        return result;

    } catch (error) {

        console.error(
            "USER OBSERVATION -> n8n ERROR:",
            error
        );

        throw error;
    }
};


// ============================================================
// ADMIN OBSERVATION
// ============================================================

const submitAdminObservation = async ({
    user_id,
    road,
    recorded_date,
    recorded_time,
    observation
}) => {

    const data = {

        request_type:
            "admin_observation",

        user_id:
            user_id,

        role:
            "ADMIN",

        road:
            road,

        recorded_date:
            recorded_date,

        recorded_time:
            recorded_time,

        observation:
            observation
    };


    console.log(
        "========================================"
    );

    console.log(
        "ADMIN OBSERVATION -> n8n"
    );

    console.log(
        "Webhook URL:",
        N8N_OBSERVATION_WEBHOOK_URL
    );

    console.log(
        "Data:",
        data
    );

    console.log(
        "========================================"
    );


    const response =
        await fetch(
            N8N_OBSERVATION_WEBHOOK_URL,
            {
                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "X-API-Key":
                        N8N_API_KEY || ""
                },

                body:
                    JSON.stringify(data)
            }
        );


    console.log(
        "n8n HTTP status:",
        response.status
    );


    const text =
        await response.text();


    console.log(
        "n8n response:",
        text
    );


    if (!response.ok) {

        const error =
            new Error(
                `n8n workflow failed with status ${response.status}`
            );

        error.status =
            response.status;

        error.details =
            text;

        throw error;
    }


    return text;
};


module.exports = {

    submitUserObservation,

    submitAdminObservation

};