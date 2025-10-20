document.addEventListener("DOMContentLoaded", () => {
  // ====== CART FUNCTIONALITY ======
  const menuCards = document.querySelectorAll("#menu .card");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const clearCartBtn = document.getElementById("clearCartBtn");

  let cart = {};

  // Add click event to menu items
  menuCards.forEach(card => {
    card.addEventListener("click", () => {
      const title = card.querySelector(".card-title").textContent;
      const priceText = card.querySelector("p:last-of-type").textContent;
      const price = parseFloat(priceText.replace('$', ''));

      addToCart(title, price);
    });
  });

  function addToCart(title, price) {
    if (cart[title]) {
      cart[title].quantity += 1;
    } else {
      cart[title] = { price, quantity: 1 };
    }
    renderCart();
  }

  function renderCart() {
    cartItems.innerHTML = "";
    let total = 0;

    for (const [title, item] of Object.entries(cart)) {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";

      li.innerHTML = `
        <div>
          <strong>${title}</strong>
          <span class="text-muted">x${item.quantity}</span>
        </div>
        <div>
          <span class="badge bg-warning text-dark rounded-pill me-2">
            $${(item.price * item.quantity).toFixed(2)}
          </span>
          <button class="btn btn-sm btn-outline-danger remove-btn" data-title="${title}">&times;</button>
        </div>
      `;

      cartItems.appendChild(li);
      total += item.price * item.quantity;
    }

    cartTotal.textContent = total.toFixed(2);
    attachRemoveListeners();
  }

  function attachRemoveListeners() {
    const removeButtons = document.querySelectorAll(".remove-btn");
    removeButtons.forEach(button => {
      button.addEventListener("click", (e) => {
        const title = e.target.getAttribute("data-title");
        delete cart[title];
        renderCart();
      });
    });
  }

  clearCartBtn.addEventListener("click", () => {
    if (Object.keys(cart).length === 0) {
      alert("Cart is already empty.");
      return;
    }

    if (confirm("Are you sure you want to clear your cart?")) {
      cart = {};
      renderCart();
    }
  });

  // ====== CONTACT FORM FUNCTIONALITY ======
  const contactForm = document.getElementById("contactForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const formFeedback = document.getElementById("formFeedback");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Clear previous feedback
    formFeedback.innerHTML = "";

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
      showFeedback("Please fill out all fields.", "danger");
      return;
    }

    if (!validateEmail(email)) {
      showFeedback("Please enter a valid email address.", "danger");
      return;
    }

    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify({ name, email, message }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });

      if (response.ok) {
        showFeedback("Your message has been sent successfully!", "success");
        contactForm.reset();
      } else {
        throw new Error("Failed to send message.");
      }
    } catch (error) {
      console.error(error);
      showFeedback("An error occurred. Please try again later.", "danger");
    }
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showFeedback(message, type = "success") {
    formFeedback.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
  }
});


// ===== LOGIN SESSION =====
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
  const loginForm = document.getElementById("loginForm");
  const loginNameInput = document.getElementById("loginName");

  function updateLoginUI() {
    const user = JSON.parse(localStorage.getItem("userSession"));
    if (user) {
      loginBtn.textContent = `Logout (${user.name})`;
    } else {
      loginBtn.textContent = "Login";
    }
  }

  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("userSession"));

    if (user) {
      // User is logged in — log them out
      if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("userSession");
        updateLoginUI();
      }
    } else {
      // Show login modal
      loginModal.show();
    }
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("loginName").value.trim();
    const email = document.getElementById("loginEmail").value.trim();

    if (name && email) {
      localStorage.setItem("userSession", JSON.stringify({ name, email }));
      updateLoginUI();
      loginModal.hide();
      loginForm.reset();
    }
  });

  updateLoginUI();
});
