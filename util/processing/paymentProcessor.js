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
    async createPayment(paymentData) {
        const postData = {
            siteId: this.siteId, // Your Twispay site ID
            customerId: this.customerId, // Customer ID, manage as per your use case
            amount: paymentData.amount,
            currency: paymentData.currency, // Ensure to use the correct currency code
            description: paymentData.description,
            invoiceEmail: paymentData.invoiceEmail,
            createdAt: (new Date()).toISOString(), // Created At
            tags: {module: {vtex: "vtex"}}
        }
    
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}` // Use 'Bearer' or other type of authentication as per API documentation
        };

        try {
            const response = await axios.post(`${this.apiEndpoint}/order/`, postData, { headers });
            this.log.info(`${(new Date()).toISOString()}: Order successfully created with ${postData}`)
            return response.data;
        } catch (error) {
            this.log.error('Error processing payment:', error);
            throw error;
        }
    }

    /**
     * Refund a payment via Twispay API.
     * 
     * @param {string} paymentId - The ID of the payment to refund.
     * @param {number} [amount] - The amount to be refunded. If not specified, full amount will be refunded.
     * @return {Promise} - The promise of the API request.
     */
    async refundPayment(refundData) {
        const deleteData = {
            orderId: refundData.orderId,
            amount: refundData.amount,
            TWISPAY_CUSTOMER_ID,
        }
    
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}` // Use 'Bearer' or other type of authentication as per API documentation
        };
    
        try {
            const response = await axios.delete(`${this.apiEndpoint}/transaction/${refundData.orderId}/`, deleteData, { headers });
            this.log.info(`${(new Date()).toISOString()}: Refund succeeded on order ${orderId} with ${amount}`)
            return response.data;
        } catch (error) {
            this.log.error('Error processing refund:', error);
            throw error;
        }
    }
}

module.exports = PaymentProcessor;
