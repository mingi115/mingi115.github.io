// ===== Scroll Fade-in =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ===== D-Day Countdown =====
const weddingDate = new Date('2026-06-13T12:00:00+09:00');

function updateCountdown() {
  const now = new Date();
  const diff = weddingDate - now;
  const msgEl = document.getElementById('cd-message');

  if (diff <= 0) {
    document.getElementById('cd-days').textContent = '00';
    document.getElementById('cd-hours').textContent = '00';
    document.getElementById('cd-minutes').textContent = '00';
    document.getElementById('cd-seconds').textContent = '00';
    msgEl.textContent = '결혼식이 진행되었습니다';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');

  msgEl.textContent = `결혼식까지 ${days}일 남았습니다`;
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===== Accordion =====
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.parentElement;
    const content = item.querySelector('.accordion-content');
    const isActive = item.classList.contains('active');

    // Close all
    document.querySelectorAll('.accordion-item').forEach(i => {
      i.classList.remove('active');
      i.querySelector('.accordion-content').style.maxHeight = null;
    });

    // Open clicked if was closed
    if (!isActive) {
      item.classList.add('active');
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  });
});

// ===== Copy to Clipboard =====
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const account = btn.dataset.account;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(account).then(() => showToast('복사 완료!'));
    } else {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = account;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('복사 완료!');
    }
  });
});

// ===== Toast =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// ===== Swiper Gallery =====
const swiper = new Swiper('.gallery-swiper', {
  loop: true,
  grabCursor: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});

// ===== Gallery Fullscreen Modal =====
const modal = document.getElementById('gallery-modal');
const modalImg = modal.querySelector('.gallery-modal-img');
const modalClose = modal.querySelector('.gallery-modal-close');

document.querySelectorAll('.gallery-swiper .swiper-slide img').forEach(img => {
  img.addEventListener('click', () => {
    modalImg.src = img.src;
    modal.classList.add('active');
  });
});

modalClose.addEventListener('click', () => modal.classList.remove('active'));
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('active');
});

// ===== Map Placeholder =====
// 카카오맵 API 키가 없으므로 플레이스홀더 표시
const mapEl = document.getElementById('map');
if (mapEl) {
  mapEl.textContent = '지도를 표시하려면 카카오맵 API 키가 필요합니다';
}

// ===== Share URL =====
document.getElementById('share-url').addEventListener('click', () => {
  const url = window.location.href;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => showToast('링크가 복사되었습니다!'));
  } else {
    const ta = document.createElement('textarea');
    ta.value = url;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('링크가 복사되었습니다!');
  }
});

// ===== Scroll Indicator =====
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
  scrollIndicator.addEventListener('click', () => {
    const greeting = document.getElementById('greeting');
    if (greeting) greeting.scrollIntoView({ behavior: 'smooth' });
  });
}
