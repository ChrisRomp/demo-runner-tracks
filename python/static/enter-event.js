// DOM Elements
const elements = {
    checkpointSelect: () => document.getElementById('checkpoint'),
    messageDiv: () => document.getElementById('message'),
    bibNumberInput: () => document.getElementById('bibNumber'),
    form: () => document.getElementById('checkpointForm')
};

// API endpoints
const api = {
    checkpoint: '/api/checkpoint',
    recordEvent: '/api/checkpoint-event'
};

// Display status messages to user
const showMessage = (message, isError = false) => {
    const messageDiv = elements.messageDiv();
    messageDiv.textContent = message;
    messageDiv.style.color = isError ? 'red' : 'green';
};

// Populate checkpoint dropdown
async function loadCheckpoints() {
    try {
        const response = await fetch(api.checkpoint);
        const checkpoints = await response.json();
        
        const select = elements.checkpointSelect();
        checkpoints.forEach(({ id, description }) => {
            select.appendChild(new Option(description, id));
        });
    } catch (error) {
        showMessage('Error loading checkpoints', true);
        console.error('Checkpoint loading error:', error);
    }
}

// Set bib number from URL if present
function setBibFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const bibNumber = params.get('bib');
    if (bibNumber) {
        elements.bibNumberInput().value = bibNumber;
    }
    elements.messageDiv().innerHTML = `Bib number <strong>${bibNumber}</strong> loaded from URL`;
}

// Handle form submission
async function handleSubmit(event) {
    event.preventDefault();
    
    const data = {
        checkpointId: parseInt(elements.checkpointSelect().value),
        bibNumber: parseInt(elements.bibNumberInput().value),
        eventTime: new Date().toISOString()
    };

    try {
        const response = await fetch(api.recordEvent, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (response.ok) {
            showMessage('Event recorded successfully');
            elements.bibNumberInput().value = '';
        } else {
            showMessage(`Error: ${result.error || 'Unknown error'}`, true);
        }
    } catch (error) {
        showMessage('Error recording event', true);
        console.error('Submission error:', error);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadCheckpoints();
    setBibFromUrl();

    // add event handler
    elements.form().addEventListener('submit', handleSubmit);
});
