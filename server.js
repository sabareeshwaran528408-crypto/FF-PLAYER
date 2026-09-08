const express = require("express");
const cors = require("cors");
const db = require("./db");
require("dotenv").config();

const app = express();

// ===============================
// MIDDLEWARE
// ===============================
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static("frontend"));


// ===============================
// HOME PAGE
// ===============================
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/frontend/index.html");
});


// ===============================
// GET PLAYER BY UID
// ===============================
app.get("/api/players/:uid", (req, res) => {

    const uid = req.params.uid;

    console.log("=================================");
    console.log("UID received:", uid);

    const sql = "SELECT * FROM players WHERE uid = ?";

    db.query(sql, [uid], (err, results) => {

        // ===============================
        // MYSQL ERROR
        // ===============================
        if (err) {

            console.log("MYSQL ERROR:");
            console.log(err);

            return res.status(500).json({
                success: false,
                message: err.message
            });
        }


        // ===============================
        // QUERY SUCCESS
        // ===============================
        console.log("QUERY RESULT:", results);


        // ===============================
        // PLAYER NOT FOUND
        // ===============================
        if (results.length === 0) {

            console.log("Player not found");

            return res.status(404).json({
                success: false,
                message: "Player not found"
            });
        }


        // ===============================
        // PLAYER FOUND
        // ===============================
        console.log("Player found:", results[0].player_name);

        res.json({
            success: true,
            player: results[0]
        });

    });
});


// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("=================================");
    console.log(`FF Player API running on http://localhost:${PORT}`);
    console.log("=================================");
});