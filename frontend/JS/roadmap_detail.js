const grid = document.getElementById("modules_grid");
const title = document.getElementById("roadmap_title");
const progressFill = document.getElementById("progress_fill");
const progressText = document.getElementById("progress_text");

/* =========================
ROADMAP DATA
========================= */
const roadmapData = {
  frontend: [
    "HTML Basics",
    "CSS Fundamentals",
    "JavaScript Basics",
    "Git & GitHub",
    "React Basics",
    "Build Projects"
  ]
};

/* =========================
LOAD SELECTED ROADMAP
========================= */
const roadmapId = localStorage.getItem("selectedRoadmap") || "frontend";
const modules = roadmapData[roadmapId];

title.innerText = roadmapId.toUpperCase() + " ROADMAP";

/* =========================
PROGRESS TRACKER
========================= */
// Fetch the list of completed module numbers from memory
let progressKey = "progress_" + roadmapId;
let completedModules = JSON.parse(localStorage.getItem(progressKey)) || [];

/* =========================
RENDER CARDS
========================= */
function loadModules() {
  grid.innerHTML = "";

  modules.forEach((mod, index) => {
    const card = document.createElement("div");
    card.className = "module_card";

    /* STATUS LOGIC */
    let statusClass = "locked";
    let statusText = "Locked";

    if (completedModules.includes(index)) {
      statusClass = "completed";
      statusText = "Done";
    } else if (index === completedModules.length) {
      statusClass = "active";
      statusText = "Start";
    }

    /* CARD UI */
    card.innerHTML = `
      <div class="module_number">Module ${index + 1}</div>
      <div class="module_title">${mod}</div>
      <div class="module_status ${statusClass}">
        ${statusText}
      </div>
    `;

    /* CLICK EVENT */
    if (statusClass !== "locked") {
      card.onclick = () => {
        // We save BOTH the Name (for the lesson) and the Index (for the progress bar)
        localStorage.setItem("selectedModule", mod);
        localStorage.setItem("selectedIndex", index);
        
        window.location.href = "module.html";
      };
    }

    grid.appendChild(card);
  });

  /* UPDATE PROGRESS BAR */
  const percent = Math.floor((completedModules.length / modules.length) * 100);
  progressFill.style.width = percent + "%";
  progressText.innerText = percent + "%";
}

loadModules();