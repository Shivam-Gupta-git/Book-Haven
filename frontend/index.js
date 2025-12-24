// For Dynamic HTML.....
let itemsContainer = document.querySelector("#items-container");

let displayProduct = (myitem) => {
  if (!itemsContainer) {
    return;
  }
  let innerHTML = "";
  myitem.forEach((item, itemIndex) => {
    innerHTML += `
    <div class="item-container">
    <div class="image-main-container">
    <a href="items.html">
    <div class="image-container" id="image-container-${itemIndex}" onClick="addToItems(${item.id})">
    <div class="image-box">
    <img src="${item.item_image1}" alt=""/>
    </div>
    <div class="image-box">
    <img src="${item.item_image2}" alt=""/>
    </div>
    <div class="image-box">
    <img src="${item.item_image3}" alt="image error"/>
    </div>
    <div class="image-box">
    <img src="${item.item_image4}" alt="image error"/>
    </div>
    </div>
    </a>
    <div class="button-box" id="button-box-${itemIndex}"></div>
    </div>

    <div class="info-main-container">
    <div class="info-container">
    <div class="rating">
      <span class="rating-star">${item.rating.stars}<i class="fa-solid fa-star"></i></span>
      <span class="no-of-reviews">${item.rating.noOfReviews}K</span>
    </div>
    <div class="company-name">${item.companyName}</div>
    <div class="item-name">${item.itemName}</div>
    <div class="prise">
      <span class="current-prise">₹${item.price.currentPrise}</span>
      <span class="original-prise">₹${item.price.originalPrise}</span>
      <span class="discount">%${item.price.discount}</span> 
      </div>
   </div>
    <div class="button-container">
      <button class="btn-add-bag" onclick="addToWishlist(${item.id})">Add to Wishlist</button>
      <a href="items.html"><i class="fa-solid fa-share-nodes"></i></a>
    </div>
    </div>

  </div>
    `;
  });
  itemsContainer.innerHTML = innerHTML;
  initializeSliders(myitem);
};

// Code For Slider Image Container...
const initializeSliders = (items) => {
  items.forEach((item, itemIndex) => {
    let sliderElements = document.querySelectorAll(
      `#image-container-${itemIndex} .image-box`
    );
    let count = 0;
    let interval = null;

    sliderElements.forEach((sliderElement, index) => {
      sliderElement.style.left = `${index * 100}%`;
    });

    function mySlider() {
      sliderElements.forEach((image) => {
        image.style.transform = `translateX(-${count * 100}%)`;
      });
    }

    let buttonBox = document.querySelector(`#button-box-${itemIndex}`);
    for (let i = 0; i < sliderElements.length; i++) {
      let div = document.createElement("div");
      div.className = "button";
      buttonBox.appendChild(div);
    }

    let buttons = buttonBox.querySelectorAll(".button");
    buttons[0].style.backgroundColor = "gray";

    buttons.forEach((button, index) => {
      button.addEventListener("click", () => {
        buttonColor();
        count = index;
        button.style.backgroundColor = "gray";
        mySlider();
      });
    });

    let imageContainer = document.querySelector(
      `#image-container-${itemIndex}`
    );
    imageContainer.addEventListener("mouseenter", () => {
      interval = setInterval(() => {
        count = (count + 1) % sliderElements.length;
        mySlider();
        changeColor();
      }, 1500);
    });

    imageContainer.addEventListener("mouseleave", () => {
      clearInterval(interval);
      count = 0;
      changeColor();
      mySlider();
    });

    let buttonColor = () => {
      buttons.forEach((button) => {
        button.style.backgroundColor = "transparent";
      });
    };

    let changeColor = () => {
      buttonColor();
      buttons[count].style.backgroundColor = "gray";
    };
  });
};
displayProduct(items);

//  Code For Filter Product....
let categoryList = document.querySelector("#categoryList");
let allCategories = [];
let initializeCategories = (items) => {
  if (!categoryList) {
    return;
  }
  items.forEach((item) => {
    if (!allCategories.includes(item.category)) {
      categoryList.innerHTML += `<label class="choose-item">
      <input type="checkbox" onclick="categoryFilter(event)" value="${item.category}">${item.category}
    </label>
    `;
      allCategories.push(item.category);
    }
  });
};
initializeCategories(items);

//
let selectedCategories = [];
let categoryFilter = (event) => {
  let category = event.target.value;

  if (event.target.checked) {
    selectedCategories.push(category);
  } else {
    selectedCategories = selectedCategories.filter((cat) => cat !== category);
  }

  let filteredItems = items.filter((item) =>
    selectedCategories.includes(item.category)
  );

  if (selectedCategories.length == 0) {
    filteredItems = items;
  }
  displayProduct(filteredItems);
};

// Code For Wishlist......

let wishlistItems;
onLoad();

function onLoad() {
  let wishlistItemStr = localStorage.getItem("wishlistItems");
  wishlistItems = wishlistItemStr ? JSON.parse(wishlistItemStr) : [];
  displayItemOnHomePage();
  displayWishlistIcon();
}

function addToWishlist(itemId) {
  if (!wishlistItems.includes(itemId)) {
    wishlistItems.push(itemId);
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
    displayWishlistIcon();
  } else {
    alert("This Item is Alleady in Wishlist");
  }
}

// let buttonAddWishlist = document.querySelectorAll('.btn-add-bag')
// buttonAddWishlist.forEach((buttonItems)=>{
//     console.log(buttonItems)

// })

function displayWishlistIcon() {
  let wishlistItemCountElement = document.querySelector(".wishlist-count");
  if (wishlistItems.length > 0) {
    wishlistItemCountElement.innerText = wishlistItems.length;
    wishlistItemCountElement.style.visibility = "visible";
  } else {
    wishlistItemCountElement.style.visibility = "hidden";
  }
}

function displayItemOnHomePage() {
  if (!itemsContainer) {
    return;
  }
  displayProduct(items);
}

// Code For ItemElement Code.....
let itemsElement;
onLoadeded();
function onLoadeded() {
  let itemsElementStr = localStorage.getItem("itemsElement");
  itemsElement = itemsElementStr ? JSON.parse(itemsElementStr) : [];
}
function addToItems(itemId) {
  itemsElement = [itemId];
  localStorage.setItem("itemsElement", JSON.stringify(itemsElement));
}
// console.log(itemsElement)

function toggleDropdown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close dropdown if user clicks outside
window.onclick = function (event) {
  if (!event.target.matches(".dropbtn")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};
