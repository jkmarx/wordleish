// Create express app
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const db = require("./database.js");

// Server port
const HTTP_PORT = 8000;
// Start server
app.listen(HTTP_PORT, () => {
  console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});
// Root endpoint
app.get("/api/v1/word", (req, res, next) => {
  const currentDate = new Date();
  const currentDateStr = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
  const todayWordSql = `SELECT * FROM wordList WHERE date_last_used = "${currentDateStr}"`;

  db.get(todayWordSql, [], (err, todayWordRow) => {
    if (!todayWordRow) {
      const randWordSql =
        "SELECT * FROM wordList WHERE date_last_used IS NULL ORDER BY RANDOM() LIMIT 1";
      db.get(randWordSql, [], (err, newWordRow) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        } else if (newWordRow) {
          db.run(
            "UPDATE wordList SET date_last_used = $todaysDate WHERE id=$id",
            {
              $id: newWordRow.id,
              $todaysDate: currentDateStr,
            }
          );
          res.json({
            message: "success",
            data: newWordRow.name,
          });
        }
      });
    } else {
      res.json({
        message: "success",
        data: todayWordRow.name,
      });
    }
  });
});

// Default response for any other request
app.use(function (req, res) {
  res.status(404);
});
