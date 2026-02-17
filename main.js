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
 * Intro Image Rotation (Disabled in favor of benefits-synced rotation)
 */
function initIntroRotation() {
  return;
}

/**
 * Benefits & Impact Rotation (3s iterative highlight synced with image)
 */
function initBenefitsRotation() {
  const items = document.querySelectorAll('.benefit-item');
  const introImg = document.getElementById('intro-rotating-image');
  if (items.length === 0) return;

  const images = [
    '/New%20Images/1S9A4753.jpg',
    '/New%20Images/EDIT2_1S9A4549.jpg',
    '/New%20Images/EDIT2_1S9A4727.jpg'
  ];

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

    // Change image in sync (cycle through 3 images for 6 benefit items)
    if (introImg) {
      const parent = introImg.parentElement;
      // Set parent background to current image to prevent white flash
      parent.style.backgroundImage = `url("${introImg.src}")`;
      parent.style.backgroundSize = 'cover';
      parent.style.backgroundPosition = 'center';

      introImg.style.opacity = '0';
      setTimeout(() => {
        const nextImg = images[currentIndex % images.length];
        introImg.src = nextImg;

        // Wait for next image to load before fading in
        const imgObj = new Image();
        imgObj.onload = () => {
          introImg.style.opacity = '1';
        };
        imgObj.onerror = () => {
          console.error('Failed to load image:', nextImg);
          introImg.style.opacity = '1'; // Fallback to show whatever is there
        };
        imgObj.src = nextImg;

        // Safety timeout in case neither fires (e.g. cached without triggering load)
        setTimeout(() => {
          if (introImg.style.opacity === '0') {
            introImg.style.opacity = '1';
          }
        }, 2000);
      }, 500);
    }
  }, 3000);
}
