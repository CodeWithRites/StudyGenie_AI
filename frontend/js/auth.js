const API_URL = "http://localhost:3000";

// LOGIN
async function login() {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      window.location.href = "dashboard.html";
    } else {
      alert(data.message);
    }
  } catch {
    alert("Server not responding. Please try again later.");
  }
}

// SIGNUP
async function signup() {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const university = document.getElementById("university").value;
    const phone = document.getElementById("phone").value;

    const res = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, university, phone })
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) window.location.href = "login.html";
  } catch {
    alert("Server not responding.");
  }
}

// LOGOUT
function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// PROTECT PAGES
function checkAuth() {
  if (!localStorage.getItem("user")) {
    window.location.href = "login.html";
  }
}

window.login = login;
window.signup = signup;
window.logout = logout;
window.checkAuth = checkAuth;
