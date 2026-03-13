// Universal Navbar script
document.addEventListener('DOMContentLoaded', function () {
    const initNav = () => {
        const hamburger = document.getElementById('hamburger');
        const mainNav = document.getElementById('mainNav');
        const navLinks = document.querySelectorAll('.main-nav a:not(.dropdown-toggle)');

        if (hamburger && mainNav) {
            // Check if listener is already attached to avoid duplicates
            if (hamburger.dataset.initialized) return;
            hamburger.dataset.initialized = 'true';

            // Hamburger click
            hamburger.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                hamburger.classList.toggle('active');
                mainNav.classList.toggle('active');
                document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
            });

            // Close menu when clicking on regular links
            navLinks.forEach(function (link) {
                link.addEventListener('click', function (e) {
                    // Do not prevent default here! Let the browser navigate.
                    hamburger.classList.remove('active');
                    mainNav.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', function (e) {
                if (!mainNav.contains(e.target) && !hamburger.contains(e.target)) {
                    hamburger.classList.remove('active');
                    mainNav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
            
            // Handle mobile dropdown for "On this page" links
            const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
            dropdownToggles.forEach(toggle => {
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const dropdownContent = this.nextElementSibling;
                    const icon = this.querySelector('.dropdown-icon');
                    
                    if (dropdownContent.style.maxHeight) {
                        dropdownContent.style.maxHeight = null;
                        if (icon) icon.style.transform = 'rotate(0deg)';
                    } else {
                        dropdownContent.style.maxHeight = dropdownContent.scrollHeight + "px";
                        if (icon) icon.style.transform = 'rotate(180deg)';
                    }
                });
            });
            
            // Support scrolling to section for "On this page" links inside the dropdown
            const dropdownItems = document.querySelectorAll('.dropdown-item');
            dropdownItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('href');
                    if(targetId && targetId.startsWith('#') && targetId !== '#') {
                        e.preventDefault();
                        const targetElement = document.querySelector(targetId);
                        if(targetElement) {
                            hamburger.classList.remove('active');
                            mainNav.classList.remove('active');
                            document.body.style.overflow = '';
                            
                            // Adjust scroll position for fixed header
                            const headerOffset = 100;
                            const elementPosition = targetElement.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                            
                            window.scrollTo({
                                 top: offsetPosition,
                                 behavior: "smooth"
                            });
                        }
                    } else if (targetId === '#') {
                        e.preventDefault();
                    } else {
                        // For fully external links, just let it navigate naturally but close the menu
                        hamburger.classList.remove('active');
                        mainNav.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            });

            // Header scroll effect
            const header = document.querySelector('.header');
            if (header) {
                let lastScrollY = window.scrollY;

                window.addEventListener('scroll', () => {
                    const currentScrollY = window.scrollY;

                    if (currentScrollY > 100) {
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
        }
    };

    // Initialize immediately if DOM is ready
    initNav();
    // Also retry after a short delay to ensure elements are present (e.g. if loaded async)
    setTimeout(initNav, 100);
});
