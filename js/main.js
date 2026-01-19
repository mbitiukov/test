const hero = document.getElementById("hero");
const choices = document.getElementById("choices");
const openChoicesBtn = document.getElementById("openChoices");

// HERO CLICK
if (hero && choices) {
  hero.addEventListener("click", () => {
    hero.style.display = "none";
    choices.classList.remove("hidden");
  });
}

// TOP MENU BUTTON
if (openChoicesBtn && hero && choices) {
  openChoicesBtn.addEventListener("click", (e) => {
    e.preventDefault();
    hero.style.display = "none";
    choices.classList.remove("hidden");
  });
}

// SERVICE WORKER 
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}
