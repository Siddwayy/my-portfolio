// Page transition and loading animations
document.addEventListener('DOMContentLoaded', function() {
    initPageAnimations();
    initPageTransitions();
    initImageLoading();
    initThemeToggle();
    initGameProjectsFilter();
    // Defer decorative effects until idle to prioritize critical rendering
    if ('requestIdleCallback' in window) {
        requestIdleCallback(function() {
            initCursorOrbs();
            initTiltCards();
        }, { timeout: 1500 });
    } else {
        setTimeout(function() {
            initCursorOrbs();
            initTiltCards();
        }, 100);
    }
}, { once: true });

// --- Cursor-reactive floating orbs + spotlight ---
function initCursorOrbs() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    var orbCount = window.innerWidth < 768 || 'ontouchstart' in window ? 6 : 12;
    const orbs = [];
    let rafId = null;
    
    const container = document.createElement('div');
    container.className = 'cursor-orbs';
    container.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(container, document.body.firstChild);
    
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-blue').trim() || '#4ecdc4';
    const colors = [accentColor, 'rgba(255, 180, 100, 0.6)', 'rgba(150, 120, 255, 0.5)', 'rgba(100, 220, 200, 0.5)'];
    
    for (let i = 0; i < orbCount; i++) {
        const orb = document.createElement('div');
        orb.className = 'cursor-orb';
        const size = 40 + Math.random() * 80;
        orb.style.width = size + 'px';
        orb.style.height = size + 'px';
        orb.style.left = Math.random() * 100 + '%';
        orb.style.top = Math.random() * 100 + '%';
        orb.style.background = colors[i % colors.length];
        orb.style.animationDelay = (Math.random() * 5) + 's';
        orb.dataset.vx = (Math.random() - 0.5) * 0.5;
        orb.dataset.vy = (Math.random() - 0.5) * 0.5;
        container.appendChild(orb);
        orbs.push({
            el: orb,
            x: parseFloat(orb.style.left) / 100 * window.innerWidth,
            y: parseFloat(orb.style.top) / 100 * window.innerHeight,
            vx: parseFloat(orb.dataset.vx),
            vy: parseFloat(orb.dataset.vy),
            size: size,
            attract: Math.random() > 0.5
        });
    }
    
    function animate() {
        document.documentElement.style.setProperty('--cursor-x', mouseX + 'px');
        document.documentElement.style.setProperty('--cursor-y', mouseY + 'px');
        const damp = 0.98;
        const strength = 0.015;
        const repelRadius = 120;
        
        orbs.forEach(function(o) {
            const dx = mouseX - o.x;
            const dy = mouseY - o.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            
            if (dist < 400) {
                const force = (o.attract ? 1 : -1) * strength * (1 - dist / 500);
                o.vx += (dx / dist) * force * 50;
                o.vy += (dy / dist) * force * 50;
            }
            
            o.vx *= damp;
            o.vy *= damp;
            o.x += o.vx;
            o.y += o.vy;
            
            o.x = Math.max(-o.size, Math.min(window.innerWidth + o.size, o.x));
            o.y = Math.max(-o.size, Math.min(window.innerHeight + o.size, o.y));
            
            o.el.style.transform = `translate(${o.x}px, ${o.y}px) translate(-50%, -50%)`;
        });
        rafId = requestAnimationFrame(animate);
    }
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });
    rafId = requestAnimationFrame(animate);
    // Pause animation when tab is hidden to save CPU/battery
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = null;
        } else {
            rafId = requestAnimationFrame(animate);
        }
    });
}

// --- Tilt cards toward cursor (event delegation) ---
function initTiltCards() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    document.addEventListener('mousemove', function(e) {
        var card = e.target.closest('.game-project-card, .expertise-item');
        if (!card) return;
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        var tiltX = Math.max(-8, Math.min(8, y * 8));
        var tiltY = Math.max(-8, Math.min(8, -x * 8));
        card.style.transform = 'perspective(800px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) translateZ(12px) scale(1.02)';
    }, { passive: true });
    document.addEventListener('mouseout', function(e) {
        var card = e.target.closest('.game-project-card, .expertise-item');
        if (card && !card.contains(e.relatedTarget)) {
            card.style.transform = '';
        }
    }, { passive: true });
}

function initPageAnimations() {
    document.documentElement.classList.add('loaded');
    document.body.classList.add('loaded');
    initStickyHeader();
}

function initStickyHeader() {
    var header = document.querySelector('header');
    if (!header) return;
    var ticking = false;
    function onScroll() {
        var scrollY = window.scrollY || document.documentElement.scrollTop;
        header.classList.toggle('scrolled', scrollY > 20);
        ticking = false;
    }
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });
    onScroll();
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
    
    // Get saved theme or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
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