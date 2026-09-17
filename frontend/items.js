// items.js - 3D Perspective Product Details Page with GSAP & ScrollTrigger Animations

let itemsObject = [];
let currentQty = 1;

function clickme(smallImg, thumbElement) {
  let mainImg = document.querySelector('#main-3d-book-cover');
  
  // Highlight active thumbnail ring
  document.querySelectorAll('.thumb-card').forEach(t => t.classList.remove('selected-thumb'));
  if (thumbElement) {
    thumbElement.classList.add('selected-thumb');
  }

  if (mainImg && smallImg) {
    if (typeof gsap !== 'undefined') {
      gsap.to('.hero-book-3d-card', {
        rotateY: '+=180',
        duration: 0.35,
        ease: 'power2.inOut',
        onComplete: () => {
          mainImg.src = smallImg.src;
          gsap.to('.hero-book-3d-card', {
            rotateY: '-=180',
            duration: 0.35,
            ease: 'power2.inOut'
          });
        }
      });
    } else {
      mainImg.src = smallImg.src;
    }
  }
}

function updateQty(change) {
  currentQty = Math.max(1, Math.min(10, currentQty + change));
  const qtyVal = document.getElementById('qty-value');
  if (qtyVal) {
    qtyVal.innerText = currentQty;
  }
}

function initItemsPage() {
  loadItemsElement();
  displayItemHeroSection();
  displaySimilarProducts();
  updateHeaderBadges();
  setupGSAPAnimations();
}

function loadItemsElement() {
  let itemsElement = [];
  try {
    let itemsElementStr = localStorage.getItem("itemsElement");
    itemsElement = itemsElementStr ? JSON.parse(itemsElementStr) : [];
  } catch (e) {
    itemsElement = [];
  }

  // Fallback: Default to first item if no valid item selected
  if (!Array.isArray(itemsElement) || itemsElement.length === 0) {
    itemsElement = [items && items[0] ? items[0].id : '1'];
  }

  itemsObject = itemsElement.map((itemId) => {
    for (let i = 0; i < items.length; i++) {
      if (itemId == items[i].id) {
        return items[i];
      }
    }
    return null;
  }).filter(Boolean);

  if (!itemsObject || itemsObject.length === 0) {
    itemsObject = [items[0]];
  }
}

function displayItemHeroSection() {
  let mainContainer = document.querySelector('.main-container');
  if (!mainContainer) return;

  const item = itemsObject[0];
  let details = item.productDetels || {};
  let rating = item.rating || { stars: 4.5, noOfReviews: 100 };
  let price = item.price || { currentPrise: 149, originalPrise: 299, discount: 50 };

  // Calculate discount if missing
  let origPrice = price.originalPrise || Math.round(price.currentPrise * 1.5);
  let discountPercent = price.discount || Math.round(((origPrice - price.currentPrise) / origPrice) * 100);

  // Image list for thumbnails
  let imageList = [];
  if (item.item_image1) imageList.push(item.item_image1);
  if (item.item_image2) imageList.push(item.item_image2);
  if (item.item_image3) imageList.push(item.item_image3);
  if (item.item_image4) imageList.push(item.item_image4);
  if (item.item_image5) imageList.push(item.item_image5);

  let thumbnailsHTML = imageList.map((imgUrl, index) => `
    <div class="thumb-card ${index === 0 ? 'selected-thumb' : ''}" onclick="clickme({src: '${imgUrl}'}, this)">
      <img src="${imgUrl}" alt="${item.itemName}" />
    </div>
  `).join('');

  mainContainer.innerHTML = `
    <div class="hero-showcase-wrapper">
      <!-- Left Column: Editorial Details & Controls -->
      <div class="hero-left-col">
        <div class="editorial-category-tag">
          <i class="fa-solid fa-bookmark"></i> ${item.companyName || 'LITERARY SELECTION'}
        </div>
        
        <h1 class="editorial-headline">
          ${(item.itemNameLong || item.itemName).toUpperCase()}
        </h1>

        <div class="context-idea-grid">
          <!-- Context Box -->
          <div class="ci-box">
            <div class="ci-header">
              <span class="ci-badge">C</span>
              <span class="ci-title">Context</span>
            </div>
            <p class="ci-text">
              Authored by <strong>${details.Author || 'Renowned Author'}</strong>.
              ${details.Highlights ? details.Highlights : 'Experience storytelling crafted with deep emotional depth and unmatched literary narrative elegance.'}
            </p>
            <div class="ci-meta">
              <span class="rating-badge"><i class="fa-solid fa-star"></i> ${rating.stars} (${rating.noOfReviews} Reviews)</span>
              
              <!-- Custom Sleek Quantity Control -->
              <div class="custom-qty-stepper">
                <span class="qty-label">Qty:</span>
                <div class="stepper-controls">
                  <button class="step-btn" onclick="updateQty(-1)">-</button>
                  <span id="qty-value">${currentQty}</span>
                  <button class="step-btn" onclick="updateQty(1)">+</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Idea Box -->
          <div class="ci-box">
            <div class="ci-header">
              <span class="ci-badge">I</span>
              <span class="ci-title">Idea</span>
            </div>
            <p class="ci-text">
              ${details.Description || 'A masterclass in modern literature designed to inspire minds and touch hearts.'}
            </p>
            <div class="ci-specs">
              <span class="spec-tag"><i class="fa-solid fa-store"></i> ${details.Seller || 'Fortune500'}</span>
              <span class="spec-tag"><i class="fa-solid fa-ruler-combined"></i> ${details.Width || '14'} x ${details.Height || '21'} cm</span>
            </div>
          </div>
        </div>

        <!-- Pricing & Action Bar -->
        <div class="price-action-bar">
          <div class="price-display">
            <div class="price-main-row">
              <span class="hero-current-price">₹${price.currentPrise}</span>
              <span class="hero-original-price">₹${origPrice}</span>
              <span class="hero-discount-tag">${discountPercent}% OFF</span>
            </div>
            <span class="tax-note">✓ Inclusive of all taxes • Free Shipping Available</span>
          </div>

          <div class="hero-cta-buttons">
            <button class="hero-bag-btn" onclick="addToBag('${item.id}')">
              <i class="fa-solid fa-bag-shopping"></i> ADD TO BAG
            </button>
            <button class="hero-wishlist-btn" onclick="addToWishlist('${item.id}')">
              <i class="fa-solid fa-heart"></i> WISHLIST
            </button>
          </div>
        </div>

        <!-- Extra Info Row & Thumbnails -->
        <div class="extra-info-row">
          <div class="pincode-box">
            <i class="fa-solid fa-location-dot"></i>
            <input type="text" placeholder="Enter Pincode for delivery check" />
            <button class="check-pin-btn">Check</button>
          </div>
          <div class="offers-trigger" onclick="toggleDropdown()">
            <i class="fa-solid fa-tags"></i> View available offers & coupons
          </div>
        </div>

        <!-- Thumbnails Gallery -->
        <div class="hero-thumbnails-container">
          <span class="thumb-label">GALLERY VIEWS:</span>
          <div class="thumbnails-flex">
            ${thumbnailsHTML}
          </div>
        </div>
      </div>

      <!-- Right Column: 3D Floating Perspective Book Showcase -->
      <div class="hero-right-col" id="hero-3d-stage">
        <div class="hero-book-3d-container">
          <div class="hero-book-3d-card">
            <div class="book-cover-front">
              <img src="${imageList[0] || item.item_image1}" alt="${item.itemName}" id="main-3d-book-cover" />
            </div>
            <div class="book-spine-left"></div>
            <div class="book-pages-right"></div>
            <div class="book-pages-bottom"></div>
          </div>
          <div class="book-cast-shadow"></div>
          <div class="book-caption-tag">${item.itemName}</div>
        </div>
      </div>
    </div>
  `;
}

function displaySimilarProducts() {
  const similarProductsContainer = document.getElementById('similar-products-container');
  if (!similarProductsContainer) return;

  if (typeof items === 'undefined' || !Array.isArray(items) || items.length === 0) {
    return;
  }

  const currentProduct = (itemsObject && itemsObject.length > 0) ? itemsObject[0] : items[0];
  const currentId = currentProduct ? currentProduct.id : null;

  // Filter out the currently displayed book (using loose !=)
  let similarProducts = items.filter((item) => item.id != currentId);
  if (similarProducts.length === 0) {
    similarProducts = items.slice(0, 5);
  } else if (similarProducts.length > 5) {
    similarProducts = similarProducts.slice(0, 5);
  }

  let standingBooksHTML = '';
  let bookCardsHTML = '';

  similarProducts.forEach((product) => {
    let rating = product.rating || { stars: 4.5, noOfReviews: 50 };
    let price = product.price || { currentPrise: 199, originalPrise: 399 };
    let bookImg = product.item_image1 || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80';
    let safeTitle = (product.itemName || 'Featured Book').replace(/"/g, '&quot;');
    let safeCompany = (product.companyName || 'Book Haven').replace(/"/g, '&quot;');

    // 1. Standing 3D Book Cover directly resting on shelf plank
    standingBooksHTML += `
      <div class="standing-book-wrapper gsap-shelf-book" onclick="selectItemAndNavigate('${product.id}')" title="${safeTitle}">
        <div class="standing-book-3d">
          <div class="standing-book-front">
            <img src="${bookImg}" alt="${safeTitle}" loading="eager" />
          </div>
          <div class="standing-book-spine"></div>
          <div class="standing-book-shadow"></div>
        </div>
      </div>
    `;

    // 2. Product Info Card rendered neatly below the wooden shelf plank
    bookCardsHTML += `
      <div class="shelf-product-card gsap-shelf-card" onclick="selectItemAndNavigate('${product.id}')">
        <div class="shelf-card-company">${safeCompany}</div>
        <div class="shelf-card-title">${product.itemName}</div>
        <div class="shelf-card-rating">★ ${rating.stars} <span class="reviews">(${rating.noOfReviews})</span></div>
        <div class="shelf-card-price">
          <span class="curr">₹${price.currentPrise}</span>
          ${price.originalPrise > price.currentPrise ? `<span class="orig">₹${price.originalPrise}</span>` : ''}
        </div>
        <button class="shelf-view-btn" onclick="event.stopPropagation(); selectItemAndNavigate('${product.id}');">
          View Book
        </button>
      </div>
    `;
  });

  similarProductsContainer.innerHTML = `
    <div class="shelf-perspective-container">
      <!-- Upper Stage: Standing 3D Books resting on wooden shelf -->
      <div class="standing-books-stage">
        ${standingBooksHTML}
      </div>

      <!-- Wooden Shelf Plank Base -->
      <div class="wooden-shelf-plank">
        <div class="plank-front-lip"></div>
      </div>

      <!-- Lower Stage: Product Cards neatly below shelf plank -->
      <div class="shelf-cards-row">
        ${bookCardsHTML}
      </div>
    </div>
  `;
}

function selectItemAndNavigate(itemId) {
  localStorage.setItem("itemsElement", JSON.stringify([itemId]));
  window.location.href = "items.html";
}

function updateHeaderBadges() {
  let bagItemStr = localStorage.getItem("bagItems");
  let bagItems = bagItemStr ? JSON.parse(bagItemStr) : [];
  let bagCount = document.querySelector('.bag-count');
  if (bagCount) {
    bagCount.innerText = bagItems.length;
    bagCount.style.display = bagItems.length > 0 ? 'flex' : 'none';
  }

  let wishlistStr = localStorage.getItem("wishlistItems");
  let wishlistItems = wishlistStr ? JSON.parse(wishlistStr) : [];
  let wishlistCount = document.querySelector('.wishlist-count');
  if (wishlistCount) {
    wishlistCount.innerText = wishlistItems.length;
    wishlistCount.style.display = wishlistItems.length > 0 ? 'flex' : 'none';
  }
}

function setupGSAPAnimations() {
  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // 1. Entrance animation for Left Hero Content
  gsap.from('.hero-left-col > *', {
    y: 35,
    opacity: 0,
    duration: 0.85,
    stagger: 0.12,
    ease: 'power3.out'
  });

  // 2. Entrance animation for 3D Floating Book
  gsap.from('.hero-book-3d-card', {
    scale: 0.8,
    rotateY: -60,
    rotateX: 30,
    opacity: 0,
    duration: 1.1,
    ease: 'back.out(1.4)'
  });

  // 3. Continuous Floating GSAP Loop for 3D Book & Shadow
  gsap.to('.hero-book-3d-card', {
    y: -16,
    rotateX: '+=2.5',
    duration: 2.8,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  gsap.to('.book-cast-shadow', {
    scale: 0.85,
    opacity: 0.35,
    duration: 2.8,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  // 4. Interactive 3D Parallax Tilt on Mousemove over Stage
  const stage = document.getElementById('hero-3d-stage');
  const card = document.querySelector('.hero-book-3d-card');

  if (stage && card) {
    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const rotateY = -22 + (x / rect.width) * 20;
      const rotateX = 10 - (y / rect.height) * 20;

      gsap.to(card, {
        rotateY: rotateY,
        rotateX: rotateX,
        duration: 0.4,
        ease: 'power1.out'
      });
    });

    stage.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: -22,
        rotateX: 10,
        duration: 0.9,
        ease: 'power2.out'
      });
    });
  }

  // 5. Entrance Animation for Standing Books Shelf (Safe, always visible by default)
  const shelfBooks = document.querySelectorAll('.gsap-shelf-book');
  const shelfCards = document.querySelectorAll('.gsap-shelf-card');

  if (shelfBooks.length > 0) {
    shelfBooks.forEach(el => {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    });
  }
  if (shelfCards.length > 0) {
    shelfCards.forEach(el => {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    });
  }

  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      try {
        ScrollTrigger.refresh();
      } catch (e) {}

      gsap.fromTo('.gsap-shelf-book',
        { y: 30, opacity: 0.3 },
        {
          scrollTrigger: {
            trigger: '.similar-products-section',
            start: 'top 98%',
            toggleActions: 'play none none none'
          },
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power2.out'
        }
      );

      gsap.fromTo('.gsap-shelf-card',
        { y: 20, opacity: 0.3 },
        {
          scrollTrigger: {
            trigger: '.similar-products-section',
            start: 'top 98%',
            toggleActions: 'play none none none'
          },
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.5,
          delay: 0.1,
          ease: 'power2.out'
        }
      );
    }
  }
}

function addToBag(itemId) {
  let bagItems = [];
  try {
    let bagItemStr = localStorage.getItem("bagItems");
    bagItems = bagItemStr ? JSON.parse(bagItemStr) : [];
  } catch (e) {
    bagItems = [];
  }
  if (!bagItems.includes(itemId)) {
    for (let i = 0; i < currentQty; i++) {
      bagItems.push(itemId);
    }
    localStorage.setItem("bagItems", JSON.stringify(bagItems));
    updateHeaderBadges();
    alert(`Added ${currentQty} book(s) to Bag!`);
  } else {
    alert("This book is already in your Bag.");
  }
}

function addToWishlist(itemId) {
  let wishlistItems = [];
  try {
    let wishlistStr = localStorage.getItem("wishlistItems");
    wishlistItems = wishlistStr ? JSON.parse(wishlistStr) : [];
  } catch (e) {
    wishlistItems = [];
  }
  if (!wishlistItems.includes(itemId)) {
    wishlistItems.push(itemId);
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
    updateHeaderBadges();
    alert("Book added to Wishlist!");
  } else {
    alert("This book is already in your Wishlist.");
  }
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

// Auto Initialize Page
if (document.readyState !== 'loading') {
  initItemsPage();
} else {
  document.addEventListener('DOMContentLoaded', initItemsPage);
}
