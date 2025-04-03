// Force scroll to top on load
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Get DOM Elements
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.getElementById('navbar');
const scrollIndicator = document.getElementById('scrollIndicator');
const countdownDigitsEl = document.querySelector('.countdown-digits');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const countdownTitleEl = document.querySelector('.countdown-title');
const registerSection = document.getElementById('register');
const faqSection = document.getElementById('faq');
const contactSection = document.getElementById('contact');
const featuresSection = document.getElementById('features');

// State Variables
let hasScrolledInitially = false;
let showIndicatorTimeout = null;

// Function to close mobile menu
function closeMenu() {
    if (navMenu && menuToggle && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    }
}

// Mobile Menu Toggle
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// Close menu on nav link click
navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close menu on outside click
document.addEventListener('click', (event) => {
    if (navMenu && navMenu.classList.contains('active')) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnToggle = menuToggle ? menuToggle.contains(event.target) : false;
        if (!isClickInsideNav && !isClickOnToggle) {
            closeMenu();
        }
    }
});

// Countdown Timer Logic
const competitionDate = new Date('March 29, 2025 20:51:00').getTime();
const countdownInterval = setInterval(function() {
    const now = new Date().getTime();
    const distance = competitionDate - now;

    if (!countdownDigitsEl || !daysEl || !hoursEl || !minutesEl || !secondsEl) {
         clearInterval(countdownInterval);
         console.error("Countdown elements not found.");
         return;
    }

    if (distance < 0) {
        clearInterval(countdownInterval);
        if (countdownTitleEl) countdownTitleEl.textContent = 'Registration Closed';
        countdownDigitsEl.innerHTML = "<div style='font-size: 1.3rem; font-weight: 500; color: #eee; padding-top: 10px;'>Check back for results!</div>";
        daysEl.innerHTML = '00';
        hoursEl.innerHTML = '00';
        minutesEl.innerHTML = '00';
        secondsEl.innerHTML = '00';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.innerHTML = days.toString().padStart(2, '0');
    hoursEl.innerHTML = hours.toString().padStart(2, '0');
    minutesEl.innerHTML = minutes.toString().padStart(2, '0');
    secondsEl.innerHTML = seconds.toString().padStart(2, '0');
}, 1000);

// Conditional Scroll Indicator
if (scrollIndicator) {
    scrollIndicator.style.opacity = '0';
    scrollIndicator.style.pointerEvents = 'none';
    scrollIndicator.style.transition = 'opacity 0.5s ease';

    showIndicatorTimeout = setTimeout(() => {
        const mediaQuery = window.matchMedia('(min-width: 769px)');
        if (mediaQuery.matches && !hasScrolledInitially && window.scrollY < 50) {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    }, 4000);
} else {
    console.warn("Scroll indicator element not found.");
}

// Navbar Visibility on Scroll
const navHideThreshold = 50;
function handleNavbarVisibility() {
    if (!navbar) return;
    if (window.scrollY < navHideThreshold) {
        navbar.classList.remove('navbar-visible');
        closeMenu(); // Also close mobile menu when scrolling to top
    } else {
        navbar.classList.add('navbar-visible');
    }
}

// Hide Scroll Indicator on First Scroll
function handleInitialScrollDetection() {
    if (!hasScrolledInitially) {
        hasScrolledInitially = true;
        if (scrollIndicator) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        }
        clearTimeout(showIndicatorTimeout);
        window.removeEventListener('scroll', handleInitialScrollDetection, { passive: true });
    }
}

// Attach Scroll Listeners
window.addEventListener('scroll', handleNavbarVisibility, { passive: true });
window.addEventListener('scroll', handleInitialScrollDetection, { passive: true });
handleNavbarVisibility(); // Set initial state

// Intersection Observer for Animations
const sectionObserverCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
 };
const sectionObserver = new IntersectionObserver(sectionObserverCallback, {
    root: null,
    threshold: 0.15
});
const sectionsToObserve = [
    document.getElementById('presentation'),
    featuresSection,
    registerSection,
    document.getElementById('faq'),
    contactSection
].filter(section => section !== null);

if (sectionsToObserve.length > 0) {
    sectionsToObserve.forEach(section => {
        sectionObserver.observe(section);
    });
} else {
    console.warn("No sections found to observe for animations.");
}

// FAQ Accordion Logic
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-section .faq-item');

    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const questionButton = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            if (questionButton && answer) {
                questionButton.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');

                    // Close other items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                            const otherButton = otherItem.querySelector('.faq-question');
                            const otherAnswer = otherItem.querySelector('.faq-answer');
                            if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
                            if (otherAnswer) otherAnswer.setAttribute('aria-hidden', 'true');
                        }
                    });

                    // Toggle current item
                    item.classList.toggle('active');
                    questionButton.setAttribute('aria-expanded', !isActive);
                    answer.setAttribute('aria-hidden', isActive);
                });
            } else {
                console.warn("FAQ item missing question button or answer div:", item);
            }
        });
    } else {
        console.warn("No FAQ items found with selector '.faq-section .faq-item'.");
    }
});


   window.onload = function() {
  var splineElement = document.querySelectorAll('spline-viewer');
  
  for (let pas = 0; pas < splineElement.length; pas++) {
    var shadowRoot = splineElement[pas].shadowRoot;
    shadowRoot.querySelector('#logo').remove();
  }
}
