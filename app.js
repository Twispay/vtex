const PaymentProcessor = require('./paymentProcessor');
const config = require('./config');

const paymentProcessor = new PaymentProcessor(config.TWISPAY_API_KEY, config.TWISPAY_API_ENDPOINT);

// ...previous processPayment function...

async function createSubscription(subscriptionData) {
    try {
        const subscriptionResult = await paymentProcessor.createSubscription(subscriptionData);
        console.log('Subscription Result:', subscriptionResult);
        // Handle subscription result as needed
    } catch (error) {
        console.error('Subscription creation failed:', error);
        // Handle failure as needed
    }
}

async function cancelSubscription(subscriptionId) {
    try {
        const cancellationResult = await paymentProcessor.cancelSubscription(subscriptionId);
        console.log('Cancellation Result:', cancellationResult);
        // Handle cancellation result as needed
    } catch (error) {
        console.error('Subscription cancellation failed:', error);
        // Handle failure as needed
    }
}
