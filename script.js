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
   RESERVAR LIBRO (con límites)
   =========================================================== */
try {
  document.addEventListener("click", e => {
    const btn = e.target.closest(".btn-reservar");
    if (!btn) return;

    const title  = document.getElementById("bmTitle").innerText;
    const author = document.getElementById("bmAuthor").innerText;
    const img    = document.getElementById("bmImage").src;
    const isbn   = document.getElementById("bmISBN").innerText;
    const date   = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    let category = window.location.pathname.split("/").pop().replace(".html", "");
    if (category === "" || category === "home") category = "home";

    const entrega = new Date();
    entrega.setDate(entrega.getDate() + 30);

    let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

    // 🔒 Máximo 6 reservas en total
    if (reservas.length >= 6) {
      alert("⚠️ No puedes reservar más de 6 libros a la vez.");
      return;
    }

    // 🔒 Máximo 2 reservas del mismo libro
    const repeticiones = reservas.filter(r => r.title === title).length;
    if (repeticiones >= 1) {
      alert("⚠️ Ya reservaste este libro el máximo permitido.");
      return;
    }

    const reserva = { title, author, img, isbn, date, entrega: entrega.toLocaleDateString('es-ES'), status: "Activa", category };
    reservas.push(reserva);
    localStorage.setItem("reservas", JSON.stringify(reservas));

    document.getElementById("bookModal").classList.add("hidden");
    document.body.style.overflow = "auto";

    // 🟢 Toast visual (funciona también en mobile)
    const toast = document.createElement("div");
    toast.className = "fixed bottom-6 right-6 bg-indigo-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-fadeIn z-[9999]";
    toast.textContent = `✅ "${title}" ha sido reservado.`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);

    updateNotifications();
  });
} catch (err) {
  console.warn("⚠️ Error al reservar libro:", err.message);
}

/* ===========================================================
   POPUP DE NOTIFICACIONES (Desktop + Mobile)
   =========================================================== */
try {
  let currentPage = window.location.pathname.split("/").pop().replace(".html", "");
  if (currentPage === "" || currentPage === "home") currentPage = "home";

  const notifBtn        = document.getElementById('notifBtn');
  const notifPopup      = document.getElementById('notifPopup');
  const notifContent    = document.getElementById('notifContent');
  const notifBadge      = document.getElementById('notifBadge');
  const notifBtnMobile  = document.getElementById('notifBtnMobile');
  const notifBadgeMobile = document.getElementById('notifBadgeMobile');

  function getReservas() {
    return JSON.parse(localStorage.getItem("reservas")) || [];
  }

  // 🔄 Actualiza el contenido y los badges
  function updateNotifications() {
    const allReservas = getReservas();
    const reservasFiltradas = ["home", "reservas", "faqs"].includes(currentPage)
      ? allReservas
      : allReservas.filter(r => r.category === currentPage);

    const total = reservasFiltradas.length;

    // Actualiza badges (desktop y mobile)
    [notifBadge, notifBadgeMobile].forEach(badge => {
      if (!badge) return;
      if (total > 0) {
        badge.classList.remove("hidden");
        badge.textContent = total;
      } else {
        badge.classList.add("hidden");
      }
    });

    // Actualiza contenido desktop
    if (notifContent) {
      if (total > 0) {
        const ultima = reservasFiltradas.at(-1);
        notifContent.innerHTML = `
          <p>📚 Tienes <b>${total}</b> libros activos</p>
          <p>✨ Último: <b>${ultima.title}</b></p>
        `;
      } else {
        notifContent.innerHTML = `<p class="text-gray-500">No tienes reservas en esta categoría</p>`;
      }
    }
  }

  // 🖥️ Desktop: abre/cierra popup
  notifBtn?.addEventListener("click", () => notifPopup?.classList.toggle("hidden"));
  document.addEventListener("click", e => {
    if (!notifBtn?.contains(e.target) && !notifPopup?.contains(e.target)) {
      notifPopup?.classList.add("hidden");
    }
  });

  // 📱 Mobile: abre modal con resumen
  notifBtnMobile?.addEventListener("click", () => {
    const reservas = getReservas();
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]";

    const popup = document.createElement("div");
    popup.className = "bg-white w-80 max-w-[90%] rounded-xl p-5 shadow-xl text-sm text-gray-800";
    popup.innerHTML = `
      <div class="flex justify-between items-center mb-3">
        <h2 class="font-semibold text-lg">Notificaciones</h2>
        <button class="text-gray-500 hover:text-black text-lg font-bold">&times;</button>
      </div>
      ${
        reservas.length
          ? `<p>📚 Tienes <b>${reservas.length}</b> libros activos.</p>
             <p class="mt-1 text-gray-700">✨ Último: <b>${reservas.at(-1).title}</b></p>`
          : `<p class="text-gray-500 text-center">No tienes reservas activas</p>`
      }
    `;
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    popup.querySelector("button").addEventListener("click", () => overlay.remove());
    overlay.addEventListener("click", e => { if (e.target === overlay) overlay.remove(); });
  });

  updateNotifications();
  window.updateNotifications = updateNotifications;
} catch (err) {
  console.warn("⚠️ Error en popup de notificaciones:", err.message);
}
