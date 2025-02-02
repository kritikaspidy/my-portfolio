// Function to toggle additional info (used in the About section)
function toggleInfo(id) {
    const info = document.getElementById(id);
    info.classList.toggle('show');
}

// Flip card functionality (to flip qualifications, certifications, etc.)
let lastFlipped = null;

function flipCard(card) {
    if (lastFlipped && lastFlipped !== card) {
        lastFlipped.classList.remove("flipped");
    }

    card.classList.toggle("flipped");
    lastFlipped = card.classList.contains("flipped") ? card : null;
}

// Filter Skills based on category selection
function filterSkills(category) {
    const skills = document.querySelectorAll("#skills-list li");
    skills.forEach(skill => {
        if (category === 'all' || skill.classList.contains(category)) {
            skill.classList.remove('hide');
            skill.classList.add('show');
        } else {
            skill.classList.remove('show');
            skill.classList.add('hide');
        }
    });
}
filterSkills('all');

const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;
    const sidebar = document.getElementById("sidebar"); // Ensure this is defined

    // Check saved theme from localStorage
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
        body.classList.add(savedTheme);
        sidebar.classList.add(savedTheme);
        themeToggle.innerHTML = savedTheme === "dark-mode"
            ? '<i class="fas fa-sun"></i>'  // Sun icon for dark mode
            : '<i class="fas fa-moon"></i>'; // Moon icon for light mode
    } else {
        body.classList.add("dark-mode"); // Default to light mode
        sidebar.classList.add("dark-mode");
    }

    // Toggle Theme
    themeToggle.addEventListener("click", () => {
        if (body.classList.contains("dark-mode")) {
            body.classList.remove("dark-mode");
            sidebar.classList.remove("dark-mode");
            body.classList.add("light-mode");
            sidebar.classList.add("light-mode");
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Moon icon
            localStorage.setItem("theme", "light-mode");
        } else {
            body.classList.remove("light-mode");
            sidebar.classList.remove("light-mode");
            body.classList.add("dark-mode");
            sidebar.classList.add("dark-mode");
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Sun icon
            localStorage.setItem("theme", "dark-mode");
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    var typed = new Typed(".typing", {
        strings: ["Fullstack Developer", "Software Designer"],
        typeSpeed: 100,
        backSpeed: 40,
        loop: true
    });
});


// Functionality to animate progress bars as the user scrolls to the skills section
window.addEventListener('scroll', function () {
    const skillsSection = document.querySelector('.skills');
    const skillBoxes = document.querySelectorAll('.skill-box');

    const sectionTop = skillsSection.offsetTop;
    const sectionHeight = skillsSection.offsetHeight;
    const scrollPosition = window.scrollY + window.innerHeight;

    if (scrollPosition > sectionTop + sectionHeight / 4) {
        skillBoxes.forEach(skillBox => {
            skillBox.classList.add('active');
            const progressBar = skillBox.querySelector('.progress');
            const progress = progressBar.getAttribute('data-progress');
            progressBar.style.width = progress;
        });
    }
});


document.addEventListener("DOMContentLoaded", function () {
    let swiper = new Swiper(".swiper", {
        spaceBetween: 24,
        loop: true,
        grabCursor: true,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
        576: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 48,
        },
        
      },
    });
});

document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("HvzKH6rXLSuwvNAPM"); // Replace with your EmailJS Public Key

    document.getElementById("contact-form").addEventListener("submit", function (event) {
        event.preventDefault();

        let params = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            mobile: document.getElementById("mobile").value,
            subject: document.getElementById("subject").value,
            message: document.getElementById("message").value
        };

        console.log("Sending message with params:", params);

        emailjs.send("service_06g5u91", "template_wafq7p1", params)
            .then(function (response) {
                alert("Message sent successfully!");
                document.getElementById("contact-form").reset();
            }, function (error) {
                alert("Failed to send message. Try again later.");
                console.error("EmailJS Error:", error);
            });
    });
});

// Get the elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('menu-icon');
const closeBtn = document.getElementById('close-btn');

// Open the sidebar when the menu icon is clicked
sidebarToggle.addEventListener('click', () => {
    sidebar.classList.add('active');
});

// Close the sidebar when the close button is clicked
closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('active');
});

