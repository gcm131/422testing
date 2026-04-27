const express = require("express");
const router = express.Router();
const db = require("./db");

// GET all properties
router.get("/", (req, res) => {
  db.query("SELECT * FROM properties", (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// POST create a property
router.post("/", (req, res) => {
  const { address, price, description } = req.body;

  db.query(
    "INSERT INTO properties (address, price, description) VALUES (?, ?, ?)",
    [address, price, description],
    (err, result) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ id: result.insertId, address, price, description });
    }
  );
});

module.exports = router;
