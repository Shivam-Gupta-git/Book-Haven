// // API URL - Change this to match your backend URL
// const API_URL = "http://localhost:4000/api";

// // DOM Elements - Login
// const loginForm = document.getElementById("login-form");
// const loginEmail = document.getElementById("login-email");
// const loginPassword = document.getElementById("login-password");
// const loginError = document.getElementById("login-error");

// // DOM Elements - Signup
// const signupForm = document.getElementById("signup-form");
// const signupName = document.getElementById("signup-name");
// const signupEmail = document.getElementById("signup-email");
// const signupPassword = document.getElementById("signup-password");
// const signupConfirmPassword = document.getElementById(
//   "signup-confirm-password"
// );
// const signupError = document.getElementById("signup-error");

// // DOM Elements - Auth UI
// const loginLink = document.getElementById("login-link");
// const signupLink = document.getElementById("signup-link");
// const logoutLink = document.getElementById("logout-link");
// const userInfo = document.getElementById("user-info");
// const sectionLink = document.getElementById("section-link");

// // Check if user is already logged in
// function checkAuthStatus() {
//   const token = localStorage.getItem("token");
//   const currentPath = window.location.pathname;

//   if (token) {
//     // User is logged in
//     if (
//       currentPath.includes("login.html") ||
//       currentPath.includes("signup.html")
//     ) {
//       // Redirect to home page if trying to access login/signup while logged in
//       window.location.href = "Home.html";
//     }
//   }
// }

// // Handle Login Form Submit
// if (loginForm) {
//   loginForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     loginError.textContent = "";

//     try {
//       const response = await fetch(`${API_URL}/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: loginEmail.value,
//           password: loginPassword.value,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to login");
//       }

//       // Save token and user data
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));

//       // Redirect to home page after login
//       window.location.href = "Home.html";
//     } catch (error) {
//       loginError.textContent = error.message;
//     }
//   });
// }

// // Handle Signup Form Submit
// if (signupForm) {
//   signupForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     signupError.textContent = "";

//     // Validate password match
//     if (signupPassword.value !== signupConfirmPassword.value) {
//       signupError.textContent = "Passwords do not match";
//       return;
//     }

//     try {
//       const response = await fetch(`${API_URL}/auth/register`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: signupName.value,
//           email: signupEmail.value,
//           password: signupPassword.value,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to register");
//       }

//       // Save token and user data
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));

//       // Redirect to home page after signup
//       window.location.href = "Home.html";
//     } catch (error) {
//       signupError.textContent = error.message;
//     }
//   });
// }

// // Logout function
// function logout() {
//   localStorage.removeItem("token");
//   localStorage.removeItem("user");
//   // Redirect to home page after logout
//   window.location.href = "Home.html";
// }

// // Update UI based on authentication status
// function updateAuthUI() {
//   const token = localStorage.getItem("token");
//   const user = JSON.parse(localStorage.getItem("user") || "{}");

//   // Update login/logout links visibility
//   if (loginLink && signupLink && logoutLink && userInfo) {
//     if (token) {
//       // User is logged in
//       loginLink.parentElement.style.display = "none";
//       signupLink.parentElement.style.display = "none";
//       logoutLink.parentElement.style.display = "block";
//       userInfo.parentElement.style.display = "block";
//       userInfo.textContent = `Hello, ${user.name}`;
//     } else {
//       // User is logged out
//       loginLink.parentElement.style.display = "block";
//       signupLink.parentElement.style.display = "block";
//       logoutLink.parentElement.style.display = "none";
//       userInfo.parentElement.style.display = "none";
//     }
//   }

//   // Update section link based on authentication
//   if (sectionLink) {
//     if (token) {
//       sectionLink.href = "index.html";
//     } else {
//       sectionLink.href = "login.html";
//     }
//   }
// }

// // Call these functions when the page loads
// document.addEventListener("DOMContentLoaded", () => {
//   checkAuthStatus();
//   updateAuthUI();
// });
