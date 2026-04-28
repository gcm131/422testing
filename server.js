const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connection Setup
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

// Properties Routes

// GET all properties (for index and estimator)
app.get("/properties", (req, res) => {
    const sql = `
        SELECT p.*, l.city, l.state, l.zip_code 
        FROM properties p 
        LEFT JOIN locations l ON p.location_id = l.location_id
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET a single property by ID (for the Edit Page)
app.get("/properties/:id", (req, res) => {
    const sql = `
        SELECT p.*, l.city, l.state, l.zip_code 
        FROM properties p 
        LEFT JOIN locations l ON p.location_id = l.location_id
        WHERE p.property_id = ?
    `;
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result[0]); 
    });
});

// POST /properties - Create a new property
app.post("/properties", (req, res) => {
    const { 
        title, city, state, zipCode, propertyType, 
        bedrooms, bathrooms, squareFeet, yearBuilt, 
        listingPrice, status, description 
    } = req.body;

    const locSql = "INSERT INTO locations (city, state, zip_code) VALUES (?, ?, ?)";
    
    db.query(locSql, [city, state, zipCode], (err, locResult) => {
        if (err) return res.status(500).json({ error: "Location Error: " + err.message });

        const locationId = locResult.insertId;
        const ownerId = 1; 

        const propSql = `
            INSERT INTO properties 
            (owner_id, location_id, title, property_type, bedrooms, bathrooms, square_feet, year_built, listing_price, status, description, listed_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const params = [
            ownerId, locationId, title, propertyType, 
            bedrooms, bathrooms, squareFeet, yearBuilt, 
            listingPrice, status, description
        ];

        db.query(propSql, params, (err, result) => {
            if (err) return res.status(500).json({ error: "Property Error: " + err.message });
            res.json({ success: true, id: result.insertId });
        });
    });
});

// PUT (Update) an existing property
app.put("/properties/:id", (req, res) => {
    const id = req.params.id;
    const { 
        title, city, state, zipCode, propertyType, 
        bedrooms, bathrooms, squareFeet, yearBuilt, 
        listingPrice, status, description 
    } = req.body;

    const updateLocSql = `
        UPDATE locations l
        JOIN properties p ON l.location_id = p.location_id
        SET l.city = ?, l.state = ?, l.zip_code = ?
        WHERE p.property_id = ?
    `;

    db.query(updateLocSql, [city, state, zipCode, id], (err) => {
        if (err) return res.status(500).json({ error: "Location Update Error" });

        const updatePropSql = `
            UPDATE properties SET 
            title = ?, property_type = ?, bedrooms = ?, bathrooms = ?, 
            square_feet = ?, year_built = ?, listing_price = ?, 
            status = ?, description = ?
            WHERE property_id = ?
        `;
        const params = [title, propertyType, bedrooms, bathrooms, squareFeet, yearBuilt, listingPrice, status, description, id];

        db.query(updatePropSql, params, (err) => {
            if (err) return res.status(500).json({ error: "Property Update Error" });
            res.json({ success: true });
        });
    });
});

// Transactions Route
app.get("/transactions", (req, res) => {
    const sql = `
        SELECT 
            t.transaction_id, t.sale_price, t.transaction_date, t.payment_method,
            p.title AS property_title, b.full_name AS buyer_name, s.full_name AS seller_name
        FROM transactions t
        JOIN properties p ON t.property_id = p.property_id
        JOIN users b ON t.buyer_id = b.user_id
        JOIN users s ON t.seller_id = s.user_id
        ORDER BY t.transaction_date DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Static File Support
app.use(express.static('.'));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));