import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import { app } from "./firebaseConfig.js";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const email = document.getElementById("email");
const password = document.getElementById("password");
const registerBtn = document.getElementById("submit");
const googleBtn = document.getElementById("googleBtn");

registerBtn.addEventListener("click", () => {
  if (!email.value || !password.value) {
    alert("Fill all fields");
    return;
  }

  if (password.value.length < 6) {
    alert("Password too short");
    return;
  }

  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      window.location.href = "newuser.html";
    })
    .catch(e => {
      alert(e.code.replace("auth/", "").replaceAll("-", " "));
    });
});

googleBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then(() => {
      window.location.href = "newuser.html";
    })
    .catch(() => {
      alert("Google sign up failed");
    });
});
