import { getAuth, onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
getFirestore,
collection,
query,
where,
getDocs,
updateDoc,
doc,
getDoc,
addDoc,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { app } from "./firebaseConfig.js";

const auth = getAuth(app);
const db = getFirestore(app);

/* =========================
UI ELEMENTS
========================= */

const hackathonsContainer = document.querySelector(".hackathons");
const notificationContainer = document.getElementById("request_notifications");

/* =========================
AUTH CHECK
========================= */

onAuthStateChanged(auth, async (user)=>{

if(!user){
window.location.href="login.html";
return;
}

/* get user name */

const userRef = doc(db,"users",user.uid);
const snap = await getDoc(userRef);

let name="Student";

if(snap.exists()){
name = snap.data().name || "Student";
}

/* greeting */

setGreeting(name);

/* load mentor requests */

loadRequests(user.uid);

/* hackathons */

loadHackathons();

});


/* =========================
MENTOR REQUEST NOTIFICATIONS
========================= */

async function loadRequests(uid){

if(!notificationContainer) return;

notificationContainer.innerHTML="";

const q = query(
collection(db,"help_requests"),
where("mentorId","==",uid),
where("status","==","pending")
);

const snapshot = await getDocs(q);

if(snapshot.empty){
notificationContainer.innerHTML="<p>No notifications</p>";
return;
}

snapshot.forEach(docSnap=>{

const data = docSnap.data();

const card = document.createElement("div");

card.className="request_card";

card.innerHTML=`

<strong>${data.studentName}</strong> requested help

<div class="request_actions">

<button class="accept_btn">Accept</button>
<button class="reject_btn">Reject</button>

</div>

`;

card.querySelector(".accept_btn").onclick = async ()=>{

/* update request */

await updateDoc(doc(db,"help_requests",docSnap.id),{
status:"accepted"
});

/* create chat */

await addDoc(collection(db,"chats"),{

mentorId:data.mentorId,
mentorName:data.mentorName,

studentId:data.studentId,
studentName:data.studentName,

createdAt:serverTimestamp()

});

card.remove();

};

card.querySelector(".reject_btn").onclick = async ()=>{

await updateDoc(doc(db,"help_requests",docSnap.id),{
status:"rejected"
});

card.remove();

};

notificationContainer.appendChild(card);

});

}


/* =========================
STATIC HACKATHONS
========================= */

const hackathons = [

{ name:"BIET Hackathon", date:"12 April 2026", status:"Upcoming"},
{ name:"Smart India Hackathon", date:"12 Sep 2026", status:"Upcoming"},
{ name:"College Hack Day", date:"25 Nov 2026", status:"Upcoming"},
{ name:"AI Mini Hackathon", date:"10 Dec 2026", status:"Upcoming"}

];


/* =========================
RENDER HACKATHONS
========================= */

function loadHackathons(){

if(!hackathonsContainer) return;

hackathonsContainer.innerHTML="<h3>Upcoming Hackathons</h3>";

hackathons.forEach(hack=>{

const card=document.createElement("div");

card.className="card";

card.innerHTML=`

<div class="title">${hack.name}</div>
<div class="date">${hack.date}</div>
<div class="status">${hack.status}</div>

`;

hackathonsContainer.appendChild(card);

});

}


/* =========================
DYNAMIC GREETING
========================= */

function setGreeting(name){

const greetingEl=document.getElementById("greeting");
const motivationEl=document.getElementById("motivation");

if(!greetingEl || !motivationEl) return;

const hour=new Date().getHours();

let greetingText="";
let motivationText="";

if(hour>=5 && hour<12){

greetingText=`Good Morning, ${name} ☀️`;
motivationText="Start your day strong and learn something new!";

}

else if(hour>=12 && hour<17){

greetingText=`Good Afternoon, ${name} 🌤️`;
motivationText="Keep building your skills and stay focused!";

}

else if(hour>=17 && hour<21){

greetingText=`Good Evening, ${name} 🌆`;
motivationText="Review your progress and improve daily!";

}

else{

greetingText=`Good Night, ${name} 🌙`;
motivationText="Rest well and recharge for tomorrow’s growth!";

}

greetingEl.textContent=greetingText;
motivationEl.textContent=motivationText;

}