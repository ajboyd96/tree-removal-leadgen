// Tree Removal Lead Generation JavaScript

// Global Variables
let currentQuestion = 0;
let quizData = {};
let isQuizActive = false;

// Quiz Questions Configuration
const quizQuestions = [
    {
        id: 'tree_condition',
        question: 'What is the condition of the tree(s) you need removed?',
        type: 'radio',
        options: [
            { value: 'dead', label: 'Dead tree - completely lifeless', priority: 'high' },
            { value: 'diseased', label: 'Diseased - showing signs of illness', priority: 'high' },
            { value: 'damaged', label: 'Storm damaged or partially fallen', priority: 'high' },
            { value: 'healthy_hazard', label: 'Healthy but poses a safety hazard', priority: 'medium' },
            { value: 'healthy_removal', label: 'Healthy tree - removal for other reasons', priority: 'medium' }
        ]
    },
    {
        id: 'tree_size',
        question: 'What size is the tree you need removed?',
        type: 'radio',
        options: [
            { value: 'small', label: 'Small (under 25 feet)', cost_factor: 1.0 },
            { value: 'medium', label: 'Medium (25-50 feet)', cost_factor: 1.5 },
            { value: 'large', label: 'Large (50-75 feet)', cost_factor: 2.0 },
            { value: 'very_large', label: 'Very Large (over 75 feet)', cost_factor: 3.0 },
            { value: 'multiple', label: 'Multiple trees of various sizes', cost_factor: 2.5 }
        ]
    },
    {
        id: 'emergency_removal',
        question: 'Do you need emergency tree removal?',
        type: 'radio',
        options: [
            { value: 'immediate', label: 'Yes - immediate removal needed (within 24 hours)', urgency: 'emergency' },
            { value: 'urgent', label: 'Yes - urgent but can wait 2-3 days', urgency: 'urgent' },
            { value: 'soon', label: 'Within the next week', urgency: 'soon' },
            { value: 'flexible', label: 'No rush - flexible timing', urgency: 'flexible' }
        ]
    },
    {
        id: 'property_type',
        question: 'What type of property is this for?',
        type: 'radio',
        options: [
            { value: 'residential_single', label: 'Single family home', property: 'residential' },
            { value: 'residential_multi', label: 'Multi-family residence/duplex', property: 'residential' },
            { value: 'commercial_small', label: 'Small commercial property', property: 'commercial' },
            { value: 'commercial_large', label: 'Large commercial/industrial', property: 'commercial' },
            { value: 'municipal', label: 'Municipal/government property', property: 'municipal' }
        ]
    },
    {
        id: 'access_difficulty',
        question: 'How difficult is access to the tree?',
        type: 'radio',
        options: [
            { value: 'easy', label: 'Easy access - open area, truck can get close', difficulty: 'easy' },
            { value: 'moderate', label: 'Moderate - some obstacles, limited truck access', difficulty: 'moderate' },
            { value: 'difficult', label: 'Difficult - tight space, crane may be needed', difficulty: 'difficult' },
            { value: 'very_difficult', label: 'Very difficult - hand removal only, many obstacles', difficulty: 'very_difficult' },
            { value: 'near_structures', label: 'Very close to house/power lines/structures', difficulty: 'complex' }
        ]
    },
    {
        id: 'budget',
        question: 'What is your budget range for this tree removal?',
        type: 'radio',
        options: [
            { value: 'under_500', label: 'Under $500', budget: 'low' },
            { value: '500_1000', label: '$500 - $1,000', budget: 'moderate' },
            { value: '1000_2500', label: '$1,000 - $2,500', budget: 'average' },
            { value: '2500_5000', label: '$2,500 - $5,000', budget: 'high' },
            { value: 'over_5000', label: 'Over $5,000', budget: 'premium' },
            { value: 'unsure', label: 'Not sure - need estimate', budget: 'unknown' }
        ]
    }
];

// Mobile Navigation
function initializeMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Quiz Functions
function startQuiz() {
    const modal = document.getElementById('quiz-modal');
    if (modal) {
        modal.style.display = 'block';
        currentQuestion = 0;
        quizData = {};
        isQuizActive = true;
        displayQuestion();
        updateProgress();
    }
}

function closeQuiz() {
    const modal = document.getElementById('quiz-modal');
    if (modal) {
        modal.style.display = 'none';
        isQuizActive = false;
        currentQuestion = 0;
        quizData = {};
    }
}

function displayQuestion() {
    const quizContent = document.getElementById('quiz-content');
    const question = quizQuestions[currentQuestion];
    
    if (!quizContent || !question) return;

    let html = `
        <div class="question">
            <h3>${question.question}</h3>
            <div class="options">
    `;

    question.options.forEach((option, index) => {
        const isSelected = quizData[question.id] === option.value;
        html += `
            <div class="option ${isSelected ? 'selected' : ''}" onclick="selectOption('${question.id}', '${option.value}')">
                <input type="radio" name="${question.id}" value="${option.value}" ${isSelected ? 'checked' : ''}>
                <label>${option.label}</label>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    // Add lead capture form for the last question
    if (currentQuestion === quizQuestions.length - 1) {
        html += `
            <div class="lead-capture">
                <h3 style="color: var(--primary-color); margin: 2rem 0 1rem;">Get Your Free Quote</h3>
                <p style="color: var(--text-light); margin-bottom: 2rem;">We'll contact you within 2 hours with a personalized estimate based on your assessment.</p>
                
                <div class="form-group">
                    <label for="full_name">Full Name *</label>
                    <input type="text" id="full_name" class="form-control" required>
                    <div class="error-message" id="full_name_error"></div>
                </div>
                
                <div class="form-group">
                    <label for="phone">Phone Number *</label>
                    <input type="tel" id="phone" class="form-control" placeholder="(555) 123-4567" required>
                    <div class="error-message" id="phone_error"></div>
                </div>
                
                <div class="form-group">
                    <label for="email">Email Address *</label>
                    <input type="email" id="email" class="form-control" placeholder="your@email.com" required>
                    <div class="error-message" id="email_error"></div>
                </div>
                
                <div class="form-group">
                    <label for="address">Property Address</label>
                    <input type="text" id="address" class="form-control" placeholder="Where is the tree located?">
                </div>
                
                <div class="form-group">
                    <label for="additional_info">Additional Information</label>
                    <textarea id="additional_info" class="form-control" rows="3" placeholder="Any additional details about your tree removal needs..."></textarea>
                </div>
            </div>
        `;
    }

    html += `
        <div class="btn-group">
            ${currentQuestion > 0 ? '<button class="btn btn-secondary" onclick="previousQuestion()">Previous</button>' : '<div></div>'}
            ${currentQuestion < quizQuestions.length - 1 ? 
                '<button class="btn btn-primary" onclick="nextQuestion()">Next</button>' : 
                '<button class="btn btn-primary" onclick="submitQuiz()">Get My Free Quote</button>'
            }
        </div>
    `;

    quizContent.innerHTML = html;
}

function selectOption(questionId, value) {
    quizData[questionId] = value;
    
    // Update visual selection
    const options = document.querySelectorAll(`input[name="${questionId}"]`);
    options.forEach(option => {
        const optionDiv = option.parentElement;
        if (option.value === value) {
            option.checked = true;
            optionDiv.classList.add('selected');
        } else {
            option.checked = false;
            optionDiv.classList.remove('selected');
        }
    });
}

function nextQuestion() {
    const currentQuestionData = quizQuestions[currentQuestion];
    
    if (!quizData[currentQuestionData.id]) {
        alert('Please select an option before continuing.');
        return;
    }

    if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;
        displayQuestion();
        updateProgress();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
        updateProgress();
    }
}

function updateProgress() {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (progressFill && progressText) {
        const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
    }
}

// Form Validation
function validateForm() {
    const requiredFields = ['full_name', 'phone', 'email'];
    let isValid = true;

    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const errorDiv = document.getElementById(fieldId + '_error');
        
        if (field && errorDiv) {
            field.classList.remove('error');
            errorDiv.textContent = '';

            if (!field.value.trim()) {
                field.classList.add('error');
                errorDiv.textContent = 'This field is required.';
                isValid = false;
            } else if (fieldId === 'email' && !isValidEmail(field.value)) {
                field.classList.add('error');
                errorDiv.textContent = 'Please enter a valid email address.';
                isValid = false;
            } else if (fieldId === 'phone' && !isValidPhone(field.value)) {
                field.classList.add('error');
                errorDiv.textContent = 'Please enter a valid phone number.';
                isValid = false;
            }
        }
    });

    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    return cleanPhone.length >= 10 && phoneRegex.test(cleanPhone);
}

// Generate Quote Estimate
function generateQuoteEstimate(quizData) {
    let basePrice = 300;
    let multiplier = 1.0;
    let urgencyFee = 0;
    
    // Size factor
    switch(quizData.tree_size) {
        case 'small': multiplier *= 1.0; break;
        case 'medium': multiplier *= 1.8; break;
        case 'large': multiplier *= 2.5; break;
        case 'very_large': multiplier *= 4.0; break;
        case 'multiple': multiplier *= 3.5; break;
    }
    
    // Difficulty factor
    switch(quizData.access_difficulty) {
        case 'easy': multiplier *= 1.0; break;
        case 'moderate': multiplier *= 1.3; break;
        case 'difficult': multiplier *= 1.8; break;
        case 'very_difficult': multiplier *= 2.2; break;
        case 'near_structures': multiplier *= 2.5; break;
    }
    
    // Emergency fees
    switch(quizData.emergency_removal) {
        case 'immediate': urgencyFee = 500; break;
        case 'urgent': urgencyFee = 250; break;
        case 'soon': urgencyFee = 100; break;
    }
    
    const estimatedCost = Math.round((basePrice * multiplier) + urgencyFee);
    const rangeMin = Math.round(estimatedCost * 0.8);
    const rangeMax = Math.round(estimatedCost * 1.3);
    
    return {
        estimated: estimatedCost,
        range: `$${rangeMin} - $${rangeMax}`,
        urgency: quizData.emergency_removal,
        priority: getPriorityLevel(quizData)
    };
}

function getPriorityLevel(data) {
    if (data.tree_condition === 'dead' || data.tree_condition === 'damaged' || 
        data.emergency_removal === 'immediate') {
        return 'HIGH PRIORITY';
    } else if (data.tree_condition === 'diseased' || data.emergency_removal === 'urgent') {
        return 'MEDIUM PRIORITY';
    }
    return 'STANDARD';
}

// Submit Quiz
async function submitQuiz() {
    if (currentQuestion !== quizQuestions.length - 1) {
        nextQuestion();
        return;
    }

    if (!validateForm()) {
        return;
    }

    // Collect form data
    const leadData = {
        full_name: document.getElementById('full_name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        address: document.getElementById('address').value.trim(),
        additional_info: document.getElementById('additional_info').value.trim(),
        quiz_responses: quizData,
        quote_estimate: generateQuoteEstimate(quizData),
        submission_time: new Date().toISOString(),
        lead_source: 'Tree Removal Quiz'
    };

    try {
        // Show loading state
        const submitBtn = document.querySelector('.btn-primary');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        // Submit to backend (Google Apps Script)
        await submitLead(leadData);
        
        // Close quiz modal and show thank you
        closeQuiz();
        showThankYou();
        
    } catch (error) {
        console.error('Error submitting lead:', error);
        alert('There was an error submitting your information. Please try again or call us directly at (555) 123-TREE.');
        
        // Reset button
        const submitBtn = document.querySelector('.btn-primary');
        if (submitBtn) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
}

// Submit Lead to Backend
async function submitLead(leadData) {
    // This would integrate with your Google Apps Script
    // For now, we'll simulate the submission
    const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
    
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leadData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        // For demo purposes, we'll just log the data
        console.log('Lead Data (would be submitted to backend):', leadData);
        
        // Simulate successful submission for demo
        return { success: true, message: 'Lead submitted successfully' };
    }
}

// Thank You Modal
function showThankYou() {
    const modal = document.getElementById('thank-you-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeThankYou() {
    const modal = document.getElementById('thank-you-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close modals when clicking outside
function setupModalCloseHandlers() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                if (modal.id === 'quiz-modal') {
                    isQuizActive = false;
                }
            }
        });
    });
}

// Keyboard navigation for quiz
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (!isQuizActive) return;
        
        switch(e.key) {
            case 'Enter':
                if (currentQuestion < quizQuestions.length - 1) {
                    nextQuestion();
                } else {
                    submitQuiz();
                }
                break;
            case 'Escape':
                closeQuiz();
                break;
            case 'ArrowLeft':
                if (currentQuestion > 0) {
                    previousQuestion();
                }
                break;
            case 'ArrowRight':
                if (currentQuestion < quizQuestions.length - 1) {
                    nextQuestion();
                }
                break;
        }
    });
}

// Phone number formatting
function formatPhoneNumber() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 6) {
                value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6,10)}`;
            } else if (value.length >= 3) {
                value = `(${value.slice(0,3)}) ${value.slice(3)}`;
            }
            e.target.value = value;
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeMobileNav();
    initializeSmoothScrolling();
    setupModalCloseHandlers();
    setupKeyboardNavigation();
    
    // Set up phone formatting after lead capture form is displayed
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('option') || e.target.closest('.option')) {
            setTimeout(formatPhoneNumber, 100);
        }
    });
});

// Export functions for global access
window.startQuiz = startQuiz;
window.closeQuiz = closeQuiz;
window.selectOption = selectOption;
window.nextQuestion = nextQuestion;
window.previousQuestion = previousQuestion;
window.submitQuiz = submitQuiz;
window.closeThankYou = closeThankYou;