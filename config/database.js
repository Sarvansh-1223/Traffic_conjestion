const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Return DATE/DATETIME columns as plain strings ("YYYY-MM-DD"),
    // not JS Date objects. Without this, mysql2 builds a Date at local
    // midnight, and JSON.stringify()/toISOString() later converts that
    // to UTC — which rolls the date back a day for any timezone ahead
    // of UTC (e.g. IST, UTC+5:30). That's what was causing recorded_date
    // to arrive at the n8n webhook one day earlier than what was entered.
    dateStrings: true
});

module.exports = db;