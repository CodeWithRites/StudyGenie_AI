// ===============================
// AI CHAT – FIXED VERSION
// ===============================

const API_URL = "http://localhost:3000";

// Go back to dashboard
window.goDashboard = function () {
  window.location.href = "dashboard.html";
};

// Send message
window.sendMessage = async function () {
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");
  const sendBtn = document.getElementById("sendBtn");

  if (!input || !chatBox) return;

  const message = input.value.trim();
  if (!message) return;

  sendBtn.disabled = true;

  // User message
  const userDiv = document.createElement("div");
  userDiv.className = "message user";
  userDiv.innerText = message;
  chatBox.appendChild(userDiv);

  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  // AI thinking
  const aiDiv = document.createElement("div");
  aiDiv.className = "message ai";
  aiDiv.innerText = "🤖 AI is typing...";
  chatBox.appendChild(aiDiv);

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    if (res.ok) {
      aiDiv.innerText = data.reply;
    } else {
      aiDiv.innerText = `❌ ${data.error || "Error"}`;
    }
  } catch (err) {
    aiDiv.innerText = "❌ Server error";
    console.error(err);
  }

  sendBtn.disabled = false;
  chatBox.scrollTop = chatBox.scrollHeight;
};

// Enter key support
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("userInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});
