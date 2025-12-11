// ============================================
// CONFIGURATION - EDIT THESE VALUES
// ============================================

const CONFIG = {
    // Event Details
    event: {
        type: 'בריתה לנסיה שרה צוקרמן',           // 'ברית' or 'זבד הבת'
        babyGender: `It's a GIRL !`,     // 'girl' or 'boy'
        date: '01/01/2026',
        dayOfWeek: 'יום חמישי',
        time: '19:30',
    },

    // Venue
    venue: {
        name: 'West אירועים',
        address: 'עליית הנוער 1, ראשון לציון',
        wazeQuery: 'WEST EVENT ראשון לציון',
        phone: '052-3630976',      // Venue phone number
        image: './images/venue.jpg', // Venue image (optional)
    },

    // Parents
    parents: {
        names: 'קורל ואופיר צוקרמן',
    },

    // Images
    images: {
        baby: './images/baby.jpg', // Path to baby image
    },

    // Text Content
    text: {
        announcement: 'בשעה טובה ומוצלחת נולדה לנו בת',
        invitation: 'הנכם מוזמנים לאירוע הבריתה',
        moodText: 'בואו עם הרבה מצב רוח :)',
    },

    // Additional Notes (leave empty string if none)
    additionalNotes: 'נסיה שרה היא מתוקה ומיוחדת, נשמח אם תביאו איתכם חיוך גדול ואהבה רבה!',

    // RSVP Form endpoint (Vercel serverless function)
    // The actual Google Script URL is stored securely in Vercel environment variables
    formEndpoint: '/api/submit-rsvp',

    // Animation Settings
    animations: {
        confettiOnLoad: true,
        confettiOnSubmit: true,
        floatingElements: true,
        showOverlayPrompt: true,
    }
};

// ============================================
// CONFETTI COLORS (Pink Theme)
// ============================================

const CONFETTI_COLORS = [
    '#FF6B9D',  // Pink primary
    '#FFB6C1',  // Light pink
    '#FFD700',  // Gold
    '#FF69B4',  // Hot pink
    '#FFC0CB',  // Pastel pink
    '#E84A7F',  // Dark pink
];

// ============================================
// STATE
// ============================================

let state = {
    attendance: null,
    guestCount: 1,
    blessingExpanded: false,
    formSubmitted: false,
    scrollY: 0,
};

// ============================================
// DOM ELEMENTS
// ============================================

const elements = {};

function cacheElements() {
    // Baby background image (fixed, blurred)
    elements.babyBackground = document.getElementById('baby-background');

    // Event Details
    elements.eventTypeTitle = document.getElementById('event-type-title');
    elements.eventDate = document.getElementById('event-date');
    elements.eventDay = document.getElementById('event-day');
    elements.eventTime = document.getElementById('event-time');
    elements.venueName = document.getElementById('venue-name');
    elements.venueAddress = document.getElementById('venue-address');
    elements.parentsNames = document.getElementById('parents-names');
    elements.additionalNote = document.getElementById('additional-note');

    // Action Buttons
    elements.wazeButton = document.getElementById('waze-button');
    elements.shareButton = document.getElementById('share-button');
    elements.calendarButton = document.getElementById('calendar-button');

    // RSVP Form
    elements.rsvpForm = document.getElementById('rsvp-form');
    elements.formFields = document.getElementById('form-fields');
    elements.btnComing = document.getElementById('btn-coming');
    elements.btnMaybe = document.getElementById('btn-maybe');
    elements.btnNotComing = document.getElementById('btn-not-coming');
    elements.guestCounterSection = document.getElementById('guest-counter-section');
    elements.guestCount = document.getElementById('guest-count');
    elements.minusBtn = document.getElementById('minus-btn');
    elements.plusBtn = document.getElementById('plus-btn');
    elements.blessingToggle = document.getElementById('blessing-toggle');
    elements.blessingContainer = document.getElementById('blessing-container');
    elements.submitBtn = document.getElementById('submit-btn');
    elements.successMessage = document.getElementById('success-message');

    // Inputs
    elements.fullNameInput = document.getElementById('full-name');
    elements.phoneInput = document.getElementById('phone');
    elements.blessingInput = document.getElementById('blessing');

    // Containers
    elements.starsContainer = document.getElementById('stars-container');
    elements.confettiContainer = document.getElementById('confetti-container');
    elements.toast = document.getElementById('toast');

    // Parallax elements
    elements.parallaxElements = document.querySelectorAll('[data-parallax]');
    elements.animateOnScrollElements = document.querySelectorAll('[data-animate-on-scroll]');
    elements.animateElements = document.querySelectorAll('[data-animate]');
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
    cacheElements();
    populateContent();
    loadBabyImage();
    setupEventListeners();

    if (CONFIG.animations.backgroundStars) {
        createBackgroundStars();
    }

    if (CONFIG.animations.parallaxEnabled) {
        initParallax();
    }

    initScrollAnimations();
    triggerInitialAnimations();

    if (CONFIG.animations.confettiOnLoad) {
        setTimeout(() => launchConfetti(40), 1000);
    }
}

// ============================================
// POPULATE CONTENT FROM CONFIG
// ============================================

function populateContent() {
    // Update page title
    document.title = `הזמנה ל${CONFIG.event.type}`;

    // Event type
    if (elements.eventTypeTitle) {
        elements.eventTypeTitle.textContent = CONFIG.event.type;
    }

    // Event details
    if (elements.eventDate) elements.eventDate.textContent = CONFIG.event.date;
    if (elements.eventDay) elements.eventDay.textContent = CONFIG.event.dayOfWeek;
    if (elements.eventTime) elements.eventTime.textContent = CONFIG.event.time;

    // Venue
    if (elements.venueName) elements.venueName.textContent = CONFIG.venue.name;
    if (elements.venueAddress) elements.venueAddress.textContent = CONFIG.venue.address;

    // Parents
    if (elements.parentsNames) elements.parentsNames.textContent = CONFIG.parents.names;

    // Additional notes
    if (elements.additionalNote && CONFIG.additionalNotes) {
        elements.additionalNote.textContent = CONFIG.additionalNotes;
    }
}

// ============================================
// IMAGE HANDLING - FIXED BACKGROUND
// ============================================

function loadBabyImage() {
    if (!CONFIG.images.baby || !elements.babyBackground) return;

    // Preload image before setting as background
    const img = new Image();

    img.onload = function () {
        elements.babyBackground.style.backgroundImage = `url(${CONFIG.images.baby})`;
        elements.babyBackground.style.opacity = '0.5';
    };

    img.onerror = function () {
        console.log('Baby image failed to load');
    };

    img.src = CONFIG.images.baby;
}

// ============================================
// BACKGROUND STARS
// ============================================

function createBackgroundStars() {
    if (!elements.starsContainer) return;

    const starCount = 30;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'background-star';

        const size = Math.random() * 3 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 5;

        Object.assign(star.style, {
            width: `${size}px`,
            height: `${size}px`,
            left: `${x}%`,
            top: `${y}%`,
            position: 'absolute',
            background: 'radial-gradient(circle, rgba(255,215,0,0.8) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: `twinkle ${duration}s ease-in-out ${delay}s infinite`,
        });

        elements.starsContainer.appendChild(star);
    }

    // Add keyframe if not exists
    if (!document.getElementById('twinkle-keyframe')) {
        const style = document.createElement('style');
        style.id = 'twinkle-keyframe';
        style.textContent = `
            @keyframes twinkle {
                0%, 100% { opacity: 0.3; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.5); }
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================
// PARALLAX EFFECT
// ============================================

function initParallax() {
    let ticking = false;

    window.addEventListener('scroll', () => {
        state.scrollY = window.pageYOffset;

        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
}

function updateParallax() {
    elements.parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.1;
        const yOffset = state.scrollY * speed;
        el.style.transform = `translateY(${yOffset}px)`;
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // For elements with delay
                const delay = entry.target.dataset.delay;
                if (delay) {
                    entry.target.style.transitionDelay = `${delay}ms`;
                }
            }
        });
    }, observerOptions);

    elements.animateOnScrollElements.forEach(el => observer.observe(el));
}

function triggerInitialAnimations() {
    // Trigger hero animations immediately
    setTimeout(() => {
        elements.animateElements.forEach(el => {
            const delay = parseInt(el.dataset.delay) || 0;
            setTimeout(() => {
                el.classList.add('visible');
            }, delay);
        });
    }, 300);
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Attendance buttons
    const attendanceButtons = [elements.btnComing, elements.btnMaybe, elements.btnNotComing];
    attendanceButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => selectAttendance(btn.dataset.status, btn));
        }
    });

    // Guest counter
    if (elements.minusBtn) elements.minusBtn.addEventListener('click', decrementGuests);
    if (elements.plusBtn) elements.plusBtn.addEventListener('click', incrementGuests);

    // Blessing toggle
    if (elements.blessingToggle) {
        elements.blessingToggle.addEventListener('click', toggleBlessing);
    }

    // Form submission
    if (elements.rsvpForm) {
        elements.rsvpForm.addEventListener('submit', handleSubmit);
    }

    // Action buttons
    if (elements.wazeButton) elements.wazeButton.addEventListener('click', openWaze);
    if (elements.shareButton) elements.shareButton.addEventListener('click', shareInvitation);
    if (elements.calendarButton) elements.calendarButton.addEventListener('click', addToCalendar);
}

// ============================================
// ATTENDANCE SELECTION
// ============================================

function selectAttendance(status, clickedBtn) {
    state.attendance = status;

    // Update button states
    const buttons = [elements.btnComing, elements.btnMaybe, elements.btnNotComing];
    buttons.forEach(btn => {
        if (btn) {
            btn.classList.remove('selected');
        }
    });

    if (clickedBtn) {
        clickedBtn.classList.add('selected');
    }

    // Show/hide guest counter based on status
    if (elements.guestCounterSection) {
        if (status === 'not-coming') {
            elements.guestCounterSection.style.display = 'none';
        } else {
            elements.guestCounterSection.style.display = 'block';
        }
    }
}

// ============================================
// GUEST COUNTER
// ============================================

function incrementGuests() {
    if (state.guestCount < 20) {
        state.guestCount++;
        updateGuestDisplay();
        animateCounter('up');
    }
}

function decrementGuests() {
    if (state.guestCount > 1) {
        state.guestCount--;
        updateGuestDisplay();
        animateCounter('down');
    }
}

function updateGuestDisplay() {
    if (elements.guestCount) {
        elements.guestCount.textContent = state.guestCount;
    }
}

function animateCounter(direction) {
    if (!elements.guestCount) return;

    elements.guestCount.style.transform = direction === 'up' ? 'scale(1.2)' : 'scale(0.8)';
    setTimeout(() => {
        elements.guestCount.style.transform = 'scale(1)';
    }, 150);
}

// ============================================
// BLESSING TOGGLE
// ============================================

function toggleBlessing() {
    state.blessingExpanded = !state.blessingExpanded;

    if (elements.blessingToggle) {
        elements.blessingToggle.classList.toggle('active', state.blessingExpanded);
    }

    if (elements.blessingContainer) {
        elements.blessingContainer.classList.toggle('expanded', state.blessingExpanded);

        if (state.blessingExpanded && elements.blessingInput) {
            setTimeout(() => elements.blessingInput.focus(), 400);
        }
    }
}

// ============================================
// FORM VALIDATION & SUBMISSION
// ============================================

function validateForm() {
    const name = elements.fullNameInput?.value.trim() || '';
    const phone = elements.phoneInput?.value.trim() || '';

    if (!state.attendance) {
        showToast('אנא בחרו האם אתם מגיעים', 'error');
        return false;
    }

    if (!name || name.length < 2) {
        showToast('אנא הזינו שם מלא', 'error');
        if (elements.fullNameInput) elements.fullNameInput.focus();
        return false;
    }

    const phonePattern = /^0[0-9]{8,9}$/;
    const cleanPhone = phone.replace(/[-\s]/g, '');
    if (!phonePattern.test(cleanPhone)) {
        showToast('מספר טלפון לא תקין', 'error');
        if (elements.phoneInput) elements.phoneInput.focus();
        return false;
    }

    return true;
}

async function handleSubmit(e) {
    e.preventDefault();

    if (state.formSubmitted) return;
    if (!validateForm()) return;

    // Show loading state
    if (elements.submitBtn) {
        elements.submitBtn.classList.add('loading');
        elements.submitBtn.disabled = true;
    }

    // Translate attendance status to Hebrew
    const attendanceHebrew = {
        'coming': 'מגיע/ה',
        'maybe': 'אולי',
        'not-coming': 'לא מגיע/ה'
    };

    // Data structure matching Google Apps Script expectations
    const formData = {
        name: elements.fullNameInput?.value.trim(),
        phone: elements.phoneInput?.value.trim(),
        attendance: attendanceHebrew[state.attendance] || state.attendance,
        guests: state.attendance === 'not-coming' ? 0 : state.guestCount,
        blessing: elements.blessingInput?.value.trim() || '',
    };

    try {
        if (CONFIG.formEndpoint) {
            // Send to Vercel serverless function
            const response = await fetch(CONFIG.formEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Submission failed');
            }
        } else {
            // Simulate network delay (no endpoint configured)
            await new Promise(resolve => setTimeout(resolve, 1500));
        }

        console.log('RSVP Data:', formData);
        showSuccess();

    } catch (error) {
        console.error('Submission error:', error);
        showToast('אירעה שגיאה, אנא נסו שנית', 'error');
        if (elements.submitBtn) {
            elements.submitBtn.classList.remove('loading');
            elements.submitBtn.disabled = false;
        }
    }
}

function showSuccess() {
    state.formSubmitted = true;

    // Hide form, show success
    if (elements.formFields) elements.formFields.style.display = 'none';
    if (elements.submitBtn) elements.submitBtn.style.display = 'none';

    // Hide attendance buttons
    const attendanceSection = document.querySelector('.attendance-selection');
    if (attendanceSection) attendanceSection.style.display = 'none';

    if (elements.successMessage) {
        elements.successMessage.classList.add('visible');
    }

    showToast('תודה! אישור ההגעה נשלח בהצלחה', 'success');

    if (CONFIG.animations.confettiOnSubmit) {
        launchConfetti(100);
    }
}

// ============================================
// VENUE ACTIONS
// ============================================

function openWaze() {
    const query = encodeURIComponent(CONFIG.venue.wazeQuery || CONFIG.venue.address);
    const wazeUrl = `waze://?q=${query}`;
    const webUrl = `https://www.waze.com/ul?q=${query}`;

    // Try Waze app first, fall back to web
    window.location.href = wazeUrl;
    setTimeout(() => window.open(webUrl, '_blank'), 500);
}

function shareInvitation() {
    const shareData = {
        title: `הזמנה ל${CONFIG.event.type}`,
        text: `הנכם מוזמנים ל${CONFIG.event.type} של ${CONFIG.parents.names}\nתאריך: ${CONFIG.event.date} בשעה ${CONFIG.event.time}\nמיקום: ${CONFIG.venue.name}, ${CONFIG.venue.address}`,
        url: window.location.href,
    };

    if (navigator.share) {
        navigator.share(shareData).catch(console.error);
    } else {
        // Fallback: copy to clipboard
        const text = `${shareData.text}\n${shareData.url}`;
        navigator.clipboard.writeText(text).then(() => {
            showToast('הקישור הועתק ללוח', 'success');
        }).catch(() => {
            showToast('לא ניתן לשתף', 'error');
        });
    }
}

function addToCalendar() {
    // Parse date (DD/MM/YYYY format)
    const dateParts = CONFIG.event.date.split('/');
    const timeParts = CONFIG.event.time.split(':');

    const startDate = new Date(
        parseInt(dateParts[2]),     // Year
        parseInt(dateParts[1]) - 1, // Month (0-indexed)
        parseInt(dateParts[0]),     // Day
        parseInt(timeParts[0]),     // Hour
        parseInt(timeParts[1])      // Minute
    );

    // End time: 3 hours after start
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);

    // Format for Google Calendar
    const formatDate = (date) => {
        return date.toISOString().replace(/-|:|\.\d+/g, '').slice(0, -1);
    };

    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${CONFIG.event.type} - ${CONFIG.parents.names}`)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(`הזמנה ל${CONFIG.event.type}`)}&location=${encodeURIComponent(`${CONFIG.venue.name}, ${CONFIG.venue.address}`)}`;

    window.open(googleCalUrl, '_blank');
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'info') {
    if (!elements.toast) return;

    const iconEl = elements.toast.querySelector('.toast-icon');
    const msgEl = elements.toast.querySelector('.toast-message');

    if (msgEl) msgEl.textContent = message;
    if (iconEl) iconEl.textContent = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';

    elements.toast.className = 'toast';
    elements.toast.classList.add(type, 'visible');

    setTimeout(() => {
        elements.toast.classList.remove('visible');
    }, 3500);
}

// ============================================
// CONFETTI SYSTEM
// ============================================

function launchConfetti(count = 50) {
    if (!elements.confettiContainer) return;

    for (let i = 0; i < count; i++) {
        setTimeout(() => createConfettiPiece(), i * 25);
    }
}

function createConfettiPiece() {
    const piece = document.createElement('div');
    piece.className = 'confetti';

    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const size = Math.random() * 10 + 6;
    const left = Math.random() * 100;
    const duration = Math.random() * 2.5 + 2;
    const delay = Math.random() * 0.3;

    const shapes = ['circle', 'square', 'heart'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];

    if (shape === 'heart') {
        piece.classList.add('heart');
        piece.textContent = '💖';
    } else {
        piece.style.width = `${size}px`;
        piece.style.height = `${size}px`;
        piece.style.backgroundColor = color;
        piece.style.borderRadius = shape === 'circle' ? '50%' : '2px';
    }

    piece.style.left = `${left}%`;
    piece.style.animationDuration = `${duration}s`;
    piece.style.animationDelay = `${delay}s`;

    elements.confettiContainer.appendChild(piece);

    setTimeout(() => piece.remove(), (duration + delay) * 1000 + 500);
}

// ============================================
// SMOOTH SCROLL
// ============================================

function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

// ============================================
// START
// ============================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
