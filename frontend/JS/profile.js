import { getAuth, onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
getFirestore,
doc,
getDoc,
updateDoc
}
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { app } from "./firebaseConfig.js";

const auth = getAuth(app);
const db = getFirestore(app);


/* =========================
UI ELEMENTS
========================= */

const userName = document.getElementById("user_name");
const userBranch = document.getElementById("user_branch");
const userBio = document.getElementById("user_bio");

const profileImg = document.getElementById("profile_img");
const coverImg = document.getElementById("cover_img");

const editBtn = document.getElementById("edit_profile");
const popup = document.getElementById("editPopup");
const closePopup = document.getElementById("closePopup");
const saveProfile = document.getElementById("saveProfile");

const editNameInput = document.getElementById("edit_name");
const editBioInput = document.getElementById("edit_bio");

const profileUpload = document.getElementById("profileUpload");
const coverUpload = document.getElementById("coverUpload");

const skillsContainer = document.querySelector(".skills_details");

/* =========================
ACHIEVEMENTS ELEMENTS
========================= */

const projectsCount = document.getElementById("projects_count");
const skillsCount = document.getElementById("skills_count");
const hackathonsCount = document.getElementById("hackathons_count");
const mentorsCount = document.getElementById("mentors_count");


/* =========================
PROJECT ELEMENTS
========================= */

const addProjectBtn = document.getElementById("add_project_btn");
const projectPopup = document.getElementById("projectPopup");
const closeProjectPopup = document.getElementById("closeProjectPopup");
const saveProjectBtn = document.getElementById("saveProject");

const projectTitleInput = document.getElementById("project_title_input");
const projectDescInput = document.getElementById("project_desc_input");
const projectLinkInput = document.getElementById("project_link_input");

const projectsContainer = document.getElementById("projects_container");


let profileBase64 = null;
let coverBase64 = null;
let projects = [];


/* =========================
AUTH CHECK
========================= */

onAuthStateChanged(auth, async (user)=>{

if(!user){
window.location.href="login.html";
return;
}

try{

const userRef = doc(db,"users",user.uid);
const snap = await getDoc(userRef);

if(snap.exists()){

const data = snap.data();

/* USER DETAILS */

userName.textContent = data.name;
userBranch.textContent = getFullBranchName(data.branch);

/* BIO */

if(data.bio){
userBio.textContent = data.bio;
}

/* PROFILE IMAGE */

if(data.photoURL){
profileImg.src = data.photoURL;
}

/* COVER IMAGE */

if(data.coverURL){
coverImg.src = data.coverURL;
}

/* SKILLS */

if(data.skills){
renderSkills(data.skills);
skillsCount.textContent = data.skills.length;
}else{
skillsCount.textContent = 0;
}

/* PROJECTS */

if(data.projects){
projects = data.projects;
renderProjects(projects);
projectsCount.textContent = projects.length;
}else{
projectsCount.textContent = 0;
}

/* HACKATHONS */

hackathonsCount.textContent = data.hackathons || 0;

/* MENTORS HELPED */

mentorsCount.textContent = data.mentors || 0;

}

}catch(err){
console.error(err);
}

});


/* =========================
BRANCH FULL NAME
========================= */

function getFullBranchName(branch){

const branchMap={
"CSE":"Computer Science & Engineering",
"CSM":"Computer Science & Engineering (AIML)",
"ECE":"Electronics & Communication Engineering",
"CS":"Cyber Security",
"IT":"Information Technology"
};

return branchMap[branch] || branch;

}


/* =========================
RENDER SKILLS
========================= */

function renderSkills(skills){

skillsContainer.innerHTML="";

skills.forEach(skill=>{

const div=document.createElement("div");

div.className="skill";

div.innerHTML=`
<img src="/frontend/Assets/skills/${skill.toLowerCase()}.png">
<p>${skill}</p>
`;

skillsContainer.appendChild(div);

});

}


/* =========================
RENDER PROJECTS
========================= */
function renderProjects(projectList){

projectsContainer.innerHTML="";

const visibleProjects = projectList.slice(0,2); // show first 2

visibleProjects.forEach((project,index)=>{

const card=document.createElement("div");

card.className="projects";

card.innerHTML=`

<h2 class="project_title">${project.title}</h2>

<h3 class="project_desc">${project.description}</h3>

<div class="project_buttons">

<button class="view_project"
onclick="window.open('${project.link}','_blank')">
View Project
</button>

<button class="delete_project"
data-index="${index}">
Delete
</button>

</div>

`;

projectsContainer.appendChild(card);

});


/* VIEW MORE BUTTON */

if(projectList.length > 2){

const viewMoreBtn=document.createElement("button");

viewMoreBtn.id="view_more_projects";
viewMoreBtn.textContent="View More";

viewMoreBtn.onclick=()=>{

projectsContainer.innerHTML="";

projectList.forEach((project,index)=>{

const card=document.createElement("div");

card.className="projects";

card.innerHTML=`

<h2 class="project_title">${project.title}</h2>

<h3 class="project_desc">${project.description}</h3>

<div class="project_buttons">

<button class="view_project"
onclick="window.open('${project.link}','_blank')">
View Project
</button>

<button class="delete_project"
data-index="${index}">
Delete
</button>

</div>

`;

projectsContainer.appendChild(card);

});

};

projectsContainer.appendChild(viewMoreBtn);

}


/* DELETE PROJECT */

document.querySelectorAll(".delete_project").forEach(btn=>{

btn.onclick = async ()=>{

const index = btn.dataset.index;

projects.splice(index,1);

const user = auth.currentUser;

await updateDoc(doc(db,"users",user.uid),{
projects:projects
});

renderProjects(projects);

};

});

}


/* =========================
PROFILE POPUP
========================= */

editBtn.onclick=()=>{

popup.style.visibility="visible";

editNameInput.value=userName.textContent;
editBioInput.value=userBio.textContent;

};

closePopup.onclick=()=>{
popup.style.visibility="hidden";
};


/* =========================
PROFILE IMAGE
========================= */

profileUpload.onchange=()=>{

const file=profileUpload.files[0];
const reader=new FileReader();

reader.onload=()=>{
profileBase64=reader.result;
profileImg.src=reader.result;
};

reader.readAsDataURL(file);

};


/* =========================
COVER IMAGE
========================= */

coverUpload.onchange=()=>{

const file=coverUpload.files[0];
const reader=new FileReader();

reader.onload=()=>{
coverBase64=reader.result;
coverImg.src=reader.result;
};

reader.readAsDataURL(file);

};


/* =========================
SAVE PROFILE
========================= */

saveProfile.onclick=async()=>{

const user=auth.currentUser;
if(!user) return;

const selectedSkills=[];

document.querySelectorAll(".skill_select input:checked").forEach(skill=>{
selectedSkills.push(skill.value);
});

const updateData={
name:editNameInput.value,
bio:editBioInput.value,
skills:selectedSkills
};

if(profileBase64) updateData.photoURL=profileBase64;
if(coverBase64) updateData.coverURL=coverBase64;

await updateDoc(doc(db,"users",user.uid),updateData);

renderSkills(selectedSkills);

userName.textContent=editNameInput.value;
userBio.textContent=editBioInput.value;
skillsCount.textContent = selectedSkills.length;

popup.style.visibility="hidden";

};


/* =========================
PROJECT POPUP
========================= */

addProjectBtn.onclick=()=>{
projectPopup.style.visibility="visible";
};

closeProjectPopup.onclick=()=>{
projectPopup.style.visibility="hidden";
};


/* =========================
SAVE PROJECT
========================= */

saveProjectBtn.onclick=async()=>{

const user=auth.currentUser;
if(!user) return;

const newProject={
title:projectTitleInput.value,
description:projectDescInput.value,
link:projectLinkInput.value
};

projects.push(newProject);

await updateDoc(doc(db,"users",user.uid),{
projects:projects
});

renderProjects(projects);
projectsCount.textContent = projects.length;

projectPopup.style.visibility="hidden";

projectTitleInput.value="";
projectDescInput.value="";
projectLinkInput.value="";

};


/* =========================
BURGER MENU
========================= */

const burger=document.getElementById("burger");
const nav=document.querySelector(".nav");

burger.addEventListener("click",()=>{
nav.classList.toggle("active");
});