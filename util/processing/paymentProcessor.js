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

        return postData;
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
    
        return deleteData;
    }

    async verifyIPN(ipnMessage) {
        try {
            const verificationData = {
                ...ipnMessage,  // replicate the received message
            };

            // Send the verification request to the payment gateway's IPN verification endpoint
            const response = await axios.post(`env.IPN_ENDPOINT`, verificationData);

            // Analyze the verification response
            // The expected content of the response will depend on your payment gateway's specifications.
            const isVerified = response.data === 'VERIFIED'; // This condition is an example.

            if (!isVerified) {
                this.log.warn('Received an INVALID IPN message', { ipnMessage });
            }

            return isVerified;
        } catch (error) {
            this.log.error('Error verifying IPN message', error);
            return false; // Verification failed due to an error
        }
    }

       /**
     * Handle the verified IPN message.
     * Implement the business logic that should be triggered by a verified IPN, such as updating order status, etc.
     *
     * @param {Object} ipnMessage - The verified IPN message received from the payment gateway.
     */
        async handleIPNMessage(ipnMessage) {
            try {
                // Extract relevant information from the IPN message
                // The structure of ipnMessage and the names of its properties depend on your payment gateway's IPN format.
                const {
                    transactionId, 
                    paymentStatus,
                } = ipnMessage;
    
                if (paymentStatus === 'Completed') {
                    // Apply business logic for a successful payment
                    // For instance, update the related order record in your database, trigger further workflows, etc.
    
                    await database.updateOrderStatus(transactionId, 'Paid');
                    await vtex.triggerPostPaymentWorkflow(transactionId);
    
                    this.log.info(`Payment completed successfully for transaction ${transactionId}`);
                } else if (paymentStatus === 'Failed') {
                    // Handle failed payments
                    // Log for review, send alerts, trigger any relevant workflows, etc.
    
                    this.log.warn(`Payment failed for transaction ${transactionId}`);
                }
    
                // Always record the IPN outcome for auditing purposes.
                this.log.info('Processed IPN message', { ipnMessage });
            } catch (error) {
                this.log.error('Error handling IPN message', error);
            }
        }
    
}

module.exports = PaymentProcessor;
