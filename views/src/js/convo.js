const hamburger = document.querySelector(".hamburger");
const burger = document.querySelector(".burger");
const naavLinks = document.querySelector(".naav-links");
const links = document.querySelectorAll(".naav-links li");
const naavLinks1 = document.querySelector(".naav-links-1");
const links1 = document.querySelectorAll(".naav-links-1 li");

hamburger.addEventListener("mousedown", () => {
  // recognition.start();
  naavLinks.classList.toggle("open");
  links.forEach(link => {
    link.classList.toggle("fade");
  });
});

// hamburger.addEventListener("mouseup", () => {
//   recognition.stop();
// });

burger.addEventListener("mousedown", () => {
  naavLinks1.classList.toggle("open");
  links1.forEach(link => {
    link.classList.toggle("fade");
  });
});
