
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

function openMenu() {
  navLinks.classList.add("open");
  hamburger.classList.add("open");
}

function closeMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove("open");
}
// scroll section outlive links

let sections = document.querySelectorAll("section");
let navlinks = document.querySelectorAll("header nav a");

window.onscroll = () => {
  sections.forEach((sec) => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 150;
    let height = sec.offsetHeight;
    let id = sec.getAttribute("id");

    if (top >= offset && top < offset + height) {
      navlinks.forEach((links) => {
        links.classList.remove("active");
        document
          .querySelector("header nav a[href*=" + id + "]")
          .classList.add("active");
      });
    }
  });

  //  sTICKY navbar

  let header = document.querySelector("header");

  header.classList.toggle("sticky", window.scrollY > 100);
};
