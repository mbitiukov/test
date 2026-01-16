const hero = document.getElementById("hero");
const choices = document.getElementById("choices");

hero.addEventListener("click", () => {
  hero.style.display = "none";
  choices.classList.remove("hidden");
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}

// Top menu button
document.getElementById("openChoices").addEventListener("click", (e) => {
  e.preventDefault();
  hero.style.display = "none";
  choices.classList.remove("hidden");
});
