// ===== Product data =====
const products = [
  { id: 1, name: "UltraBook Pro 14", category: "laptops", price: 54999, icon: "💻" },
  { id: 2, name: "GameForce X17", category: "laptops", price: 79999, icon: "🖥️" },
  { id: 3, name: "FoldBook Air 13", category: "laptops", price: 49999, icon: "💻" },
  { id: 4, name: "Pixel Nova 8", category: "phones", price: 32999, icon: "📱" },
  { id: 5, name: "Galaxy Edge S", category: "phones", price: 45999, icon: "📱" },
  { id: 6, name: "Redmi Note Lite", category: "phones", price: 12499, icon: "📱" },
  { id: 7, name: "SoundWave Headphones", category: "accessories", price: 3499, icon: "🎧" },
  { id: 8, name: "Mechanical Keyboard", category: "accessories", price: 4299, icon: "⌨️" },
  { id: 9, name: "Wireless Mouse M2", category: "accessories", price: 1299, icon: "🖱️" }
];

const productGrid = document.getElementById("productGrid");
const resultCount = document.getElementById("resultCount");
const filterButtons = document.querySelectorAll(".filter-btn");
const contactForm = document.getElementById("contactForm");

// ===== Display products =====
function displayProducts(list) {
  productGrid.innerHTML = "";

  if (list.length === 0) {
    productGrid.innerHTML = `<p class="empty">No products found.</p>`;
    resultCount.textContent = "0 items";
    return;
  }

  list.forEach((product) => {
    const card = document.createElement("article");
    card.className = `product-card ${product.category}`;

    card.innerHTML = `
      <div class="product-img">${product.icon}</div>
      <span class="product-category">${product.category}</span>
      <h3 class="product-name">${product.name}</h3>
      <div class="product-bottom">
        <span class="product-price">₱${product.price.toLocaleString()}</span>
        <button class="add-btn" data-id="${product.id}">Add</button>
      </div>
    `;

    productGrid.appendChild(card);
  });

  resultCount.textContent = `${list.length} ${list.length === 1 ? "item" : "items"}`;
}

// ===== Filter products =====
function filterProducts(category) {
  if (category === "all") {
    displayProducts(products);
    return;
  }

  const filtered = products.filter((product) => product.category === category);
  displayProducts(filtered);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    filterProducts(button.dataset.category);
  });
});

// small feedback when "Add" is clicked (event delegation since cards are re-rendered)
productGrid.addEventListener("click", (e) => {
  if (!e.target.classList.contains("add-btn")) return;

  const btn = e.target;
  btn.textContent = "Added ✓";
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = "Add";
    btn.disabled = false;
  }, 1500);
});

// ===== Form validation =====
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (name.length < 3) {
    alert("Name must be at least 3 characters.");
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    alert('Please enter a valid email (must contain "@" and ".").');
    return;
  }

  if (message.length < 10) {
    alert("Message must be at least 10 characters.");
    return;
  }

  sendMessage({ name, email, message });
});

// ===== Fetch API =====
// JSONPlaceholder is a free fake API, it just returns the data we send.
// Used here to practice POST requests since GitHub Pages has no backend.
function sendMessage(data) {
  const submitBtn = contactForm.querySelector("button");
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then((res) => {
      if (!res.ok) throw new Error("Request failed: " + res.status);
      return res.json();
    })
    .then((result) => {
      console.log("Sent:", result);
      alert(`Thanks ${data.name}! Your message was sent successfully.`);
      contactForm.reset();
    })
    .catch((err) => {
      console.error(err);
      alert("Something went wrong. Please try again later.");
    })
    .finally(() => {
      submitBtn.textContent = "Send message";
      submitBtn.disabled = false;
    });
}

// ===== Start =====
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("productTotal").textContent = products.length;
displayProducts(products);
