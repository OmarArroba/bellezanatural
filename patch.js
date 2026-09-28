const fs = require('fs');
let code = fs.readFileSync('js/fullscreen.js', 'utf8');

// Eliminar wheelNav y spheres
code = code.replace(/const wheelNav.*?;/, 'const optionWheelEl = document.getElementById(\'optionWheel\');');
code = code.replace(/const spheres.*?;/, '');

// Borrar todo desde function isMobile() hasta function restWheel()
code = code.replace(/function isMobile\(\) \{[\s\S]*?function restWheel\(\) \{[\s\S]*?\}, REST_DELAY\);\n  \}/, '');

// Instanciar OptionWheel
const owInit = `
  let optionWheel;
  if (optionWheelEl) {
    optionWheel = new OptionWheel(optionWheelEl, {
      items: ['Inicio', 'Resultados', 'Servicios', 'Promos'],
      side: 'left',
      textColor: '#a6a6a6',
      activeColor: '#c9a84c',
      onChange: (index) => {
        goTo(index);
      }
    });
  }
`;
code = code.replace(/\/\/.*NAVEGACI..N FULLSCREEN/, owInit + '\n\n  // NAVEGACION FULLSCREEN');

// Reemplazar llamadas a layoutSpheres, showWheel, restWheel
code = code.replace(/showWheel\(\);/g, '');
code = code.replace(/restWheel\(\);/g, '');
code = code.replace(/layoutSpheres\(current\);/g, 'if(optionWheel) optionWheel.setIndex(current);');

// Borrar inicializacion al final
code = code.replace(/layoutSpheres\(0\);\n  wheelNav.classList.add\('rest'\);\n\n  \/\/ Mostrar brevemente la rueda al cargar\n  setTimeout\(\(\) => \{ showWheel\(\); restWheel\(\); \}, 800\);\n\n  \/\/ Re-layout en resize \(cambia entre modo lateral y modo inferior\)\n  window.addEventListener\('resize', \(\) => layoutSpheres\(current\)\);/, '');

fs.writeFileSync('js/fullscreen.js', code);
console.log("Patched fullscreen.js");
