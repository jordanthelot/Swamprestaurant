// Configuration
// REPLACE THIS with your actual raiaAI webhook or API Endpoint
const RAIA_API_URL = 'https://api.raia.ai/v1/webhook/YOUR_ENDPOINT_ID'; 
// If you are using n8n to bridge the gap, put the n8n webhook URL here.

const form = document.getElementById('loyaltyForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. UI Loading State
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="spinner"></div> Processing...';
    errorMessage.classList.add('hidden');

    // 2. Capture Data
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        source: 'web_signup',
        timestamp: new Date().toISOString()
    };

    try {
        // 3. Send to API
        // Note: This assumes the API accepts JSON. 
        const response = await fetch(RAIA_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer YOUR_API_KEY' // Add this if raiaAI requires auth headers
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // 4. Success Handling
        form.classList.add('hidden');
        successMessage.classList.remove('hidden');

    } catch (error) {
        // 5. Error Handling
        console.error('Error:', error);
        errorMessage.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
});