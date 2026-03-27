/* =========================
1. GET MODULE + ROADMAP
========================= */
const roadmap = localStorage.getItem("selectedRoadmap");
const moduleName = localStorage.getItem("selectedModule");

/* =========================
2. SAFE CHECK
========================= */
if (!roadmap || !moduleName) {
  alert("No module selected");
  window.location.href = "roadmaps.html";
}

/* =========================
3. MODULE CONTENT DATA
========================= */
const moduleContent = {
  frontend: {
    "HTML Basics": {
      title: "HTML Basics",
      desc: "Learn how web pages are structured using HTML.",
      topics: [
        { title: "What is HTML?", content: "HTML (HyperText Markup Language) is used to create and structure web pages." },
        { title: "Basic Structure", content: "&lt;html&gt;\n  &lt;head&gt;\n    &lt;title&gt;Page&lt;/title&gt;\n  &lt;/head&gt;\n  &lt;body&gt;\n    Content\n  &lt;/body&gt;\n&lt;/html&gt;" },
        { title: "Text Tags", content: "&lt;h1&gt; to &lt;h6&gt;, &lt;p&gt;, &lt;span&gt;" },
        { title: "Links & Images", content: "&lt;a href=''&gt;Link&lt;/a&gt;, &lt;img src='' /&gt;" },
        { title: "Lists", content: "&lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;" },
        { title: "Forms", content: "&lt;form&gt;, &lt;input&gt;, &lt;label&gt;, &lt;button&gt;" }
      ]
    },
    "CSS Fundamentals": {
      title: "CSS Fundamentals",
      desc: "Learn how to style web pages using CSS.",
      topics: [
        { title: "What is CSS?", content: "CSS is used to style HTML elements." },
        { title: "Selectors", content: "class, id, element selectors" },
        { title: "Box Model", content: "margin, padding, border, content" },
        { title: "Flexbox", content: "Used for layout alignment" }
      ]
    },
    "JavaScript Basics": {
      title: "JavaScript Basics",
      desc: "Add interactivity to your website.",
      topics: [
        { title: "Variables", content: "let, const, var" },
        { title: "Functions", content: "Reusable blocks of code" },
        { title: "DOM Manipulation", content: "Change HTML dynamically" }
      ]
    }
  },
  backend: {
    "Node.js Basics": {
      title: "Node.js Basics",
      desc: "Build backend servers using Node.js.",
      topics: [
        { title: "What is Node.js?", content: "JavaScript runtime for server-side" },
        { title: "Express.js", content: "Framework for building APIs" },
        { title: "Routing", content: "Handle different API endpoints" }
      ]
    }
  }
};

/* =========================
4. SMART MODULE MATCH
========================= */
const modules = moduleContent[roadmap]; 
let data = null;

if (modules && moduleName) {
  const safeModuleName = moduleName.toString().toLowerCase().trim();
  const matchedKey = Object.keys(modules).find(
    key => key.toLowerCase().trim() === safeModuleName
  );

  if (matchedKey) {
    data = modules[matchedKey];
  }
}

/* =========================
5. UI ELEMENTS & LOAD DATA
========================= */
const titleEl = document.getElementById("module_title");
const descEl = document.getElementById("module_desc");
const topicsContainer = document.getElementById("module_topics");

if (!data) {
  titleEl.innerText = "Content not found ❌";
  descEl.innerText = `Could not load module: "${moduleName}". Please go back and try again.`;
} else {
  titleEl.innerText = data.title;
  descEl.innerText = data.desc;
  topicsContainer.innerHTML = "";

  data.topics.forEach(topic => {
    const div = document.createElement("div");
    div.className = "topic_card";
    div.innerHTML = `
      <h4>${topic.title}</h4>
      <p>${topic.content}</p>
    `;
    topicsContainer.appendChild(div);
  });
}

/* =========================
6. START QUIZ & SAVE PROGRESS
========================= */
document.getElementById("start_quiz").onclick = () => {
  
  // A. Get the current roadmap and the index of the module we are on
  const currentRoadmap = localStorage.getItem("selectedRoadmap");
  const currentIndex = parseInt(localStorage.getItem("selectedIndex"));

  // B. Load the old progress array
  let progressKey = "progress_" + currentRoadmap; 
  let completedModules = JSON.parse(localStorage.getItem(progressKey)) || [];

  // C. Add this module to "Done" list (if not already there and if it's a valid number)
  if (!isNaN(currentIndex) && !completedModules.includes(currentIndex)) {
      completedModules.push(currentIndex);
      localStorage.setItem(progressKey, JSON.stringify(completedModules));
  }

  // D. Save the exact Name for the quiz page
  if (data) {
    localStorage.setItem("selectedModule", data.title); 
  }
  
  // E. Move to Quiz
  window.location.href = "quiz.html";
};