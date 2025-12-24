// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Hero section animation
gsap.from(".about-hero-content", {
  duration: 1,
  y: 50,
  opacity: 0,
  ease: "power3.out",
});

// Story section animation
gsap.from(".story-text", {
  scrollTrigger: {
    trigger: ".about-story",
    start: "top center",
  },
  duration: 1,
  x: -50,
  opacity: 0,
  ease: "power2.out",
});

gsap.from(".story-image", {
  scrollTrigger: {
    trigger: ".about-story",
    start: "top center",
  },
  duration: 1,
  x: 50,
  opacity: 0,
  ease: "power2.out",
});

// Values section animation
gsap.from(".value-card", {
  scrollTrigger: {
    trigger: ".about-values",
    start: "top center",
  },
  duration: 0.8,
  y: 50,
  opacity: 0,
  stagger: 0.2,
  ease: "power2.out",
});

// Team section animation
gsap.from(".team-member", {
  scrollTrigger: {
    trigger: ".about-team",
    start: "top center",
  },
  duration: 0.8,
  scale: 0.8,
  opacity: 0,
  stagger: 0.2,
  ease: "back.out(1.7)",
});

// Stats section animation
gsap.from(".stat-item", {
  scrollTrigger: {
    trigger: ".about-stats",
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

// Add hover animations for team members
document.querySelectorAll(".team-member").forEach((member) => {
  member.addEventListener("mouseenter", () => {
    gsap.to(member, {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out",
    });
  });

  member.addEventListener("mouseleave", () => {
    gsap.to(member, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  });
});

// Add hover animations for value cards
document.querySelectorAll(".value-card").forEach((card) => {
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
