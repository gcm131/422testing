const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234", 
    database: "RealEstMng"
});

db.connect(err => {
    if (err) {
        console.error("DB connection error:", err);
        process.exit(1);
    }
    console.log("MySQL connected");
});

// CHANGE: Use /api/ prefix to prevent naming conflicts with your .html/.js files
app.get("/api/transactions", (req, res) => {
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
            console.error("SQL Error:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Fallback logger - Check your terminal when you refresh the page!
app.use((req, res) => {
    console.log(`404 Check: ${req.method} ${req.url}`);
    res.status(404).send("Route not found");
});

app.listen(3000, () => console.log("Server on 3000"));