/* =========================================
   TechNest Product Catalog - script.js
   ========================================= */

// ---------- Products Data ----------
const products = [
  { id: 1, name: "UltraBook Pro 14", category: "laptops", price: 54999, icon: "💻" },
  { id: 2, name: "GameForce X17", category: "laptops", price: 79999, icon: "🖥️" },
  { id: 3, name: "Pixel Nova 8", category: "phones", price: 32999, icon: "📱" },
  { id: 4, name: "Galaxy Edge S", category: "phones", price: 45999, icon: "📲" },
  { id: 5, name: "SoundWave Earbuds", category: "accessories", price: 3499, icon: "🎧" },
  { id: 6, name: "Mechanical Keyboard RGB", category: "accessories", price: 4299, icon: "⌨️" },
  { id: 7, name: "Wireless Mouse M2", category: "accessories", price: 1299, icon: "🖱️" },
  { id: 8, name: "FoldBook Air 13", category: "laptops", price: 49999, icon: "💻" },
  { id: 9, name: "Redmi Note Lite", category: "phones", price: 12499, icon: "📱" }
];

// ---------- DOM Elements ----------
const productGrid = document.getElementById("productGrid");
const resultCount = document.getElementById("resultCount");
const filterButtons = document.querySelectorAll(".filter-btn");
const contactForm = document.getElementById("contactForm");

// Format numbers as Philippine Peso, e.g. 54999 -> ₱54,999.00
function formatPrice(price) {
  return "₱" + price.toLocaleString("en-PH", { minimumFractionDigits: 2 });
}

// ---------- Display Function ----------
// Renders the given list of products inside #productGrid
function displayProducts(productList) {
  productGrid.innerHTML = "";

  if (productList.length === 0) {
    productGrid.innerHTML = '<p class="empty-message">No products found in this category.</p>';
    resultCount.textContent = "";
    return;
  }

  productList.forEach(function (product) {
    const card = document.createElement("article");
    card.classList.add("product-card");
    card.dataset.id = product.id;

    card.innerHTML = `
      <div class="product-icon" aria-hidden="true">${product.icon}</div>
      <span class="product-category">${product.category}</span>
      <h3 class="product-name">${product.name}</h3>
      <p class="product-price">${formatPrice(product.price)}</p>
    `;

    productGrid.appendChild(card);
  });

  const label = productList.length === 1 ? "product" : "products";
  resultCount.textContent = `Showing ${productList.length} ${label}`;
}

// ---------- Filter Function ----------
// Filters products by category ("all" shows everything)
function filterProducts(category) {
  if (category === "all") {
    displayProducts(products);
  } else {
    const filtered = products.filter(function (product) {
      return product.category === category;
    });
    displayProducts(filtered);
  }
}

// Attach click events to each filter button
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    // highlight the clicked button
    filterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });
    button.classList.add("active");

    filterProducts(button.dataset.category);
  });
});

// ---------- Form Validation ----------
function validateForm(name, email, message) {
  const errors = [];

  if (name.length < 3) {
    errors.push("Name must be at least 3 characters.");
  }

  if (!email.includes("@") || !email.includes(".")) {
    errors.push('Email must contain "@" and ".".');
  }

  if (message.length < 10) {
    errors.push("Message must be at least 10 characters.");
  }

  return errors;
}

contactForm.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  const errors = validateForm(name, email, message);

  if (errors.length > 0) {
    alert("Please fix the following:\n\n- " + errors.join("\n- "));
    return;
  }

  sendMessage({ name: name, email: email, message: message });
});

// ---------- Fetch API ----------
// Sends the form data to a free fake REST API (JSONPlaceholder).
// It doesn't actually save anything but returns a real response,
// which is enough to demo a POST request on a static GitHub Pages site.
function sendMessage(formData) {
  const submitBtn = contactForm.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Server responded with status " + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      console.log("Message sent:", data);
      alert(`Thank you, ${formData.name}! Your message has been sent successfully.`);
      contactForm.reset();
    })
    .catch(function (error) {
      console.error("Fetch error:", error);
      alert("Sorry, your message could not be sent right now. Please try again later.");
    })
    .finally(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    });
}

// ---------- Initialize ----------
document.getElementById("year").textContent = new Date().getFullYear();
displayProducts(products);
