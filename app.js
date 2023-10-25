const express = require('express');
const { Pool } = require('pg'); // PostgreSQL client for Node.js
const path = require('path');
const bodyParser = require('body-parser'); // middleware to handle post body request
const PaymentProcessor = require('./util/processing/paymentProcessor');
const SubscriptionProcessor = require('./util/processing/subscriptionProcessor');
const { getConfig } = require('./db'); // The database module you created
const { Logger } = require('vtex');

// Initialize your database connection
const pool = new Pool(".env");

// Express middleware setup
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json
app.use(express.static(path.join(__dirname, 'public'))); // to serve static files

// Serve the HTML form at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'config_form.html'));
});

// POST route to handle the form submission
app.post('/update-config', async (req, res) => {
    const { api_key, api_endpoint, site_id, customer_id } = req.body;

    try {
        // Construct the SQL query for updating the configuration
        const updateQuery = `
            UPDATE configuration
            SET api_key = $1, api_endpoint = $2, site_id = $3, customer_id = $4
            WHERE config_name = 'TwispayConfig'`;

        // Execute the query with the provided input values
        await pool.query(updateQuery, [api_key, api_endpoint, site_id, customer_id]);

        // If successful, send a positive response back to the client
        res.send('Configuration updated successfully.');
    } catch (err) {
        // If there's an error, log it and send a 500 status code
        console.error('Error updating configuration:', err);
        res.status(500).send('An error occurred while updating the configuration.');
    }
});


const app = express();
const router = express.Router();

// Global variables
let paymentProcessor;
let subscriptionProcessor;

const initializeProcessors = async () => {
  try {
    const config = await getConfig(); // Fetch config from the database

    paymentProcessor = new PaymentProcessor(config.api_key, config.api_endpoint, config.site_id, config.customer_id, log);
    subscriptionProcessor = new SubscriptionProcessor(config.api_key, config.api_endpoint, config.site_id, config.customer_id, log);
  } catch (error) {
    console.error('Failed to initialize processors with configuration:', error);
  }
};

initializeProcessors();

// Route for creating a payment
router.post('/create-payment', async (req, res) => {
    try {
        const paymentData = req.body;
        const formData = await paymentProcessor.createPayment(paymentData);
        res.render('payment-form', { formData });
    } catch (error) {
        log.error('Payment creation failed:', error);
        res.status(500).send('An error occurred while creating the payment');
    }
});

// Route for refunding a payment
router.post('/refund-payment', async (req, res) => {
    try {
        const refundData = req.body;
        await paymentProcessor.refundPayment(refundData);
        res.send('Refund successful');
    } catch (error) {
        log.error('Refund failed:', error);
        res.status(500).send('An error occurred while refunding the payment');
    }
});

// Route for creating a subscription
router.post('/create-subscription', async (req, res) => {
    try {
        const subscriptionData = req.body;
        await subscriptionProcessor.createSubscription(subscriptionData);
        res.send('Subscription created successfully');
    } catch (error) {
        log.error('Subscription creation failed:', error);
        res.status(500).send('An error occurred while creating the subscription');
    }
});

// Route for canceling a subscription
router.post('/cancel-subscription', async (req, res) => {
    try {
        const { subscriptionId } = req.body;
        await subscriptionProcessor.cancelSubscription(subscriptionId);
        res.send('Subscription canceled successfully');
    } catch (error) {
        log.error('Subscription cancellation failed:', error);
        res.status(500).send('An error occurred while canceling the subscription');
    }
});

// IPN Listener Route
router.post('/ipn-listener', async (req, res) => {
    try {
        const ipnMessage = req.body;

        res.status(200).send('OK');

        const isValid = await paymentProcessor.verifyIPN(ipnMessage);

        if (isValid) {
            Logger.info('Received VALID IPN message - processing');
            await paymentProcessor.handleIPNMessage(ipnMessage);
        } else {
            Logger.warn('Received INVALID IPN message - ignoring');
        }
    } catch (error) {
        Logger.error('Error receiving IPN message', error);
    }
});

// Route for handling the payment completion callback
router.get('/complete-payment', (req, res) => {
    res.send('Payment completed');
});


app.use('/', router);

module.exports = app;

//Server starting is handled by vtex