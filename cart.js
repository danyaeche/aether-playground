const cartList = document.querySelector("[data-cart-list]");
const emptyCart = document.querySelector("[data-empty-cart]");
const cartLayout = document.querySelector("[data-cart-layout]");
const cartSubtotal = document.querySelector("[data-cart-subtotal]");
const cartTax = document.querySelector("[data-cart-tax]");
const cartDelivery = document.querySelector("[data-cart-delivery]");
const cartTotal = document.querySelector("[data-cart-total]");
const checkoutForm = document.querySelector("[data-checkout-form]");
const checkoutButton = document.querySelector("[data-checkout-button]");
const fulfillmentInputs = [...document.querySelectorAll("[name='fulfillment']")];
const addressField = document.querySelector("[data-address-field]");
const orderSuccess = document.querySelector("[data-order-success]");

let fulfillment = "pickup";

const totals = () => {
  const subtotal = window.FornoStore.getCart().reduce(
    (sum, item) => sum + window.FornoStore.getItemPrice(item) * item.quantity,
    0,
  );
  const delivery = fulfillment === "delivery" ? 4 : 0;
  const tax = subtotal * 0.0825;
  return { subtotal, delivery, tax, total: subtotal + delivery + tax };
};

const itemTemplate = (item) => {
  const pizza = window.FornoStore.getPizza(item.id);
  if (!pizza) return "";
  const price = window.FornoStore.getItemPrice(item);
  return `
    <article class="cart-item">
      <div class="cart-item-art art-${pizza.toppings}" style="--pizza-accent:${pizza.accent}" aria-hidden="true">
        <div class="mini-pie"><i></i><i></i><i></i><i></i></div>
      </div>
      <div class="cart-item-info">
        <p>${pizza.origin} · ${item.size.replace("-inch", " inch")}</p>
        <h2>${pizza.name}</h2>
        <button type="button" class="remove-item" data-remove="${pizza.id}" data-size="${item.size}">Remove</button>
      </div>
      <div class="quantity-control" aria-label="Quantity for ${pizza.name}">
        <button type="button" data-quantity="${item.quantity - 1}" data-id="${pizza.id}" data-size="${item.size}" aria-label="Decrease ${pizza.name} quantity">−</button>
        <span>${item.quantity}</span>
        <button type="button" data-quantity="${item.quantity + 1}" data-id="${pizza.id}" data-size="${item.size}" aria-label="Increase ${pizza.name} quantity">＋</button>
      </div>
      <strong>${window.FornoStore.formatPrice(price * item.quantity)}</strong>
    </article>`;
};

const renderTotals = () => {
  const value = totals();
  cartSubtotal.textContent = window.FornoStore.formatPrice(value.subtotal);
  cartTax.textContent = window.FornoStore.formatPrice(value.tax);
  cartDelivery.textContent = value.delivery ? window.FornoStore.formatPrice(value.delivery) : "Free";
  cartTotal.textContent = window.FornoStore.formatPrice(value.total);
};

const bindCartControls = () => {
  cartList.querySelectorAll("[data-quantity]").forEach((button) => {
    button.addEventListener("click", () => {
      window.FornoStore.updateQuantity(button.dataset.id, button.dataset.size, button.dataset.quantity);
      renderCart();
    });
  });

  cartList.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      window.FornoStore.removeItem(button.dataset.remove, button.dataset.size);
      renderCart();
    });
  });
};

const renderCart = () => {
  const cart = window.FornoStore.getCart();
  const hasItems = cart.length > 0;
  emptyCart.hidden = hasItems;
  cartLayout.hidden = !hasItems;
  checkoutButton.disabled = !hasItems;
  cartList.innerHTML = cart.map(itemTemplate).join("");
  renderTotals();
  bindCartControls();
};

fulfillmentInputs.forEach((input) => {
  input.addEventListener("change", () => {
    fulfillment = input.value;
    const isDelivery = fulfillment === "delivery";
    addressField.hidden = !isDelivery;
    addressField.querySelector("input").required = isDelivery;
    renderTotals();
  });
});

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!checkoutForm.reportValidity() || window.FornoStore.getCount() === 0) return;

  const orderNumber = `FRN-${String(Date.now()).slice(-5)}`;
  orderSuccess.querySelector("[data-order-number]").textContent = orderNumber;
  orderSuccess.querySelector("[data-order-method]").textContent =
    fulfillment === "delivery" ? "We’ll bring it to your door." : "We’ll have it hot and ready for pickup.";
  window.FornoStore.clearCart();
  document.querySelector(".cart-page-main").hidden = true;
  orderSuccess.hidden = false;
  orderSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
});

renderCart();
