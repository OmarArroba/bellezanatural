const fs = require('fs');
let code = fs.readFileSync('js/fullscreen.js', 'utf8');

// The code has blocks separated by comments. We can remove specific lines.

// 1. wheelNav y spheres
code = code.replace("const wheelNav  = document.getElementById('wheelNav');", "const optionWheelEl = document.getElementById('optionWheel');");
code = code.replace("const spheres   = Array.from(document.querySelectorAll('.sphere'));", "");

// 2. Remove isMobile, getSideSlot, getBottomSlot, getRoleForSphere, layoutSpheres, showWheel, restWheel
// They start at `function isMobile()` and end at `function restWheel() { ... }`
const startIdx = code.indexOf('function isMobile()');
const endMarker = 'function restWheel() {';
const endIdx = code.indexOf(endMarker);
const finalEndIdx = code.indexOf('}', code.indexOf('}', code.indexOf('}', endIdx) + 1) + 1) + 1; // finds the end of restWheel

if(startIdx !== -1 && finalEndIdx !== -1) {
  code = code.slice(0, startIdx) + code.slice(finalEndIdx);
}

// 3. OptionWheel instantiation
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
code = code.replace(/\/\/.*NAVEGACI.N FULLSCREEN/, owInit + '\n\n  // NAVEGACION FULLSCREEN');

// 4. Update goTo() function
code = code.replace('showWheel();', '');
code = code.replace('layoutSpheres(current);', 'if (optionWheel) optionWheel.setIndex(current);');
code = code.replace('restWheel();', '');

// 5. Remove '4. Sphere clicks' block completely
const sphereClickStart = code.indexOf('// 4. Sphere clicks');
if (sphereClickStart !== -1) {
  const sphereClickEnd = code.indexOf('// 5. Keyboard');
  code = code.slice(0, sphereClickStart) + code.slice(sphereClickEnd);
}

// 6. Update IntersectionObserver block
code = code.replace('showWheel();', '');
code = code.replace('layoutSpheres(current);', 'if (optionWheel) optionWheel.setIndex(current);');
code = code.replace('restWheel();', '');

// 7. Remove initialization calls at the bottom
code = code.replace("layoutSpheres(0);", "");
code = code.replace("wheelNav.classList.add('rest');", "");
code = code.replace(/setTimeout\(\(\) => \{ showWheel\(\); restWheel\(\); \}, 800\);/, "");
code = code.replace("window.addEventListener('resize', () => layoutSpheres(current));", "");

fs.writeFileSync('js/fullscreen.js', code);
console.log("Patched clean fullscreen.js");
