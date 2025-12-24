// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Hero section animation
gsap.from(".feedback-hero-content", {
  duration: 1,
  y: 50,
  opacity: 0,
  ease: "power3.out",
});

// Rating section animation
gsap.from(".rating-container", {
  scrollTrigger: {
    trigger: ".rating-section",
    start: "top center",
  },
  duration: 1,
  y: 30,
  opacity: 0,
  ease: "power2.out",
});

// Form section animation
gsap.from(".form-content", {
  scrollTrigger: {
    trigger: ".feedback-form-section",
    start: "top center",
  },
  duration: 1,
  y: 50,
  opacity: 0,
  ease: "power2.out",
});

// Testimonials section animation
gsap.from(".testimonial-card", {
  scrollTrigger: {
    trigger: ".testimonials-section",
    start: "top center",
  },
  duration: 0.8,
  y: 30,
  opacity: 0,
  stagger: 0.2,
  ease: "power2.out",
});

// Star Rating functionality
const stars = document.querySelectorAll(".star-rating i");
const ratingText = document.querySelector(".rating-text");
let currentRating = 0;

stars.forEach((star) => {
  star.addEventListener("mouseover", () => {
    const rating = star.getAttribute("data-rating");
    updateStars(rating);
  });

  star.addEventListener("mouseout", () => {
    updateStars(currentRating);
  });

  star.addEventListener("click", () => {
    currentRating = star.getAttribute("data-rating");
    updateStars(currentRating);
    updateRatingText(currentRating);
  });
});

function updateStars(rating) {
  stars.forEach((star) => {
    const starRating = star.getAttribute("data-rating");
    if (starRating <= rating) {
      star.classList.add("active");
    } else {
      star.classList.remove("active");
    }
  });
}

function updateRatingText(rating) {
  const texts = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };
  ratingText.textContent = texts[rating] || "Click to rate";
}

// Dropdown functionality
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

// Form validation and submission
const feedbackForm = document.getElementById("feedbackForm");

feedbackForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form values
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const category = document.getElementById("category").value;
  const message = document.getElementById("message").value;
  const anonymous = document.getElementById("anonymous").checked;

  // Basic validation
  if (!name || !email || !category || !message) {
    alert("Please fill in all required fields");
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address");
    return;
  }

  // Rating validation
  if (currentRating === 0) {
    alert("Please provide a rating");
    return;
  }

  // Here you would typically send the form data to your server
  // For now, we'll just show a success message
  alert("Thank you for your feedback! We appreciate your input.");
  feedbackForm.reset();
  currentRating = 0;
  updateStars(0);
  updateRatingText(0);
});

// Add hover animations for testimonial cards
document.querySelectorAll(".testimonial-card").forEach((card) => {
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

// Add fade-in animation to elements when they come into view
const fadeElements = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.1,
  }
);

fadeElements.forEach((element) => {
  observer.observe(element);
});

// Smooth scroll for navigation links
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
