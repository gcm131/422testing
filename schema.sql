CREATE SCHEMA RealEstMng;

USE RealEstMng;

CREATE TABLE locations (
    location_id INT NOT NULL AUTO_INCREMENT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    neighborhood VARCHAR(100),
    PRIMARY KEY (location_id)
);

CREATE TABLE users (
    user_id INT NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    role ENUM('Admin','Seller','Buyer'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
);

CREATE TABLE properties (
    property_id INT NOT NULL AUTO_INCREMENT,
    owner_id INT,
    location_id INT,
    title VARCHAR(150),
    property_type VARCHAR(50),
    bedrooms INT,
    bathrooms DECIMAL(3,1),
    square_feet INT,
    year_built INT,
    listing_price DECIMAL(12,2),
    status ENUM('Available','Pending','Sold'),
    description TEXT,
    listed_date DATE,
    PRIMARY KEY (property_id),
    FOREIGN KEY (owner_id) REFERENCES users(user_id),
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
);

CREATE TABLE price_estimates (
    estimate_id INT NOT NULL AUTO_INCREMENT,
    property_id INT NOT NULL,
    estimated_price DECIMAL(12,2),
    model_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (estimate_id),
    FOREIGN KEY (property_id) REFERENCES properties(property_id)
);

CREATE TABLE transactions (
    transaction_id INT NOT NULL AUTO_INCREMENT,
    property_id INT,
    buyer_id INT,
    seller_id INT,
    sale_price DECIMAL(12,2),
    transaction_date DATE,
    payment_method VARCHAR(50),
    PRIMARY KEY (transaction_id),
    FOREIGN KEY (property_id) REFERENCES properties(property_id),
    FOREIGN KEY (buyer_id) REFERENCES users(user_id),
    FOREIGN KEY (seller_id) REFERENCES users(user_id)
);
