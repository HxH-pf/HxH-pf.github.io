const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const header = document.querySelector('[data-header]');
const progress = document.querySelector('.scroll-progress');
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-nav');
const revealItems = document.querySelectorAll('.reveal');
const parallaxItems = document.querySelectorAll('.parallax');

document.querySelector('[data-year]').textContent = new Date().getFullYear();

function closeMenu() {
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  document.body.classList.remove('menu-open');
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menu.classList.toggle('open', !isOpen);
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
  document.body.classList.toggle('menu-open', !isOpen);
});

menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

revealItems.forEach((item) => {
  item.style.setProperty('--delay', `${item.dataset.delay || 0}ms`);
});

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px' });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('in-view'));
}

let ticking = false;

function updateScrollEffects() {
  const scrollY = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? scrollY / scrollable : 0;

  header.classList.toggle('scrolled', scrollY > 24);
  progress.style.width = `${ratio * 100}%`;

  if (!prefersReducedMotion) {
    parallaxItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
      const speed = Number(item.dataset.speed || 0.05);
      const relative = window.innerHeight / 2 - (rect.top + rect.height / 2);
      item.style.setProperty('--parallax-y', `${relative * speed}px`);
    });
  }

  ticking = false;
}

function requestScrollUpdate() {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollEffects);
    ticking = true;
  }
}

window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', requestScrollUpdate, { passive: true });
updateScrollEffects();

document.querySelectorAll('.feature').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
  });
});

document.querySelectorAll('[data-asset-src]').forEach((slot) => {
  const source = slot.dataset.assetSrc;
  const image = new Image();

  image.onload = () => {
    image.alt = slot.dataset.assetAlt || '';
    image.decoding = 'async';
    slot.prepend(image);
    slot.classList.add('asset-loaded');
  };

  image.src = source;
});
