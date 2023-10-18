-- setup.sql

CREATE TABLE configuration (
    id serial PRIMARY KEY,
    config_name VARCHAR(50) UNIQUE,  -- E.g., 'TwispayConfig'
    api_key VARCHAR(128),
    api_endpoint VARCHAR(256),
    site_id VARCHAR(50),
    customer_id VARCHAR(50)
);

-- Insert your configuration data
INSERT INTO configuration (config_name, api_key, api_endpoint, site_id, customer_id) 
VALUES ('TwispayConfig', 'your_api_key', 'your_api_endpoint', 'your_site_id', 'your_customer_id');
