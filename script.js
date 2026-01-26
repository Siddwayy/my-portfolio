// Page transition and loading animations
document.addEventListener('DOMContentLoaded', function() {
    // Initialize page animations
    initPageAnimations();
    
    // Handle phone number copy
    initPhoneCopy();
    
    // Handle page transitions
    initPageTransitions();
    
    // Handle image loading
    initImageLoading();
    
    // Initialize theme toggle
    initThemeToggle();
}, { once: true });

function initPageAnimations() {
    // Show page content
    document.documentElement.classList.add('loaded');
    
    // Remove loading spinner after page loads
    const spinner = document.querySelector('.loading-spinner');
    if (spinner) {
        // Wait for all content to be ready
        if (document.readyState === 'complete') {
            setTimeout(() => {
                spinner.classList.remove('active');
            }, 150);
        } else {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    spinner.classList.remove('active');
                }, 150);
            });
        }
    }
    
    // Trigger content animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 20);
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
                this.style.color = '#4ecdc4';

                setTimeout(() => {
                    this.innerText = originalText;
                    this.style.color = '';
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
        return; // Already initialized
    }
    window.pageTransitionsSetup = true;
    
    let isNavigating = false; // Flag to prevent double navigation
    
    const links = document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"])');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if already navigating
            if (isNavigating) {
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
            
            isNavigating = true;
            
            // Hide page content immediately
            document.body.classList.add('transitioning');
            
            // Create transition overlay and show it immediately
            const overlay = document.createElement('div');
            overlay.className = 'page-transition active';
            document.body.appendChild(overlay);
            
            // Force immediate render and show overlay
            overlay.offsetHeight; // Trigger reflow
            
            // Animate out
            setTimeout(() => {
                overlay.classList.add('exit');
                
                // Navigate after transition
                setTimeout(() => {
                    if (isNavigating) { // Double check flag
                        window.location.href = href;
                    }
                }, 250);
            }, 30);
            
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

// Also handle pagehide to clean up before navigation
window.addEventListener('pagehide', function(event) {
    // Clean up before page unloads
    cleanupStuckStates();
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