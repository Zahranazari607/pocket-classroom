// polish.js

const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️ Light";
  } else {
    document.body.classList.remove("dark");
    themeToggle.textContent = "🌙 Dark";
  }
  localStorage.setItem("pc_theme", theme);
}

themeToggle && themeToggle.addEventListener("click", () => {
  const current = localStorage.getItem("pc_theme") || "light";
  applyTheme(current === "dark" ? "light" : "dark");
});

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("pc_theme") || "light";
  applyTheme(saved);
});

document.addEventListener("keydown", e => {
  // Flip Flashcard
  if (e.code === "Space") {
    if (document.getElementById("flashcardsTabBtn") && document.getElementById("flashcardsTabBtn").classList.contains("active")) {
      e.preventDefault();
      document.getElementById("flashcard") && document.getElementById("flashcard").click();
    }
  }

  // Switch tabs
  if (e.key === "[") {
    const tabs = [...document.querySelectorAll("#learnTabs .nav-link")];
    let active = tabs.findIndex(t=>t.classList.contains("active"));
    let prev = (active-1+tabs.length)%tabs.length;
    tabs[prev] && tabs[prev].click();
  }
  if (e.key === "]") {
    const tabs = [...document.querySelectorAll("#learnTabs .nav-link")];
    let active = tabs.findIndex(t=>t.classList.contains("active"));
    let next = (active+1)%tabs.length;
    tabs[next] && tabs[next].click();
  }
});
