/* ============================
   VELTRON CAPITAL — JavaScript
   ============================ */

// ─── NAVBAR SCROLL ───────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ─── HAMBURGER MENU ──────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ─── SLIDER / SIMULADOR ──────────────────────────────────────
const slider   = document.getElementById('montoSlider');
const amountEl = document.getElementById('sim-amount');
const commEl   = document.getElementById('sim-commission');
const netEl    = document.getElementById('sim-net');

const COMMISSION = 0.12;
const MIN = 100000;
const MAX = 5000000;

function formatCOP(n) {
  return '$ ' + Math.round(n).toLocaleString('es-CO').replace(/,/g, '.');
}

function updateSlider(value) {
  const pct = ((value - MIN) / (MAX - MIN)) * 100;
  slider.style.setProperty('--slider-pct', pct + '%');

  const commission = value * COMMISSION;
  const net        = value - commission;

  amountEl.textContent   = formatCOP(value);
  commEl.textContent     = '-' + formatCOP(commission);
  netEl.textContent      = formatCOP(net);
}

slider.addEventListener('input', () => updateSlider(Number(slider.value)));

// Init
updateSlider(Number(slider.value));

// ─── MODAL ───────────────────────────────────────────────────
const modal       = document.getElementById('modal');
const modalClose  = document.getElementById('modal-close');
const btnSolicitar = document.getElementById('btn-solicitar');
const btnLogin    = document.getElementById('btn-login');
const btnRegister = document.getElementById('btn-register');
const modalLogin  = document.getElementById('modal-login');
const modalCta    = document.getElementById('modal-cta');

function openModal() {
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

[btnSolicitar, btnLogin, btnRegister].forEach(btn => {
  btn?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

modalLogin.addEventListener('click', (e) => {
  e.preventDefault();
  alert('Redirigiendo al inicio de sesión...');
  closeModal();
});

modalCta.addEventListener('click', (e) => {
  e.preventDefault();
  alert('Redirigiendo al registro...');
  closeModal();
});

// ─── SMOOTH ANCHOR SCROLL ────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── SCROLL REVEAL ANIMATION ─────────────────────────────────
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(
  '.step-card, .security-card, .simulator-card, .hero-stats, .section-badge, .section-title, .section-subtitle'
).forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.55s ease ${i * 0.07}s, transform 0.55s ease ${i * 0.07}s`;
  observer.observe(el);
});

document.addEventListener('animationend', () => {}, { once: true });

// Inject reveal class style
const revealStyle = document.createElement('style');
revealStyle.textContent = `.revealed { opacity: 1 !important; transform: none !important; }`;
document.head.appendChild(revealStyle);
