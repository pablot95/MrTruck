(function () {
  'use strict';

  const header   = document.getElementById('site-header');
  const logo     = document.getElementById('header-logo');
  const hero     = document.getElementById('hero');
  const toggle   = document.getElementById('nav-toggle');
  const mobMenu  = document.getElementById('mobile-menu');
  const mobClose = document.getElementById('mob-close');
  const mobLinks = mobMenu ? mobMenu.querySelectorAll('.mob-link') : [];

  function openMenu() {
    mobMenu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    mobMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobMenu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    mobMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (toggle && mobMenu) {
    toggle.addEventListener('click', () => {
      mobMenu.classList.contains('open') ? closeMenu() : openMenu();
    });
    if (mobClose) mobClose.addEventListener('click', closeMenu);
    mobLinks.forEach(l => l.addEventListener('click', closeMenu));
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobMenu && mobMenu.classList.contains('open')) closeMenu();
  });

  if (hero && header && logo) {
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        header.classList.toggle('scrolled', !entry.isIntersecting);
        header.classList.toggle('logo-visible', !entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    heroObserver.observe(hero);
  }

  const hdrLinks = document.querySelectorAll('.hdr-link');
  const sections = document.querySelectorAll('section[id]');

  const navObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          hdrLinks.forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`.hdr-link[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach(s => navObserver.observe(s));

  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealEls.forEach(el => revealObserver.observe(el));
  }

  const heroEl = document.querySelector('.hero-content');
  if (heroEl) {
    const items = heroEl.querySelectorAll('.hero-logo-wrap, .hero-title, .hero-sub, .hero-actions, .hero-trusted');
    items.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      setTimeout(() => {
        el.style.transition = 'opacity .8s cubic-bezier(.25,.46,.45,.94), transform .8s cubic-bezier(.25,.46,.45,.94)';
        el.style.opacity = '1';
        el.style.transform = 'none';
      }, 200 + i * 160);
    });
  }

  const scrollEl = document.querySelector('.hero-scroll');
  if (scrollEl && hero) {
    const scrollObserver = new IntersectionObserver(
      ([entry]) => { scrollEl.style.opacity = entry.isIntersecting ? '1' : '0'; },
      { threshold: 0.5 }
    );
    scrollObserver.observe(hero);
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  let waFloat = document.querySelector('.wa-float');
  if (waFloat) {
    let lastScrollY = window.scrollY;
    let ticking = false;
    window.addEventListener('scroll', () => {
      lastScrollY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(() => {
          waFloat.style.transform = lastScrollY > 300 ? '' : 'translateY(80px)';
          waFloat.style.opacity = lastScrollY > 300 ? '1' : '0';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
    waFloat.style.transition = 'transform .4s cubic-bezier(.4,0,.2,1), opacity .4s cubic-bezier(.4,0,.2,1), box-shadow .3s cubic-bezier(.4,0,.2,1)';
    waFloat.style.transform = 'translateY(80px)';
    waFloat.style.opacity = '0';
  }

})();
