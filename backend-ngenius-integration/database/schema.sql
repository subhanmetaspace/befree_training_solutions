-- =============================================
-- N-Genius Payment Gateway - Database Schema (MySQL)
-- BeFree EdTech Platform
-- =============================================

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    plan_id VARCHAR(100) NOT NULL,
    plan_name VARCHAR(255),
    
    -- Billing Info
    billing_cycle ENUM('month', 'year') NOT NULL DEFAULT 'month',
    quantity INT NOT NULL DEFAULT 1,
    base_price DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'AED',
    
    -- Contact Information
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    
    -- Billing Address
    country VARCHAR(100),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    
    -- Payment Info
    payment_method ENUM('card', 'online') DEFAULT 'card',
    
    -- N-Genius Payment Gateway Fields
    ngenius_order_ref VARCHAR(100) UNIQUE,
    ngenius_payment_ref VARCHAR(100),
    payment_url TEXT,
    
    -- Order Status
    status ENUM('pending', 'awaiting_payment', 'processing', 'paid', 'failed', 'refunded', 'cancelled') DEFAULT 'pending',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    paid_at TIMESTAMP NULL,
    
    -- Metadata
    merchant_order_reference VARCHAR(100),
    notes TEXT,
    
    INDEX idx_orders_user_id (user_id),
    INDEX idx_orders_status (status),
    INDEX idx_orders_email (email),
    INDEX idx_orders_ngenius_order_ref (ngenius_order_ref),
    INDEX idx_orders_created_at (created_at)
);

-- Payment Transactions Table (for tracking all payment attempts)
CREATE TABLE IF NOT EXISTS payment_transactions (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36),
    
    -- N-Genius Transaction Info
    ngenius_payment_ref VARCHAR(100),
    ngenius_order_ref VARCHAR(100),
    transaction_type ENUM('sale', 'capture', 'refund', 'void') DEFAULT 'sale',
    
    -- Amount
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'AED',
    
    -- Status
    status ENUM('pending', 'authorized', 'captured', 'failed', 'refunded', 'voided') DEFAULT 'pending',
    
    -- Response Data
    response_code VARCHAR(10),
    response_message TEXT,
    auth_code VARCHAR(50),
    rrn VARCHAR(50),
    
    -- Card Info (masked)
    card_brand VARCHAR(20),
    card_last_four VARCHAR(4),
    card_expiry VARCHAR(7),
    
    -- 3DS Info
    three_ds_status VARCHAR(50),
    three_ds_enrolled BOOLEAN DEFAULT FALSE,
    
    -- Raw Response
    raw_response JSON,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_payment_transactions_order_id (order_id),
    INDEX idx_payment_transactions_ngenius_payment_ref (ngenius_payment_ref),
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
