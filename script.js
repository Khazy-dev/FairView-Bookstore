/* =========================
   REFERENCIAS DEL DOM
   ========================= */
const main      = document.getElementById('main');          // contenedor principal que cambia de orden en desktop
const signIn    = document.getElementById('formSignIn');    // formulario de login
const signUp    = document.getElementById('formSignUp');    // formulario de registro
const loginError= document.getElementById('loginError');    // span o div para mostrar error de login


/* =========================
   HELPERS
   ========================= */
/**
 * Activa un formulario y ajusta el layout en desktop.
 * @param {HTMLFormElement} form  formulario a mostrar (signIn o signUp)
 * @param {"signin"|"signup"} mode  modo para invertir orden del layout en md+
 */
function activate(form, mode) {
  // 1. Mostrar solo el formulario pasado, ocultar el otro
  [signIn, signUp].forEach(f => f && f.classList.add('hidden'));
  form?.classList.remove('hidden');

  // 2. Cambiar el orden del layout en pantallas md en adelante
  //    signin: imagen a la derecha -> md:flex-row
  //    signup: imagen a la izquierda -> md:flex-row-reverse
  if (main) {
    main.classList.remove('md:flex-row', 'md:flex-row-reverse');
    main.classList.add(mode === 'signup' ? 'md:flex-row-reverse' : 'md:flex-row');
  }

  // 3. Enfocar el primer input del formulario activo
  const first = form?.querySelector('input');
  if (first) first.focus({ preventScroll: true });
}


/* =========================
   EVENTOS: LOGIN
   ========================= */
// Unificamos la validación en un solo submit handler
signIn?.addEventListener('submit', e => {
  e.preventDefault();

  // Obtenemos los valores por name="email" y name="password"
  const email = signIn.email?.value.trim();
  const pass  = signIn.password?.value.trim();

  // Validación básica
  if (!email || !pass) {
    if (loginError) loginError.textContent = 'Completá email y contraseña.';
    return;
  }

  // Limpia error si existía
  if (loginError) loginError.textContent = '';

  // Acción demo: redirigir a home 
  window.location.href = 'home.html';
});


/* =========================
   EVENTOS: REGISTRO
   ========================= */
// Validación mínima de ejemplo para el registro
signUp?.addEventListener('submit', e => {
  // Si el form nativo marca inválido, no seguimos
  if (!signUp.checkValidity()) return;
  e.preventDefault();
  alert('Registro enviado (demo)');
});


/* =========================
   ESTADO INICIAL
   ========================= */
// Mostrar login al cargar, imagen a la derecha en md+
activate(signIn, 'signin');

/* =========================
   EVENTOS: CAMBIO ENTRE LOGIN / SIGNUP
   ========================= */
const goToSignUp = document.getElementById('goToSignUp');
const goToSignIn = document.getElementById('goToSignIn');

goToSignUp?.addEventListener('click', e => {
  e.preventDefault();
  activate(signUp, 'signup'); // cambia layout y muestra form de registro
});

goToSignIn?.addEventListener('click', e => {
  e.preventDefault();
  activate(signIn, 'signin'); // cambia layout y muestra form de login
});



/* =========================
   NAVBAR MOBILE
   ========================= */
// Referencias del menú principal (hamburguesa)
const menuBtn  = document.getElementById('menuBtn');   // botón hamburguesa
const menuList = document.getElementById('menuList');  // ul del menú

// Abre/cierra el contenedor del menú en mobile
menuBtn?.addEventListener('click', () => {
  if (!menuList) return;

  // wasHidden nos dice si el menú estaba cerrado antes del click
  const wasHidden = menuList.classList.contains('hidden');
  menuList.classList.toggle('hidden');
  menuList.classList.toggle('flex');

  // Si se cerró el menú hamburguesa, colapsar el submenú de Categorías
  if (!wasHidden) {
    const catSub  = document.getElementById('catSub');   // ul del submenú mobile
    const catBtn  = document.getElementById('catBtn');   // botón "Categorías" mobile
    const catIcon = document.getElementById('catIcon');  // ícono +/−

    if (catSub && !catSub.classList.contains('hidden')) {
      catSub.classList.add('hidden');
      catBtn?.setAttribute('aria-expanded', 'false');

      // Dejar el ícono en estado + al cerrar
      if (catIcon) {
        catIcon.classList.add('fa-angle-down');
        catIcon.classList.remove('fa-angle-up');
      }
    }
  }
});

// Toggle del submenú de Categorías en mobile
const catBtn  = document.getElementById('catBtn');
const catSub  = document.getElementById('catSub');
const catIcon = document.getElementById('catIcon');

if (catBtn && catSub) {
  catBtn.addEventListener('click', () => {
    // Alternamos visibilidad del submenú
    const isOpen = catSub.classList.toggle('hidden') === false;

    // Accesibilidad: aria-expanded true/false
    catBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    // Sincronizamos el ícono con el estado actual
    // Importante: el ícono por defecto debería tener "fa-plus"
    if (catIcon) {
      catIcon.classList.toggle('fa-angle-down', !isOpen);
      catIcon.classList.toggle('fa-angle-up', isOpen);
    }
  });
}





//
// Modal elementos
const bookModal = document.getElementById('bookModal');
const bookModalOverlay = document.getElementById('bookModalOverlay');
const bookModalClose = document.getElementById('bookModalClose');

// Campos a rellenar
const bmTitleTop = document.getElementById('bmTitleTop');
const bmTitle = document.getElementById('bmTitle');
const bmAuthor = document.getElementById('bmAuthor');
const bmImage = document.getElementById('bmImage');
const bmStars = document.getElementById('bmStars');
const bmRatingText = document.getElementById('bmRatingText');
const bmDesc = document.getElementById('bmDesc');
const bmISBN = document.getElementById('bmISBN');
const bmYear = document.getElementById('bmYear');
const bmPages = document.getElementById('bmPages');
const bmGenero = document.getElementById('bmGenero');

// Utilidad: render de estrellas
function renderStars(n) {
  const full = Math.max(0, Math.min(5, parseInt(n, 10) || 0));
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 5; i++) {
    const iEl = document.createElement('i');
    iEl.className = (i < full) ? 'fa-solid fa-star' : 'fa-regular fa-star text-gray-300';
    iEl.classList.add('text-sm');
    frag.appendChild(iEl);
  }
  bmStars.innerHTML = '';
  bmStars.appendChild(frag);
  bmRatingText.textContent = `${full}/5`;
}

// Abrir modal
function openBookModal(card) {
  const title = card.dataset.title || 'Sin título';
  const author = card.dataset.author || 'Autor desconocido';
  const image = card.dataset.image || '';
  const rating = card.dataset.rating || '0';
  const desc = card.dataset.description || 'Sin descripción disponible.';
  const isbn = card.dataset.isbn || 'N/D';
  const year = card.dataset.year || 'N/D';
  const pages = card.dataset.pages || 'N/D';
  const genero = card.dataset.genero || 'N/D';


  bmTitleTop.textContent = title;
  bmTitle.textContent = title;
  bmAuthor.textContent = author;
  bmImage.src = image;
  bmImage.alt = title;
  renderStars(rating);
  bmDesc.textContent = desc;
  bmISBN.textContent = isbn;
  bmYear.textContent = year;
  bmPages.textContent = pages;
  bmGenero.textContent = genero;

  bookModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // evita scroll del fondo
}

// Cerrar modal
function closeBookModal() {
  bookModal.classList.add('hidden');
  document.body.style.overflow = '';
}

// Eventos globales
bookModalOverlay?.addEventListener('click', closeBookModal);
bookModalClose?.addEventListener('click', closeBookModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !bookModal.classList.contains('hidden')) closeBookModal();
});

// Delegación: cualquier .book-card abre modal
document.querySelectorAll('.book-card').forEach(card => {
  card.addEventListener('click', () => openBookModal(card));
});

// ====================== animacion ======================
  let vantaEffect;
  function initVanta() {
    if (vantaEffect) return;
    vantaEffect = VANTA.GLOBE({
      el: "#vanta-globe",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0xff3f81,          // color de puntos
      backgroundColor: 0x23153c, // color de fondo
      size: 2.10,               // tamaño de los puntos
      points: 15.0              // densidad del globo
    });
  }

  document.addEventListener('DOMContentLoaded', initVanta);
  window.addEventListener('resize', () => { if (vantaEffect) vantaEffect.resize(); });
  window.addEventListener('pagehide', () => { if (vantaEffect) { vantaEffect.destroy(); vantaEffect = null; } });

