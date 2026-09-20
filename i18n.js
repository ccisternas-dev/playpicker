// Stable activity IDs and filter values are shared across languages.
let language = 'en';
try { const stored = localStorage.getItem('playpicker-language'); if (stored === 'es' || stored === 'en') language = stored; } catch {}
const SPANISH = {
  "PlayPicker — Little ideas. Big adventures.": "PlayPicker — Pequeñas ideas. Grandes aventuras.",
  "Less screen time, more play time. Discover simple, creative activities for your family with PlayPicker.": "Menos pantallas, más juego. Descubre actividades sencillas y creativas para tu familia con PlayPicker.",
  "PlayPicker home": "Inicio de PlayPicker",
  "Main navigation": "Navegación principal",
  "Discover": "Descubrir",
  "My collection": "Mi colección",
  "Less scrolling. More playing.": "Menos pantallas. Más juego.",
  "FIND YOUR NEXT LITTLE ADVENTURE": "ENCUENTRA TU PRÓXIMA AVENTURA",
  "Your next “let’s do that!”": "¿A qué jugamos hoy?",
  "Filters": "Filtros",
  "Try cardboard, painting, nature…": "Prueba cartón, pintura, naturaleza…",
  "Search activities": "Buscar actividades",
  "Age": "Edad",
  "Any age": "Cualquier edad",
  "2–3 years": "2–3 años",
  "4–5 years": "4–5 años",
  "6–8 years": "6–8 años",
  "9–12 years": "9–12 años",
  "Time": "Tiempo",
  "Any time": "Cualquier duración",
  "15 min or less": "15 min o menos",
  "30 min or less": "30 min o menos",
  "Up to an hour": "Hasta una hora",
  "Setting": "Lugar",
  "Anywhere": "Cualquier lugar",
  "Indoors": "Interior",
  "Outdoors": "Exterior",
  "Mess level": "Limpieza después",
  "Any mess": "Cualquier nivel",
  "Low": "Poca",
  "Medium": "Media",
  "High": "Mucha",
  "Reset": "Restablecer",
  "Activity categories": "Categorías de actividades",
  "All activities": "Todas",
  "Make & create": "Crear e imaginar",
  "Explore nature": "Explorar la naturaleza",
  "Move & play": "Moverse y jugar",
  "Little scientists": "Pequeños científicos",
  "Swipe a little. Play a lot.": "Desliza un poco. Juega mucho.",
  "Swipe to discover activities": "Desliza para descubrir actividades",
  "A LITTLE SPARK FOR YOUR DAY": "UNA CHISPA DE INSPIRACIÓN",
  "Find their": "Encuentra su",
  "next favorite": "próxima",
  "thing to do.": "aventura favorita.",
  "One simple idea at a time.": "Una idea sencilla cada vez.",
  "Keep what you love. Skip what you don’t.": "Guarda lo que te guste. Pasa lo demás.",
  "← Pass for now": "← Ahora no",
  "Save for later ♡ →": "Guardar para después ♡ →",
  "Real-world fun. Right at your fingertips.": "Diversión de verdad. Al alcance de tu mano.",
  "Activity cards": "Tarjetas de actividades",
  "Undo last swipe": "Deshacer el último deslizamiento",
  "Undo": "Deshacer",
  "Pass on this activity": "Pasar esta actividad",
  "Not today": "Hoy no",
  "View activity instructions": "Ver las instrucciones de la actividad",
  "How to play": "Cómo jugar",
  "Save this activity": "Guardar esta actividad",
  "Love it": "Me encanta",
  "Swipe left to pass · swipe right to save": "Izquierda para pasar · derecha para guardar",
  "GOOD TO KNOW": "RECUERDA",
  "No fancy supplies.": "Sin materiales complicados.",
  "No perfect results.": "Sin buscar la perfección.",
  "Just time together.": "Solo tiempo en familia.",
  "A little room for possibility": "Hay mucho por descubrir",
  "Explore all activities": "Explorar todas las actividades",
  "Small moments. Big memories.": "Pequeños momentos. Grandes recuerdos.",
  "Add to your phone": "Añadir al móvil",
  "Close installation instructions": "Cerrar las instrucciones de instalación",
  "A LITTLE PLAY, ALWAYS HANDY": "UN POCO DE JUEGO, SIEMPRE A MANO",
  "Make room for play.": "Haz espacio para jugar.",
  "Add PlayPicker to your home screen. No app store needed.": "Añade PlayPicker a tu pantalla de inicio. Sin tiendas de aplicaciones.",
  "On iPhone": "En iPhone",
  "Open this site in Safari, tap Share, then": "Abre esta página en Safari, toca Compartir y luego",
  "Add to Home Screen": "Añadir a pantalla de inicio",
  ". Leave": ". Mantén",
  "Open as Web App": "Abrir como app web",
  "enabled if shown, then tap Add.": "activado si aparece y toca Añadir.",
  "On Android": "En Android",
  "Open this site in Chrome, open the ⋮ menu, then choose": "Abre esta página en Chrome, abre el menú ⋮ y elige",
  "Add to Home screen": "Añadir a pantalla de inicio",
  "or": "o",
  "Install app": "Instalar aplicación",
  "For installation and offline play, use an HTTPS address. Your saved activities stay in this browser on this device.": "Para instalar y jugar sin conexión, usa una dirección HTTPS. Las actividades guardadas se conservan en este navegador y dispositivo.",
  "Install PlayPicker": "Instalar PlayPicker",
  "Close activity": "Cerrar actividad",
  "activity": "actividad",
  "activities": "actividades",
  "in your collection": "en tu colección",
  "for a little everyday adventure": "para una pequeña aventura cotidiana",
  "Your next little adventures": "Tus próximas aventuras",
  "Unsave": "Quitar de la colección",
  "Save": "Guardar",
  "View": "Ver",
  "Ages": "Edades",
  "Tap a heart on any activity to keep it here for another day.": "Toca el corazón de una actividad para guardarla aquí para otro día.",
  "No activities match just yet. Try a different filter or explore them all.": "No hay actividades que coincidan. Prueba otro filtro o explóralas todas.",
  "Saved for another little adventure ♡": "Guardada para otra pequeña aventura ♡",
  "Removed from your collection": "Eliminada de tu colección",
  "Saved for this visit. Browser storage is unavailable.": "Guardada durante esta visita. El almacenamiento del navegador no está disponible.",
  "♥ Saved to my collection": "♥ Guardada en mi colección",
  "♡ Save to my collection": "♡ Guardar en mi colección",
  "minutes": "minutos",
  "Gather a few things": "Prepara los materiales",
  "Let’s make it happen": "¡Manos a la obra!",
  "A little grown-up note": "Una nota para las personas adultas",
  "idea": "idea",
  "ideas": "ideas",
  "left to discover": "por descubrir",
  "A little inspiration, collected.": "Un poco de inspiración para llevar.",
  "Let’s try a different mix.": "Probemos otra combinación.",
  "You’ve explored these ideas. Your favorites are waiting in your collection.": "Ya has explorado estas ideas. Tus favoritas te esperan en tu colección.",
  "No ideas match these filters. Give your next adventure a little more room.": "No hay ideas con estos filtros. Amplía la búsqueda para encontrar tu próxima aventura.",
  "Revisit passed activities": "Volver a ver las descartadas",
  "Reset filters": "Restablecer filtros",
  "View my collection →": "Ver mi colección →",
  "LOVE IT": "ME ENCANTA",
  "NOT TODAY": "HOY NO",
  "A LITTLE CREATIVITY GOES A LONG WAY": "UN POCO DE CREATIVIDAD LO CAMBIA TODO",
  "See what you’ll need": "Mira qué necesitas",
  "Use the left arrow to pass or right arrow to save. Use the buttons below as an alternative to swiping.": "Usa la flecha izquierda para pasar o la derecha para guardar. También puedes usar los botones de abajo en lugar de deslizar.",
  "It’s a little match! Saved to your collection ♥": "¡Esta es para ti! Guardada en tu colección ♥",
  "saved": "guardada",
  "passed": "descartada",
  "ideas remaining.": "ideas restantes.",
  "Last swipe undone. Give it another look.": "Último deslizamiento deshecho. Mírala otra vez.",
  "PlayPicker is ready on your home screen.": "PlayPicker ya está en tu pantalla de inicio.",
  "Low mess": "Poco que limpiar",
  "Medium mess": "Limpieza moderada",
  "High mess": "Mucho que limpiar"
};
const SPANISH_ACTIVITIES = {
  "cardboard-town": {
    "title": "Una ciudad de cartón",
    "description": "Convierte las cajas de ayer en un mundo nuevo.",
    "badge": "Un poco de imaginación",
    "materials": [
      "Cajas de cartón limpias",
      "Rotuladores lavables",
      "Cinta adhesiva de papel",
      "Tijeras infantiles"
    ],
    "steps": [
      "Elige algunas cajas e imagina qué edificios necesita tu ciudad.",
      "Pide a una persona adulta que corte puertas y ventanas en el cartón más grueso.",
      "Dibuja tejados, letreros de tiendas y detalles de colores.",
      "Coloca los edificios y añade calles de papel. Inventa una historia sobre sus habitantes."
    ],
    "tip": "Puedes seguir construyendo durante varios días. ¡Una caja de cereales puede ser una biblioteca estupenda!"
  },
  "nature-crowns": {
    "title": "Coronas de naturaleza",
    "description": "Un poco de aire fresco. Una tarde de reyes y reinas.",
    "badge": "Al aire libre",
    "materials": [
      "Una tira de cartulina reciclada",
      "Cinta adhesiva de papel",
      "Hojas y flores caídas",
      "Pegamento en barra"
    ],
    "steps": [
      "Sal a pasear con una persona adulta y recoge hojas y flores caídas.",
      "Mide una tira de cartulina alrededor de tu cabeza, dejando un poco de margen para unir los extremos.",
      "Extiende la tira y pega los tesoros que has encontrado.",
      "Deja que se seque, une los extremos con cinta y comienza tu desfile real."
    ],
    "tip": "Deja las plantas vivas para los animales y evita las que no conozcas. Lávate las manos al terminar."
  },
  "rainbow-prints": {
    "title": "Arcoíris con esponjas",
    "description": "Grandes colores y pequeñas obras de arte.",
    "badge": "¡A todo color!",
    "materials": [
      "Pintura lavable adecuada para la edad",
      "Una esponja limpia",
      "Papel grande",
      "Una bandeja y un protector para la mesa"
    ],
    "steps": [
      "Protege la zona de trabajo y coloca una hoja grande sobre la mesa.",
      "Una persona adulta pone franjas de pintura lavable en una esponja húmeda.",
      "Presiona o desliza la esponja sobre el papel para crear un arcoíris.",
      "Prueba nuevas formas y deja secar tu obra de arte."
    ],
    "tip": "Con los más pequeños, usa una esponja grande y supervisa de cerca. La pintura va en el papel, no en la boca."
  },
  "paper-rockets": {
    "title": "¡Cohetes de papel!",
    "description": "Pequeños cohetes. Descubrimientos de otro planeta.",
    "badge": "Asombro en marcha",
    "materials": [
      "Papel",
      "Cinta adhesiva de papel",
      "Una pajita para beber",
      "Tijeras infantiles"
    ],
    "steps": [
      "Enrolla un rectángulo pequeño de papel alrededor de la pajita sin apretarlo y pega la unión.",
      "Saca el tubo de papel, dobla un extremo y ciérralo con cinta.",
      "Añade aletas de papel e introduce la pajita por el extremo abierto.",
      "Apunta hacia un espacio despejado y sopla por la pajita. Compara distintas formas de aletas."
    ],
    "tip": "Nunca apuntes a la cara ni a los animales. Cada niño o niña debe usar su propia pajita."
  },
  "living-room-trail": {
    "title": "Aventura en el salón",
    "description": "Una habitación cualquiera se convierte en una gran expedición.",
    "badge": "Energía bien aprovechada",
    "materials": [
      "Cojines de suelo",
      "Una manta",
      "Hojas de papel para marcar los pasos"
    ],
    "steps": [
      "Despeja un espacio seguro en el suelo con una persona adulta.",
      "Coloca cojines planos y hojas de papel para formar un camino corto.",
      "Imagina un río que hay que cruzar y una isla de manta a la que llegar.",
      "Por turnos, elige nuevas formas de avanzar: pasos lentos, gatear con cuidado o caminar de forma divertida."
    ],
    "tip": "Mantén todo a ras de suelo y usa superficies antideslizantes. Evita saltar desde los muebles."
  },
  "bug-hotel": {
    "title": "Un hotel para insectos",
    "description": "Un refugio acogedor para los pequeños visitantes del jardín.",
    "badge": "Para mentes curiosas",
    "materials": [
      "Una caja de madera limpia y abierta",
      "Ramitas caídas",
      "Piñas de pino",
      "Hojas secas"
    ],
    "steps": [
      "Busca un lugar resguardado al aire libre con una persona adulta.",
      "Coloca la caja de lado, a ras de suelo.",
      "Añade capas sueltas de ramitas, hojas secas y piñas.",
      "Vuelve en silencio durante los días siguientes para observar a los huéspedes sin molestarlos."
    ],
    "tip": "Observa los insectos sin tocarlos. Evita la madera con astillas y lávate las manos al terminar."
  },
  "shadow-stories": {
    "title": "Érase una vez una sombra",
    "description": "Pequeñas manos cuentan grandes historias en la pared.",
    "badge": "Solo falta una historia",
    "materials": [
      "Una linterna",
      "Una pared despejada",
      "Tus manos"
    ],
    "steps": [
      "Baja un poco la luz y pide a una persona adulta que apunte una linterna hacia una pared despejada.",
      "Coloca una mano entre la luz y la pared. ¿Qué forma aparece?",
      "Prueba un pájaro, un conejo o una criatura que nadie haya visto antes.",
      "Por turnos, añade un personaje a la historia."
    ],
    "tip": "Nunca apuntes la luz a los ojos. Mantén suficiente iluminación para moverte con seguridad."
  },
  "sink-float": {
    "title": "¿Se hunde o flota?",
    "description": "Pequeños experimentos para grandes preguntas.",
    "badge": "Diversión en 15 minutos",
    "materials": [
      "Un recipiente poco profundo con agua",
      "Una hoja grande",
      "Una cuchara de madera",
      "Una piedra grande y lisa",
      "Una toalla"
    ],
    "steps": [
      "Coloca un recipiente poco profundo en una superficie estable, junto a una persona adulta.",
      "Elige objetos grandes y seguros de casa e intenta adivinar qué hará cada uno.",
      "Introduce suavemente un objeto cada vez en el agua y observa.",
      "Separa los objetos que se hunden de los que flotan y vaciad el recipiente juntos."
    ],
    "tip": "Una persona adulta debe permanecer siempre al alcance de la mano cuando haya agua. Usa objetos demasiado grandes para tragarlos y vacía el agua inmediatamente después."
  },
  "leaf-rubbings": {
    "title": "Los secretos de las hojas",
    "description": "Descubre los detalles que se esconden a plena vista.",
    "badge": "Pequeñas alegrías",
    "materials": [
      "Hojas caídas",
      "Papel",
      "Ceras de colores grandes"
    ],
    "steps": [
      "Elige algunas hojas caídas con formas diferentes.",
      "Coloca una hoja con los nervios hacia arriba debajo de una hoja de papel.",
      "Frota suavemente el papel con el lateral de una cera de color.",
      "Compara los dibujos y combínalos para crear una imagen llena de hojas de colores."
    ],
    "tip": "Usa hojas conocidas que no irriten la piel y lávate las manos al terminar."
  }
};
function t(text) { return language === 'es' ? (SPANISH[text] ?? text) : text; }
function localizeActivity(activity) { return language === 'es' ? {...activity, ...SPANISH_ACTIVITIES[activity.id]} : activity; }
function normalizeSearch(text) { return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase(language); }
// Capture static text once, preserving nested elements, listeners, and select values.
const staticText = [];
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
while (walker.nextNode()) {
  const node = walker.currentNode;
  if (node.parentElement.closest('script, style, #language-toggle')) continue;
  const source = node.textContent.trim();
  if (source) staticText.push({node, original: node.textContent, source});
}
const staticAttributes = [];
document.querySelectorAll('[aria-label], [placeholder], meta[name="description"]').forEach(node => {
  for (const attribute of ['aria-label', 'placeholder', 'content']) {
    if (node.hasAttribute(attribute)) staticAttributes.push({node, attribute, original: node.getAttribute(attribute)});
  }
});
function translateStaticPage() {
  document.documentElement.lang = language;
  document.title = t('PlayPicker — Little ideas. Big adventures.');
  for (const {node, original, source} of staticText) {
    // Decorative characters remain outside the translated phrase.
    const phrase = source.replace(/^[✳☷✂❀↝⚗↗]\s*/, '');
    node.textContent = original.replace(phrase, t(phrase));
  }
  for (const {node, attribute, original} of staticAttributes) node.setAttribute(attribute, t(original));
  const button = document.querySelector('#language-toggle');
  button.textContent = language === 'en' ? 'ES' : 'EN';
  button.lang = language === 'en' ? 'es' : 'en';
  button.setAttribute('aria-label', language === 'en' ? 'Cambiar a español' : 'Switch to English');
  button.title = language === 'en' ? 'Español' : 'English';
}
