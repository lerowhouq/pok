// Cookie Management Functions
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = name + "=" + value + ";expires=" + expires.toUTCString() + ";path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
}

// Age Verification Popup
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Age verification script running');
    
    const agePopup = document.getElementById('ageVerificationPopup');
    const acceptBtn = document.getElementById('acceptAge');
    const closeBtn = document.getElementById('closeAge');
    
    console.log('Age popup element:', agePopup);
    console.log('Accept button:', acceptBtn);
    console.log('Close button:', closeBtn);
    
    if (!agePopup) {
        console.error('Age popup element not found!');
        return;
    }
    
    // Check if user has already accepted age verification via cookie
    const ageAccepted = getCookie('ageVerified');
    const userCountry = getCookie('userCountry');
    const userLanguage = getCookie('userLanguage');
    
    console.log('Age verification cookie:', ageAccepted);
    console.log('User country cookie:', userCountry);
    console.log('User language cookie:', userLanguage);
    
    // If user has already accepted, don't show popup
    if (ageAccepted === 'true') {
        console.log('User already verified age - hiding popup');
        agePopup.classList.add('hidden');
        return;
    }
    
    // Accept button - hide popup and set cookie
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            console.log('Accept button clicked - setting cookies');
            
            // Set age verification cookie (expires in 1 year)
            setCookie('ageVerified', 'true', 365);
            
            // Set timestamp of verification
            setCookie('ageVerifiedTimestamp', new Date().toISOString(), 365);
            
            // Set user preferences cookies
            setCookie('userPreferences', JSON.stringify({
                theme: 'dark',
                notifications: true,
                language: navigator.language || 'en'
            }), 365);
            
            // Track user interaction
            setCookie('lastVisit', new Date().toISOString(), 365);
            setCookie('visitCount', (parseInt(getCookie('visitCount') || '0') + 1).toString(), 365);
            
            agePopup.classList.add('hidden');
        });
    }
    
    // Close button - redirect to forbidden page
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            console.log('Close button clicked - redirecting to forbidden page');
            
            // Set a cookie to track denied access
            setCookie('ageVerificationDenied', 'true', 30);
            setCookie('deniedTimestamp', new Date().toISOString(), 30);
            
            // Redirect to forbidden page
            window.location.href = 'forbidden.html';
        });
    }
    
    // Prevent closing by clicking outside
    agePopup.addEventListener('click', function(e) {
        if (e.target === agePopup) {
            console.log('Clicked outside popup - keeping it open');
            // Keep popup open - don't allow closing by clicking outside
        }
    });
    
    // Additional cookie tracking for analytics
    function trackUserBehavior() {
        // Track page load time
        const loadTime = performance.now();
        setCookie('pageLoadTime', loadTime.toString(), 1);
        
        // Track user agent
        setCookie('userAgent', navigator.userAgent, 30);
        
        // Track screen resolution
        setCookie('screenResolution', `${screen.width}x${screen.height}`, 30);
        
        // Track timezone
        setCookie('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone, 30);
    }
    
    // Track user behavior after a short delay
    setTimeout(trackUserBehavior, 1000);
});

// Cookie Consent Banner
document.addEventListener('DOMContentLoaded', function() {
    const cookieBanner = document.getElementById('cookieConsent');
    const acceptCookiesBtn = document.getElementById('acceptCookies');
    const rejectCookiesBtn = document.getElementById('rejectCookies');
    const customizeCookiesBtn = document.getElementById('customizeCookies');
    
    // Check if user has already made a cookie choice
    const cookieConsent = getCookie('cookieConsent');
    
    if (cookieConsent) {
        console.log('Cookie consent already given:', cookieConsent);
        return; // Don't show banner if consent already given
    }
    
    // Show cookie banner after age verification (if needed)
    setTimeout(() => {
        if (cookieBanner) {
            cookieBanner.classList.add('show');
            console.log('Showing cookie consent banner');
        }
    }, 2000); // Show 2 seconds after page load
    
    // Accept all cookies
    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', function() {
            console.log('User accepted all cookies');
            
            // Set consent cookie
            setCookie('cookieConsent', 'all', 365);
            setCookie('cookieConsentTimestamp', new Date().toISOString(), 365);
            
            // Enable all cookie types
            setCookie('cookiesEssential', 'true', 365);
            setCookie('cookiesPreferences', 'true', 365);
            setCookie('cookiesAnalytics', 'true', 365);
            setCookie('cookiesSecurity', 'true', 365);
            
            // Hide banner
            cookieBanner.classList.remove('show');
        });
    }
    
    // Reject non-essential cookies
    if (rejectCookiesBtn) {
        rejectCookiesBtn.addEventListener('click', function() {
            console.log('User rejected non-essential cookies');
            
            // Set consent cookie
            setCookie('cookieConsent', 'essential', 365);
            setCookie('cookieConsentTimestamp', new Date().toISOString(), 365);
            
            // Only enable essential cookies
            setCookie('cookiesEssential', 'true', 365);
            setCookie('cookiesPreferences', 'false', 365);
            setCookie('cookiesAnalytics', 'false', 365);
            setCookie('cookiesSecurity', 'false', 365);
            
            // Delete non-essential cookies
            deleteCookie('userPreferences');
            deleteCookie('pageLoadTime');
            deleteCookie('userAgent');
            deleteCookie('screenResolution');
            deleteCookie('timezone');
            deleteCookie('visitCount');
            deleteCookie('lastVisit');
            
            // Hide banner
            cookieBanner.classList.remove('show');
        });
    }
    
    // Customize cookies (placeholder for future implementation)
    if (customizeCookiesBtn) {
        customizeCookiesBtn.addEventListener('click', function() {
            console.log('User wants to customize cookies');
            
            // For now, just accept essential cookies
            // In the future, you could show a detailed cookie settings modal
            setCookie('cookieConsent', 'custom', 365);
            setCookie('cookiesEssential', 'true', 365);
            
            // Hide banner
            cookieBanner.classList.remove('show');
            
            // Show a simple alert for now
            alert('Cookie customization feature coming soon. For now, only essential cookies will be used.');
        });
    }
});

// Function to check if specific cookie types are allowed
function isCookieAllowed(cookieType) {
    const consent = getCookie('cookieConsent');
    const specificConsent = getCookie('cookies' + cookieType.charAt(0).toUpperCase() + cookieType.slice(1));
    
    if (consent === 'all') return true;
    if (consent === 'essential' && cookieType === 'essential') return true;
    if (consent === 'custom' && specificConsent === 'true') return true;
    
    return false;
}

// Enhanced cookie setting function with consent check
function setCookieWithConsent(name, value, days, cookieType = 'essential') {
    if (isCookieAllowed(cookieType)) {
        setCookie(name, value, days);
        console.log(`Cookie set: ${name} (${cookieType})`);
    } else {
        console.log(`Cookie blocked: ${name} (${cookieType} not allowed)`);
    }
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
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

// Countdown timer
function updateCountdown() {
    const targetDate = new Date('November 20, 2025 23:59:59').getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    } else {
        // Countdown has ended
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
    }
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe all sections and important elements
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const features = document.querySelectorAll('.feature');
    const scheduleDays = document.querySelectorAll('.schedule-day');
    const prizeTiers = document.querySelectorAll('.prize-tier');
    
    sections.forEach(section => observer.observe(section));
    features.forEach(feature => observer.observe(feature));
    scheduleDays.forEach(day => observer.observe(day));
    prizeTiers.forEach(tier => observer.observe(tier));
});

// Enhanced form validation
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.registration-form');
    const phoneInput = document.getElementById('phone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Remove all non-digit characters except +, spaces, hyphens, and parentheses
            let value = e.target.value.replace(/[^\d\s\-\(\)\+]/g, '');
            
            // Ensure only one + at the beginning
            if (value.startsWith('+')) {
                value = '+' + value.substring(1).replace(/\+/g, '');
            }
            
            e.target.value = value;
        });
    }
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#e74c3c';
                } else {
                    field.style.borderColor = 'rgba(255, 215, 0, 0.3)';
                }
            });
            
            if (isValid) {
                // Collect form data
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                
                // Store in session storage for payment page
                sessionStorage.setItem('registrationData', JSON.stringify(data));
                
                // Redirect to payment page
                window.location.href = 'payment.html';
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const cards = document.querySelectorAll('.card');
    
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
    
    // Subtle card movement
    cards.forEach((card, index) => {
        const rate = scrolled * (0.1 + index * 0.02);
        card.style.transform = `translateY(${rate}px) rotate(-8deg)`;
    });
});

// Smooth reveal animations for stats
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach((stat, index) => {
        setTimeout(() => {
            stat.style.opacity = '1';
            stat.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Trigger stats animation when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// Enhanced hover effects for interactive elements
document.addEventListener('DOMContentLoaded', () => {
    const interactiveElements = document.querySelectorAll('.btn, .feature, .schedule-day, .prize-tier');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add loading class to body initially
document.body.classList.add('loading');

// Utility function for smooth element transitions
function smoothTransition(element, properties, duration = 300) {
    element.style.transition = `all ${duration}ms ease`;
    Object.assign(element.style, properties);
    
    setTimeout(() => {
        element.style.transition = '';
    }, duration);
}

// Enhanced mobile menu functionality (if needed)
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Initialize mobile menu
initMobileMenu();

// Add some CSS for loading state
const style = document.createElement('style');
style.textContent = `
    body.loading {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    .stat-number {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }
    
    .fade-in-up {
        animation: fadeInUp 0.8s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Card animation on hover
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.05)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Prize tier hover effects
document.querySelectorAll('.prize-tier').forEach(tier => {
    tier.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
    });
    
    tier.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });
});

// Feature hover effects
document.querySelectorAll('.feature').forEach(feature => {
    feature.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(10px)';
    });
    
    feature.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
    });
});

// Timeline item hover effects
document.querySelectorAll('.timeline-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(10px)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
    });
});

// Form input focus effects
document.querySelectorAll('.form-group input, .form-group select').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateY(-2px)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateY(0)';
    });
});

// Add CSS for notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
    
    .loaded {
        opacity: 1;
    }
    
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
`;

document.head.appendChild(notificationStyles);

// Add some additional interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add click sound effect to buttons (optional)
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Add a subtle scale effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Add typing effect to hero title (optional)
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Close any open notifications
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => notification.remove());
    }
});

// Add touch support for mobile devices
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && navMenu.classList.contains('active')) {
            // Swipe left - close menu
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
} 