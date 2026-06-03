/* ==========================================================================
   INTERACTIVE JAVASCRIPT SYSTEM — NASHA SHIBIN PORTFOLIO (2026)
   No frameworks, no JS libraries. Pure Vanilla JS.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Check if device is touch-capable or viewport is small
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 1024;

  /* ==========================================================================
     MODULE 1 — CUSTOM CURSOR (DESKTOP ONLY)
     ========================================================================== */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let dotX = mouseX;
  let dotY = mouseY;
  let mouseActive = false;

  if (!isTouchDevice && cursorDot && cursorRing) {
    // Show custom cursor elements on first movement
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!mouseActive) {
        mouseActive = true;
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
      }
    });

    // Hide/Show cursor when mouse leaves/enters viewport
    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
      if (mouseActive) {
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
      }
    });

    // Custom cursor lerp loop
    const updateCursor = () => {
      // Small dot follows instantly
      dotX = mouseX;
      dotY = mouseY;
      
      // Ring follows with a lerp lag (0.16)
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      cursorDot.style.left = `${dotX}px`;
      cursorDot.style.top = `${dotY}px`;
      
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;

      requestAnimationFrame(updateCursor);
    };
    requestAnimationFrame(updateCursor);

    // Hover listeners to scale and glow cursor
    const setupCursorHovers = () => {
      const interactives = document.querySelectorAll('.interactive, a, button, .project-card, .process-card');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursorRing.classList.add('hovered');
          cursorDot.classList.add('hovered');
        });
        
        el.addEventListener('mouseleave', () => {
          cursorRing.classList.remove('hovered');
          cursorDot.classList.remove('hovered');
        });
      });
    };
    setupCursorHovers();

    // Re-initialize hover events if DOM contents change dynamically
    const observer = new MutationObserver(setupCursorHovers);
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    // Hide custom cursor elements for touch/mobile devices
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorRing) cursorRing.style.display = 'none';
    document.body.style.cursor = 'auto';
  }


  /* ==========================================================================
     MODULE 2 — MAGNETIC HOVER EFFECT ON CTAS
     ========================================================================== */
  const magneticCTAs = document.querySelectorAll('.magnetic');
  
  if (!isTouchDevice && magneticCTAs.length > 0) {
    magneticCTAs.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        // Mouse coordinate relative to the button center
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Push button toward cursor location (reduced factor of 0.28)
        btn.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
        btn.style.transition = 'none';
      });
      
      btn.addEventListener('mouseleave', () => {
        // Return back to base with a premium transition elastic feel
        btn.style.transform = 'translate(0px, 0px)';
        btn.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });
  }


  /* ==========================================================================
     MODULE 3 — DYNAMIC CARD PERSPECTIVE TILT (PROJECTS)
     ========================================================================== */
  const tiltCards = document.querySelectorAll('.tilt-card');
  
  if (!isTouchDevice && tiltCards.length > 0) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Map cursor position to a percentage shift (-0.5 to 0.5)
        const xPercent = (x / rect.width) - 0.5;
        const yPercent = (y / rect.height) - 0.5;
        
        // Tilt rotations
        const rotateX = -yPercent * 10; // max tilt 10deg
        const rotateY = xPercent * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        card.style.transition = 'none';
      });
      
      card.addEventListener('mouseleave', () => {
        // Reset tilt on exit
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        card.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });
  }


  /* ==========================================================================
     MODULE 4 — SCROLL INTERSECTION OBSERVER REVEALS & COUNT-UPS
     ========================================================================== */
  // 1. Reveal (Fade + translateY) Observer
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
  
  const revealObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target); // Reveal only once
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // 2. Stats Row Number Count-Up Observer
  const statsRow = document.querySelector('.stats-row');
  
  if (statsRow) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const numbers = entry.target.querySelectorAll('.stat-number');
          
          numbers.forEach(numEl => {
            const targetStr = numEl.getAttribute('data-target');
            const targetVal = parseFloat(targetStr);
            const extraStr = targetStr.replace(/[0-9.]/g, ''); // Keeps strings like "+" or suffix
            
            let startTimestamp = null;
            const duration = 2000; // 2 seconds counting

            const step = (timestamp) => {
              if (!startTimestamp) startTimestamp = timestamp;
              const progress = Math.min((timestamp - startTimestamp) / duration, 1);
              
              // Ease-out Quad easing function
              const easeProgress = progress * (2 - progress);
              const currentValue = easeProgress * targetVal;
              
              if (Number.isInteger(targetVal)) {
                numEl.innerText = Math.floor(currentValue) + extraStr;
              } else {
                numEl.innerText = currentValue.toFixed(1) + extraStr;
              }
              
              if (progress < 1) {
                window.requestAnimationFrame(step);
              } else {
                numEl.innerText = targetStr; // Snap to final original target string
              }
            };
            
            window.requestAnimationFrame(step);
          });
          
          statsObserver.unobserve(entry.target); // Animate once
        }
      });
    }, { threshold: 0.3 });
    
    statsObserver.observe(statsRow);
  }


  /* ==========================================================================
     MODULE 5 — NAVIGATION NAVBAR INTERACTION
     ========================================================================== */
  const mainNav = document.getElementById('mainNav');
  
  // Frosted navigation state on scrolling
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      mainNav.classList.add('nav-scrolled');
    } else {
      mainNav.classList.remove('nav-scrolled');
    }
  });

  // Hamburger mobile menu actions
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.mobile-drawer .nav-link');

  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      mobileDrawer.classList.toggle('active');
    });

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        mobileDrawer.classList.remove('active');
      });
    });
  }

  // Smooth anchor scrolls adjusting for header height offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        
        const headerHeight = 90;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset;
        
        window.scrollTo({
          top: targetPos - headerHeight,
          behavior: 'smooth'
        });
      }
    });
  });

});
