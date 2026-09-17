// wishlist.js - Wishlist Page Logic & Helper Functions

let wishlistItemObject = [];

function initWishlistPage() {
  loadWishlistItemsObject();
  displayWishlistItems();
  displayWishlistItemCount();
  displayBagIcon();
}

function loadWishlistItemsObject() {
  let wishlistItemsStr = localStorage.getItem("wishlistItems");
  let wishlistItems = wishlistItemsStr ? JSON.parse(wishlistItemsStr) : [];
  if (typeof items !== "undefined" && Array.isArray(items)) {
    wishlistItemObject = wishlistItems.map((itemId) => {
      return items.find((item) => item.id == itemId) || null;
    }).filter(Boolean);
  } else {
    wishlistItemObject = [];
  }
}

function displayWishlistItems() {
  let containerElement = document.querySelector(".wishlists-container");
  let emptyState = document.querySelector(".empty-wishlist-state");
  if (!containerElement) {
    return;
  }
  let innerHTML = "";
  if (wishlistItemObject && wishlistItemObject.length > 0) {
    wishlistItemObject.forEach((wishlistItem) => {
      innerHTML += generateWishlistItemHTML(wishlistItem);
    });
    if (emptyState) emptyState.style.display = "none";
    containerElement.style.display = "grid";
  } else {
    if (emptyState) emptyState.style.display = "block";
    containerElement.style.display = "none";
  }
  containerElement.innerHTML = innerHTML;

  // GSAP entrance animation for cards
  if (typeof gsap !== 'undefined') {
    gsap.from('.wishlist-container', {
      y: 30,
      opacity: 0,
      scale: 0.96,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out'
    });
  }
}

function generateWishlistItemHTML(item) {
  let price = item.price || { currentPrise: 0, originalPrise: 0, discount: 0 };
  return `
    <div class="wishlist-container">
      <div class="image-container">
        <a href="items.html" onclick="addToItems('${item.id}');"><img src="${item.item_image1}" alt="${item.itemName}"/></a>
        <button class="cancle-button" onClick="removeFromWishlist('${item.id}')"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="info-contaner">
        <div class="info-container-detels">
          <div class="company-name">${item.companyName || ''}</div>
          <div class="item-name">${item.itemName || ''}</div>
          <div class="prise">
            <span class="current-prise">₹${price.currentPrise}</span>
            ${price.originalPrise > price.currentPrise ? `<span class="original-prise">₹${price.originalPrise}</span>` : ''}
            ${price.discount ? `<span class="discount">(${price.discount}% OFF)</span>` : ''}
          </div>
        </div>
        <div class="button-container">
          <button class="move-to-bag" onClick="addToBag('${item.id}')">MOVE TO BAG</button>
        </div>
      </div> 
    </div>
  `;
}

function removeFromWishlist(itemId) {
  let wishlistItemsStr = localStorage.getItem("wishlistItems");
  let wishlistItems = wishlistItemsStr ? JSON.parse(wishlistItemsStr) : [];
  wishlistItems = wishlistItems.filter((id) => id != itemId);
  localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  initWishlistPage();
}

function displayWishlistItemCount() {
  let myWishlistItemCount = document.querySelector(".my-wishlist-item-count");
  let wishlistCountBadge = document.querySelector(".wishlist-count");
  let wishlistItemsStr = localStorage.getItem("wishlistItems");
  let wishlistItems = wishlistItemsStr ? JSON.parse(wishlistItemsStr) : [];

  if (myWishlistItemCount) {
    if (wishlistItems.length > 0) {
      myWishlistItemCount.innerText = wishlistItems.length;
      myWishlistItemCount.style.visibility = "visible";
    } else {
      myWishlistItemCount.style.visibility = "hidden";
    }
  }

  if (wishlistCountBadge) {
    if (wishlistItems.length > 0) {
      wishlistCountBadge.innerText = wishlistItems.length;
      wishlistCountBadge.style.visibility = "visible";
    } else {
      wishlistCountBadge.style.visibility = "hidden";
    }
  }
}

function displayBagIcon() {
  let bagItemCountElement = document.querySelector(".bag-count");
  let bagItemStr = localStorage.getItem("bagItems");
  let bagItems = bagItemStr ? JSON.parse(bagItemStr) : [];
  if (bagItemCountElement) {
    if (bagItems && bagItems.length > 0) {
      bagItemCountElement.innerText = bagItems.length;
      bagItemCountElement.style.visibility = "visible";
    } else {
      bagItemCountElement.style.visibility = "hidden";
    }
  }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  try { initWishlistPage(); } catch(e) {}
} else {
  document.addEventListener('DOMContentLoaded', () => {
    try { initWishlistPage(); } catch(e) {}
  });
}
