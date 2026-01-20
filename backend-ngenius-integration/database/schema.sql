-- =============================================
-- N-Genius Payment Gateway - Database Schema
-- BeFree EdTech Platform
-- =============================================

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    plan_id VARCHAR(100) NOT NULL,
    plan_name VARCHAR(255),
    
    -- Billing Info
    billing_cycle VARCHAR(20) NOT NULL CHECK (billing_cycle IN ('month', 'year')),
    quantity INTEGER NOT NULL DEFAULT 1,
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
    payment_method VARCHAR(20) CHECK (payment_method IN ('card', 'online')),
    
    -- N-Genius Payment Gateway Fields
    ngenius_order_ref VARCHAR(100) UNIQUE,
    ngenius_payment_ref VARCHAR(100),
    payment_url TEXT,
    
    -- Order Status
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
        'pending',
        'awaiting_payment',
        'processing',
        'paid',
        'failed',
        'refunded',
        'cancelled'
    )),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    merchant_order_reference VARCHAR(100),
    notes TEXT,
    metadata JSONB DEFAULT '{}'
);

-- Create indexes for faster queries
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_ngenius_order_ref ON orders(ngenius_order_ref);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Payment Transactions Table (for tracking all payment attempts)
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    
    -- N-Genius Transaction Info
    ngenius_payment_ref VARCHAR(100),
    ngenius_order_ref VARCHAR(100),
    transaction_type VARCHAR(50) CHECK (transaction_type IN ('sale', 'capture', 'refund', 'void')),
    
    -- Amount
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'AED',
    
    -- Status
    status VARCHAR(50) CHECK (status IN (
        'pending',
        'authorized',
        'captured',
        'failed',
        'refunded',
        'voided'
    )),
    
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
    raw_response JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX idx_payment_transactions_ngenius_payment_ref ON payment_transactions(ngenius_payment_ref);

-- Webhook Logs Table (for debugging and audit)
CREATE TABLE IF NOT EXISTS webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source VARCHAR(50) DEFAULT 'ngenius',
    event_type VARCHAR(100),
    order_ref VARCHAR(100),
    payload JSONB,
    processed BOOLEAN DEFAULT FALSE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_webhook_logs_order_ref ON webhook_logs(order_ref);
CREATE INDEX idx_webhook_logs_created_at ON webhook_logs(created_at);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating updated_at
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at
    BEFORE UPDATE ON payment_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
