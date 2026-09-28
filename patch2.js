const fs = require('fs');
let code = fs.readFileSync('js/fullscreen.js', 'utf8');

code = code.replace(/\/\/ 4\. Sphere clicks[\s\S]*?\}\);/g, '');

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

code = code.replace(/\/\/  NAVEGACI..N FULLSCREEN/g, owInit + '\n\n  //  NAVEGACION FULLSCREEN');

fs.writeFileSync('js/fullscreen.js', code);
console.log("Patched fullscreen.js again");
