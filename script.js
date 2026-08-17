let currentUserEmail = ""; 
let currentWizardStep = 1;

// Handles switching tabs between Login and Register smoothly
function switchForm(formType) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    hideMessage();

    if (formType === 'login') {
        if (loginForm) loginForm.classList.remove('hidden');
        if (registerForm) registerForm.classList.add('hidden');
        if (tabLogin) tabLogin.classList.add('active');
        if (tabRegister) tabRegister.classList.remove('active');
    } else {
        if (loginForm) loginForm.classList.add('hidden');
        if (registerForm) registerForm.classList.remove('hidden');
        if (tabLogin) tabLogin.classList.remove('active');
        if (tabRegister) tabRegister.classList.add('active');
    }
}

// Global alert system
function showMessage(text, type) {
    const msgBox = document.getElementById('message-box');
    if (msgBox) {
        msgBox.innerText = text;
        msgBox.className = `message ${type}`;
    }
}

function hideMessage() {
    const msgBox = document.getElementById('message-box');
    if (msgBox) msgBox.className = 'message hidden';
}

// Controls the 5-step wizard layout views
function changeStep(direction) {
    hideMessage();

    const currentStepEl = document.getElementById(`step-${currentWizardStep}`);
    if (currentStepEl) currentStepEl.classList.add('hidden');
    
    currentWizardStep += direction;
    
    const nextStepEl = document.getElementById(`step-${currentWizardStep}`);
    if (nextStepEl) nextStepEl.classList.remove('hidden');
    
    const displayEl = document.getElementById('current-step-display');
    if (displayEl) displayEl.innerText = currentWizardStep;

    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnSave = document.getElementById('btn-save-profile');

    if (btnPrev) btnPrev.classList.toggle('hidden', currentWizardStep === 1);
    if (btnNext) btnNext.classList.toggle('hidden', currentWizardStep === 5);
    if (btnSave) btnSave.classList.toggle('hidden', currentWizardStep !== 5);
}

// Safe User Registration API request
async function handleRegister(event) {
    event.preventDefault();
    hideMessage();
    
    const name = document.getElementById('reg-name')?.value || "";
    const email = document.getElementById('reg-email')?.value || "";
    const password = document.getElementById('reg-password')?.value || "";

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        if (!response.ok) return showMessage(data.error, 'error');

        showMessage("Registered successfully!", 'success');
        document.getElementById('register-form').reset();
        setTimeout(() => switchForm('login'), 1500);
    } catch (e) {
        showMessage('Connection to server lost.', 'error');
    }
}

// Safe User Login API request
async function handleLogin(event) {
    event.preventDefault();
    hideMessage();
    
    const email = document.getElementById('login-email')?.value || "";
    const password = document.getElementById('login-password')?.value || "";

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) return showMessage(data.error, 'error');

        document.getElementById('login-form').reset();
        currentUserEmail = email;
        routeUserFlow(data);
    } catch (e) {
        showMessage('Connection to server lost.', 'error');
    }
}

// Directs workspace routing based on whether profile database rows exist
function routeUserFlow(userData) {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('auth-tabs').classList.add('hidden');
    document.getElementById('secure-area').classList.remove('hidden');
    document.getElementById('user-display-name').innerText = userData.name;

    if (userData.has_profile) {
        document.getElementById('dashboard').classList.remove('hidden');
        document.getElementById('profile-wizard').classList.add('hidden');
        document.getElementById('sum-city').innerText = userData.profile.city || "N/A";
        document.getElementById('sum-country').innerText = userData.profile.country || "N/A";
        document.getElementById('sum-edu').innerText = userData.profile.education || "N/A";
        document.getElementById('sum-job').innerText = userData.profile.occupation || "N/A";
    } else {
        currentWizardStep = 1;
        for (let i = 1; i <= 5; i++) {
            const step = document.getElementById(`step-${i}`);
            if (step) step.classList.toggle('hidden', i !== 1);
        }
        document.getElementById('btn-prev').classList.add('hidden');
        document.getElementById('btn-next').classList.remove('hidden');
        document.getElementById('btn-save-profile').classList.add('hidden');
        document.getElementById('current-step-display').innerText = 1;

        document.getElementById('profile-wizard').classList.remove('hidden');
        document.getElementById('dashboard').classList.add('hidden');
    }
}

// Safe 25-Question Data Package Submission handler
async function submitProfile(event) {
    event.preventDefault();
    hideMessage();
    
    // Safely reads all 25 element values using protective fallback handlers
    const profilePayload = {
        email: currentUserEmail,
        age: document.getElementById('q-age')?.value || "N/A",
        phone: document.getElementById('q-phone')?.value || "N/A",
        gender: document.getElementById('q-gender')?.value || "N/A",
        dob: document.getElementById('q-dob')?.value || "N/A",
        nationality: document.getElementById('q-nationality')?.value || "N/A",
        address: document.getElementById('q-address')?.value || "N/A",
        city: document.getElementById('q-city')?.value || "N/A",
        state: document.getElementById('q-state')?.value || "N/A",
        zip: document.getElementById('q-zip')?.value || "N/A",
        country: document.getElementById('q-country')?.value || "N/A",
        education: document.getElementById('q-education')?.value || "N/A",
        school: document.getElementById('q-school')?.value || "N/A",
        gradyear: document.getElementById('q-gradyear')?.value || "N/A",
        occupation: document.getElementById('q-occupation')?.value || "N/A",
        experience: document.getElementById('q-experience')?.value || "N/A",
        skill1: document.getElementById('q-skill1')?.value || "N/A",
        skill2: document.getElementById('q-skill2')?.value || "N/A",
        workmode: document.getElementById('q-workmode')?.value || "N/A",
        linkedin: document.getElementById('q-linkedin')?.value || "N/A",
        github: document.getElementById('q-github')?.value || "N/A",
        salary: document.getElementById('q-salary')?.value || "N/A",
        languages: document.getElementById('q-languages')?.value || "N/A",
        source: document.getElementById('q-source')?.value || "N/A",
        hobbies: document.getElementById('q-hobbies')?.value || "N/A",
        ice_name: document.getElementById('q-ice-name')?.value || "N/A"
    };

    try {
        const response = await fetch('/api/save-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profilePayload)
        });
        const data = await response.json();
        if (!response.ok) return showMessage(data.error, 'error');

        showMessage('Profile created successfully!', 'success');
        document.getElementById('questionnaire-form').reset();
        document.getElementById('sum-city').innerText = profilePayload.city;
        document.getElementById('sum-country').innerText = profilePayload.country;
        document.getElementById('sum-edu').innerText = profilePayload.education;
        document.getElementById('sum-job').innerText = profilePayload.occupation;
        
        document.getElementById('profile-wizard').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
    } catch (e) {
        showMessage('Error updating profile information.', 'error');
    }
}

function handleLogout() {
    document.getElementById('secure-area').classList.add('hidden');
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('profile-wizard').classList.add('hidden');
    document.getElementById('auth-tabs').classList.remove('hidden');
    currentUserEmail = "";
    showMessage('Logged out successfully.', 'success');
    switchForm('login');
}
