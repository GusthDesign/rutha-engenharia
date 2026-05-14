/**
 * RUTHA ENGENHARIA — script.js
 * 1. Header scroll → .scrolled
 * 2. Hero slider (autoplay, arrows, dots, swipe)
 * 3. Hamburger menu toggle
 * 4. Smooth scroll with header offset
 * 5. Fade-in IntersectionObserver
 * 6. Contact form submit → show success
 * 7. Active nav link on scroll
 */

(function () {
  'use strict';

  const qs  = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ── 1. Header scroll ─────────────────────────────────────── */
  const header = qs('.header');

  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── 2. Hero Slider ───────────────────────────────────────── */
  const slides  = qsa('.hero__slide');
  const dots    = qsa('.hero__dot');
  const prevBtn = qs('#heroPrev');
  const nextBtn = qs('#heroNext');
  let current   = 0;
  let autoTimer = null;

  function goTo(index) {
    if (!slides.length) return;
    slides[current].classList.remove('active');
    if (dots[current]) {
      dots[current].classList.remove('active');
      dots[current].setAttribute('aria-selected', 'false');
    }
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) {
      dots[current].classList.add('active');
      dots[current].setAttribute('aria-selected', 'true');
    }
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(current + 1), 6000);
  }

  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }

  if (slides.length > 1) {
    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goTo(parseInt(dot.dataset.index, 10));
        startAuto();
      });
    });

    // Touch swipe support
    let touchStartX = 0;
    const slider = qs('#heroSlider');
    if (slider) {
      slider.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
      }, { passive: true });
      slider.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
          goTo(diff > 0 ? current + 1 : current - 1);
          startAuto();
        }
      }, { passive: true });
    }

    startAuto();
  }

  /* ── 3. Hamburger menu ────────────────────────────────────── */
  const hamburger = qs('#hamburger');
  const nav       = qs('#nav');

  function openMenu() {
    if (!nav || !hamburger) return;
    nav.classList.add('open');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!nav || !hamburger) return;
    nav.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.contains('open') ? closeMenu() : openMenu();
    });
    qsa('.nav__link', nav).forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('open')) closeMenu();
    });
  }

  /* ── 4. Smooth scroll with header offset ─────────────────── */
  function getHeaderHeight() {
    return header ? header.offsetHeight : 72;
  }

  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = qs(targetId);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - getHeaderHeight(),
      behavior: 'smooth'
    });
  });

  /* ── 5. Fade-in IntersectionObserver ─────────────────────── */
  const fadeEls = qsa('.fade-in');

  if ('IntersectionObserver' in window && fadeEls.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => observer.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ── 6. Contact form ──────────────────────────────────────── */
  const form        = qs('#contactForm');
  const formSuccess = qs('#formSuccess');

  if (form && formSuccess) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      formSuccess.removeAttribute('hidden');
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => {
        form.reset();
        formSuccess.setAttribute('hidden', '');
      }, 3000);
    });
  }

  /* ── 7. Active nav link on scroll ────────────────────────── */
  const sections = qsa('section[id]');
  const navLinks = qsa('.nav__link');

  function updateActiveLink() {
    const scrollY = window.scrollY;
    const offset  = getHeaderHeight();
    let   active  = '';
    sections.forEach(section => {
      if (scrollY >= section.offsetTop - offset - 20) {
        active = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + active);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

})();
