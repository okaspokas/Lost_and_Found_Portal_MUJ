let items = [];
let currentFilter = "all";
let currentCategory = "all";
let currentSort = "recent";

document.addEventListener("DOMContentLoaded", async function () {
  await loadItems();
  await checkServer();
  renderItems();
  setupEventListeners();
  document.getElementById("item-date").valueAsDate = new Date();
});


async function checkServer() {
  const statusDiv = document.getElementById("server-status");
  try {
    const res = await fetch("http://localhost:3000/items");
    if (res.ok) {
      statusDiv.textContent = "✅ Server Connected";
      statusDiv.style.background = "#d4edda";
      statusDiv.style.color = "#155724";
      statusDiv.style.padding = "8px";
      statusDiv.style.textAlign = "center";
      statusDiv.style.fontWeight = "bold";
    } else {
      throw new Error("Bad response");
    }
  } catch {
    statusDiv.textContent = "❌ Server Offline – showing local data only";
    statusDiv.style.background = "#ffe0e0";
    statusDiv.style.color = "#cc0000";
    statusDiv.style.padding = "8px";
    statusDiv.style.textAlign = "center";
    statusDiv.style.fontWeight = "bold";
  }
}


async function loadItems() {
  const grid = document.getElementById("items-grid");
  grid.classList.add("loading");

  try {
    const res = await fetch("/items");
    items = await res.json();
  } catch {
    console.log("Backend not running, using sample data");
    // Sample data fallback
    items = [
      {
        id: 1,
        type: "lost",
        name: "AirPods Pro",
        category: "electronics",
        description: "Lost white AirPods Pro case near LHC stairs. Last seen yesterday evening.",
        location: "LHC",
        date: "2024-10-15",
        contact: "example@email.com",
        timestamp: Date.now() - 1000000
      },
      {
        id: 2,
        type: "found",
        name: "Black Backpack",
        category: "bags",
        description: "Found black North Face backpack at AB1 Block C entrance. Contains notebooks.",
        location: "AB1",
        date: "2024-10-16",
        contact: "founder@muj.ac.in",
        timestamp: Date.now()
      },
      {
        id: 3,
        type: "lost",
        name: "Student ID Card",
        category: "documents",
        description: "MUJ Student ID - Roll no. CS2023-XYZ. Lost near Dome Building.",
        location: "Dome Building",
        date: "2024-10-16",
        contact: "+91-9876543210",
        timestamp: Date.now() - 500000
      }
    ];
  } finally {
    grid.classList.remove("loading");
  }
}


async function addItem(itemOrFormData) {
  const submitBtn = document.querySelector("#report-form button[type='submit']");
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Submitting...";
  submitBtn.disabled = true;

  try {
    let res;
    if (itemOrFormData instanceof FormData) {
      res = await fetch("http://localhost:3000/items", {
        method: "POST",
        body: itemOrFormData  // No Content-Type for FormData
      });
    } else {
      res = await fetch("http://localhost:3000/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemOrFormData)
      });
    }

    const saved = await res.json();
    items.unshift(saved);
    renderItems();
  } catch (err) {
    console.error("Add item failed:", err);
    // Still add locally for offline
    const fallbackItem = itemOrFormData instanceof FormData 
      ? Object.fromEntries(itemOrFormData) 
      : itemOrFormData;
    items.unshift({ ...fallbackItem, id: Date.now() });
    renderItems();
  } finally {
    closeModal();
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

function setupEventListeners() {
  document.querySelectorAll(".tab").forEach(tab =>
    tab.addEventListener("click", e => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      e.target.classList.add("active");
      currentFilter = e.target.dataset.tab;
      renderItems();
    })
  );

  document.getElementById("category-filter").addEventListener("change", e => {
    currentCategory = e.target.value;
    renderItems();
  });

  document.getElementById("sort-filter").addEventListener("change", e => {
    currentSort = e.target.value;
    renderItems();
  });

  document.getElementById("search-input").addEventListener("input", e => {
    renderItems();
  });

  document.getElementById("report-lost-btn").onclick = () => openModal("lost");
  document.getElementById("report-found-btn").onclick = () => openModal("found");

  document.getElementById("modal-close").onclick = closeModal;
  document.getElementById("report-form").addEventListener("submit", handleFormSubmit);

  // Image preview
  document.getElementById("item-image").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const preview = document.createElement("img");
        preview.src = ev.target.result;
        preview.className = "image-preview";
        preview.style.maxWidth = "100%";
        preview.style.maxHeight = "200px";
        preview.style.borderRadius = "16px";
        preview.style.marginTop = "12px";
        preview.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";

        const container = document.querySelector(".form-group:has(#item-image)");
        let existingPreview = container.querySelector(".image-preview");
        if (existingPreview) existingPreview.remove();
        container.appendChild(preview);
      };
      reader.readAsDataURL(file);
    }
  });

  // Details modal events
  document.getElementById("details-close").onclick = () => document.getElementById("details-modal").classList.remove("active");
  document.getElementById("close-details").onclick = () => document.getElementById("details-modal").classList.remove("active");
  document.getElementById("copy-contact").onclick = copyContact;

  // Dark mode toggle
  const darkToggle = document.getElementById("dark-toggle");
  const html = document.documentElement;
  
  const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  html.setAttribute('data-theme', currentTheme);
  darkToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

  darkToggle.onclick = () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    darkToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  };

  // Match media changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      darkToggle.textContent = e.matches ? '☀️' : '🌙';
    }
  });
}


function handleFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData();
  const imageInput = document.getElementById("item-image");
  const imageFile = imageInput.files[0];

  const itemData = {
    type: document.getElementById("item-type").value,
    name: document.getElementById("item-name").value,
    category: document.getElementById("item-category").value,
    description: document.getElementById("item-description").value,
    location: document.getElementById("item-location").value,
    date: document.getElementById("item-date").value,
    contact: document.getElementById("item-contact").value,
    timestamp: Date.now()
  };

  // Add text fields to FormData
  Object.keys(itemData).forEach(key => {
    formData.append(key, itemData[key]);
  });

  if (imageFile) {
    formData.append("image", imageFile);
  }

  addItem(formData);
}


function renderItems() {
  const grid = document.getElementById("items-grid");
  const emptyState = document.getElementById("empty-state");
  const search = document.getElementById("search-input").value.toLowerCase();

  grid.innerHTML = "";

  let filtered = [...items];

 
  if (search) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search)
    );
  }

  
  if (currentFilter !== "all") {
    filtered = filtered.filter(item => item.type === currentFilter);
  }

  
  if (currentCategory !== "all") {
    filtered = filtered.filter(item => item.category === currentCategory);
  }

  
  if (currentSort === "recent") {
    filtered.sort((a, b) => b.timestamp - a.timestamp);
  } else {
    filtered.sort((a, b) => a.timestamp - b.timestamp);
  }

  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "item-card";

    const getCategoryIcon = (category) => {
      const icons = {
        electronics: '💻',
        accessories: '⌚',
        documents: '🆔',
        clothing: '👕',
        bags: '🎒',
        keys: '🔑',
        pets: '🐶',
        other: '❓'
      };
      return icons[category] || '❓';
    };

    card.innerHTML = `
      ${item.image ? `<img src="${item.image}" class="item-image" alt="${item.name}"/>` : ''}
      <div class="item-card-content">
        <div class="item-category-icon">${getCategoryIcon(item.category)}</div>
        <span class="item-badge badge-${item.type}">${item.type.toUpperCase()}</span>
        <h3 class="item-title">${item.name}</h3>
        <p class="item-description">${item.description}</p>
        <div class="item-meta">
          <span>📍 ${item.location}</span>
          <span>📅 ${item.date}</span>
        </div>
      </div>
    `;

    card.onclick = () => showDetails(item);
    grid.appendChild(card);
  });
}


function openModal(type) {
  document.getElementById("item-type").value = type;
  document.getElementById("modal-title").innerText =
    type === "lost" ? "Report Lost Item" : "Report Found Item";
  document.getElementById("report-modal").classList.add("active");
}

function closeModal() {
  document.getElementById("report-modal").classList.remove("active");
  document.getElementById("report-form").reset();
}

function showDetails(item) {
  document.getElementById("details-title").textContent = item.name;
  const content = document.getElementById("details-content");
  
  const badgeClass = item.type === 'lost' ? 'badge-lost' : 'badge-found';
  const icon = getCategoryIcon(item.category);
  
  content.innerHTML = `
    <div class="item-badge ${badgeClass}">${item.type.toUpperCase()}</div>
    <div style="font-size:1.5rem; margin:10px 0;">${icon}</div>
    ${item.image ? `<img src="${item.image}" alt="${item.name}" />` : ''}
    <p class="item-description" style="margin:15px 0; font-size:1.1rem;">${item.description}</p>
    <div style="background:#f8f9fa; padding:15px; border-radius:8px; margin:15px 0;">
      <h4>📍 Location: <strong>${item.location}</strong></h4>
      <h4>📅 Date: <strong>${item.date}</strong></h4>
    </div>
    <div style="margin-top:20px;">
      <strong>📞 Contact:</strong> <span id="details-contact">${item.contact}</span>
    </div>
  `;
  
  document.getElementById("details-modal").classList.add("active");
}

function copyContact() {
  const contact = document.getElementById("details-contact").textContent;
  navigator.clipboard.writeText(contact).then(() => {
    const btn = document.getElementById("copy-contact");
    const original = btn.textContent;
    btn.textContent = "✅ Copied!";
    btn.style.background = "#d4edda";
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = "";
    }, 2000);
  });
}
