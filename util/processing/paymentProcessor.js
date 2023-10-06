const axios = require('axios');

class PaymentProcessor {
    /**
     * Constructor for PaymentProcessor.
     * 
     * @param {string} apiKey - API key for authentication.
     * @param {string} apiEndpoint - Endpoint for API requests.
     */
    constructor(apiKey, apiEndpoint) {
        this.apiKey = apiKey;
        this.apiEndpoint = apiEndpoint;
    }

    /**
     * Make a payment request to API.
     * 
     * @param {number} amount - The amount to be paid.
     * @param {string} currency - The currency code.
     * @param {string} orderId - The order identifier.
     * @param {string} customerId - The customer identifier.
     * @param {string} paymentMethod - The payment method.
     * @param {string} callbackUrl - The callback URL for payment status updates.
     * @param {string} description - A description of the payment.
     * @return {Promise} - The promise of the API request.
     */
    async makePayment(amount, currency, orderId, customerId, paymentMethod, callbackUrl, description) {
        const paymentData = {
            amount,
            currency,
            orderId,
            customerId,
            paymentMethod,
            callbackUrl,
            description,
        };

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
        };

        try {
            const response = await axios.post(this.apiEndpoint, paymentData, { headers });
            return response.data;
        } catch (error) {
            console.error('Error processing payment:', error);
            throw error;
        }
    }

    /**
     * Create a subscription via API.
     * 
     * @param {object} subscriptionData - Data needed to create a subscription.
     * @return {Promise} - The promise of the API request.
     */
    async createSubscription(subscriptionData) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
        };

        try {
            const response = await axios.post(`${this.apiEndpoint}/subscriptions`, subscriptionData, { headers });
            return response.data;
        } catch (error) {
            console.error('Error creating subscription:', error);
            throw error;
        }
    }

    /**
     * Cancel a subscription via API.
     * 
     * @param {string} subscriptionId - The ID of the subscription to cancel.
     * @return {Promise} - The promise of the API request.
     */
    async cancelSubscription(subscriptionId) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
        };

        try {
            const response = await axios.delete(`${this.apiEndpoint}/subscriptions/${subscriptionId}`, { headers });
            return response.data;
        } catch (error) {
            console.error('Error canceling subscription:', error);
            throw error;
        }
    }
}

module.exports = PaymentProcessor;
