import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { app } from "./firebaseConfig.js";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("submit");
const googleBtn = document.getElementById("googleBtn");

loginBtn.addEventListener("click", () => {
  if (!email.value || !password.value) return alert("Fill all fields");

  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => window.location.href = "dashboard.html")
    .catch(e => alert(e.code.replace("auth/", "").replaceAll("-", " ")));
});

googleBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then(() => window.location.href = "dashboard.html")
    .catch(() => alert("Google sign in failed"));
});
