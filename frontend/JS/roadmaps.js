const roadmapGrid = document.getElementById("roadmaps_grid");

/* =========================
ROADMAP DATA
========================= */

const roadmaps = [
{
  id: "frontend",
  title: "Frontend Developer",
  icon: "💻",
  desc: "Learn HTML, CSS, JS and build UI",
  modules: 6
},
{
  id: "backend",
  title: "Backend Developer",
  icon: "🛠️",
  desc: "Learn Node.js, APIs & databases",
  modules: 5
},
{
  id: "python",
  title: "Python Developer",
  icon: "🐍",
  desc: "Learn Python and automation",
  modules: 5
},
{
  id: "ai",
  title: "AI / ML Engineer",
  icon: "🤖",
  desc: "Machine learning & data science",
  modules: 6
},
{
  id: "android",
  title: "Android Developer",
  icon: "📱",
  desc: "Build mobile apps using Android",
  modules: 5
}
];

/* =========================
LOAD CARDS
========================= */

function loadRoadmaps(){

roadmapGrid.innerHTML = "";

roadmaps.forEach(r => {

const card = document.createElement("div");

card.className = "roadmap_card";

card.innerHTML = `

<div class="roadmap_icon">${r.icon}</div>

<div class="roadmap_title">${r.title}</div>

<div class="roadmap_desc">${r.desc}</div>

<div class="roadmap_meta">Modules: ${r.modules}</div>

<button class="start_btn">Start Learning</button>

`;

card.querySelector(".start_btn").onclick = () => {

localStorage.setItem("selectedRoadmap", r.id);

window.location.href = "roadmap_detail.html";

};

roadmapGrid.appendChild(card);

});

}

loadRoadmaps();