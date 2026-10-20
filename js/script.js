
const slides = document.querySelectorAll(".background-slide");
const thumbnails = document.querySelectorAll(".thumbnail");
const currentSlideText = document.getElementById("current-slide");

let currentIndex = 0;
let slideInterval;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
    });

    thumbnails.forEach((thumbnail, i) => {
        thumbnail.classList.toggle("active", i === index);
    });

    currentSlideText.textContent = String(index + 1).padStart(2, "0");

    currentIndex = index;
}

function startSlideshow() {
    clearInterval(slideInterval);

    slideInterval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % slides.length;
        showSlide(nextIndex);
    }, 6000);
}

thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
        const index = Number(thumbnail.dataset.slide);

        showSlide(index);
        startSlideshow();
    });
});

showSlide(0);
startSlideshow();



/* =========================
   PRODUCT FILTERS
========================= */

const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedCategory = button.dataset.filter;

        filterButtons.forEach((item) => {
            item.classList.toggle("active", item === button);
        });

        productCards.forEach((card) => {
            const matches =
                selectedCategory === "all" ||
                card.dataset.category === selectedCategory;

            card.hidden = !matches;
        });
    });
});

/* =========================
   SHOPPING CART
========================= */

const cart = [];

const cartModal = document.getElementById("cart-modal");
const openCartButton = document.getElementById("open-cart");
const closeCartButton = document.getElementById("close-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout-btn");

const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(price);

function openCart() {
    cartModal.classList.add("open");
    cartModal.setAttribute("aria-hidden", "false");
    closeCartButton.focus();
}

function closeCart() {
    cartModal.classList.remove("open");
    cartModal.setAttribute("aria-hidden", "true");
    openCartButton.focus();
}

openCartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);

cartModal.addEventListener("click", (event) => {
    if (event.target === cartModal) {
        closeCart();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && cartModal.classList.contains("open")) {
        closeCart();
    }
});

/* Add products to cart */

document.querySelectorAll(".add-cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        if (!name || !Number.isFinite(price) || price < 0) {
            return;
        }

        const existingItem = cart.find((item) => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name,
                price,
                quantity: 1
            });
        }

        renderCart();

        button.innerHTML = '<i class="bi bi-check2"></i> Added';
        window.setTimeout(() => {
            button.innerHTML =
                '<i class="bi bi-bag-plus"></i> Add to Cart';
        }, 1000);
    });
});

/* Display cart items and total */

function renderCart() {
    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = formatPrice(totalPrice);
    checkoutButton.disabled = cart.length === 0;

    if (cart.length === 0) {
        cartItemsContainer.textContent = "Your cart is empty.";
        return;
    }

    cartItemsContainer.replaceChildren();

    cart.forEach((item) => {
        const row = document.createElement("div");
        row.className = "cart-item";

        const details = document.createElement("div");

        const name = document.createElement("h3");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent = formatPrice(item.price * item.quantity);

        const actions = document.createElement("div");
        actions.className = "cart-item-actions";

        const decrease = document.createElement("button");
        decrease.textContent = "−";
        decrease.setAttribute("aria-label", `Decrease ${item.name}`);

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const increase = document.createElement("button");
        increase.textContent = "+";
        increase.setAttribute("aria-label", `Increase ${item.name}`);

        decrease.addEventListener("click", () => {
            item.quantity -= 1;

            if (item.quantity <= 0) {
                cart.splice(cart.indexOf(item), 1);
            }

            renderCart();
        });

        increase.addEventListener("click", () => {
            item.quantity += 1;
            renderCart();
        });

        actions.append(decrease, quantity, increase);
        details.append(name, price, actions);

        const remove = document.createElement("button");
        remove.className = "remove-item";
        remove.textContent = "Remove";

        remove.addEventListener("click", () => {
            cart.splice(cart.indexOf(item), 1);
            renderCart();
        });

        row.append(details, remove);
        cartItemsContainer.append(row);
    });
}

/* Checkout placeholder */

checkoutButton.addEventListener("click", () => {
    alert(
        "Your cart is ready! Online checkout and payment need to be connected."
    );
});

renderCart();
