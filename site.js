const sharedHeader = document.querySelector("[data-header]");
const sharedMenuToggle = document.querySelector("[data-menu-toggle]");
const sharedNav = document.querySelector("[data-nav]");

const updateCartBadges = () => {
  const count = window.FornoStore?.getCount() || 0;
  document.querySelectorAll("[data-cart-count]").forEach((badge) => {
    badge.textContent = count;
    badge.setAttribute("aria-label", `${count} ${count === 1 ? "item" : "items"} in cart`);
  });
};

const updateSharedHeader = () => {
  if (!sharedHeader) return;
  sharedHeader.classList.toggle(
    "is-scrolled",
    window.scrollY > 30 || document.body.classList.contains("interior-page"),
  );
};

const closeSharedMenu = () => {
  if (!sharedMenuToggle || !sharedNav) return;
  sharedMenuToggle.setAttribute("aria-expanded", "false");
  sharedNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

if (sharedMenuToggle && sharedNav) {
  sharedMenuToggle.addEventListener("click", () => {
    const isOpen = sharedMenuToggle.getAttribute("aria-expanded") === "true";
    sharedMenuToggle.setAttribute("aria-expanded", String(!isOpen));
    sharedNav.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  sharedNav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", closeSharedMenu),
  );
}

window.addEventListener("scroll", updateSharedHeader, { passive: true });
window.addEventListener("forno:cart-updated", updateCartBadges);
window.addEventListener("storage", updateCartBadges);
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeSharedMenu();
});

updateSharedHeader();
updateCartBadges();
