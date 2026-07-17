const PIZZA_CATALOG = [
  {
    id: "margherita",
    name: "Margherita",
    origin: "Napoli",
    category: "classic",
    description: "San Marzano tomato, fior di latte, basil, and extra-virgin olive oil.",
    price: 15,
    accent: "#d94b2b",
    toppings: "basil",
    badge: "Most loved",
  },
  {
    id: "pepperoni",
    name: "Hot Pepperoni",
    origin: "New York",
    category: "classic",
    description: "Cup-and-char pepperoni, mozzarella, tomato, pecorino, and hot honey.",
    price: 18,
    accent: "#b83225",
    toppings: "pepperoni",
    badge: "Crowd favorite",
  },
  {
    id: "mortadella",
    name: "Mortadella & Pistachio",
    origin: "Bologna",
    category: "signature",
    description: "Fior di latte, mortadella, pistachio pesto, stracciatella, and lemon zest.",
    price: 21,
    accent: "#c8936a",
    toppings: "pistachio",
    badge: "Forno signature",
  },
  {
    id: "funghi",
    name: "Wild Funghi",
    origin: "The forest",
    category: "vegetarian",
    description: "Roasted mushrooms, taleggio, thyme, garlic confit, and black pepper.",
    price: 19,
    accent: "#9a7454",
    toppings: "mushroom",
    badge: "Vegetarian",
  },
  {
    id: "diavola",
    name: "Diavola",
    origin: "Calabria",
    category: "signature",
    description: "Spicy soppressata, tomato, fior di latte, Calabrian chile, and oregano.",
    price: 20,
    accent: "#a72f23",
    toppings: "diavola",
    badge: "Fiery",
  },
  {
    id: "patata",
    name: "Patata Bianca",
    origin: "Rome",
    category: "white",
    description: "Paper-thin potato, smoked mozzarella, rosemary, sea salt, and olive oil.",
    price: 17,
    accent: "#d7b260",
    toppings: "potato",
    badge: "No tomato",
  },
  {
    id: "prosciutto",
    name: "Prosciutto & Rucola",
    origin: "Parma",
    category: "classic",
    description: "Tomato, fior di latte, prosciutto di Parma, arugula, and aged balsamic.",
    price: 21,
    accent: "#c96354",
    toppings: "prosciutto",
    badge: "Finished fresh",
  },
  {
    id: "four-cheese",
    name: "Quattro Formaggi",
    origin: "Lombardy",
    category: "white",
    description: "Fior di latte, gorgonzola, taleggio, pecorino, and a touch of wildflower honey.",
    price: 20,
    accent: "#dfbf6e",
    toppings: "cheese",
    badge: "Cheese lover",
  },
  {
    id: "garden",
    name: "The Garden",
    origin: "Market daily",
    category: "vegetarian",
    description: "Zucchini, roasted pepper, artichoke, olive, tomato, basil, and mozzarella.",
    price: 18,
    accent: "#78905b",
    toppings: "garden",
    badge: "Vegetarian",
  },
  {
    id: "sausage",
    name: "Fennel Sausage",
    origin: "Tuscany",
    category: "signature",
    description: "House fennel sausage, caramelized onion, roasted pepper, mozzarella, and chile.",
    price: 20,
    accent: "#b75b35",
    toppings: "sausage",
    badge: "House made",
  },
  {
    id: "marinara",
    name: "Marinara",
    origin: "Napoli",
    category: "vegetarian",
    description: "San Marzano tomato, sliced garlic, oregano, basil, and extra-virgin olive oil.",
    price: 13,
    accent: "#c7432e",
    toppings: "marinara",
    badge: "Vegan",
  },
  {
    id: "pear",
    name: "Pear & Gorgonzola",
    origin: "Forno original",
    category: "white",
    description: "Roasted pear, gorgonzola dolce, mozzarella, walnut, radicchio, and honey.",
    price: 20,
    accent: "#a58654",
    toppings: "pear",
    badge: "Sweet & savory",
  },
];

const STORAGE_KEY = "forno-cart-v1";
const SIZE_UPCHARGE = { "12-inch": 0, "16-inch": 5 };

const getCart = () => {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const saveCart = (cart) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent("forno:cart-updated", { detail: cart }));
};

const getPizza = (id) => PIZZA_CATALOG.find((pizza) => pizza.id === id);

const getItemPrice = (item) => {
  const pizza = getPizza(item.id);
  return pizza ? pizza.price + (SIZE_UPCHARGE[item.size] || 0) : 0;
};

const addItem = (id, size = "12-inch") => {
  const cart = getCart();
  const existing = cart.find((item) => item.id === id && item.size === size);

  if (existing) existing.quantity += 1;
  else cart.push({ id, size, quantity: 1 });

  saveCart(cart);
  return cart;
};

const updateQuantity = (id, size, quantity) => {
  const cart = getCart();
  const item = cart.find((entry) => entry.id === id && entry.size === size);

  if (item) item.quantity = Math.max(0, Number(quantity) || 0);
  saveCart(cart.filter((entry) => entry.quantity > 0));
};

const removeItem = (id, size) => {
  saveCart(getCart().filter((item) => !(item.id === id && item.size === size)));
};

const clearCart = () => saveCart([]);
const getCount = () => getCart().reduce((total, item) => total + item.quantity, 0);
const formatPrice = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

window.FornoStore = {
  catalog: PIZZA_CATALOG,
  addItem,
  clearCart,
  formatPrice,
  getCart,
  getCount,
  getItemPrice,
  getPizza,
  removeItem,
  updateQuantity,
};
