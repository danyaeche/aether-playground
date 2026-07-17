const menuGrid = document.querySelector("[data-menu-grid]");
const menuFilters = [...document.querySelectorAll("[data-menu-filter]")];
const menuSearch = document.querySelector("[data-menu-search]");
const menuPagination = document.querySelector("[data-menu-pagination]");
const menuResultCount = document.querySelector("[data-menu-result-count]");
const menuToast = document.querySelector("[data-toast]");
const ITEMS_PER_PAGE = 6;

let activeCategory = "all";
let searchTerm = "";
let currentPage = 1;

const pizzaArtwork = (pizza) => `
  <div class="menu-pizza-art art-${pizza.toppings}" style="--pizza-accent:${pizza.accent}" aria-hidden="true">
    <div class="menu-pie"><i></i><i></i><i></i><i></i><i></i><i></i></div>
    <span>${pizza.origin}</span>
  </div>`;

const cardTemplate = (pizza, index) => `
  <article class="order-card" style="--card-delay:${index * 45}ms">
    ${pizzaArtwork(pizza)}
    <div class="order-card-copy">
      <div class="order-card-topline">
        <span>${pizza.badge}</span>
        <span>from ${window.FornoStore.formatPrice(pizza.price)}</span>
      </div>
      <h2>${pizza.name}</h2>
      <p>${pizza.description}</p>
      <div class="order-controls">
        <label>
          <span class="sr-only">Choose size for ${pizza.name}</span>
          <select data-size-for="${pizza.id}" aria-label="Choose size for ${pizza.name}">
            <option value="12-inch">12” Regular</option>
            <option value="16-inch">16” Large · +$5</option>
          </select>
        </label>
        <button type="button" data-add-pizza="${pizza.id}">Add <span>＋</span></button>
      </div>
    </div>
  </article>`;

const getFilteredPizzas = () =>
  window.FornoStore.catalog.filter((pizza) => {
    const categoryMatch = activeCategory === "all" || pizza.category === activeCategory;
    const searchableText = `${pizza.name} ${pizza.origin} ${pizza.description}`.toLowerCase();
    return categoryMatch && searchableText.includes(searchTerm);
  });

const showToast = (pizza, size) => {
  menuToast.querySelector("strong").textContent = pizza.name;
  menuToast.querySelector("small").textContent = `${size.replace("-inch", " inch")} added to your cart`;
  menuToast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => menuToast.classList.remove("is-visible"), 3200);
};

const bindAddButtons = () => {
  menuGrid.querySelectorAll("[data-add-pizza]").forEach((button) => {
    button.addEventListener("click", () => {
      const pizza = window.FornoStore.getPizza(button.dataset.addPizza);
      const size = menuGrid.querySelector(`[data-size-for="${pizza.id}"]`).value;
      window.FornoStore.addItem(pizza.id, size);
      showToast(pizza, size);
      button.classList.add("is-added");
      button.innerHTML = "Added <span>✓</span>";
      window.setTimeout(() => {
        button.classList.remove("is-added");
        button.innerHTML = "Add <span>＋</span>";
      }, 1300);
    });
  });
};

const renderPagination = (pageCount) => {
  if (pageCount <= 1) {
    menuPagination.innerHTML = "";
    return;
  }

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)
    .map(
      (page) => `<button type="button" data-page="${page}" class="${page === currentPage ? "is-active" : ""}" aria-label="Go to menu page ${page}" ${page === currentPage ? 'aria-current="page"' : ""}>${String(page).padStart(2, "0")}</button>`,
    )
    .join("");

  menuPagination.innerHTML = `
    <button type="button" data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""} aria-label="Previous menu page">← <span>Previous</span></button>
    <div>${pages}</div>
    <button type="button" data-page="${currentPage + 1}" ${currentPage === pageCount ? "disabled" : ""} aria-label="Next menu page"><span>Next</span> →</button>`;

  menuPagination.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => {
      currentPage = Number(button.dataset.page);
      renderMenu();
      document.querySelector(".menu-toolbar").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
};

const renderMenu = () => {
  const filtered = getFilteredPizzas();
  const pageCount = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  if (currentPage > pageCount) currentPage = pageCount;
  const firstIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visible = filtered.slice(firstIndex, firstIndex + ITEMS_PER_PAGE);

  menuGrid.innerHTML = visible.length
    ? visible.map(cardTemplate).join("")
    : `<div class="no-results"><span>○</span><h2>No pizzas found</h2><p>Try another search or category.</p></div>`;

  menuResultCount.textContent = `${filtered.length} ${filtered.length === 1 ? "pizza" : "pizzas"} · page ${currentPage} of ${pageCount}`;
  renderPagination(pageCount);
  bindAddButtons();
};

menuFilters.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.menuFilter;
    currentPage = 1;
    menuFilters.forEach((filter) => {
      const current = filter === button;
      filter.classList.toggle("is-active", current);
      filter.setAttribute("aria-pressed", String(current));
    });
    renderMenu();
  });
});

menuSearch.addEventListener("input", () => {
  searchTerm = menuSearch.value.trim().toLowerCase();
  currentPage = 1;
  renderMenu();
});

renderMenu();
