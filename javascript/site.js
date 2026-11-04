// Shared behaviour for every page: mobile nav toggle + footer year.
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
