// Slider functionality
const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const dotsContainer = document.querySelector(".slider-dots");
const currentTimeSpan = document.querySelector(".current-time");

let currentSlide = 0;
const slideCount = slides ? slides.length : 0;
const slideDuration = 5000; // 5 seconds
let progressInterval;
let timeInterval;
let currentTime = 0;

const thumbnailCards = document.querySelectorAll(".thumbnail-card");

// Bind click events on thumbnail cards
if (thumbnailCards.length > 0) {
  thumbnailCards.forEach((thumb, index) => {
    thumb.addEventListener("click", () => goToSlide(index));
  });
}

// Create dots (if container exists)
if (dotsContainer && slides.length > 0) {
  slides.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });
}

const dots = document.querySelectorAll(".dot");

function updateSlider() {
  if (!slides || slides.length === 0) return;
  slides.forEach((slide, index) => {
    slide.classList.remove("active");
    if (dots[index]) dots[index].classList.remove("active");
    if (thumbnailCards[index]) thumbnailCards[index].classList.remove("active");
  });

  if (slides[currentSlide]) {
    slides[currentSlide].classList.add("active");
    animateSlideText(slides[currentSlide]);
  }
  if (dots[currentSlide]) dots[currentSlide].classList.add("active");
  if (thumbnailCards[currentSlide]) thumbnailCards[currentSlide].classList.add("active");

  startProgressAnimation();
}

function animateSlideText(slideElem) {
  if (typeof gsap === "undefined" || !slideElem) return;
  const title = slideElem.querySelector("h1");
  const author = slideElem.querySelector(".slide-author");
  const desc = slideElem.querySelector("p");
  if (title && author && desc) {
    gsap.fromTo(
      [title, author, desc],
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: "power2.out", overwrite: "auto" }
    );
  }
}

// Hero Search input handler
const heroSearchInput = document.getElementById("hero-search-input");
if (heroSearchInput) {
  heroSearchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && heroSearchInput.value.trim() !== "") {
      window.location.href = `index.html?search=${encodeURIComponent(heroSearchInput.value.trim())}`;
    }
  });
}

function startProgressAnimation() {
  clearInterval(progressInterval);
  clearInterval(timeInterval);

  if (!slides || !slides[currentSlide]) return;
  const progressBar = slides[currentSlide].querySelector(".slide-progress");
  if (progressBar) progressBar.style.transform = "scaleX(0)";

  currentTime = 0;
  if (currentTimeSpan) currentTimeSpan.textContent = currentTime;

  let progress = 0;
  const step = 100 / (slideDuration / 16);

  progressInterval = setInterval(() => {
    progress += step;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);
    }
    if (progressBar) progressBar.style.transform = `scaleX(${progress / 100})`;
  }, 16);

  timeInterval = setInterval(() => {
    currentTime++;
    if (currentTimeSpan) currentTimeSpan.textContent = currentTime;
    if (currentTime >= slideDuration / 1000) {
      clearInterval(timeInterval);
    }
  }, 1000);
}

function goToSlide(index) {
  if (slideCount === 0) return;
  currentSlide = index;
  updateSlider();
}

function nextSlide() {
  if (slideCount === 0) return;
  currentSlide = (currentSlide + 1) % slideCount;
  updateSlider();
}

function prevSlide() {
  if (slideCount === 0) return;
  currentSlide = (currentSlide - 1 + slideCount) % slideCount;
  updateSlider();
}

if (prevBtn) prevBtn.addEventListener("click", prevSlide);
if (nextBtn) nextBtn.addEventListener("click", nextSlide);

let slideInterval;
if (slider && slideCount > 0) {
  slideInterval = setInterval(nextSlide, slideDuration);

  slider.addEventListener("mouseenter", () => {
    clearInterval(slideInterval);
    clearInterval(progressInterval);
    clearInterval(timeInterval);
  });

  slider.addEventListener("mouseleave", () => {
    slideInterval = setInterval(nextSlide, slideDuration);
    startProgressAnimation();
  });

  updateSlider();
}

// -------------------------------------------------------------
// 3D Coverflow Carousel & GSAP ScrollTrigger Animations
// -------------------------------------------------------------
const cfItems = document.querySelectorAll(".coverflow-item");
const cfPrev = document.getElementById("cf-prev");
const cfNext = document.getElementById("cf-next");
let cfActiveIndex = 3;

function updateCoverflow() {
  if (!cfItems || cfItems.length === 0) return;
  const isMobile = window.innerWidth < 650;
  const spacing1 = isMobile ? 120 : 200;
  const spacing2 = isMobile ? 210 : 360;
  const spacing3 = isMobile ? 280 : 490;

  cfItems.forEach((item, index) => {
    const offset = index - cfActiveIndex;
    const absOffset = Math.abs(offset);

    let xPos = 0;
    if (offset === 1) xPos = spacing1;
    else if (offset === -1) xPos = -spacing1;
    else if (offset === 2) xPos = spacing2;
    else if (offset === -2) xPos = -spacing2;
    else if (offset >= 3) xPos = spacing3 + (offset - 3) * 85;
    else if (offset <= -3) xPos = -spacing3 + (offset + 3) * 85;

    let scaleVal = offset === 0 ? 1.25 : Math.max(0.5, 0.88 - (absOffset - 1) * 0.15);
    let rotateYVal = offset < 0 ? 38 : offset > 0 ? -38 : 0;
    let zIndexVal = 40 - absOffset * 5;
    let opacityVal = offset === 0 ? 1 : Math.max(0.25, 0.85 - (absOffset - 1) * 0.2);
    let filterVal = offset === 0 ? "brightness(1.15)" : `brightness(${Math.max(0.35, 0.7 - (absOffset - 1) * 0.12)})`;

    if (offset === 0) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }

    if (typeof gsap !== "undefined") {
      gsap.to(item, {
        x: xPos,
        scale: scaleVal,
        rotateY: rotateYVal,
        zIndex: zIndexVal,
        opacity: opacityVal,
        filter: filterVal,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    } else {
      item.style.transform = `translateX(${xPos}px) scale(${scaleVal}) rotateY(${rotateYVal}deg)`;
      item.style.zIndex = zIndexVal;
      item.style.opacity = opacityVal;
      item.style.filter = filterVal;
    }
  });
}

if (cfItems.length > 0) {
  updateCoverflow();

  cfItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      if (cfActiveIndex === index && item.dataset.itemId) {
        handleHomeItemClick(item.dataset.itemId);
      } else {
        cfActiveIndex = index;
        updateCoverflow();
      }
    });
  });

  if (cfPrev) {
    cfPrev.addEventListener("click", () => {
      cfActiveIndex = (cfActiveIndex - 1 + cfItems.length) % cfItems.length;
      updateCoverflow();
    });
  }

  if (cfNext) {
    cfNext.addEventListener("click", () => {
      cfActiveIndex = (cfActiveIndex + 1) % cfItems.length;
      updateCoverflow();
    });
  }
}

// Global window event listeners
window.addEventListener("load", updateCoverflow);
window.addEventListener("resize", updateCoverflow);
document.addEventListener("DOMContentLoaded", updateCoverflow);

// -------------------------------------------------------------
// GSAP ScrollTrigger Section Animations (Robust & Staggered)
// -------------------------------------------------------------
function initGSAPAnimations() {
  if (typeof gsap === "undefined") {
    console.warn("GSAP is not loaded");
    return;
  }

  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Coverflow Header
    const cfHeader = document.querySelector(".coverflow-header");
    if (cfHeader) {
      gsap.fromTo(
        cfHeader,
        { y: 35, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".coverflow-hero-section",
            start: "top 85%",
            toggleActions: "play none none none",
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        }
      );
    }

    // 2. Collection Items
    const collectionItems = document.querySelectorAll(".collection-item");
    if (collectionItems.length > 0) {
      gsap.fromTo(
        collectionItems,
        { y: 30, opacity: 0, scale: 0.9 },
        {
          scrollTrigger: {
            trigger: ".collection-section",
            start: "top 85%",
            toggleActions: "play none none none",
          },
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.06,
          duration: 0.6,
          ease: "back.out(1.2)",
        }
      );
    }

    // 3. Best Selling Books
    const bookCards = document.querySelectorAll(".aesthetic-book-card");
    if (bookCards.length > 0) {
      gsap.fromTo(
        bookCards,
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".books-scroll-grid",
            start: "top 90%",
            toggleActions: "play none none none",
          },
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.7,
          ease: "power2.out",
        }
      );
    }

    // 4. Best Selling Stationery
    const stationeryCards = document.querySelectorAll(".aesthetic-product-card");
    if (stationeryCards.length > 0) {
      gsap.fromTo(
        stationeryCards,
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".stationery-scroll-grid",
            start: "top 90%",
            toggleActions: "play none none none",
          },
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.7,
          ease: "power2.out",
        }
      );
    }

    // 5. Our Story Card
    const storyCard = document.querySelector(".our-story-card");
    if (storyCard) {
      gsap.fromTo(
        storyCard,
        { y: 45, opacity: 0, scale: 0.96 },
        {
          scrollTrigger: {
            trigger: ".our-story-card",
            start: "top 85%",
            toggleActions: "play none none none",
          },
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
        }
      );
    }

    // 6. Testimonials
    const testimonials = document.querySelectorAll(".testimonial-card");
    if (testimonials.length > 0) {
      gsap.fromTo(
        testimonials,
        { y: 35, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".readers-section",
            start: "top 85%",
            toggleActions: "play none none none",
          },
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.8,
          ease: "power2.out",
        }
      );
    }

    // 7. Stay Inspired Bar
    const stayInspired = document.querySelector(".stay-inspired-bar");
    if (stayInspired) {
      gsap.fromTo(
        stayInspired,
        { y: 30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".stay-inspired-bar",
            start: "top 90%",
            toggleActions: "play none none none",
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        }
      );
    }

    // 8. Footer Columns
    const footerCols = document.querySelectorAll(".aesthetic-footer .footer-col");
    if (footerCols.length > 0) {
      gsap.fromTo(
        footerCols,
        { y: 30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".aesthetic-footer",
            start: "top 90%",
            toggleActions: "play none none none",
          },
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.7,
          ease: "power2.out",
        }
      );
    }

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGSAPAnimations);
} else {
  initGSAPAnimations();
}

window.addEventListener("load", () => {
  if (typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.refresh();
  }
});

function toggleDropdown() {
  const dropdown = document.getElementById("myDropdown");
  if (dropdown) dropdown.classList.toggle("show");
}

function handleHomeItemClick(itemId) {
  try {
    localStorage.setItem("itemsElement", JSON.stringify([itemId]));
  } catch (e) {
    console.error("Failed to store item:", e);
  }
  window.location.href = "items.html";
}

function scrollRowLeft(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.scrollBy({ left: -340, behavior: "smooth" });
  }
}

function scrollRowRight(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.scrollBy({ left: 340, behavior: "smooth" });
  }
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
