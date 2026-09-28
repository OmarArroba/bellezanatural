/**
 * Fullscreen Scroll + Rueda + Funcionalidades originales
 * ─────────────────────────────────────────────────────────
 * Incluye: navegación fullscreen, rueda animada,
 *          hero slider, comparison slider, modal de reserva,
 *          animación de tarjetas de servicio.
 *
 * La rueda cambia de layout según viewport:
 *   Desktop → izquierda (arco vertical)
 *   Móvil   → abajo (arco horizontal)
 */

(() => {
  'use strict';

  const WA_PHONE = '593994242444';

  // ── Elementos principales ─────────────────────────────────
  const container = document.getElementById('scrollContainer');
  const sections  = Array.from(container.querySelectorAll('.fs-section'));
  const arrows    = Array.from(container.querySelectorAll('.arrow-down'));
  const wheelNav  = document.getElementById('wheelNav');
  const spheres   = Array.from(document.querySelectorAll('.sphere'));

  const TOTAL     = sections.length;
  let current     = 0;
  let isScrolling = false;
  const COOLDOWN  = 900;
  let restTimer   = null;
  const REST_DELAY = 2400;

  // ──────────────────────────────────────────────────────────
  //  RUEDA DE NAVEGACIÓN
  // ──────────────────────────────────────────────────────────

  function isMobile() { return window.innerWidth <= 768; }

  // Configuración de cada "slot" en el arco lateral (desktop)
  function getSideSlot(role) {
    switch (role) {
      case 'far-prev': return {
        top: '0%', left: '-22%', size: 40, fontSize: 0,
        bg: '#2e7d32', opacity: 0.4, shadow: 'none', color: '#fff'
      };
      case 'prev': return {
        top: '14%', left: '6%', size: 54, fontSize: 7.5,
        bg: '#2e7d32', opacity: 0.8, shadow: '0 4px 18px rgba(0,0,0,0.3)', color: '#fff'
      };
      case 'active': return {
        top: '37%', left: '20%', size: 88, fontSize: 10,
        bg: '#6abf69', opacity: 1, shadow: '0 6px 35px rgba(106,191,105,0.35)', color: '#080808'
      };
      case 'next': return {
        top: '63%', left: '6%', size: 54, fontSize: 7.5,
        bg: '#b3dce6', opacity: 0.8, shadow: '0 4px 18px rgba(0,0,0,0.3)', color: '#080808'
      };
      case 'far-next': return {
        top: '82%', left: '-22%', size: 40, fontSize: 0,
        bg: '#b3dce6', opacity: 0.4, shadow: 'none', color: '#fff'
      };
      default: return {
        top: '50%', left: '-70%', size: 28, fontSize: 0,
        bg: '#444', opacity: 0, shadow: 'none', color: '#fff'
      };
    }
  }

  // Configuración de cada "slot" en el arco horizontal (móvil/abajo)
  function getBottomSlot(role) {
    switch (role) {
      case 'far-prev': return {
        left: '0%', bottom: '-22%', size: 34, fontSize: 0,
        bg: '#2e7d32', opacity: 0.4, shadow: 'none', color: '#fff'
      };
      case 'prev': return {
        left: '12%', bottom: '8%', size: 44, fontSize: 7,
        bg: '#2e7d32', opacity: 0.8, shadow: '0 4px 16px rgba(0,0,0,0.3)', color: '#fff'
      };
      case 'active': return {
        left: '38%', bottom: '28%', size: 72, fontSize: 9,
        bg: '#6abf69', opacity: 1, shadow: '0 6px 30px rgba(106,191,105,0.35)', color: '#080808'
      };
      case 'next': return {
        left: '65%', bottom: '8%', size: 44, fontSize: 7,
        bg: '#b3dce6', opacity: 0.8, shadow: '0 4px 16px rgba(0,0,0,0.3)', color: '#080808'
      };
      case 'far-next': return {
        left: '85%', bottom: '-22%', size: 34, fontSize: 0,
        bg: '#b3dce6', opacity: 0.4, shadow: 'none', color: '#fff'
      };
      default: return {
        left: '50%', bottom: '-60%', size: 24, fontSize: 0,
        bg: '#444', opacity: 0, shadow: 'none', color: '#fff'
      };
    }
  }

  function getRoleForSphere(sphereIdx, activeIdx) {
    const diff = sphereIdx - activeIdx;
    if (diff === -2) return 'far-prev';
    if (diff === -1) return 'prev';
    if (diff ===  0) return 'active';
    if (diff ===  1) return 'next';
    if (diff ===  2) return 'far-next';
    return 'hidden';
  }

  function layoutSpheres(activeIdx) {
    const mobile = isMobile();

    spheres.forEach((sphere, i) => {
      const role = getRoleForSphere(i, activeIdx);

      if (mobile) {
        const cfg = getBottomSlot(role);
        // Limpiar propiedades de modo lateral
        sphere.style.top = 'auto';
        sphere.style.left = cfg.left;
        sphere.style.bottom = cfg.bottom;
        sphere.style.width = cfg.size + 'px';
        sphere.style.height = cfg.size + 'px';
        sphere.style.background = cfg.bg;
        sphere.style.opacity = cfg.opacity;
        sphere.style.boxShadow = cfg.shadow;
        sphere.style.color = cfg.color;

        // Ajustar left para centrar la esfera (compensar su propio tamaño)
        // Ya se maneja con transform en el siguiente paso
      } else {
        const cfg = getSideSlot(role);
        sphere.style.bottom = 'auto';
        sphere.style.top = cfg.top;
        sphere.style.left = cfg.left;
        sphere.style.width = cfg.size + 'px';
        sphere.style.height = cfg.size + 'px';
        sphere.style.background = cfg.bg;
        sphere.style.opacity = cfg.opacity;
        sphere.style.boxShadow = cfg.shadow;
        sphere.style.color = cfg.color;
      }

      const label = sphere.querySelector('.sphere__label');
      const fs = mobile ? getBottomSlot(role).fontSize : getSideSlot(role).fontSize;
      if (fs > 0) {
        label.style.fontSize = fs + 'px';
        label.style.opacity = '1';
      } else {
        label.style.fontSize = '0px';
        label.style.opacity = '0';
      }

      sphere.classList.toggle('active', role === 'active');
      sphere.classList.toggle('out-of-range', role === 'hidden');
    });
  }

  function showWheel() {
    clearTimeout(restTimer);
    wheelNav.classList.remove('rest');
    wheelNav.classList.add('visible');
  }

  function restWheel() {
    clearTimeout(restTimer);
    restTimer = setTimeout(() => {
      wheelNav.classList.remove('visible');
      wheelNav.classList.add('rest');
    }, REST_DELAY);
  }

  // ──────────────────────────────────────────────────────────
  //  NAVEGACIÓN FULLSCREEN
  // ──────────────────────────────────────────────────────────

  function goTo(index) {
    if (index < 0 || index >= TOTAL || index === current || isScrolling) return;
    isScrolling = true;
    current = index;

    showWheel();
    layoutSpheres(current);
    sections[current].scrollIntoView({ behavior: 'smooth' });
    restWheel();

    setTimeout(() => { isScrolling = false; }, COOLDOWN);
  }

  // 1. Wheel
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (isScrolling) return;
    if (e.deltaY > 0) goTo(current + 1);
    else if (e.deltaY < 0) goTo(current - 1);
  }, { passive: false });


  // 3. Arrow buttons
  arrows.forEach((btn) => {
    btn.addEventListener('click', () => goTo(current + 1));
  });

  // 4. Sphere clicks
  spheres.forEach((sphere) => {
    sphere.addEventListener('click', () => {
      const targetIdx = parseInt(sphere.dataset.index, 10);
      if (targetIdx === current) {
        showWheel();
        restWheel();
      } else {
        goTo(targetIdx);
      }
    });
  });

  // 5. Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goTo(current + 1); }
    else if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); goTo(current - 1); }
  });

  // 6. Sync con scroll real
  const scrollObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
        const idx = sections.indexOf(entry.target);
        if (idx !== -1 && idx !== current) {
          current = idx;
          showWheel();
          layoutSpheres(current);
          restWheel();
        }
      }
    });
  }, { root: container, threshold: 0.55 });
  sections.forEach((s) => scrollObs.observe(s));

  // 7. In-view animations
  const viewObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Animar cards de servicios
        const grid = entry.target.querySelector('#serviciosGrid');
        if (grid) {
          grid.querySelectorAll('.card-service').forEach((c) => c.classList.add('animate-in'));
        }
      }
    });
  }, { root: container, threshold: 0.3 });
  sections.forEach((s) => viewObs.observe(s));
  sections[0].classList.add('in-view');

  // ──────────────────────────────────────────────────────────
  //  ACORDEÓN DE SERVICIOS (Móvil)
  // ──────────────────────────────────────────────────────────

  const serviceCards = document.querySelectorAll('.card-service');
  const serviciosGrid = document.getElementById('serviciosGrid');
  
  serviceCards.forEach(card => {
    const header = card.querySelector('.card-header-toggle');
    const img = card.querySelector('.card-img');
    
    const toggleAccordion = () => {
      if (isMobile()) {
        const isExpanding = !card.classList.contains('expanded');
        // Cerrar todos
        serviceCards.forEach(c => c.classList.remove('expanded'));
        // Abrir este si no estaba abierto
        if (isExpanding) {
          card.classList.add('expanded');
          if (serviciosGrid) serviciosGrid.classList.add('has-expanded');
        } else {
          if (serviciosGrid) serviciosGrid.classList.remove('has-expanded');
        }
      }
    };
    
    if (header) header.addEventListener('click', toggleAccordion);
    if (img) img.addEventListener('click', toggleAccordion);
  });

  // ──────────────────────────────────────────────────────────
  //  HERO SLIDER (del original)
  // ──────────────────────────────────────────────────────────

  const slides = document.querySelectorAll('.hero-slide');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    slides[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
  }

  function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
  }

  function startSlider() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 4000);
  }

  startSlider();

  // ──────────────────────────────────────────────────────────
  //  COMPARISON SLIDER (del original)
  // ──────────────────────────────────────────────────────────

  const compSlider = document.getElementById('comparisonSlider');
  const compBefore = document.getElementById('comparisonBefore');
  const compHandle = document.getElementById('comparisonHandle');

  if (compSlider) {
    let isDragging = false;

    function updateSliderPos(x) {
      const rect = compSlider.getBoundingClientRect();
      let pos = Math.max(0, Math.min(x - rect.left, rect.width));
      let pct = (pos / rect.width) * 100;
      compBefore.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      compHandle.style.left = `${pct}%`;
    }

    compSlider.addEventListener('mousedown', (e) => { isDragging = true; updateSliderPos(e.clientX); });
    window.addEventListener('mousemove', (e) => { if (isDragging) updateSliderPos(e.clientX); });
    window.addEventListener('mouseup', () => { isDragging = false; });
    compSlider.addEventListener('touchstart', (e) => { updateSliderPos(e.touches[0].clientX); });
    compSlider.addEventListener('touchmove', (e) => { updateSliderPos(e.touches[0].clientX); }, { passive: true });
  }

  // ──────────────────────────────────────────────────────────
  //  MODAL DE RESERVA (del original)
  // ──────────────────────────────────────────────────────────

  const modal     = document.getElementById('bookingModal');
  const openBtns  = document.querySelectorAll('.open-modal-btn');
  const closeBtn  = document.getElementById('closeModalBtn');

  const waMsgBase = encodeURIComponent('Hola! Quiero agendar una cita en Suéltate el Pelo.');
  const footerWa  = document.getElementById('footerWaLink');
  if (footerWa) footerWa.href = `https://wa.me/${WA_PHONE}?text=${waMsgBase}`;

  openBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
      updateModalWaLink();
    });
  });

  closeBtn.addEventListener('click', () => { modal.classList.remove('open'); });
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });

  const dInput      = document.getElementById('bookingDate');
  const tInput      = document.getElementById('bookingTime');
  const sInput      = document.getElementById('bookingService');
  const modalWaLink = document.getElementById('modalWaLink');

  function updateModalWaLink() {
    const d = dInput.value || '(por definir)';
    const t = tInput.value || '(por definir)';
    const s = sInput.value || '(por definir)';
    const msg = `Hola! Quiero reservar una cita:\n📅 Fecha: ${d}\n⏰ Hora: ${t}\n💅 Servicio: ${s}`;
    modalWaLink.href = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
  }

  [dInput, tInput, sInput].forEach((el) => {
    el.addEventListener('change', updateModalWaLink);
  });

  // ──────────────────────────────────────────────────────────
  //  INICIALIZACIÓN
  // ──────────────────────────────────────────────────────────

  layoutSpheres(0);
  wheelNav.classList.add('rest');

  // Mostrar brevemente la rueda al cargar
  setTimeout(() => { showWheel(); restWheel(); }, 800);

  // Re-layout en resize (cambia entre modo lateral y modo inferior)
  window.addEventListener('resize', () => layoutSpheres(current));

})();
