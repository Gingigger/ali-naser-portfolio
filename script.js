const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('ali-portfolio-theme');
if (savedTheme) root.dataset.theme = savedTheme;

themeToggle?.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('ali-portfolio-theme', next);
});

const progress = document.getElementById('scrollProgress');
const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  if (progress) progress.style.width = `${pct}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

const glow = document.getElementById('cursorGlow');
window.addEventListener('pointermove', (event) => {
  if (!glow) return;
  glow.style.transform = `translate(${event.clientX - 210}px, ${event.clientY - 210}px)`;
});

if (window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateX(${y * -3.5}deg) rotateY(${x * 4.5}deg) translateY(-2px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });

  document.querySelectorAll('.magnetic').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
    });
    button.addEventListener('pointerleave', () => { button.style.transform = ''; });
  });
}

const companyInput = document.getElementById('companyInput');
const roleInput = document.getElementById('roleInput');
const companyTargets = document.querySelectorAll('[data-company]');
const roleTargets = document.querySelectorAll('[data-role]');

function updateLetter() {
  const company = companyInput?.value.trim() || 'your organization';
  const role = roleInput?.value.trim() || 'engineering internship';
  companyTargets.forEach((el) => { el.textContent = company; });
  roleTargets.forEach((el) => { el.textContent = role; });
}
companyInput?.addEventListener('input', updateLetter);
roleInput?.addEventListener('input', updateLetter);

const copyButton = document.getElementById('copyLetter');
const copyStatus = document.getElementById('copyStatus');
copyButton?.addEventListener('click', async () => {
  const paper = document.getElementById('coverLetterPaper');
  if (!paper) return;
  const text = paper.innerText.replace(/\n{3,}/g, '\n\n');
  try {
    await navigator.clipboard.writeText(text);
    copyStatus.textContent = 'Copied — ready to paste into an application.';
  } catch {
    copyStatus.textContent = 'Copy was blocked by the browser. Select the letter text manually.';
  }
  window.setTimeout(() => { copyStatus.textContent = ''; }, 3500);
});

document.getElementById('printLetter')?.addEventListener('click', () => window.print());


const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.proof-image-button').forEach((button) => {
  button.addEventListener('click', () => {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    const nestedImage = button.querySelector('img');
    lightboxImage.src = button.dataset.image || nestedImage?.src || '';
    lightboxCaption.textContent = button.dataset.caption || nestedImage?.alt || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});
