/* ===========================================================
   REFERENCIAS DEL DOM PRINCIPAL
   =========================================================== */
const main       = document.getElementById('main');          
const signIn     = document.getElementById('formSignIn');    
const signUp     = document.getElementById('formSignUp');    
const loginError = document.getElementById('loginError');    


/* ===========================================================
   FUNCIONES AUXILIARES
   =========================================================== */
function activate(form, mode) {
  try {
    [signIn, signUp].forEach(f => f && f.classList.add('hidden'));
    form?.classList.remove('hidden');

    if (main) {
      main.classList.remove('md:flex-row', 'md:flex-row-reverse');
      main.classList.add(mode === 'signup' ? 'md:flex-row-reverse' : 'md:flex-row');
    }

    const first = form?.querySelector('input');
    if (first) first.focus({ preventScroll: true });
  } catch (err) {
    console.warn("⚠️ Error al activar formulario:", err.message);
  }
}


/* ===========================================================
   LOGIN
   =========================================================== */
try {
  signIn?.addEventListener('submit', e => {
    e.preventDefault();
    const email = signIn.email?.value.trim();
    const pass  = signIn.password?.value.trim();

    if (!email || !pass) {
      if (loginError) loginError.textContent = 'Completá email y contraseña.';
      return;
    }

    if (loginError) loginError.textContent = '';
    window.location.href = 'home.html';
  });
} catch (err) {
  console.warn("⚠️ Error en login:", err.message);
}


/* ===========================================================
   REGISTRO
   =========================================================== */
try {
  signUp?.addEventListener('submit', e => {
    if (!signUp.checkValidity()) return;
    e.preventDefault();
    alert('Registro enviado (demo)');
  });
} catch (err) {
  console.warn("⚠️ Error en registro:", err.message);
}


/* ===========================================================
   ESTADO INICIAL
   =========================================================== */
activate(signIn, 'signin');


/* ===========================================================
   CAMBIO ENTRE LOGIN / SIGNUP
   =========================================================== */
try {
  const goToSignUp = document.getElementById('goToSignUp');
  const goToSignIn = document.getElementById('goToSignIn');

  goToSignUp?.addEventListener('click', e => {
    e.preventDefault();
    activate(signUp, 'signup');
  });

  goToSignIn?.addEventListener('click', e => {
    e.preventDefault();
    activate(signIn, 'signin');
  });
} catch (err) {
  console.warn("⚠️ Error al cambiar formulario:", err.message);
}


/* ===========================================================
   NAVBAR MOBILE
   =========================================================== */
try {
  const menuBtn  = document.getElementById('menuBtn');
  const menuList = document.getElementById('menuList');

  menuBtn?.addEventListener('click', () => {
    if (!menuList) return;
    const wasHidden = menuList.classList.contains('hidden');
    menuList.classList.toggle('hidden');
    menuList.classList.toggle('flex');

    if (!wasHidden) {
      const catSub  = document.getElementById('catSub');
      const catBtn  = document.getElementById('catBtn');
      const catIcon = document.getElementById('catIcon');
      if (catSub && !catSub.classList.contains('hidden')) {
        catSub.classList.add('hidden');
        catBtn?.setAttribute('aria-expanded', 'false');
        if (catIcon) {
          catIcon.classList.add('fa-angle-down');
          catIcon.classList.remove('fa-angle-up');
        }
      }
    }
  });

  const catBtn  = document.getElementById('catBtn');
  const catSub  = document.getElementById('catSub');
  const catIcon = document.getElementById('catIcon');

  if (catBtn && catSub) {
    catBtn.addEventListener('click', () => {
      const isOpen = catSub.classList.toggle('hidden') === false;
      catBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (catIcon) {
        catIcon.classList.toggle('fa-angle-down', !isOpen);
        catIcon.classList.toggle('fa-angle-up', isOpen);
      }
    });
  }
} catch (err) {
  console.warn("⚠️ Error en navbar:", err.message);
}


/* ===========================================================
   MODAL DE LIBRO
   =========================================================== */
try {
  const bookModal         = document.getElementById('bookModal');
  const bookModalOverlay  = document.getElementById('bookModalOverlay');
  const bookModalClose    = document.getElementById('bookModalClose');

  const bmTitleTop = document.getElementById('bmTitleTop');
  const bmTitle    = document.getElementById('bmTitle');
  const bmAuthor   = document.getElementById('bmAuthor');
  const bmImage    = document.getElementById('bmImage');
  const bmStars    = document.getElementById('bmStars');
  const bmRatingText = document.getElementById('bmRatingText');
  const bmDesc     = document.getElementById('bmDesc');
  const bmISBN     = document.getElementById('bmISBN');
  const bmYear     = document.getElementById('bmYear');
  const bmPages    = document.getElementById('bmPages');
  const bmGenero   = document.getElementById('bmGenero');

  function renderStars(n) {
    const full = Math.max(0, Math.min(5, parseInt(n, 10) || 0));
    bmStars.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const star = document.createElement('i');
      star.className = i < full ? 'fa-solid fa-star text-sm text-lime-500' : 'fa-regular fa-star text-sm text-gray-300';
      bmStars.appendChild(star);
    }
    bmRatingText.textContent = `${full}/5`;
  }

  function openBookModal(card) {
    bmTitleTop.textContent = card.dataset.title || 'Sin título';
    bmTitle.textContent    = card.dataset.title || 'Sin título';
    bmAuthor.textContent   = card.dataset.author || 'Autor desconocido';
    bmImage.src            = card.dataset.image || '';
    bmImage.alt            = card.dataset.title || '';
    renderStars(card.dataset.rating || 0);
    bmDesc.textContent     = card.dataset.description || 'Sin descripción disponible.';
    bmISBN.textContent     = card.dataset.isbn || 'N/D';
    bmYear.textContent     = card.dataset.year || 'N/D';
    bmPages.textContent    = card.dataset.pages || 'N/D';
    bmGenero.textContent   = card.dataset.genero || 'N/D';

    bookModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeBookModal() {
    bookModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }

  bookModalOverlay?.addEventListener('click', closeBookModal);
  bookModalClose?.addEventListener('click', closeBookModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !bookModal.classList.contains('hidden')) closeBookModal();
  });

  document.querySelectorAll('.book-card').forEach(card => {
    card.addEventListener('click', () => openBookModal(card));
  });
} catch (err) {
  console.warn("⚠️ Error en modal de libro:", err.message);
}


/* ===========================================================
   EFECTO VANTA (protegido)
   =========================================================== */
try {
  let vantaEffect;
  function initVanta() {
    if (typeof VANTA === "undefined") return;
    if (vantaEffect) return;
    vantaEffect = VANTA.GLOBE({
      el: "#vanta-globe",
      mouseControls: true,
      touchControls: true,
      minHeight: 200.00,
      minWidth: 200.00,
      color: 0xff3f81,
      backgroundColor: 0x23153c,
      size: 2.1,
      points: 15.0
    });
  }
  document.addEventListener('DOMContentLoaded', initVanta);
  window.addEventListener('resize', () => { if (vantaEffect) vantaEffect.resize(); });
  window.addEventListener('pagehide', () => { if (vantaEffect) { vantaEffect.destroy(); vantaEffect = null; } });
} catch (err) {
  console.warn("⚠️ Error en VANTA:", err.message);
}


/* ===========================================================
   RESERVAR LIBRO
   =========================================================== */
try {
  document.addEventListener("click", e => {
    if (e.target.closest(".btn-reservar")) {
      const title  = document.getElementById("bmTitle").innerText;
      const author = document.getElementById("bmAuthor").innerText;
      const img    = document.getElementById("bmImage").src;
      const date   = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
      
      let category = window.location.pathname.split("/").pop().replace(".html", "");
      if (category === "" || category === "home") category = "home";

      const entrega = new Date();
      entrega.setDate(entrega.getDate() + 30);

      const reserva = { title, author, img, date, entrega: entrega.toLocaleDateString('es-ES'), status: "Activa", category };
      const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
      reservas.push(reserva);
      localStorage.setItem("reservas", JSON.stringify(reservas));

      document.getElementById("bookModal").classList.add("hidden");
      document.body.style.overflow = "auto";

      const toast = document.createElement("div");
      toast.className = "fixed bottom-6 right-6 bg-indigo-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-fadeIn";
      toast.textContent = `✅ "${title}" ha sido reservado.`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);

      updateNotifications();
    }
  });
} catch (err) {
  console.warn("⚠️ Error al reservar libro:", err.message);
}


/* ===========================================================
   POPUP DE NOTIFICACIONES
   =========================================================== */
try {
  let currentPage = window.location.pathname.split("/").pop().replace(".html", "");
  if (currentPage === "" || currentPage === "home") currentPage = "home";

  const notifBtn     = document.getElementById('notifBtn');
  const notifPopup   = document.getElementById('notifPopup');
  const notifContent = document.getElementById('notifContent');
  const notifBadge   = document.getElementById('notifBadge');

  function updateNotifications() {
    if (!notifContent || !notifBadge) return;
    const allReservas = JSON.parse(localStorage.getItem("reservas")) || [];
    const reservasFiltradas = currentPage === "home"
      ? allReservas
      : allReservas.filter(r => r.category === currentPage);

    if (reservasFiltradas.length) {
      notifBadge.classList.remove('hidden');
      notifBadge.textContent = reservasFiltradas.length;
      const ultima = reservasFiltradas.at(-1);
      notifContent.innerHTML = `
        <p>📚 Tienes <b>${reservasFiltradas.length}</b> libros activos</p>
        <p>✨ Último: <b>${ultima.title}</b></p>
      `;
    } else {
      notifBadge.classList.add('hidden');
      notifContent.innerHTML = `<p class="text-gray-500">No tienes reservas en esta categoría</p>`;
    }
  }

  notifBtn?.addEventListener('click', () => notifPopup?.classList.toggle('hidden'));
  document.addEventListener('click', e => {
    if (!notifBtn?.contains(e.target) && !notifPopup?.contains(e.target))
      notifPopup?.classList.add('hidden');
  });

  updateNotifications();
} catch (err) {
  console.warn("⚠️ Error en popup de notificaciones:", err.message);
}
