// Slider functionality
const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const dotsContainer = document.querySelector(".slider-dots");
const currentTimeSpan = document.querySelector(".current-time");

let currentSlide = 0;
const slideCount = slides.length;
const slideDuration = 5000; // 5 seconds
let progressInterval;
let timeInterval;
let currentTime = 0;

// Create dots
slides.forEach((_, index) => {
  const dot = document.createElement("div");
  dot.classList.add("dot");
  if (index === 0) dot.classList.add("active");
  dot.addEventListener("click", () => goToSlide(index));
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".dot");

function updateSlider() {
  slides.forEach((slide, index) => {
    slide.classList.remove("active");
    dots[index].classList.remove("active");
  });

  slides[currentSlide].classList.add("active");
  dots[currentSlide].classList.add("active");

  // Reset and start progress animation
  startProgressAnimation();
}

function startProgressAnimation() {
  // Clear existing intervals
  clearInterval(progressInterval);
  clearInterval(timeInterval);

  // Reset progress bar
  const progressBar = slides[currentSlide].querySelector(".slide-progress");
  progressBar.style.transform = "scaleX(0)";

  // Reset timer
  currentTime = 0;
  currentTimeSpan.textContent = currentTime;

  // Start progress animation
  let progress = 0;
  const step = 100 / (slideDuration / 16); // 60fps animation

  progressInterval = setInterval(() => {
    progress += step;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);
    }
    progressBar.style.transform = `scaleX(${progress / 100})`;
  }, 16);

  // Start timer
  timeInterval = setInterval(() => {
    currentTime++;
    currentTimeSpan.textContent = currentTime;
    if (currentTime >= slideDuration / 1000) {
      clearInterval(timeInterval);
    }
  }, 1000);
}

function goToSlide(index) {
  currentSlide = index;
  updateSlider();
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slideCount;
  updateSlider();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slideCount) % slideCount;
  updateSlider();
}

// Add click events to buttons
prevBtn.addEventListener("click", prevSlide);
nextBtn.addEventListener("click", nextSlide);

// Auto slide
let slideInterval = setInterval(nextSlide, slideDuration);

// Pause auto slide on hover
slider.addEventListener("mouseenter", () => {
  clearInterval(slideInterval);
  clearInterval(progressInterval);
  clearInterval(timeInterval);
});

slider.addEventListener("mouseleave", () => {
  slideInterval = setInterval(nextSlide, slideDuration);
  startProgressAnimation();
});

// Initialize first slide
updateSlider();

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Navbar scroll effect
// window.addEventListener("scroll", () => {
//   const navbar = document.querySelector(".navbar");
//   if (window.scrollY > 50) {
//     navbar.style.background = "rgba(255, 255, 255, 0.95)";
//     navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
//   } else {
//     navbar.style.background = "rgba(255, 255, 255, 0.95)";
//     navbar.style.boxShadow = "none";
//   }
// });

// Hero section animation
gsap.from(".hero-content", {
  duration: 1,
  y: 100,
  opacity: 0,
  ease: "power3.out",
});

gsap.from(".hero-image", {
  duration: 1,
  x: 100,
  opacity: 0,
  ease: "power3.out",
  delay: 0.3,
});

// Featured books animation
gsap.from(".book-card", {
  scrollTrigger: {
    trigger: ".featured",
    start: "top center",
    toggleActions: "play none none reverse",
  },
  duration: 0.8,
  y: 50,
  opacity: 0,
  stagger: 0.2,
  ease: "power2.out",
});

// Categories animation
gsap.from(".category-card", {
  scrollTrigger: {
    trigger: ".categories",
    start: "top center",
    toggleActions: "play none none reverse",
  },
  duration: 0.8,
  scale: 0.8,
  opacity: 0,
  stagger: 0.2,
  ease: "back.out(1.7)",
});

// Newsletter section animation
gsap.from(".newsletter-content", {
  scrollTrigger: {
    trigger: ".newsletter",
    start: "top center",
    toggleActions: "play none none reverse",
  },
  duration: 1,
  y: 50,
  opacity: 0,
  ease: "power2.out",
});

// Add to cart functionality
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", function () {
    const bookCard = this.closest(".book-card");
    const bookTitle = bookCard.querySelector("h3").textContent;

    // Animation for button click
    gsap.to(this, {
      scale: 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });

    // Show notification
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = `${bookTitle} added to cart!`;
    document.body.appendChild(notification);

    // Animate notification
    gsap.fromTo(
      notification,
      {
        y: -100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          setTimeout(() => {
            gsap.to(notification, {
              y: -100,
              opacity: 0,
              duration: 0.5,
              ease: "power2.in",
              onComplete: () => notification.remove(),
            });
          }, 2000);
        },
      }
    );
  });
});

// Newsletter form submission
const newsletterForm = document.querySelector(".newsletter-form");
newsletterForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = this.querySelector('input[type="email"]').value;

  if (email) {
    // Animation for form submission
    gsap.to(this, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });

    // Show success message
    const successMessage = document.createElement("div");
    successMessage.className = "success-message";
    successMessage.textContent = "Thank you for subscribing!";
    this.appendChild(successMessage);

    // Animate success message
    gsap.fromTo(
      successMessage,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      }
    );

    // Reset form
    this.reset();
  }
});

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));

    gsap.to(window, {
      duration: 1,
      scrollTo: {
        y: target,
        offsetY: 70,
      },
      ease: "power2.inOut",
    });
  });
});

// Add hover animations for category cards
document.querySelectorAll(".category-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    gsap.to(card, {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out",
    });
  });

  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  });
});

// Add CSS for notifications
const style = document.createElement("style");
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2c3e50;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 1000;
    }

    .success-message {
        color: #2ecc71;
        margin-top: 1rem;
        font-weight: bold;
    }
`;
document.head.appendChild(style);

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
