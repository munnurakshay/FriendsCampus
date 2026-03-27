/* =========================
GET MODULE + ROADMAP
========================= */

let roadmap = localStorage.getItem("selectedRoadmap");
let moduleName = localStorage.getItem("selectedModule");

/* =========================
SAFE CHECK
========================= */

if (!roadmap || !moduleName) {
  alert("No module selected");
  window.location.href = "roadmaps.html";
}

/* =========================
LOAD QUESTIONS (FETCH JSON)
========================= */

async function getAllData() {
  try {

    const htmlQ = await fetch("/frontend/JS/data/HTML_Practice_Test.json").then(res => res.json());
    const cssQ = await fetch("/frontend/JS/data/CSS_Practice_Test.json").then(res => res.json());
    const jsQ = await fetch("/frontend/JS/data/JavaScript_Practice_Test.json").then(res => res.json());
    const nodeQ = await fetch("/frontend/JS/data/NodeJS_Practice_Test.json").then(res => res.json());
    const mongoQ = await fetch("/frontend/JS/data/MongoDB_Practice_Test.json").then(res => res.json());

    return {
      HTML: htmlQ.HTML_Practice_Test || htmlQ,
      CSS: cssQ.CSS_Practice_Test || cssQ,
      JavaScript: jsQ.JavaScript_Practice_Test || jsQ,
      NodeJS: nodeQ.NodeJS_Practice_Test || nodeQ,
      MongoDB: mongoQ.MongoDB_Practice_Test || mongoQ
    };

  } catch (err) {
    console.error("Fetch error:", err);
    alert("Error loading questions. Check JSON path.");
  }
}

/* =========================
MODULE → TOPIC MAP
========================= */

const moduleTopicMap = {
  frontend: {
    "HTML Basics": "HTML",
    "CSS Fundamentals": "CSS",
    "JavaScript Basics": "JavaScript"
  },
  backend: {
    "Node.js Basics": "NodeJS",
    "Databases": "MongoDB"
  }
};

/* =========================
QUIZ VARIABLES
========================= */

let questions = [];
let current = 0;
let score = 0;
let answered = false;

/* =========================
INIT QUIZ
========================= */

async function initQuiz() {

  const allQuestions = await getAllData();

  console.log("ROADMAP:", roadmap);
  console.log("MODULE:", moduleName);

  /* 🔥 FIXED MATCHING (case-insensitive) */
  const normalizedModule = moduleName.trim().toLowerCase();

  const matchedKey = Object.keys(moduleTopicMap[roadmap] || {}).find(
    key => key.toLowerCase() === normalizedModule
  );

  if (!matchedKey) {
    alert("Topic not found");
    return;
  }

  const topic = moduleTopicMap[roadmap][matchedKey];

  console.log("TOPIC:", topic);

  const data = allQuestions[topic];

  if (!data || data.length === 0) {
    alert("No questions available");
    return;
  }

  /* random 10 questions */
  questions = data.sort(() => 0.5 - Math.random()).slice(0, 10);

  loadQuestion();
}

initQuiz();

/* =========================
LOAD QUESTION
========================= */

function loadQuestion() {

  answered = false;

  const q = questions[current];

  document.getElementById("question_box").innerText = q.question;

  const optionsBox = document.getElementById("options_box");
  optionsBox.innerHTML = "";

  q.options.forEach(option => {

    const div = document.createElement("div");

    div.className = "option";
    div.innerText = option;

    div.onclick = () => selectAnswer(div, option, q.answer);

    optionsBox.appendChild(div);

  });

  updateProgress();
}

/* =========================
UPDATE PROGRESS
========================= */

function updateProgress() {

  const progressFill = document.getElementById("quiz_progress_fill");
  const progressText = document.getElementById("progress_count");

  progressFill.style.width =
    ((current + 1) / questions.length) * 100 + "%";

  progressText.innerText = `${current + 1} / ${questions.length}`;
}

/* =========================
SELECT ANSWER
========================= */

function selectAnswer(element, selected, correct) {

  if (answered) return;

  answered = true;

  const allOptions = document.querySelectorAll(".option");

  if (selected === correct) {
    element.classList.add("correct");
    score++;
  } else {
    element.classList.add("wrong");

    allOptions.forEach(opt => {
      if (opt.innerText === correct) {
        opt.classList.add("correct");
      }
    });
  }

}

/* =========================
NEXT BUTTON
========================= */

document.getElementById("next_btn").onclick = () => {

  if (!answered) {
    alert("Please select an answer first!");
    return;
  }

  current++;

  if (current < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }

};

/* =========================
RESULT SCREEN
========================= */

function showResult() {

  const container = document.querySelector(".quiz_wrapper");

  container.innerHTML = `

  <div class="result_box">

    <div class="result_card">

      <div class="result_icon">🎉</div>

      <div class="result_title">
        Congratulations!
      </div>

      <div class="result_score">
        You scored ${score} / ${questions.length}
      </div>

      <div class="result_xp">
        +${score * 10} XP earned
      </div>

      <div class="result_actions">
        <button class="result_btn" onclick="goBack()">Back to Modules</button>
        <button class="result_btn retry" onclick="retryQuiz()">Retry</button>
      </div>

    </div>

  </div>

  `;
}

/* =========================
NAVIGATION
========================= */

window.goBack = function () {
  window.location.href = "roadmap_detail.html";
};

window.retryQuiz = function () {
  current = 0;
  score = 0;
  initQuiz();
};