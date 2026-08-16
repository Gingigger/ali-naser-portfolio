const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
const scrollProgress = document.getElementById('scrollProgress');
const cursorGlow = document.getElementById('cursorGlow');
const revealNodes = document.querySelectorAll('.reveal');
const tiltCards = document.querySelectorAll('.tilt-card');
const magneticButtons = document.querySelectorAll('.magnetic');
const companyInput = document.getElementById('companyInput');
const roleInput = document.getElementById('roleInput');
const companyTargets = document.querySelectorAll('[data-company]');
const roleTargets = document.querySelectorAll('[data-role]');
const copyLetterButton = document.getElementById('copyLetter');
const printLetterButton = document.getElementById('printLetter');
const copyStatus = document.getElementById('copyStatus');
const coverLetterPaper = document.getElementById('coverLetterPaper');
const lightbox = document.getElementById('lightbox');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const galleryTriggers = document.querySelectorAll('[data-image]');

const savedTheme = localStorage.getItem('aliPortfolioTheme');
if (savedTheme) root.dataset.theme = savedTheme;

themeToggle?.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = nextTheme;
  localStorage.setItem('aliPortfolioTheme', nextTheme);
});

navToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

const updateScrollProgress = () => {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = `${progress}%`;
};
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

window.addEventListener('pointermove', (event) => {
  if (!cursorGlow) return;
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
revealNodes.forEach(node => revealObserver.observe(node));

const updateLetterText = () => {
  const company = companyInput?.value.trim() || 'your organization';
  const role = roleInput?.value.trim() || 'engineering internship';
  companyTargets.forEach(el => { el.textContent = company; });
  roleTargets.forEach(el => { el.textContent = role; });
};
companyInput?.addEventListener('input', updateLetterText);
roleInput?.addEventListener('input', updateLetterText);
updateLetterText();

copyLetterButton?.addEventListener('click', async () => {
  const content = [...coverLetterPaper.querySelectorAll('p')]
    .map(p => p.innerText.trim())
    .filter(Boolean)
    .join('\n\n');

  try {
    await navigator.clipboard.writeText(content);
    copyStatus.textContent = 'Cover letter copied to clipboard.';
  } catch (error) {
    copyStatus.textContent = 'Could not copy automatically. Please copy it manually.';
  }
});

printLetterButton?.addEventListener('click', () => window.print());

const openLightbox = (imageSrc, captionText) => {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;
  lightboxImage.src = imageSrc;
  lightboxCaption.textContent = captionText || '';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
  document.body.style.overflow = '';
};

galleryTriggers.forEach(trigger => {
  trigger.addEventListener('click', () => {
    openLightbox(trigger.dataset.image, trigger.dataset.caption);
  });
});

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
});

const applyTilt = (card, event) => {
  const rect = card.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const rotateY = ((x / rect.width) - 0.5) * 8;
  const rotateX = ((y / rect.height) - 0.5) * -8;
  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
};

tiltCards.forEach(card => {
  card.addEventListener('pointermove', (event) => applyTilt(card, event));
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
});

magneticButtons.forEach(button => {
  button.addEventListener('pointermove', (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.06}px, ${y * 0.06}px)`;
  });
  button.addEventListener('pointerleave', () => { button.style.transform = ''; });
});
