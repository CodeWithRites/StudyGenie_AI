// Protect dashboard
checkAuth();

// Load user data
const user = JSON.parse(localStorage.getItem("user"));
const username = user.email.split("@")[0];

document.getElementById("welcomeText").innerText =
  `Welcome back, ${username.charAt(0).toUpperCase() + username.slice(1)} 👋`;

// Navigation
function goUpload() {
  window.location.href = "upload.html";
}

function goChat() {
  window.location.href = "chat.html";
}

// Profile modal
function openProfile() {
  document.getElementById("profileEmail").innerText = user.email;
  document.getElementById("profileUniversity").innerText =
    user.university || "Not provided";
  document.getElementById("profilePhone").innerText =
    user.phone || "Not provided";

  document.getElementById("profileModal").style.display = "flex";
}

function closeProfile() {
  document.getElementById("profileModal").style.display = "none";
}
