const N8N_WEBHOOK_URL =
    process.env.N8N_WEBHOOK_URL;

const N8N_API_KEY =
    process.env.N8N_API_KEY;

async function analyzeTraffic(data) {

    const response = await fetch(
        N8N_WEBHOOK_URL,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "X-API-Key": N8N_API_KEY
            },

            body: JSON.stringify(data)
        }
    );

    const responseText =
        await response.text();

    let result;

    try {
        result = JSON.parse(responseText);
    } catch {
        result = {
            response: responseText
        };
    }

    if (!response.ok) {
        throw new Error(
            result.message ||
            result.error ||
            "n8n request failed."
        );
    }

    return result?.output || result;
}

module.exports = {
    analyzeTraffic
};