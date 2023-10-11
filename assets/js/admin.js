document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('paymentForm');

    paymentForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent the form from submitting traditionally

        // Basic validation example:
        const amount = document.getElementById('amount').value;
        const currency = document.getElementById('currency').value;
        const orderId = document.getElementById('orderId').value;

        let isValid = true;
        let errorMessage = '';

        // Validate amount - assuming amount should be a positive number
        if (isNaN(amount) || amount <= 0) {
            isValid = false;
            errorMessage = 'Please enter a valid amount.';
        }

        // Validate order ID - as an example, check if it's not empty
        if (isValid && orderId.trim() === '') {
            isValid = false;
            errorMessage = 'Order ID cannot be empty.';
        }

        // If data is valid, submit to server using fetch or another method
        if (isValid) {
            // Example using Fetch API to send data to server
            fetch('/process-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount, currency, orderId }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        alert('Payment processed successfully!');
                        // Handle success, e.g., redirecting to a success page
                    } else {
                        alert('Payment failed: ' + data.errorMessage);
                        // Handle failure, e.g., showing an error message to the user
                    }
                })
                .catch((error) => {
                    console.error('Error during fetch operation:', error);
                    alert('An error occurred while processing your payment.');
                });
        } else {
            // Show an error message to the user
            alert(errorMessage);
        }
    });
});