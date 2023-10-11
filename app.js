const PaymentProcessor = require('./util/processing/paymentProcessor');
const SubscriptionProcessor = require('./util/processing/subscriptionProcessor');
const config = require('./config');
const Log = require('./util/logger/Log'); // Adjust the path according to your project structure
const log = new Log(path.join(config.LOG_FILE_PATH, 'app.log'));

const paymentProcessor = new PaymentProcessor(config.TWISPAY_API_KEY, config.TWISPAY_API_ENDPOINT, config.TWISPAY_SITE_ID, config.TWISPAY_CUSTOMER_ID, log);
const subscriptionProcessor = new PaymentProcessor(config.TWISPAY_API_KEY, config.TWISPAY_API_ENDPOINT, config.TWISPAY_SITE_ID, config.TWISPAY_CUSTOMER_ID, log);

async function createPayment(paymentData) {
    try {
        const paymentResult = await paymentProcessor.createPayment(paymentData);
    } catch (error) {
        log.error('Subscription creation failed:', error);
    }
}

async function refundPayment(refundData) {
    try {
        const refundResult = await paymentProcessor.refundPayment(refundData);
    } catch (error) {
        log.error('Refund failed:', error);
    }
}

async function createSubscription(subscriptionData) {
    try {
        const subscriptionResult = await subscriptionProcessor.createSubscription(subscriptionData);
    } catch (error) {
        log.error('Subscription creation failed:', error);
    }
}

async function cancelSubscription(subscriptionId) {
    try {
        const cancellationResult = await subscriptionProcessor.cancelSubscription(subscriptionId);
    } catch (error) {
        log.error('Subscription cancellation failed:', error);
    }
}
