require('dotenv').config();

module.exports = {
    TWISPAY_API_KEY: process.env.TWISPAY_API_KEY,
    TWISPAY_API_ENDPOINT: process.env.TWISPAY_API_ENDPOINT,
    TWISPAY_SITE_ID: process.env.TWISPAY_SITE_ID,
    TWISPAY_CUSTOMER_ID: process.env.TWISPAY_CUSTOMER_ID,
    EMAIL: process.env.EMAIL,
    LOG_FILE_PATH: './logs/'
};