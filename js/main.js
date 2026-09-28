document.addEventListener('DOMContentLoaded', () => {
  const WA_PHONE = "593994242444"; // Ecuador country code included for proper WhatsApp routing

  // --- Header Scroll Effect ---
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // --- Mobile Menu ---
  const menuBtn = document.getElementById('menu-toggle-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu.querySelectorAll('.nav-link');

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  });

  // --- Hero Slider ---
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function startSlider() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 4000);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'), 10);
      showSlide(idx);
      startSlider();
    });
  });

  startSlider();

  // --- Comparison Slider ---
  const compSlider = document.getElementById('comparison-slider');
  const compBefore = document.getElementById('comparison-before');
  const compHandle = document.getElementById('comparison-handle');
  let isDragging = false;

  function updateSliderPos(x) {
    const rect = compSlider.getBoundingClientRect();
    let pos = Math.max(0, Math.min(x - rect.left, rect.width));
    let pct = (pos / rect.width) * 100;
    compBefore.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    compHandle.style.left = `${pct}%`;
  }

  compSlider.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSliderPos(e.clientX);
  });
  
  window.addEventListener('mousemove', (e) => {
    if (isDragging) updateSliderPos(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  compSlider.addEventListener('touchstart', (e) => {
    updateSliderPos(e.touches[0].clientX);
  });

  compSlider.addEventListener('touchmove', (e) => {
    updateSliderPos(e.touches[0].clientX);
  }, { passive: true });

  // --- Scroll Animations (Intersection Observer) ---
  const servicesGrid = document.getElementById('servicios-grid');
  if (servicesGrid) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = servicesGrid.querySelectorAll('.card-service');
          cards.forEach(card => card.classList.add('animate-in'));
          observer.unobserve(servicesGrid);
        }
      });
    }, { threshold: 0.15 });
    observer.observe(servicesGrid);
  }

  // --- WhatsApp Links & Modal ---
  const modal = document.getElementById('booking-modal');
  const openBtns = document.querySelectorAll('.open-modal-btn');
  const closeBtn = document.getElementById('close-modal-btn');
  
  // Static links
  const waMsgBase = encodeURIComponent("Hola! Quiero agendar una cita en Suéltate el Pelo.");
  document.getElementById('footer-wa-link').href = `https://wa.me/${WA_PHONE}?text=${waMsgBase}`;

  // Modal logic
  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
      updateModalWaLink();
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('open');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
    }
  });

  // Modal form updates
  const dInput = document.getElementById('booking-date');
  const tInput = document.getElementById('booking-time');
  const sInput = document.getElementById('booking-service');
  const modalWaLink = document.getElementById('modal-wa-link');

  function updateModalWaLink() {
    const d = dInput.value || "(por definir)";
    const t = tInput.value || "(por definir)";
    const s = sInput.value || "(por definir)";
    const msg = `Hola! Quiero reservar una cita:\n📅 Fecha: ${d}\n⏰ Hora: ${t}\n💅 Servicio: ${s}`;
    modalWaLink.href = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
  }

  [dInput, tInput, sInput].forEach(el => {
    el.addEventListener('change', (e) => {
      updateModalWaLink();
    });
  });
});
