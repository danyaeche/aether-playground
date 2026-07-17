const pizzas = {
  neapolitan: {
    number: "01",
    name: "Neapolitan",
    origin: "Naples, Italy · Born 1889",
    description:
      "The benchmark for minimal, expressive pizza. A long-fermented dough is stretched by hand, dressed sparingly, and transformed in a fiercely hot oven before the center loses its tenderness.",
    crust: "Soft, airy & charred",
    bake: "60–90 seconds",
    pairing: "Sparkling water",
  },
  roman: {
    number: "02",
    name: "Roman Tonda",
    origin: "Rome, Italy · Pizza romana",
    description:
      "Rolled thin and baked until its entire surface is crisp, tonda romana is made for sharing. The rigid base carries bold, salty toppings without surrendering its satisfying snap.",
    crust: "Thin & crackly",
    bake: "3–4 minutes",
    pairing: "Cold lager",
  },
  newyork: {
    number: "03",
    name: "New York",
    origin: "New York, USA · Since 1905",
    description:
      "A descendant of the Neapolitan pie, enlarged for the American city. Its sturdy but pliable base is built to fold lengthwise, keeping every drop of cheese and tomato in place.",
    crust: "Crisp-chewy",
    bake: "8–12 minutes",
    pairing: "Root beer",
  },
  sicilian: {
    number: "04",
    name: "Sicilian",
    origin: "Palermo, Italy · Sfincione",
    description:
      "Its name means thick sponge, a clue to the tender, bread-like crumb beneath the sauce. Traditional versions layer onion, anchovy, herbs, and hard cheese rather than mozzarella.",
    crust: "Plush & golden",
    bake: "12–15 minutes",
    pairing: "Nero d’Avola",
  },
  detroit: {
    number: "05",
    name: "Detroit",
    origin: "Detroit, USA · Motor City",
    description:
      "Baked in a blue-steel pan inspired by the auto industry, this rectangular pie turns Wisconsin brick cheese into its signature: a dark, lacy, caramelized frico perimeter.",
    crust: "Airy with frico",
    bake: "12–15 minutes",
    pairing: "Pale ale",
  },
  chicago: {
    number: "06",
    name: "Deep Dish",
    origin: "Chicago, USA · Since 1943",
    description:
      "More savory pie than flatbread, Chicago deep dish uses a rich, buttery dough to form high walls. Cheese goes in first to protect the crust, followed by fillings and bright tomato.",
    crust: "Buttery & tall",
    bake: "30–40 minutes",
    pairing: "Italian red",
  },
  apizza: {
    number: "07",
    name: "New Haven Apizza",
    origin: "New Haven, USA · Coal fired",
    description:
      "Pronounced ah-BEETS, this Connecticut icon prizes char over symmetry. Coal-fired ovens create a smoky, chewy shell; the classic tomato pie needs only sauce, oregano, and pecorino.",
    crust: "Smoky & chewy",
    bake: "5–7 minutes",
    pairing: "Birch beer",
  },
  barese: {
    number: "08",
    name: "Focaccia Barese",
    origin: "Bari, Italy · Pugliese classic",
    description:
      "Potato in the dough gives this Pugliese specialty its tender center, while a well-oiled pan creates a fried, deeply golden base. Cherry tomatoes and olives settle into its dimples.",
    crust: "Dimpled & crisp",
    bake: "18–25 minutes",
    pairing: "Primitivo",
  },
};

const filterButtons = [...document.querySelectorAll("[data-filter]")];
const cards = [...document.querySelectorAll("[data-category]")];
const resultCount = document.querySelector("[data-result-count]");
const dialog = document.querySelector("[data-dialog]");
const closeDialogButton = document.querySelector("[data-dialog-close]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    const visibleCards = cards.filter(
      (card) => filter === "all" || card.dataset.category === filter,
    );

    filterButtons.forEach((item) => {
      const isCurrent = item === button;
      item.classList.toggle("is-active", isCurrent);
      item.setAttribute("aria-pressed", String(isCurrent));
    });

    cards.forEach((card) => card.classList.add("is-hiding"));

    window.setTimeout(() => {
      cards.forEach((card) => {
        card.hidden = !visibleCards.includes(card);
        card.classList.remove("is-hiding");
      });

      resultCount.textContent =
        filter === "all"
          ? "Showing all 8 pizza styles"
          : `Showing ${visibleCards.length} pizza ${visibleCards.length === 1 ? "style" : "styles"}`;
    }, 180);
  });
});

const setDialogContent = (pizza) => {
  dialog.querySelector("[data-dialog-number]").textContent = pizza.number;
  dialog.querySelector("[data-dialog-title]").textContent = pizza.name;
  dialog.querySelector("[data-dialog-origin]").textContent = pizza.origin;
  dialog.querySelector("[data-dialog-description]").textContent = pizza.description;
  dialog.querySelector("[data-dialog-crust]").textContent = pizza.crust;
  dialog.querySelector("[data-dialog-bake]").textContent = pizza.bake;
  dialog.querySelector("[data-dialog-pairing]").textContent = pizza.pairing;
};

document.querySelectorAll("[data-pizza]").forEach((button) => {
  button.addEventListener("click", () => {
    setDialogContent(pizzas[button.dataset.pizza]);
    dialog.showModal();
  });
});

closeDialogButton.addEventListener("click", () => dialog.close());

dialog.addEventListener("click", (event) => {
  const bounds = dialog.getBoundingClientRect();
  const clickedOutside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;

  if (clickedOutside) dialog.close();
});
