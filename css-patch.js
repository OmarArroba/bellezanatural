const fs = require('fs');
let code = fs.readFileSync('css/fullscreen.css', 'utf8');

// The weird spaces are because it's UTF-16LE mixed with UTF8.
// Let's just find the start of the bad block and trim it.
const badStart = code.indexOf('/* Contacto y Redes */');
if (badStart !== -1) {
  code = code.slice(0, badStart);
} else {
  // Try finding @media (max-width: 480px)
  const marker = '.comparison-slider { max-height: 28vh; }\r\n}';
  const idx = code.indexOf(marker);
  if (idx !== -1) {
    code = code.slice(0, idx + marker.length);
  }
}

// Ensure no null bytes
code = code.replace(/\0/g, '');

const newCSS = `
/* Contacto y Redes - Redesign */
.contact-content-custom {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.text-center { text-align: center; }
.contact-subtitle {
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  margin: 2.5rem 0 1.5rem;
  color: var(--white);
  font-weight: 300;
  text-transform: uppercase;
}
.social-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem 4rem;
  margin-bottom: 1rem;
}
.social-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--white);
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.3s;
  text-transform: uppercase;
}
.social-item:hover { color: var(--gold); }
.social-icon {
  width: 28px;
  height: 28px;
  border: 1px solid var(--white);
  transition: border-color 0.3s;
}
.social-item:hover .social-icon { border-color: var(--gold); }
.legal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 3rem;
  text-align: center;
  margin-bottom: 3rem;
}
.legal-grid a {
  color: var(--white);
  text-decoration: none;
  font-size: 0.75rem;
  transition: color 0.3s;
  text-transform: uppercase;
}
.legal-grid a:hover { color: var(--gold); }
.contact-footer {
  font-size: 0.7rem;
  color: var(--white-muted);
  line-height: 1.5;
}
@media (max-width: 768px) {
  .social-grid { gap: 1.5rem 1.5rem; }
  .legal-grid { grid-template-columns: 1fr; gap: 0.75rem; }
}
`;

fs.writeFileSync('css/fullscreen.css', code + '\n' + newCSS);
