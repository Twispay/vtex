const axios = require('axios');

class PaymentProcessor {
    /**
     * Constructor for PaymentProcessor.
     * 
     * @param {string} apiKey - API key for authentication.
     * @param {string} apiEndpoint - Endpoint for API requests.
     */
    constructor(apiKey, apiEndpoint, siteId, customerId, log) {
        this.apiKey = apiKey;
        this.apiEndpoint = apiEndpoint;
        this.siteId = siteId;
        this.customerId = customerId;
        this.log = log;
    }
    /**
     * Create a subscription via API.
     * 
     * @param {object} subscriptionData - Data needed to create a subscription.
     * @return {Promise} - The promise of the API request.
     */
    async createSubscription(subscriptionData) {
        const postData = {
            siteId: YOUR_TWISPAY_SITE_ID, // Replace with your Twispay site ID
            customerId: YOUR_TWISPAY_CUSTOMER_ID, // Replace with customer ID
            externalOrderId: order_info.order_id,
            amount: subscriptionData.total,
            currency: subscriptionData.currency, 
            description: subscriptionData.description,
            invoiceEmail: EMAIL,
            createdAt: new Date().toISOString(), 
            intervalType: subscriptionData.intervalType, 
            intervalValue: subscriptionData.intervalValue, 
            retryPayment: "true", 
            nextDueDate: subscriptionData.nextDueDate, 
            transactionMethod: "card",
            orderType: "recurring",
            tags: [
                {
                    vtex: "vtex"
                }
            ]
        };
        
        return postData;
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
            const response = await axios.delete(`${this.apiEndpoint}/order/${subscriptionId}`, { headers });
            this.log.info(`${(new Date()).toISOString()}: Subscription ${subscriptionId} successfully canceled`)
            return response.data;
        } catch (error) {
            log.error('Error canceling subscription:', error);
            throw error;
        }
    }
}

module.exports = PaymentProcessor;
