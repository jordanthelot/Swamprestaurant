// Configuration

// 1. CONNECT TO N8N
// This is your Production Webhook URL.
const WEBHOOK_URL = 'https://raia.app.n8n.cloud/webhook/272c9a2a-67c6-4ae8-9d06-a96099238654'; 

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

    // 2. Capture & Clean Data
    // We apply the fix here so RaiaAI doesn't reject the number
    let rawPhone = document.getElementById('phone').value;
    
    // Remove non-numbers
    let cleanPhone = rawPhone.replace(/\D/g, '');
    
    // Add Country Code (+1) if missing
    if (cleanPhone.length === 10) {
        cleanPhone = '+1' + cleanPhone;
    } else if (cleanPhone.length === 11 && cleanPhone.startsWith('1')) {
        cleanPhone = '+' + cleanPhone;
    }
    // Note: If the user types +1..., the regex \D removes the +, so we add it back here:
    if (!cleanPhone.startsWith('+')) {
        cleanPhone = '+' + cleanPhone.replace(/^\+/, ''); 
        // Logic check: The regex above stripped the +, so simply:
        // if it's 11 digits starting with 1, it's likely 1352..., so just make it +1352...
    }
    // Simplified robust logic for US numbers:
    if (cleanPhone.length === 10) cleanPhone = '+1' + cleanPhone;
    else if (cleanPhone.length === 11 && cleanPhone.startsWith('1')) cleanPhone = '+' + cleanPhone;
    
    const formData = {
        name: document.getElementById('name').value,
        phone: cleanPhone, // Send the cleaned +1 version
        source: 'web_signup',
        timestamp: new Date().toISOString()
    };

    try {
        // 3. Send to n8n
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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