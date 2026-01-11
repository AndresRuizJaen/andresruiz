const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* Año footer */
const yearEl = $("#year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* Menú móvil */
const navToggle = $("#navToggle");
const navMenu = $("#navMenu");

navToggle?.addEventListener("click", () => {
  const open = navMenu.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
});

/* Cerrar menú al hacer click en un enlace */
$$(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    navMenu?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

/* Estado activo en el menú según scroll */
const sections = ["inicio", "visualizaciones", "servicios", "acerca"]
  .map(id => document.getElementById(id))
  .filter(Boolean);

const linksById = new Map(
  $$(".nav-link").map(a => [a.getAttribute("href")?.replace("#", ""), a])
);

function setActive(id) {
  $$(".nav-link").forEach(a => a.classList.remove("is-active"));
  const link = linksById.get(id);
  if (link) link.classList.add("is-active");
}

if ("IntersectionObserver" in window && sections.length) {
  const io = new IntersectionObserver((entries) => {
    // Elegimos la sección con mayor intersección visible
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible?.target?.id) setActive(visible.target.id);
  }, {
    root: null,
    threshold: [0.35, 0.5, 0.65]
  });

  sections.forEach(sec => io.observe(sec));
} else {
  // Fallback simple
  window.addEventListener("scroll", () => {
    let current = "inicio";
    for (const sec of sections) {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 160) current = sec.id;
    }
    setActive(current);
  }, { passive: true });
}

/* Activo por defecto */
setActive("inicio");

