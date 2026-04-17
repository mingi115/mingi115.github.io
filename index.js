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
const weddingDate = new Date('2026-06-13T11:20:00+09:00');

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

// ===== Gallery Fullscreen Modal =====
const modal = document.getElementById('gallery-modal');
const modalClose = modal.querySelector('.gallery-modal-close');

const modalSwiper = new Swiper('.modal-swiper', {
  loop: true,
  navigation: {
    nextEl: '.modal-swiper .swiper-button-next',
    prevEl: '.modal-swiper .swiper-button-prev',
  },
});

// ===== Swiper Gallery =====
const swiper = new Swiper('.gallery-swiper', {
  loop: true,
  grabCursor: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true,
    dynamicMainBullets: 3,
  },
  on: {
    click: function() {
      modalSwiper.slideToLoop(this.realIndex, 0);
      modal.classList.add('active');
    }
  }
});

modalClose.addEventListener('click', () => modal.classList.remove('active'));
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('active');
});

// ===== Kakao Map =====
const mapEl = document.getElementById('map');
if (mapEl) try {
  if (typeof kakao === 'undefined') throw new Error('kakao not loaded');
  const map = new kakao.maps.Map(mapEl, {
    center: new kakao.maps.LatLng(37.5503, 126.9107),
    level: 3
  });

  const geocoder = new kakao.maps.services.Geocoder();
  geocoder.addressSearch('서울시 마포구 양화로 87', function(result, status) {
    if (status === kakao.maps.services.Status.OK) {
      const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
      const marker = new kakao.maps.Marker({ map, position: coords });
      map.setCenter(coords);

      const overlay = new kakao.maps.CustomOverlay({
        position: coords,
        content: '<div style="background:#fff;border:1px solid #bbb;border-radius:3px;padding:3px 7px;font-size:11px;font-family:sans-serif;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.2);">웨딩시그니처</div>',
        yAnchor: 2.5
      });
      overlay.setMap(map);
    }
  });
} catch(e) {}

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

// ===== Background Music (YouTube) =====
let ytPlayer;
let musicReady = false;

function initYTPlayer() {
  ytPlayer = new YT.Player('yt-player', {
    videoId: 'Z3bKEtU8MQ0',
    playerVars: {
      autoplay: 1,
      mute: 1,
      loop: 1,
      playlist: 'Z3bKEtU8MQ0',
      origin: window.location.origin
    },
    events: {
      onReady: () => {
        musicReady = true;
        ytPlayer.playVideo();
        // 1단계: 프로그래밍 클릭 시도
        musicBtn.click();
        // 2단계: 첫 인터랙션 시 언뮤트 (아직 뮤트 상태일 경우)
        const events = ['click', 'touchstart', 'scroll'];
        function onFirstInteraction(e) {
          if (musicBtn.contains(e.target)) return;
          if (ytPlayer.isMuted()) musicBtn.click();
          events.forEach(ev => document.removeEventListener(ev, onFirstInteraction));
        }
        events.forEach(ev => document.addEventListener(ev, onFirstInteraction, { passive: true }));
      },
      onError: () => { musicReady = false; }
    }
  });
}


if (window.YT && window.YT.Player) {
  initYTPlayer();
} else {
  window.onYouTubeIframeAPIReady = initYTPlayer;
}

const musicBtn = document.getElementById('music-btn');
musicBtn.addEventListener('click', () => {
  if (!ytPlayer) return;
  try {
    if (ytPlayer.isMuted()) {
      ytPlayer.unMute();
      setTimeout(() => {
        if (!ytPlayer.isMuted()) musicBtn.classList.add('playing');
      }, 100);
    } else {
      ytPlayer.mute();
      musicBtn.classList.remove('playing');
    }
  } catch(e) {}
});

// ===== Scroll Indicator =====
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
  scrollIndicator.addEventListener('click', () => {
    const greeting = document.getElementById('greeting');
    if (greeting) greeting.scrollIntoView({ behavior: 'smooth' });
  });
}
