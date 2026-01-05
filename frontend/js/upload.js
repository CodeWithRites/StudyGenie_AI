// Protect page
checkAuth();

function goDashboard() {
  window.location.href = "dashboard.html";
}

function uploadNotes() {
  const subject = document.getElementById("subject").value;
  const fileInput = document.getElementById("fileInput");
  const status = document.getElementById("statusText");

  if (!subject || fileInput.files.length === 0) {
    status.innerText = "⚠️ Please enter subject and select a PDF file.";
    return;
  }

  const file = fileInput.files[0];

  if (file.type !== "application/pdf") {
    status.innerText = "❌ Only PDF files are allowed.";
    return;
  }

  // FRONTEND DEMO (no backend yet)
  status.innerText = "⏳ Uploading notes...";

  setTimeout(() => {
    status.innerText = "✅ Notes uploaded successfully! (AI summary coming soon)";
    fileInput.value = "";
    document.getElementById("subject").value = "";
  }, 1500);
}
