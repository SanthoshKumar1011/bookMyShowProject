const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const port = "3004";

const dbPath = path.join(__dirname, "bookmyseat.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
  } catch (e) {
    console.log(`DB Error ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/seats/", async (req, res) => {
  const { seat_type = "" } = req.query;
  const query = `SELECT * FROM Seats WHERE seat_type LIKE '%${seat_type}%' ORDER BY seat_id;`;
  const data = await db.all(query);
  res.send(data);
});

app.put("/bookseat/", async (req, res) => {
  const { selectedSeats } = req.body;
  const seats = selectedSeats.join(",");
  const query = `UPDATE Seats
                 SET status = 'Booked'
                 WHERE seat_id IN (${seats});`;
  await db.run(query);
  res.send({ msg: "Seat updated" });
});

module.exports = app;
