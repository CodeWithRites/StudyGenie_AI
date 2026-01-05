// HOME
document.getElementById("homeBtn")?.addEventListener("click", () => {
  window.location.href = "index.html";
});

// FEATURES (scroll)
document.getElementById("featuresBtn")?.addEventListener("click", () => {
  document.getElementById("features").scrollIntoView({
    behavior: "smooth"
  });
});

// LOGIN
document.getElementById("loginBtn")?.addEventListener("click", () => {
  window.location.href = "login.html";
});

// TRY FREE
document.getElementById("tryFreeBtn")?.addEventListener("click", () => {
  window.location.href = "dashboard.html";
});

// GET STARTED FREE
document.getElementById("getStartedBtn")?.addEventListener("click", () => {
  window.location.href = "dashboard.html";
});

// WATCH DEMO
document.getElementById("watchDemoBtn")?.addEventListener("click", () => {
  window.location.href = "demo.html";
});
