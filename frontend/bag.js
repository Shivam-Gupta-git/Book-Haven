let bagItemObject;
let selectedItems = new Set(); // Track selected items

onLoaded();

function onLoaded() {
  loadBagItemObject();
  displayBagItems();
  displayBagSummery();
}

function loadBagItemObject() {
  bagItemObject = bagItems.map((itemId) => {
    for (let i = 0; i < items.length; i++) {
      if (itemId == items[i].id) {
        selectedItems.add(itemId); // Add all items to selected items initially
        return items[i];
      }
    }
  });
  // console.log(bagItemObject)
}

function displayBagItems() {
  let bagItemContainerElement = document.querySelector(".bags-container");

  if (!bagItemContainerElement) {
    return;
  }
  let innerHTML = "";
  bagItemObject.forEach((bagItems) => {
    innerHTML += generateItemHTML(bagItems);
  });
  bagItemContainerElement.innerHTML = innerHTML;

  // Add event listeners to checkboxes
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

function generateItemHTML(item) {
  return `
  <div class="bag-container">
    <div class="item-checkbox-container">
      <input type="checkbox" class="item-checkbox" data-item-id="${item.id}" checked>
    </div>
    <div class="image-container">
      <a href="#"><img src="${item.item_image1}" alt="image-Error"/></a>
    </div>
    <div class="info-contaner">
      <div class="company-name">${item.companyName}</div>
      <div class="item-name">${item.itemName}</div>
      <div class="item-size">

      </div>
      <div class="prise">
        <span class="current-prise">₹${item.price.currentPrise}</span>
        <span class="original-prise">₹${item.price.originalPrise}</span>
        <span class="discount">(${item.price.discount} % OFF)</span>
      </div>
      <div class="item-Qty">


      </div>
    </div> 
    <button class="cancle-button" onClick="removeFromBag(${item.id})"><i class="fa-solid fa-xmark"></i></button>
  </div>
  `;
}

function removeFromBag(itemId) {
  bagItems = bagItems.filter((bagItemId) => bagItemId != itemId);
  selectedItems.delete(itemId); // Remove from selected items
  localStorage.setItem("bagItems", JSON.stringify(bagItems));
  loadBagItemObject();
  displayBagIcon();
  displayBagItems();
  displayBagSummery();
}

function displayBagSummery() {
  // Only count selected items
  let totalItem = selectedItems.size;
  let totalMRP = 0;
  let totalDiscount = 0;
  let convenienceFee = 50;
  let finalPayment = 0;

  // Only calculate prices for selected items
  bagItemObject.forEach((bagItem) => {
    if (selectedItems.has(bagItem.id)) {
      totalMRP += bagItem.price.originalPrise;
      totalDiscount += bagItem.price.originalPrise - bagItem.price.currentPrise;
    }
  });

  finalPayment = totalMRP - totalDiscount + convenienceFee;

  let bagsInfoContainer = document.querySelector(".bags-info-container");
  if (!bagsInfoContainer) {
    return;
  }
  bagsInfoContainer.innerHTML = `

  <div class="apply-box">
  <div class="coupons">COUPONS</div>
  </div>
  <div class="apply-coupons-box">
  <span><i class="fa-solid fa-tag"></i>
  <span class="apply-coupons">Apply Coupons</span>
  </span>
  <span class="apply">APPLY</span>
  </div>
  <div class="prise-detail">
  <span class="prise-details">PRICE DETAILS</span><span class="items">(${totalItem} <span>Items</span>)</span>
</div>

<div class="prise-container">
  <div class="total-mrp-box">
    <span class="total-prise">Total MRP</span><span class="original-Prise">₹${totalMRP}</span>
  </div>
  <div class="box-discount">
      <span class="discount-on-mrp">Discount ON MRP</span>
        <span class="discount-prise"> -₹${totalDiscount}</span>
  </div>
  <div class="convenience-fee-box">
    <span class="convenience-fee">Convenience Fee</span>
    <span class="convenience-fee-prise">₹${convenienceFee}</span>
  </div>
  <div class="coupon-box">
  <span class="coupon-discount">Coupon Discount</span>
  <span class="apply-coupon">Apply Coupon</span>
  </div>
  <div class="total-amount-box">
    <span class="total-amount">Total Amount</span>
    <span class="total-amount-prise">₹${finalPayment}</span>
  </div>
</div>
<button class="order-now" onClick="placeOrder()" ${
    totalItem === 0 ? "disabled" : ""
  }>PLACE ORDER</button>
  `;
}

function placeOrder() {
  // Check if any items are selected
  if (selectedItems.size === 0) {
    alert("Please select at least one item to place order");
    return;
  }

  const modal = document.getElementById("addressModal");
  modal.style.display = "block";
}

// Handle address form submission
document.getElementById("addressForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form values
  const fullName = document.getElementById("fullName").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;
  const pincode = document.getElementById("pincode").value;

  // Validate phone number
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    alert("Please enter a valid 10-digit phone number");
    return;
  }

  // Validate pincode
  const pincodeRegex = /^\d{6}$/;
  if (!pincodeRegex.test(pincode)) {
    alert("Please enter a valid 6-digit PIN code");
    return;
  }

  // Get only selected items
  const selectedItemsArray = bagItemObject.filter((item) =>
    selectedItems.has(item.id)
  );

  // Create order details message
  let orderDetails = "Order Details:\n\n";
  selectedItemsArray.forEach((item) => {
    orderDetails += `${item.itemName} - ₹${item.price.currentPrise}\n`;
  });
  orderDetails += `\nTotal Amount: ₹${selectedItemsArray.reduce(
    (total, item) => total + item.price.currentPrise,
    0
  )}`;
  orderDetails += `\n\nDelivery Address:\n${fullName}\n${address}\n${city}, ${state} - ${pincode}\nPhone: ${phone}`;

  // Show order confirmation
  alert("Thank you for your order!\n\n" + orderDetails);

  // Remove checked items from bagItems
  // const checkedItemIds = Array.from(selectedItems);
  // bagItems = bagItems.filter((itemId) => !checkedItemIds.includes(itemId));

  // Update localStorage with new bagItems
  localStorage.setItem("bagItems", JSON.stringify(bagItems));

  // Clear the form and close the modal
  this.reset();
  document.getElementById("addressModal").style.display = "none";

  // Reset selected items and update display
  selectedItems.clear();
  loadBagItemObject();
  displayBagIcon();
  displayBagItems();
  displayBagSummery();
});

// Close modal when clicking the X button
document.querySelector(".close-modal").addEventListener("click", function () {
  document.getElementById("addressModal").style.display = "none";
});

// Close modal when clicking outside
window.addEventListener("click", function (event) {
  const modal = document.getElementById("addressModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

{
  /* <button class="move-to-bag" onClick="addToBag()">MOVE TO BAG</button> */
}
