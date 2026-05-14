// Intersection Observer for scroll reveal animations
const revealElements = document.querySelectorAll('.reveal');

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(el => {
    revealOnScroll.observe(el);
});

// Interactive hover glow effect on cards
const cards = document.querySelectorAll('.blog-card');

cards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Carousel functionality
const carouselTrack = document.querySelector('.carousel-track');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
let autoplayInterval;

function goToSlide(n) {
    currentSlide = n;
    if (carouselTrack) {
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % dots.length;
    goToSlide(currentSlide);
}

function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 4000);
}

function stopAutoplay() {
    clearInterval(autoplayInterval);
}

// Add click handlers to dots
dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
        stopAutoplay();
        const slideNum = parseInt(e.target.getAttribute('data-slide'));
        goToSlide(slideNum);
        startAutoplay();
    });
});

// Start autoplay on page load
if (dots.length > 0) {
    startAutoplay();
}

// Theme toggle (dark/light) with saved preference
const THEME_STORAGE_KEY = 'blogweekly-theme';

function getPreferredTheme() {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme, toggleButton) {
    document.documentElement.setAttribute('data-theme', theme);
    if (toggleButton) {
        toggleButton.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        toggleButton.setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
}

function createThemeToggle() {
    const toggleButton = document.createElement('button');
    toggleButton.className = 'theme-toggle';
    toggleButton.type = 'button';
    toggleButton.innerHTML = `
        <svg class="icon-sun" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="4" stroke-width="1.8"></circle>
            <path d="M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" stroke-width="1.8" stroke-linecap="round"></path>
        </svg>
        <svg class="icon-moon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20.2 15.2a8.5 8.5 0 1 1-11.4-11.4A7.2 7.2 0 1 0 20.2 15.2z" stroke-width="1.8" stroke-linejoin="round"></path>
        </svg>
    `;

    let currentTheme = getPreferredTheme();
    applyTheme(currentTheme, toggleButton);

    toggleButton.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
        applyTheme(currentTheme, toggleButton);
    });

    return toggleButton;
}

const navTarget = document.querySelector('.header-nav') || document.querySelector('.navbar');
if (navTarget) {
    navTarget.appendChild(createThemeToggle());
}
