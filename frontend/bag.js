// bag.js - Shopping Bag & Cart Checkout Logic

let bagItemObject = [];
let selectedItems = new Set();
let bagItems = [];

function initBagPage() {
  loadBagItemObject();
  displayBagItems();
  displayBagSummery();
  if (typeof displayBagIcon === "function") {
    displayBagIcon();
  }
}

function loadBagItemObject() {
  let bagItemStr = localStorage.getItem("bagItems");
  bagItems = bagItemStr ? JSON.parse(bagItemStr) : [];
  if (typeof items !== "undefined" && Array.isArray(items)) {
    bagItemObject = bagItems.map((itemId) => {
      let found = items.find((i) => i.id == itemId);
      if (found) {
        selectedItems.add(itemId);
        return found;
      }
      return null;
    }).filter(Boolean);
  } else {
    bagItemObject = [];
  }
}

function displayBagItems() {
  let bagItemContainerElement = document.querySelector(".bags-container");
  if (!bagItemContainerElement) return;

  let innerHTML = "";
  if (bagItemObject && bagItemObject.length > 0) {
    bagItemObject.forEach((item) => {
      innerHTML += generateBagItemHTML(item);
    });
  } else {
    innerHTML = `<div style='padding: 4rem 2rem; text-align: center;'>
      <i class='fa-regular fa-bag-shopping' style='font-size: 3.5rem; color: #e8decb; margin-bottom: 1rem; display: block;'></i>
      <h3 style='font-family: Georgia, serif; font-size: 1.4rem; color: #4a3e3d; margin-bottom: 0.5rem;'>Your bag is empty</h3>
      <p style='font-size: 0.95rem; color: #8c786a; margin-bottom: 1.5rem;'>Start exploring and add books to your bag!</p>
      <a href='index.html' style='display: inline-block; padding: 10px 28px; background: #5c4b43; color: #fff; text-decoration: none; font-size: 0.85rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; border-radius: 8px;'>Browse Books</a>
    </div>`;
  }
  bagItemContainerElement.innerHTML = innerHTML;

  // GSAP entrance animation for cart cards
  if (typeof gsap !== 'undefined' && bagItemObject && bagItemObject.length > 0) {
    gsap.from('.bag-container', {
      y: 25,
      opacity: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out'
    });
  }

  document.querySelectorAll(".item-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const itemId = this.getAttribute("data-item-id");
      if (this.checked) {
        selectedItems.add(itemId);
      } else {
        selectedItems.delete(itemId);
      }
      displayBagSummery();
    });
  });
}

function generateBagItemHTML(item) {
  let price = item.price || { currentPrise: 0, originalPrise: 0, discount: 0 };
  let isChecked = selectedItems.has(item.id) ? "checked" : "";

  return `
    <div class="bag-container">
      <div class="checkbox-container">
        <input type="checkbox" class="item-checkbox" data-item-id="${item.id}" ${isChecked}>
      </div>
      <div class="image-container">
        <img src="${item.item_image1}" alt="${item.itemName}">
        <button class="cancle-button" onClick="removeFromBag('${item.id}')"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="info-contaner">
        <div class="company-name">${item.companyName || ''}</div>
        <div class="item-name">${item.itemName || ''}</div>
        <div class="prise">
          <span class="current-prise">₹${price.currentPrise}</span>
          ${price.originalPrise > price.currentPrise ? `<span class="original-prise">₹${price.originalPrise}</span>` : ''}
          ${price.discount ? `<span class="discount">(${price.discount}% OFF)</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

function removeFromBag(itemId) {
  let bagItemStr = localStorage.getItem("bagItems");
  bagItems = bagItemStr ? JSON.parse(bagItemStr) : [];
  bagItems = bagItems.filter((id) => id != itemId);
  localStorage.setItem("bagItems", JSON.stringify(bagItems));
  selectedItems.delete(itemId);
  initBagPage();
}

function displayBagSummery() {
  let bagSummeryElement = document.querySelector(".bag-summary");
  if (!bagSummeryElement) return;

  let totalItem = selectedItems.size;
  let totalMRP = 0;
  let totalDiscount = 0;

  let selectedItemsArray = bagItemObject.filter((item) => selectedItems.has(item.id));
  selectedItemsArray.forEach((bagItem) => {
    let price = bagItem.price || { currentPrise: 0, originalPrise: 0 };
    totalMRP += price.originalPrise || price.currentPrise;
    totalDiscount += (price.originalPrise || price.currentPrise) - price.currentPrise;
  });

  let finalPayment = totalMRP - totalDiscount;

  bagSummeryElement.innerHTML = `
    <div class="bag-details-container">
      <div class="price-header">PRICE DETAILS (${totalItem} Items)</div>
      <div class="price-item">
        <span class="price-item-tag">Total MRP</span>
        <span class="price-item-value">₹${totalMRP}</span>
      </div>
      <div class="price-item">
        <span class="price-item-tag">Discount on MRP</span>
        <span class="price-item-value priceDetail-base-discount">-₹${totalDiscount}</span>
      </div>
      <div class="price-item">
        <span class="price-item-tag">Convenience Fee</span>
        <span class="price-item-value">FREE</span>
      </div>
      <hr>
      <div class="price-footer">
        <span class="price-item-tag">Total Amount</span>
        <span class="price-item-value">₹${finalPayment}</span>
      </div>
    </div>
    <button class="btn-place-order" onClick="placeOrder()" ${totalItem === 0 ? "disabled" : ""}>PLACE ORDER</button>
  `;
}

function placeOrder() {
  if (selectedItems.size === 0) {
    alert("Please select at least one item to place order");
    return;
  }
  const modal = document.getElementById("addressModal");
  if (modal) modal.style.display = "block";
}

const addressFormElement = document.getElementById("addressForm");
if (addressFormElement) {
  addressFormElement.addEventListener("submit", function (e) {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const pincode = document.getElementById("pincode").value;

    const selectedItemsArray = bagItemObject.filter((item) => selectedItems.has(item.id));
    let orderDetails = "Order Details:\n\n";
    selectedItemsArray.forEach((item) => {
      orderDetails += `${item.itemName} - ₹${item.price.currentPrise}\n`;
    });
    orderDetails += `\nTotal Amount: ₹${selectedItemsArray.reduce((total, item) => total + item.price.currentPrise, 0)}`;
    orderDetails += `\n\nDelivery Address:\n${fullName}\n${address}\n${city}, ${state} - ${pincode}\nPhone: ${phone}`;

    alert("Thank you for your order!\n\n" + orderDetails);

    localStorage.setItem("bagItems", JSON.stringify([]));
    this.reset();
    const modal = document.getElementById("addressModal");
    if (modal) modal.style.display = "none";
    initBagPage();
  });
}

const closeModalBtn = document.querySelector(".close-modal");
if (closeModalBtn) {
  closeModalBtn.addEventListener("click", function () {
    const modal = document.getElementById("addressModal");
    if (modal) modal.style.display = "none";
  });
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  try { initBagPage(); } catch(e) {}
} else {
  document.addEventListener('DOMContentLoaded', () => {
    try { initBagPage(); } catch(e) {}
  });
}
