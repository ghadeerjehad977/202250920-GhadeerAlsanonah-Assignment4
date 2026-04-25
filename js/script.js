const greeting = document.getElementById("greeting");

if (greeting) {
  const hour = new Date().getHours();

  if (hour < 12) {
    greeting.textContent = "Good morning! 👋";
  } else if (hour < 18) {
    greeting.textContent = "Good afternoon! 👋";
  } else {
    greeting.textContent = "Good evening! 👋";
  }
}

const toggleBtn = document.getElementById("toggleProjectsBtn");
const projectsSection = document.getElementById("projects");

toggleBtn.addEventListener("click", ()=> {
  if (projectsSection.style.display === "none"){
    projectsSection.style.display = "block";
  }
  else{
    projectsSection.style.display = "none";
  }
});

const form = document.getElementById("contactForm");
const message = document.getElementById("formMessage");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const inputs = form.querySelectorAll("input, textarea");
  let isValid = true;

  inputs.forEach(input => {
    if(input.value.trim() === ""){
      isValid= false;
    }
  });

  if (!isValid){
    message.textContent = "Please fill all fields";
    message.style.color = "red";
  } else{
    message.textContent = "Message is sent successfully!";
    message.style.color= "lightgreen";
    form.reset();
  }
});

const themeBtn = document.querySelector(".theme-btn");

// Load saved theme when page opens
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
}

// Toggle theme on click
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
        localStorage.setItem("theme", "light");
    } else {
        localStorage.setItem("theme", "dark");
    }
});

const repoList = document.getElementById("repoList");
const repoStatus = document.getElementById("repoStatus");

fetch("https://api.github.com/users/ghadeerjehad977/repos")
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to load repositories.");
        }
        return response.json();
    })
    .then(repos => {
        repoStatus.textContent = "";

        if (repos.length === 0) {
            repoStatus.textContent = "No repositories found.";
            return;
        }

        repos.slice(0, 6).forEach(repo => {
            const card = document.createElement("div");
            card.classList.add("project-card");

            card.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description ? repo.description : "No description available."}</p>
                <a href="${repo.html_url}" target="_blank">View Repository</a>
            `;

            repoList.appendChild(card);
        });
    })
    .catch(error => {
        repoStatus.textContent = "Sorry, GitHub projects could not be loaded right now.";
    });

    const filterSelect = document.getElementById("filterProjects");
    const sortSelect = document.getElementById("sortProjects");

    const projectContainer = document.querySelector("#projects .card-grid");
    const projectCards = Array.from(projectContainer.children);

    // FILTER
    filterSelect.addEventListener("change", () => {
        const value = filterSelect.value;

        projectCards.forEach(card => {
            if (value === "all" || card.dataset.category === value) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });

    // SORT
    sortSelect.addEventListener("change", () => {
        const value = sortSelect.value;

        let sorted = [...projectCards];

        if (value === "az") {
            sorted.sort((a, b) => {
                return a.querySelector("h3").textContent.localeCompare(
                    b.querySelector("h3").textContent
                );
            });
        }

        if (value === "za") {
            sorted.sort((a, b) => {
                return b.querySelector("h3").textContent.localeCompare(
                    a.querySelector("h3").textContent
                );
            });
        }

        // reset order
        if (value === "default") {
            sorted = projectCards;
        }

        // re-append in new order
        sorted.forEach(card => projectContainer.appendChild(card));
    });