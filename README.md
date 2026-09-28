# Belleza Natural - Interfaz Web

Este repositorio contiene el desarrollo del entorno visual ("Front-End") para la página web del salón de belleza "Belleza Natural". Su objetivo principal es ofrecer una experiencia inmersiva y moderna al usuario simulando el comportamiento de diapositivas de pantalla completa, con un formato de navegación fluida que se asemeja al de una aplicación móvil nativa.

## Estructura del Proyecto

El sitio está estructurado en cuatro secciones principales a las que el usuario accede desplazándose de manera vertical:

1. Inicio (Hero): Contiene un carrusel fotográfico de fondo, mensajes de bienvenida y botones de llamado a la acción.
2. Resultados (Transformaciones): Muestra evidencias del trabajo del salón utilizando un componente interactivo deslizable para comparar fotografías del "Antes y Después".
3. Servicios: Despliega el catálogo de atenciones de belleza agrupadas por categorías (Cabello, Uñas, Cejas y Pestañas) junto con sus respectivos precios. En dispositivos móviles, esta sección se reorganiza bajo un sistema de acordeón interactivo para optimizar el espacio visual.
4. Promociones: Presenta en formato de tarjetas los distintos paquetes y ofertas activas.

## Herramientas y Tecnologías Utilizadas

El desarrollo fue construido enteramente utilizando tecnologías web estándar y nativas, prescindiendo del uso de librerías de terceros para garantizar un rendimiento óptimo, accesibilidad y un control preciso del código.

### HTML5
Proporciona la estructura y la semántica del documento web. 
* Se implementaron etiquetas estructurales modernas (`<section>`, `<article>`, `<nav>`, `<main>`) para mejorar la accesibilidad y el SEO.
* Incluye soporte directo para gráficos vectoriales mediante el uso de etiquetas `<svg>` insertadas, utilizadas en la interfaz de la rueda de navegación.

### CSS3
Encargado de la presentación visual y el comportamiento de la interfaz.
* **CSS Scroll Snapping:** Tecnología clave empleada para lograr la experiencia de navegación por "diapositivas". Permite que al desplazar la rueda del ratón o deslizar en pantallas táctiles, la vista se detenga obligatoriamente en el borde de cada sección.
* **Flexbox y CSS Grid:** Utilizados para maquetar el interior de cada sección. Facilitan alinear elementos de manera precisa y distribuir el contenido en columnas responsivas.
* **Responsive Design (Media Queries):** Se aplicaron puntos de ruptura para reestructurar dinámicamente los estilos, ajustando tipografías, reubicando la rueda de navegación y alterando la distribución de los componentes basándose en las dimensiones del dispositivo (PC, Tablet o Móviles), incluyendo soporte dinámico para el viewport (`100dvh`).
* **Variables CSS (Custom Properties):** Se establecieron para administrar de forma global y eficiente la paleta de colores corporativos y variables matemáticas de posición.
* **Transiciones y Animaciones (Keyframes):** Empleadas para efectos sutiles de entrada, deslizamiento fluido de contenido, estados táctiles e indicadores interactivos.

### Vanilla JavaScript (ES6+)
Agrega interactividad dinámica sin dependencias adicionales.
* **Intersection Observer API:** Herramienta avanzada nativa del navegador, utilizada para monitorear qué sección de la página está actualmente visible. Activa las animaciones de entrada del texto e imágenes de manera optimizada y se encarga de actualizar dinámicamente el estado en la rueda lateral de navegación.
* **Manejo del DOM:** Utilizado para inyectar lógica de comportamiento a los elementos, tales como la apertura y cierre de las tarjetas de servicios (estilo acordeón) y el funcionamiento del carrusel cíclico de imágenes del inicio.
* **Event Listeners Multimodal:** Controla e interpreta diversas entradas de usuario, abarcando desde toques en pantallas móviles hasta clics tradicionales, movimiento y arrastre en los controles de los comparadores visuales.
