const axios = require('axios');
const sgMail = require('@sendgrid/mail');
const config = require('./config');

// Set API keys from config
sgMail.setApiKey(config.SENDGRID_API_KEY);

/**
 * Make a payment request to Twispay API.
 * 
 * @param {number} amount - The amount to be paid.
 * @param {string} currency - The currency code.
 * @param {string} orderId - The order identifier.
 * @return {Promise} - The promise of the API request.
 */
const makePayment = (amount, currency, orderId) => {
    const paymentData = {
        amount,
        currency,
        orderId,
    };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.TWISPAY_API_KEY}` // Use 'Bearer' or other type of authentication as per API documentation
    };

    return axios.post(config.TWISPAY_API_ENDPOINT, paymentData, { headers });
};

/**
 * Send an email using SendGrid.
 * 
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} text - Email body text.
 * @return {Promise} - The promise of the email send operation.
 */
const sendEmail = (to, subject, text) => {
    const msg = {
        to,
        from: 'your-email@example.com', // Your email address
        subject,
        text,
    };

    return sgMail.send(msg);
};

module.exports = {
    makePayment,
    sendEmail,
};