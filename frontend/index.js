// index.js - Dynamic 3D Wooden Bookshelf Dashboard & Catalog Logic

// Render Books onto 3D Wooden Shelves (Image 2 UI)
let displayProduct = (myitem) => {
  let targetContainer = document.querySelector("#shelves-container") || document.querySelector("#items-container") || document.querySelector(".shelves-container");
  if (!targetContainer) {
    return;
  }

  if (!myitem || myitem.length === 0) {
    targetContainer.innerHTML = `
      <div class="no-books-found">
        <i class="fa-solid fa-book-open" style="font-size: 3rem; color: #a89689; margin-bottom: 1rem;"></i>
        <h3>No books found matching your search</h3>
        <p>Try searching for a different book title, author, or publisher.</p>
      </div>
    `;
    return;
  }

  // Partition products into shelf rows
  let currentlyReading = myitem.slice(0, 3);
  let nextUp = myitem.slice(3, 9);
  let finished = myitem.slice(9, 15);
  let remaining = myitem.slice(15);

  let html = "";

  // Shelf 1: Currently reading
  if (currentlyReading.length > 0) {
    html += `
      <div class="shelf-row">
        <div class="shelf-row-header">
          <h3>Currently reading</h3>
        </div>
        <div class="wooden-shelf-wrapper">
          <div class="books-on-shelf">
            ${currentlyReading.map((item, idx) => renderShelfBookItem(item, [65, 40, 85][idx % 3])).join("")}
          </div>
          <div class="wooden-shelf-plank"></div>
        </div>
      </div>
    `;
  }

  // Shelf 2: Next up
  if (nextUp.length > 0) {
    html += `
      <div class="shelf-row">
        <div class="shelf-row-header">
          <h3>Next up</h3>
          <a href="#" class="full-shelf-link">Full shelf <i class="fa-solid fa-arrow-right"></i></a>
        </div>
        <div class="wooden-shelf-wrapper">
          <div class="books-on-shelf">
            ${nextUp.map((item) => renderShelfBookItem(item)).join("")}
          </div>
          <div class="wooden-shelf-plank"></div>
        </div>
      </div>
    `;
  }

  // Shelf 3: Finished
  if (finished.length > 0) {
    html += `
      <div class="shelf-row">
        <div class="shelf-row-header">
          <h3>Finished</h3>
          <a href="#" class="full-shelf-link">Full shelf <i class="fa-solid fa-arrow-right"></i></a>
        </div>
        <div class="wooden-shelf-wrapper">
          <div class="books-on-shelf">
            ${finished.map((item) => renderShelfBookItem(item)).join("")}
          </div>
          <div class="wooden-shelf-plank"></div>
        </div>
      </div>
    `;
  }

  // Shelf 4+: Library Collection (chunks of 6)
  if (remaining.length > 0) {
    for (let i = 0; i < remaining.length; i += 6) {
      let chunk = remaining.slice(i, i + 6);
      let shelfNum = Math.floor(i / 6) + 1;
      html += `
        <div class="shelf-row">
          <div class="shelf-row-header">
            <h3>Library Collection ${shelfNum}</h3>
          </div>
          <div class="wooden-shelf-wrapper">
            <div class="books-on-shelf">
              ${chunk.map((item) => renderShelfBookItem(item)).join("")}
            </div>
            <div class="wooden-shelf-plank"></div>
          </div>
        </div>
      `;
    }
  }

  targetContainer.innerHTML = html;
  triggerGSAPAnimations();
};

// Helper: Render individual 3D Book Item on Wooden Shelf
function renderShelfBookItem(item, progressVal) {
  let safeTitle = (item.itemName || "").replace(/"/g, "&quot;");
  let safeCompany = (item.companyName || "").replace(/"/g, "&quot;");
  let progressHtml = progressVal !== undefined
    ? `<div class="book-reading-progress"><div class="progress-fill" style="width: ${progressVal}%;"></div></div>`
    : "";

  return `
    <div class="shelf-book-item" onclick="handleBookClick(event, '${item.id}')" title="${safeTitle}">
      <div class="book-cover-3d">
        <img src="${item.item_image1}" alt="${safeTitle}" loading="lazy" />
        ${item.price && item.price.discount ? `<span class="shelf-book-discount">-%${item.price.discount}</span>` : ""}
      </div>
      ${progressHtml}
      
      <!-- Product Details Tooltip Card on Hover -->
      <div class="shelf-book-hover-card">
        <div class="hover-card-title">${item.itemName}</div>
        <div class="hover-card-author">${item.companyName}</div>
        <div class="hover-card-rating">
          <span>★ ${item.rating ? item.rating.stars : '4.5'}</span>
          <span class="reviews">(${item.rating ? item.rating.noOfReviews : '100'}K)</span>
        </div>
        <div class="hover-card-price">
          <span class="curr-price">₹${item.price ? item.price.currentPrise : 0}</span>
          ${item.price && item.price.originalPrise > item.price.currentPrise ? `<span class="orig-price">₹${item.price.originalPrise}</span>` : ""}
        </div>
        <div class="hover-card-actions">
          <button class="btn-shelf-wishlist" onclick="event.stopPropagation(); addToWishlist('${item.id}');">
            <i class="fa-solid fa-heart"></i> Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  `;
}

function handleBookClick(event, itemId) {
  addToItems(itemId);
  window.location.href = "items.html";
}

// Trigger GSAP Animations for Store Wooden Shelves
function triggerGSAPAnimations() {
  if (typeof gsap === "undefined") return;

  const shelfWrappers = document.querySelectorAll("#my-library-dashboard .wooden-shelf-wrapper");
  if (shelfWrappers.length > 0) {
    gsap.fromTo(
      shelfWrappers,
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: "power2.out" }
    );
  }

  const bookItems = document.querySelectorAll("#my-library-dashboard .shelf-book-item");
  if (bookItems.length > 0) {
    gsap.fromTo(
      bookItems,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, stagger: 0.03, ease: "back.out(1.1)", delay: 0.15 }
    );
  }
}


// Live Search & Category Filtering
function initSearchAndFilter() {
  let navSearchInput = document.querySelector("#search-product");
  let librarySearchInput = document.querySelector("#library-search-input");
  let libraryTabs = document.querySelector("#library-tabs");

  let performSearch = (query) => {
    let q = (query || "").toLowerCase().trim();
    if (!q) {
      displayProduct(items);
      return;
    }

    let filtered = items.filter((item) => {
      let titleMatch = (item.itemName || "").toLowerCase().includes(q);
      let companyMatch = (item.companyName || "").toLowerCase().includes(q);
      let catMatch = (item.category || "").toLowerCase().includes(q);
      let authorMatch = (item.productDetels && item.productDetels.Author || "").toLowerCase().includes(q);
      return titleMatch || companyMatch || catMatch || authorMatch;
    });

    displayProduct(filtered);
  };

  if (navSearchInput) {
    navSearchInput.addEventListener("input", (e) => {
      if (librarySearchInput) librarySearchInput.value = e.target.value;
      performSearch(e.target.value);
    });
  }

  if (librarySearchInput) {
    librarySearchInput.addEventListener("input", (e) => {
      if (navSearchInput) navSearchInput.value = e.target.value;
      performSearch(e.target.value);
    });
  }

  if (libraryTabs) {
    // Populate dynamic categories into tabs
    let categories = Array.from(new Set(items.map((i) => i.category))).filter(Boolean);
    let tabsHtml = `<button class="lib-tab active" data-category="all">Shelves</button><button class="lib-tab" data-category="all">All Books</button>`;
    categories.forEach((cat) => {
      tabsHtml += `<button class="lib-tab" data-category="${cat}">${cat}</button>`;
    });
    libraryTabs.innerHTML = tabsHtml;

    libraryTabs.querySelectorAll(".lib-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        libraryTabs.querySelectorAll(".lib-tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        let selectedCat = tab.getAttribute("data-category");
        if (selectedCat === "all") {
          displayProduct(items);
        } else {
          let filtered = items.filter((item) => item.category === selectedCat);
          displayProduct(filtered);
        }
      });
    });
  }
}

// Wishlist Logic
let wishlistItems = [];
function initIndexPage() {
  let wishlistItemStr = localStorage.getItem("wishlistItems");
  wishlistItems = wishlistItemStr ? JSON.parse(wishlistItemStr) : [];
  displayProduct(items);
  displayWishlistIcon();
  initSearchAndFilter();
}

function addToWishlist(itemId) {
  if (!wishlistItems.includes(itemId)) {
    wishlistItems.push(itemId);
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
    displayWishlistIcon();
    alert("Book added to your Wishlist!");
  } else {
    alert("This Book is already in your Wishlist");
  }
}

function displayWishlistIcon() {
  let wishlistItemCountElement = document.querySelector(".wishlist-count");
  if (wishlistItemCountElement) {
    if (wishlistItems.length > 0) {
      wishlistItemCountElement.innerText = wishlistItems.length;
      wishlistItemCountElement.style.visibility = "visible";
    } else {
      wishlistItemCountElement.style.visibility = "hidden";
    }
  }
}

// Item Selection Persistence
let itemsElement = [];
function loadStoredItemElement() {
  let itemsElementStr = localStorage.getItem("itemsElement");
  itemsElement = itemsElementStr ? JSON.parse(itemsElementStr) : [];
}

function addToItems(itemId) {
  itemsElement = [itemId];
  localStorage.setItem("itemsElement", JSON.stringify(itemsElement));
}

function toggleDropdown() {
  const myDropdown = document.getElementById("myDropdown");
  if (myDropdown) myDropdown.classList.toggle("show");
}

window.onclick = function (event) {
  if (!event.target.matches(".dropbtn") && !event.target.closest(".dropbtn")) {
    const dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown && openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

if (document.readyState === "complete" || document.readyState === "interactive") {
  initIndexPage();
  loadStoredItemElement();
} else {
  document.addEventListener("DOMContentLoaded", () => {
    initIndexPage();
    loadStoredItemElement();
  });
}



