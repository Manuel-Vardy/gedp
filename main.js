// Import CSS files
import './style.css';
import './responsive.css';

document.addEventListener('DOMContentLoaded', () => {
  initSlider();
  initScrollAnimations();
  initFormHandlers();
  initNavEffects();
  initMobileMenu();
  initIntroRotation();
  initBenefitsRotation();
});

/**
 * Hero Slider Logic
 */
function initSlider() {
  const slides = document.querySelectorAll('.slide');

  // Guard clause for pages without slider
  if (slides.length === 0) return;

  let currentSlide = 0;
  let slideInterval;


  function goToSlide(n) {
    slides[currentSlide].classList.remove('active');

    currentSlide = (n + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');

    resetInterval();
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startInterval() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
  }


  // Pause on hover - REMOVED as requested
  // const slider = document.querySelector('.hero');
  // slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
  // slider.addEventListener('mouseleave', startInterval);

  startInterval();
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('hide-reveal-left')) {
          entry.target.classList.add('reveal-left');
        } else {
          entry.target.classList.add('reveal');
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll('.hide-reveal, .hide-reveal-left, section, .portal-card').forEach(el => {
    // Only add hide-reveal if it doesn't already have an animation class
    if (!el.classList.contains('hide-reveal-left') && !el.classList.contains('hide-reveal')) {
      el.classList.add('hide-reveal');
    }
    observer.observe(el);
  });
}

/**
 * Form Handling
 */
function initFormHandlers() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const originalText = btn.innerText;

      btn.innerText = 'Sending...';
      btn.disabled = true;

      // Simulate API call
      setTimeout(() => {
        btn.innerText = 'Sent Successfully!';
        btn.style.backgroundColor = 'var(--ghana-green)';
        form.reset();

        setTimeout(() => {
          btn.innerText = originalText;
          btn.style.backgroundColor = '';
          btn.disabled = false;
        }, 3000);
      }, 1500);
    });
  });
}

/**
 * Navigation Effects
 */
function initNavEffects() {
  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Header scroll effect
  const header = document.querySelector('.header');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Hide when crossing hero section (400px threshold)
    if (currentScrollY > 400) {
      if (currentScrollY > lastScrollY) {
        // Scrolling Down
        header.classList.add('nav-hidden');
        header.classList.remove('nav-scrolled');
      } else {
        // Scrolling Up
        header.classList.remove('nav-hidden');
        header.classList.add('nav-scrolled');
      }
    } else {
      // Near Top (Over Hero)
      header.classList.remove('nav-hidden');
      header.classList.remove('nav-scrolled');
    }

    lastScrollY = currentScrollY;
  });
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburger || !mainNav) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mainNav.classList.toggle('active');
    document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when clicking on a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mainNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mainNav.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove('active');
      mainNav.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/**
 * Intro Image Rotation (168-hour cycle)
 */
function initIntroRotation() {
  const introImg = document.getElementById('intro-rotating-image');
  if (!introImg) return;

  const images = [
    '/FINAL%20LOADS/The%20Girl%20with%20the%20Laptop/1S9A4541.jpg',
    '/1S9A4487-1.jpg'
  ];

  // Calculate index based on 168-hour (one week) cycles
  const totalHours = Math.floor(Date.now() / (1000 * 60 * 60));
  const weekIndex = Math.floor(totalHours / 168) % images.length;

  introImg.src = images[weekIndex];
}

/**
 * Benefits & Impact Rotation (1.5s iterative highlight)
 */
function initBenefitsRotation() {
  const items = document.querySelectorAll('.benefit-item');
  if (items.length === 0) return;

  let currentIndex = 0;

  // Initial state
  items[currentIndex].classList.add('active');

  setInterval(() => {
    // Remove active from current
    items[currentIndex].classList.remove('active');

    // Move to next
    currentIndex = (currentIndex + 1) % items.length;

    // Add active to next
    items[currentIndex].classList.add('active');
  }, 3000);
}
