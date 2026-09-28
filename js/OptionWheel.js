class OptionWheel {
  constructor(el, options = {}) {
    this.el = el;
    this.items = options.items || [];
    this.onChange = options.onChange || null;
    this.textColor = options.textColor || '#a6a6a6';
    this.activeColor = options.activeColor || '#ffffff';
    this.side = options.side || 'left';
    this.fontSize = options.fontSize || 1.5;
    this.spacing = options.spacing || 1.4;
    this.curve = options.curve || 1;
    this.tilt = options.tilt || 6;
    this.blur = options.blur || 2;
    this.fade = options.fade || 0.25;
    this.minOpacity = options.minOpacity || 0.05;
    this.smoothing = options.smoothing || 200;
    this.inset = options.inset || 30;
    this.loop = options.loop || false;
    this.draggable = options.draggable !== false;

    this.count = this.items.length;
    this.pos = options.defaultSelected || 0;
    this.target = this.pos;
    this.selected = Math.round(this.target);
    this.last = performance.now();
    this.raf = null;
    
    this.itemEls = [];
    this.isDragging = false;
    this.dragStartPos = 0;
    this.dragStartY = 0;
    this.dragMoved = false;

    this.initDOM();
    this.runFrame = this.runFrame.bind(this);
    this.startLoop();
    this.bindEvents();
  }

  get remPx() {
    return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  }

  get rowH() {
    return Math.max(this.fontSize * this.spacing * this.remPx, 1);
  }

  initDOM() {
    this.el.innerHTML = '';
    this.el.className = `option-wheel ${this.side === 'right' ? 'option-wheel--right' : ''}`;
    this.el.style.setProperty('--ow-text-color', this.textColor);
    this.el.style.setProperty('--ow-active-color', this.activeColor);
    this.el.style.setProperty('--ow-font-size', `${this.fontSize}rem`);
    this.el.style.setProperty('--ow-inset', `${this.inset}px`);

    this.items.forEach((label, i) => {
      const itemEl = document.createElement('div');
      itemEl.className = `option-wheel__item ${i === this.selected ? 'option-wheel__item--selected' : ''}`;
      itemEl.textContent = label;
      itemEl.dataset.index = i;
      this.el.appendChild(itemEl);
      this.itemEls.push(itemEl);
    });
  }

  startLoop() {
    if (this.raf !== null) cancelAnimationFrame(this.raf);
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.runFrame);
  }

  runFrame(now) {
    const dt = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    const tau = Math.max(this.smoothing, 1) / 1000;
    const k = 1 - Math.exp(-dt / tau);

    let next = this.pos + (this.target - this.pos) * k;
    const settled = Math.abs(this.target - next) < 0.001;
    if (settled) next = this.target;
    this.pos = next;

    const n = this.count;
    const mirror = this.side === 'right' ? -1 : 1;
    const tiltRad = (this.tilt * Math.PI) / 180;
    const rowH = this.rowH;
    const R = tiltRad > 0.0005 ? rowH / tiltRad : 0;

    for (let i = 0; i < n; i++) {
      const el = this.itemEls[i];
      let d = i - next;
      if (this.loop && n > 1) {
        d = ((d % n) + n) % n;
        if (d > n / 2) d -= n;
      }
      const dist = Math.abs(d);
      let x = 0;
      let y = d * rowH;
      let rot = 0;
      
      if (R > 0) {
        const ang = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, d * tiltRad));
        y = R * Math.sin(ang);
        x = -mirror * R * (1 - Math.cos(ang)) * this.curve;
        rot = (mirror * ang * 180) / Math.PI;
      }
      
      el.style.transform = `translate(${x.toFixed(2)}px, calc(${y.toFixed(2)}px - 50%)) rotate(${rot.toFixed(3)}deg)`;
      el.style.opacity = Math.max(this.minOpacity, 1 - dist * this.fade);
      el.style.filter = this.blur > 0 ? `blur(${(dist * this.blur).toFixed(2)}px)` : 'none';
      el.style.setProperty('--ow-p', Math.max(0, 1 - Math.min(dist, 1)).toFixed(4));
    }

    if (!settled) {
      this.raf = requestAnimationFrame(this.runFrame);
    } else {
      this.raf = null;
    }
  }

  applyTarget(value, snap) {
    let v = value;
    if (!this.loop) v = Math.min(Math.max(v, 0), Math.max(this.count - 1, 0));
    if (snap) v = Math.round(v);
    this.target = v;
    
    const idx = ((Math.round(v) % this.count) + this.count) % this.count;
    if (idx !== this.selected) {
      this.itemEls[this.selected].classList.remove('option-wheel__item--selected');
      this.selected = idx;
      this.itemEls[this.selected].classList.add('option-wheel__item--selected');
      if (this.onChange) this.onChange(idx, this.items[idx]);
    }
    this.startLoop();
  }

  bindEvents() {
    // Wheel event
    let wheelTimer = null;
    this.el.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaMode === 1 ? e.deltaY * 24 : e.deltaY;
      const step = Math.max(-1, Math.min(1, delta / this.rowH));
      this.applyTarget(this.target + step, false);
      if (wheelTimer) clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => this.applyTarget(this.target, true), 140);
    }, { passive: false });

    // Pointer events for drag
    this.el.addEventListener('pointerdown', (e) => {
      if (!this.draggable) return;
      this.isDragging = true;
      this.dragStartPos = this.target;
      this.dragStartY = e.clientY;
      this.dragMoved = false;
      this.el.classList.add('option-wheel--dragging');
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      const dy = e.clientY - this.dragStartY;
      if (!this.dragMoved && Math.abs(dy) > 4) {
        this.dragMoved = true;
        this.el.setPointerCapture(e.pointerId);
      }
      if (this.dragMoved) {
        this.applyTarget(this.dragStartPos - dy / this.rowH, false);
      }
    });

    const endDrag = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.el.classList.remove('option-wheel--dragging');
      if (this.dragMoved) this.applyTarget(this.target, true);
    };

    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    // Clicks on items
    this.itemEls.forEach((el, index) => {
      el.addEventListener('click', () => {
        if (this.dragMoved) return;
        let d = index - (((Math.round(this.target) % this.count) + this.count) % this.count);
        if (this.loop && this.count > 1) {
          if (d > this.count / 2) d -= this.count;
          else if (d < -this.count / 2) d += this.count;
        }
        this.applyTarget(Math.round(this.target) + d, true);
      });
    });
  }
  
  setIndex(index) {
    this.applyTarget(index, true);
  }
}
