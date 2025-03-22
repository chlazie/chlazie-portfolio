
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

  // dark mode
  const checkbox = document.getElementById("checkbox")
checkbox.addEventListener("change", () => {
  document.body.classList.toggle("dark")
});


// Listen for the toggle action
checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
  }
});

// Load saved theme preference on page load
window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    checkbox.checked = true;
  }
});



  //  sTICKY navbar

  let header = document.querySelector("header");

  header.classList.toggle("sticky", window.scrollY > 100);
};

// auto typing
const typingText = document.getElementById("typing-text");
const words = ["Frontend Developer.", "Web Designer.", "Writer.","AI Developer.", "Youtuber.", "Tik Toker."];
// typingText.style.width = `${typingText.textContent.length}ch`;
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentWord = words[wordIndex];

  // Update text content based on typing or deleting
  if (isDeleting) {
    typingText.textContent = currentWord.substring(0, charIndex--);
  } else {
    typingText.textContent = currentWord.substring(0, charIndex++);
  }

  // Pause when the word is fully typed or deleted
  if (!isDeleting && charIndex === currentWord.length) {
    isDeleting = true;
    setTimeout(typeEffect, 1000); // Pause before deleting
    return;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length; // Move to the next word
    setTimeout(typeEffect, 800); // Pause before re-typing
    return;
  }

  // Adjust typing and deleting speeds
  setTimeout(typeEffect, isDeleting ? 100 : 200); // Slower typing and deleting
}


// Start the typing effect
typeEffect();

const nameElement = document.getElementById('name-change');
const names = ['Solace', 'Chlazie De-solo'];
let index = 0;

function changeName() {
  nameElement.classList.add('hidden'); // Fade out effect
  setTimeout(() => {
    nameElement.textContent = names[index]; // Change the text
    nameElement.classList.remove('hidden'); // Fade in effect
    index = (index + 1) % names.length; // Move to the next name
  }, 500); // Match the transition duration in CSS
}

setInterval(changeName, 3000); // Change every 3 seconds
