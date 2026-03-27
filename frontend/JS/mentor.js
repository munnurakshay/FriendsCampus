import { getAuth, onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
getFirestore,
collection,
getDocs,
addDoc,
serverTimestamp,
query,
where,
onSnapshot,
updateDoc,
doc
}
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { app } from "./firebaseConfig.js";

const auth = getAuth(app);
const db = getFirestore(app);

/* =========================
UI
========================= */

const profilesContainer = document.querySelector(".profiles");
const searchInput = document.getElementById("mentor_search");
const chatUsers = document.getElementById("chat_users");
const chatMessages = document.getElementById("chat_messages");
const chatHeader = document.getElementById("chat_user");

const loadedChats = new Set();

let mentors = [];
let currentRoom = null;


/* =========================
AUTH CHECK
========================= */

onAuthStateChanged(auth, async (user)=>{

if(!user){
window.location.href="login.html";
return;
}

loadMentors();
loadChats(user.uid);

});


/* =========================
LOAD MENTORS
========================= */

async function loadMentors(){

const snapshot = await getDocs(collection(db,"users"));

mentors = [];

snapshot.forEach(docSnap=>{

const data = docSnap.data();

if(docSnap.id === auth.currentUser.uid) return;

mentors.push({
id: docSnap.id,
name: data.name || "Student",
branch: data.branch || "",
skills: data.skills || [],
photo: data.photoURL || "/frontend/Assets/user_profile.png",
cover: data.coverURL || "/frontend/Assets/bg_img.jpg",
bio: data.bio || "No bio available"
});

});

showRandomMentors();

}


/* =========================
RANDOM MENTORS
========================= */

function showRandomMentors(){

const shuffled = mentors.sort(()=>0.5 - Math.random());

renderMentors(shuffled.slice(0,10));

}


/* =========================
RENDER MENTORS
========================= */

function renderMentors(list){

profilesContainer.innerHTML="";

list.forEach(mentor=>{

const card=document.createElement("div");

card.className="person";

card.innerHTML=`

<div class="image">

<div class="bg_img">
<img src="${mentor.cover}">
</div>

<div class="img">
<img src="${mentor.photo}">
</div>

</div>

<div class="profile_details">
<h2>${mentor.name}</h2>
<h3>${mentor.branch}</h3>
</div>

<div class="skills">
${mentor.skills.slice(0,3).join(" • ")}
</div>

<div class="mentor_actions">

<button class="view_profile">View Profile</button>

<button class="request_help">Request Help</button>

</div>

`;

card.querySelector(".view_profile").onclick=()=>{
openProfilePopup(mentor);
};

card.querySelector(".request_help").onclick=()=>{
sendHelpRequest(mentor);
};

profilesContainer.appendChild(card);

});

}


/* =========================
PROFILE POPUP
========================= */

function openProfilePopup(mentor){

const popup=document.createElement("div");

popup.className="profile_popup";

popup.innerHTML=`

<div class="popup_box">

<div class="popup_cover">
<img src="${mentor.cover}">
</div>

<div class="popup_img">
<img src="${mentor.photo}">
</div>

<h2>${mentor.name}</h2>
<h3>${mentor.branch}</h3>

<p>${mentor.bio}</p>

<p class="popup_skills">
${mentor.skills.join(" • ")}
</p>

<button id="close_popup">Close</button>

</div>

`;

document.body.appendChild(popup);

document.getElementById("close_popup").onclick=()=>{
popup.remove();
};

}


/* =========================
SEARCH (NAME + SKILL)
========================= */

searchInput.addEventListener("input",()=>{

const search = searchInput.value.toLowerCase();

if(search===""){
showRandomMentors();
return;
}

const filtered = mentors.filter(mentor=>{

const nameMatch = mentor.name.toLowerCase().includes(search);

const skillMatch = mentor.skills
.join(" ")
.toLowerCase()
.includes(search);

return nameMatch || skillMatch;

});

renderMentors(filtered);

});


/* =========================
SEND HELP REQUEST
========================= */

async function sendHelpRequest(mentor){

const user = auth.currentUser;

await addDoc(collection(db,"help_requests"),{

mentorId: mentor.id,
mentorName: mentor.name,

studentId: user.uid,
studentName: user.displayName || "Student",

status:"pending",

createdAt: serverTimestamp()

});

alert("Request sent to "+mentor.name);

}


/* =========================
LOAD CHATS
========================= */

function loadChats(uid){

const mentorQuery = query(
collection(db,"chats"),
where("mentorId","==",uid)
);

const studentQuery = query(
collection(db,"chats"),
where("studentId","==",uid)
);

/* listen mentor chats */
onSnapshot(mentorQuery,(snapshot)=>{

chatUsers.innerHTML="";
loadedChats.clear();

snapshot.forEach(docSnap=>{
addChatUser(docSnap);
});

});

/* listen student chats */
onSnapshot(studentQuery,(snapshot)=>{

snapshot.forEach(docSnap=>{
addChatUser(docSnap);
});

});

}


/* =========================
ADD CHAT USER
========================= */

function addChatUser(docSnap){

const data = docSnap.data();
const roomId = docSnap.id;

let otherUserId;
let otherUserName;

if(data.mentorId === auth.currentUser.uid){
otherUserId = data.studentId;
otherUserName = data.studentName;
}else{
otherUserId = data.mentorId;
otherUserName = data.mentorName;
}

if(document.getElementById("chat_"+otherUserId)) return;

const lastMsg = data.lastMessage || "";
const unread = data.lastSender !== auth.currentUser.uid && data.lastMessage;

const div = document.createElement("div");

div.className = "chat_user";
div.id = "chat_"+otherUserId;

div.innerHTML = `
<div class="chat_name">${otherUserName}</div>
<div class="chat_preview">${lastMsg}</div>
${unread ? `<span class="chat_badge">●</span>` : ""}
`;

div.onclick = ()=>{
openChat(roomId, otherUserName);
};

chatUsers.appendChild(div);

}


/* =========================
OPEN CHAT
========================= */

function openChat(roomId,name){

currentRoom = roomId;

chatHeader.innerText = name;

/* remove unread badge */

const badges = document.querySelectorAll(".chat_badge");
badges.forEach(b => b.remove());

listenMessages();

}


/* =========================
SEND MESSAGE
========================= */

document.getElementById("send_message").onclick = sendMessage;

async function sendMessage(){

const text = document.getElementById("chat_text").value;

if(!text || !currentRoom) return;

await addDoc(collection(db,"messages"),{

roomId: currentRoom,
senderId: auth.currentUser.uid,
text: text,
createdAt: serverTimestamp()

});

/* update last message */

await updateDoc(doc(db,"chats",currentRoom),{

lastMessage: text,
lastSender: auth.currentUser.uid,
lastTime: serverTimestamp()

});

document.getElementById("chat_text").value="";

}


/* =========================
REALTIME MESSAGES
========================= */

function listenMessages(){

const q=query(
collection(db,"messages"),
where("roomId","==",currentRoom)
);

onSnapshot(q,(snapshot)=>{

chatMessages.innerHTML="";

snapshot.forEach(docSnap=>{

const data=docSnap.data();

const div=document.createElement("div");

div.className="message";

if(data.senderId===auth.currentUser.uid){
div.classList.add("me");
}else{
div.classList.add("other");
}

div.textContent=data.text;

chatMessages.appendChild(div);

});

chatMessages.scrollTop = chatMessages.scrollHeight;

});

}