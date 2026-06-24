// ============================================
// SCROLL SYSTEM — BIDIRECTIONAL ANIMATIONS
// ============================================

// --- NAVBAR SCROLL EFFECT ---
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  
  // Navbar blur effect
  if (currentScrollY > 10) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  // Navbar hide on scroll down, show on scroll up
  if (currentScrollY > 300) {
    if (currentScrollY > lastScrollY + 8) {
      navbar.classList.add('hidden');
    } else if (currentScrollY < lastScrollY - 8) {
      navbar.classList.remove('hidden');
    }
  } else {
    navbar.classList.remove('hidden');
  }
  
  // Active nav link
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.pageYOffset >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
  
  lastScrollY = currentScrollY;
}, { passive: true });

// ============================================
// SCROLL PROGRESS BAR
// ============================================
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
  if (scrollProgress) {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }
}, { passive: true });

// ============================================
// INTERSECTION OBSERVER — BIDIRECTIONAL
// ============================================
const revealElements = document.querySelectorAll(
  '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur, .reveal-rotate, .section-divider'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      // Remove .visible when scrolling back up — bidirectional
      entry.target.classList.remove('visible');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ============================================
// PARALLAX EFFECTS
// ============================================
const parallaxShapes = document.querySelectorAll('.hero-shape');
const heroImageWrapper = document.querySelector('.hero-image-wrapper');
const aboutImage = document.querySelector('.about-image-wrapper');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroSection = document.querySelector('.hero');
  
  if (heroSection && heroImageWrapper) {
    const heroRect = heroSection.getBoundingClientRect();
    
    if (heroRect.bottom > 0 && heroRect.top < window.innerHeight) {
      // Floating shapes parallax — move down on scroll
      parallaxShapes.forEach(shape => {
        const speed = parseFloat(shape.getAttribute('data-speed')) || 0.3;
        const yOffset = scrollY * speed * 0.5;
        shape.style.transform = `translate3d(0, ${yOffset}px, 0)`;
      });
      
      // Hero image — fade out on scroll down, fade in on scroll up
      const heroProgress = Math.min(scrollY / (heroRect.height * 0.6), 1);
      const opacity = 1 - (heroProgress * 0.85);
      const scale = 1 + (heroProgress * 0.03);
      heroImageWrapper.style.opacity = opacity;
      heroImageWrapper.style.transform = `translate3d(0, ${scrollY * 0.08}px, 0) scale(${scale})`;
    }
  }
  
  // About image subtle parallax (continuous)
  if (aboutImage) {
    const aboutRect = aboutImage.getBoundingClientRect();
    if (aboutRect.bottom > 0 && aboutRect.top < window.innerHeight) {
      const rect = aboutImage.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const offset = (sectionCenter - viewportCenter) * 0.05;
      aboutImage.querySelector('img').style.transform = `translate3d(0, ${offset}px, 0) scale(1.05)`;
    }
  }
}, { passive: true });

// ============================================
// STAT COUNTER ANIMATION (on visible)
// ============================================
const statNumbers = document.querySelectorAll('.stat-number');

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const stat = entry.target;
      const targetText = stat.textContent;
      const num = parseInt(targetText);
      
      if (!isNaN(num) && !stat.dataset.animated) {
        stat.dataset.animated = 'true';
        animateCounter(stat, 0, num, 1500);
      }
    }
    // Remove animated flag so it can replay on scroll back up and down again
    if (!entry.isIntersecting) {
      entry.target.dataset.animated = '';
    }
  });
}, { threshold: 0.8 });

statNumbers.forEach(stat => statObserver.observe(stat));

function animateCounter(el, start, end, duration) {
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out quad
    const eased = 1 - (1 - progress) * (1 - progress);
    const current = Math.round(start + (end - start) * eased);
    
    el.textContent = current + (el.dataset.suffix || '+');
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// ============================================
// MOBILE NAV TOGGLE
// ============================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });
}

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
  });
});

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const navHeight = navbar.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================
// CONTACT FORM
// ============================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sent ✓';
    btn.style.background = '#3fb950';
    btn.style.borderColor = '#3fb950';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.borderColor = '';
      contactForm.reset();
    }, 3000);
  });
}

// ============================================
// CURSOR TRAIL (desktop only)
// ============================================
if (window.innerWidth > 1024 && !('ontouchstart' in window)) {
  const trail = document.createElement('div');
  trail.style.cssText = `
    position: fixed; width: 28px; height: 28px; border: 1.5px solid rgba(32,32,32,0.08);
    border-radius: 50%; pointer-events: none; z-index: 9999; transition: transform 0.15s ease,
    opacity 0.3s ease, width 0.3s ease, height 0.3s ease;
    transform: translate(-50%, -50%); opacity: 0;
  `;
  document.body.appendChild(trail);

  let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    trail.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    trail.style.opacity = '0';
  });

  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    trail.style.left = trailX + 'px';
    trail.style.top = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Expand on hover over interactive elements
  document.querySelectorAll('a, button, .work-card, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      trail.style.width = '48px';
      trail.style.height = '48px';
      trail.style.borderColor = 'rgba(32,32,32,0.15)';
    });
    el.addEventListener('mouseleave', () => {
      trail.style.width = '28px';
      trail.style.height = '28px';
      trail.style.borderColor = 'rgba(32,32,32,0.08)';
    });
  });
}
