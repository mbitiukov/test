const hero = document.getElementById("hero");
const choices = document.getElementById("choices");
const openChoicesBtn = document.getElementById("openChoices");

//Hero Click
if (hero && choices) {
  hero.addEventListener("click", () => {
    hero.style.display = "none";
    choices.classList.remove("hidden");
  });
}

//Top menu button
if (openChoicesBtn && hero && choices) {
  openChoicesBtn.addEventListener("click", (e) => {
    e.preventDefault();
    hero.style.display = "none";
    choices.classList.remove("hidden");
  });
}

//Serwise worker 
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}
//Back button
document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("pwa-back-btn");
  if (location.pathname.endsWith("index.html")) {
  backBtn.style.display = "none";
}


  if (!backBtn) return;

  const isPWA =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  if (isPWA) {
    backBtn.style.display = "block";
  }

  backBtn.addEventListener("click", () => {
    if (history.length > 1) {
      history.back();
    } else {
      window.location.href = "./index.html";
    }
  });
});
