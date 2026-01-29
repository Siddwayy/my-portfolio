// Page transition and loading animations
document.addEventListener('DOMContentLoaded', function() {
    initPageAnimations();
    initPhoneCopy();
    initPageTransitions();
    initImageLoading();
    initThemeToggle();
    initGameProjectsFilter();
}, { once: true });

function initPageAnimations() {
    document.documentElement.classList.add('loaded');
    document.body.classList.add('loaded');
}

function initPhoneCopy() {
    const phoneElement = document.getElementById('phone-number');

    if (phoneElement) {
        phoneElement.addEventListener('click', function(event) {
            event.preventDefault();

            const phoneNumber = this.innerText;
            
            navigator.clipboard.writeText(phoneNumber).then(() => {
                const originalText = this.innerText;
                this.innerText = 'Copied!';
                this.classList.add('copied');

                setTimeout(() => {
                    this.innerText = originalText;
                    this.classList.remove('copied');
                }, 2000);

            }).catch(err => {
                console.error('Failed to copy phone number: ', err);
                alert('Could not copy number. Please copy it manually.');
            });
        });
    }
}

function initPageTransitions() {
    if (window.pageTransitionsSetup) {
        return;
    }
    window.pageTransitionsSetup = true;
    window.isNavigating = false;
    
    const links = document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"])');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (window.isNavigating) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return false;
            }
            
            // Skip if it's the same page or external link
            if (!href || href === '#' || href.startsWith('http') || href.startsWith('//')) {
                return true; // Allow default behavior
            }
            
            // Check if clicking the same page
            const currentPath = window.location.pathname.split('/').pop() || '';
            const targetPath = href.split('/').pop() || '';
            
            // Normalize paths (handle index.html vs ./ vs empty)
            let normalizedCurrent = currentPath || 'index.html';
            let normalizedTarget = targetPath || 'index.html';
            
            // Handle relative paths
            if (href === './' || href === '/' || href === '') {
                normalizedTarget = 'index.html';
            }
            if (currentPath === '' || currentPath === '/') {
                normalizedCurrent = 'index.html';
            }
            
            if (normalizedCurrent === normalizedTarget) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            window.isNavigating = true;
            document.body.classList.add('transitioning');
            
            // Create transition overlay and show it immediately
            const overlay = document.createElement('div');
            overlay.className = 'page-transition active';
            document.body.appendChild(overlay);
            
            overlay.offsetHeight;
            setTimeout(() => {
                overlay.classList.add('exit');
                setTimeout(() => {
                    if (window.isNavigating) window.location.href = href;
                }, 180);
            }, 10);
            
            return false;
        }, { passive: false });
    });
}

function initImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
            
            img.addEventListener('error', function() {
                this.style.opacity = '0.5';
            });
        }
    });
}

// Clean up function for stuck states
function cleanupStuckStates() {
    // Clean up any stuck overlays or transitions
    const stuckOverlays = document.querySelectorAll('.page-transition.active');
    stuckOverlays.forEach(overlay => {
        overlay.classList.remove('active');
        overlay.classList.remove('exit');
        overlay.style.pointerEvents = 'none';
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 100);
    });
    
    // Remove transitioning class
    document.body.classList.remove('transitioning');
    
    // Reset navigation flag
    window.isNavigating = false;
    
    // Remove loading spinner if stuck
    const spinner = document.querySelector('.loading-spinner');
    if (spinner && spinner.classList.contains('active')) {
        spinner.classList.remove('active');
        spinner.style.opacity = '0';
        spinner.style.pointerEvents = 'none';
    }
}

// Safety timeout to clean up stuck states after 2 seconds
setTimeout(() => {
    const activeOverlay = document.querySelector('.page-transition.active');
    const activeSpinner = document.querySelector('.loading-spinner.active');
    if (activeOverlay || activeSpinner) {
        cleanupStuckStates();
    }
}, 2000);

// Handle browser back/forward navigation (popstate)
window.addEventListener('popstate', function(event) {
    cleanupStuckStates();
    // Re-initialize animations
    setTimeout(() => {
        initPageAnimations();
    }, 50);
});

// Handle browser back/forward navigation (pageshow - for cached pages)
window.addEventListener('pageshow', function(event) {
    cleanupStuckStates();
    
    if (event.persisted) {
        // Page was loaded from cache, trigger animations
        document.body.classList.add('loaded');
        document.documentElement.classList.add('loaded');
        
        // Re-initialize animations
        setTimeout(() => {
            initPageAnimations();
        }, 50);
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    if (!themeToggle || !themeIcon) return;
    
    // Get saved theme or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Update theme
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Update icon
        if (newTheme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        
        // Save preference
        localStorage.setItem('theme', newTheme);
    });
}

function initGameProjectsFilter() {
    const filterBar = document.querySelector('.game-projects-filter');
    const cards = document.querySelectorAll('.game-project-card');
    if (!filterBar || !cards.length) return;

    const buttons = filterBar.querySelectorAll('.filter-btn[data-filter]');
    buttons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var filter = this.getAttribute('data-filter');
            buttons.forEach(function(b) { b.classList.remove('filter-btn--active'); });
            this.classList.add('filter-btn--active');

            cards.forEach(function(card) {
                var categories = (card.getAttribute('data-category') || '').trim().split(/\s+/);
                var show = filter === 'all' || categories.indexOf(filter) !== -1;
                card.classList.toggle('game-project-card--hidden', !show);
            });
        });
    });
}