const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// UPDATE THESE TO MATCH YOUR MYSQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234", // <--- PUT YOUR REAL PASSWORD HERE
    database: "RealEstMng"   // <--- MAKE SURE THIS MATCHES YOUR DB
});

db.connect(err => {
    if (err) {
        console.error("DB connection error:", err);
        process.exit(1);
    }
    console.log("MySQL connected");
});

// ---------------------------
// GET /properties (with city)
// ---------------------------
app.get("/properties", (req, res) => {
    const sql = `
        SELECT 
            p.property_id,
            p.owner_id,
            p.location_id,
            p.title,
            p.property_type,
            p.bedrooms,
            p.bathrooms,
            p.square_feet,
            p.year_built,
            p.listing_price,
            p.status,
            p.description,
            p.listed_date,
            l.city,
            l.state,
            l.zip_code,
            l.neighborhood
        FROM properties p
        JOIN locations l ON p.location_id = l.location_id
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching properties:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

// -------------------------------------------
// GET /transactions (JOIN properties + users)
// -------------------------------------------
app.get("/transactions", (req, res) => {
    const sql = `
        SELECT 
            t.transaction_id,
            t.sale_price,
            t.transaction_date,
            t.payment_method,
            p.title AS property_title,
            b.full_name AS buyer_name,
            s.full_name AS seller_name
        FROM transactions t
        JOIN properties p ON t.property_id = p.property_id
        JOIN users b ON t.buyer_id = b.user_id
        JOIN users s ON t.seller_id = s.user_id
        ORDER BY t.transaction_date DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching transactions:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

// ---------------------------
// POST /transactions/simulate
// ---------------------------
app.post("/transactions/simulate", (req, res) => {
    const sql = `
        INSERT INTO transactions 
        (property_id, buyer_id, seller_id, sale_price, transaction_date, payment_method)
        VALUES (?, ?, ?, ?, NOW(), ?)
    `;

    const { property_id, buyer_id, seller_id, sale_price, payment_method } = req.body;

    db.query(sql, [property_id, buyer_id, seller_id, sale_price, payment_method], (err, result) => {
        if (err) {
            console.error("Error inserting transaction:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ success: true, transaction_id: result.insertId });
    });
});

// ---------------------------
// START SERVER
// ---------------------------
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
