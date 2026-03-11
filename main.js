/* ============================================================
   PACE RUN CLUB — main.js
   Shared JS for all pages
   ============================================================ */

(function () {
  'use strict';

  // ── Custom Cursor ──────────────────────────────────────────
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');

  if (cursor && cursorRing) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    function animateRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Scale on interactive elements
    var interactables = document.querySelectorAll(
      'a, button, .run-card, .event-item, .testimonial-card, .bento-card, .quick-link-card, .value-card, .phil-card, .join-perk, .strava-stat, .timeline-item'
    );
    interactables.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursor.style.transform      = 'translate(-50%,-50%) scale(2.2)';
        cursorRing.style.width      = '58px';
        cursorRing.style.height     = '58px';
        cursorRing.style.opacity    = '0.25';
      });
      el.addEventListener('mouseleave', function () {
        cursor.style.transform      = 'translate(-50%,-50%) scale(1)';
        cursorRing.style.width      = '34px';
        cursorRing.style.height     = '34px';
        cursorRing.style.opacity    = '0.55';
      });
    });
  }

  // ── Nav scroll effect ──────────────────────────────────────
  var nav = document.getElementById('nav');
  if (nav) {
    function handleScroll() {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // ── Mobile hamburger ───────────────────────────────────────
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on mobile nav link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Scroll reveal ──────────────────────────────────────────
  var revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          // Stagger siblings slightly
          var delay = 0;
          var siblings = entry.target.parentElement
            ? Array.from(entry.target.parentElement.querySelectorAll('.reveal'))
            : [];
          var idx = siblings.indexOf(entry.target);
          if (idx > 0) delay = Math.min(idx * 80, 320);

          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay);

          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback for older browsers
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ── Gallery ────────────────────────────────────────────────
  var gallery = document.getElementById('gallery');
  if (gallery) {
    var slides    = gallery.querySelectorAll('.gallery-slide');
    var dots      = gallery.querySelectorAll('.gallery-dot');
    var numEl     = document.getElementById('galleryNum');
    var progress  = document.getElementById('galleryProgress');
    var prevBtn   = document.getElementById('galleryPrev');
    var nextBtn   = document.getElementById('galleryNext');
    var current   = 0;
    var total     = slides.length;
    var interval  = null;
    var DURATION  = 3500; // ms per slide

    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (index + total) % total;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
      if (numEl) numEl.textContent = current + 1;
      resetProgress();
    }

    function resetProgress() {
      if (!progress) return;
      progress.style.transition = 'none';
      progress.style.width = '0%';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          progress.style.transition = 'width ' + DURATION + 'ms linear';
          progress.style.width = '100%';
        });
      });
    }

    function startAuto() {
      interval = setInterval(function () {
        goTo(current + 1);
      }, DURATION);
    }

    function stopAuto() {
      clearInterval(interval);
    }

    // Dot clicks
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        stopAuto();
        goTo(parseInt(dot.getAttribute('data-index')));
        startAuto();
      });
    });

    // Arrow clicks
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        stopAuto();
        goTo(current - 1);
        startAuto();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        stopAuto();
        goTo(current + 1);
        startAuto();
      });
    }

    // Pause on hover
    gallery.addEventListener('mouseenter', stopAuto);
    gallery.addEventListener('mouseleave', startAuto);

    // Touch swipe support
    var touchStartX = 0;
    gallery.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    gallery.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        stopAuto();
        goTo(diff > 0 ? current + 1 : current - 1);
        startAuto();
      }
    }, { passive: true });

    // Kick off
    resetProgress();
    startAuto();
  }


  var submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      var inputs = document.querySelectorAll('.join-form-card input, .join-form-card select');
      var allFilled = true;
      inputs.forEach(function (inp) {
        if (!inp.value.trim()) allFilled = false;
      });

      if (!allFilled) {
        submitBtn.textContent = 'Please fill all required fields';
        submitBtn.style.background = '#cc3300';
        setTimeout(function () {
          submitBtn.textContent = 'Register My Interest';
          submitBtn.style.background = '';
        }, 2200);
        return;
      }

      submitBtn.textContent = '✓ We\'ll be in touch soon!';
      submitBtn.style.background = '#1a7a1a';
      submitBtn.disabled = true;
    });
  }

})();

/* ── JOIN POPUP ── */
(function () {
  const overlay  = document.getElementById('popupOverlay');
  const closeBtn = document.getElementById('popupClose');
  const dismiss  = document.getElementById('popupDismiss');
  const snooze   = document.getElementById('popupSnooze');

  function showPopup() {
    overlay.classList.add('visible');
  }

  function closePopup() {
    overlay.classList.remove('visible');
  }

  // First appearance — after 15 seconds
  setTimeout(showPopup, 15000);

  // Re-appear every 15 seconds after closing
  overlay.addEventListener('transitionend', () => {
    if (!overlay.classList.contains('visible')) {
      setTimeout(showPopup, 15000);
    }
  });

  // Close on X button
  closeBtn.addEventListener('click', closePopup);

  // Close on overlay click (outside popup)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePopup();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePopup();
  });

  // "Don't show again"
  dismiss.addEventListener('click', closePopup);

  // "Remind me later"
  snooze.addEventListener('click', (e) => {
    e.stopPropagation();
    closePopup();
  });
})();