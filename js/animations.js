/**
 * LUMA STUDIO - Scroll Reveal Animation Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
});

function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}
