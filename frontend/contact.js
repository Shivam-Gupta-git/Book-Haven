// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Hero section animation
gsap.from(".contact-hero-content", {
  duration: 1,
  y: 50,
  opacity: 0,
  ease: "power3.out",
});

// Info cards animation
gsap.from(".info-card", {
  scrollTrigger: {
    trigger: ".contact-info",
    start: "top center",
  },
  duration: 0.8,
  y: 50,
  opacity: 0,
  stagger: 0.2,
  ease: "power2.out",
});

// Form section animation
gsap.from(".form-content", {
  scrollTrigger: {
    trigger: ".contact-form-section",
    start: "top center",
  },
  duration: 1,
  x: -50,
  opacity: 0,
  ease: "power2.out",
});

gsap.from(".map-container", {
  scrollTrigger: {
    trigger: ".contact-form-section",
    start: "top center",
  },
  duration: 1,
  x: 50,
  opacity: 0,
  ease: "power2.out",
});

// FAQ section animation
gsap.from(".faq-item", {
  scrollTrigger: {
    trigger: ".faq-section",
    start: "top center",
  },
  duration: 0.8,
  y: 30,
  opacity: 0,
  stagger: 0.2,
  ease: "power2.out",
});

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

// FAQ Accordion functionality
document.querySelectorAll(".faq-question").forEach((question) => {
  question.addEventListener("click", () => {
    const faqItem = question.parentElement;
    const isActive = faqItem.classList.contains("active");

    // Close all FAQ items
    document.querySelectorAll(".faq-item").forEach((item) => {
      item.classList.remove("active");
    });

    // If the clicked item wasn't active, open it
    if (!isActive) {
      faqItem.classList.add("active");
    }
  });
});

// Form validation and submission
const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form values
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  // Basic validation
  if (!name || !email || !subject || !message) {
    alert("Please fill in all fields");
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address");
    return;
  }

  // Here you would typically send the form data to your server
  // For now, we'll just show a success message
  alert("Thank you for your message! We'll get back to you soon.");
  contactForm.reset();
});

// Add hover animations for info cards
document.querySelectorAll(".info-card").forEach((card) => {
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
