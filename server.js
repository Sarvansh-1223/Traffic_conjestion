const express = require("express");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const trafficRoutes = require("./routes/trafficRoutes");
const observationRoutes = require("./routes/observationRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public"), {
    index: false
}));

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "login.html")
    );
});

app.use("/", authRoutes);
app.use("/api", observationRoutes);
app.use("/api", trafficRoutes);
app.use("/api", userRoutes);

app.use((req, res) => {
    res.status(404).json({
        error: "Route not found."
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});