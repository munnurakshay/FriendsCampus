/* =========================
1. FIREBASE INITIALIZATION
========================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
   //Paste The Firebase API KEYS HERE
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* =========================
2. UI ELEMENTS
========================= */
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("submit");

/* =========================
3. RESTRICTED LOGIN FUNCTION
========================= */
loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // STRICT CREDENTIAL CHECK
    if (email !== "admin@friends.com" || password !== "admin123") {
        alert("Incorrect Credentials! Only the Master Admin can login.");
        emailInput.value = "";
        passwordInput.value = "";
        return; // STOP HERE
    }

    // If credentials are correct, proceed to Firebase
    loginBtn.innerText = "Verifying...";
    loginBtn.disabled = true;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login Successful! Welcome, Master Admin.");
        window.location.href = "/frontend/admin/admin_dashboard.html";
    } catch (error) {
        console.error("Firebase Error:", error.message);
        alert("Firebase Auth Error: Make sure this user exists in your Firebase Console!");
        loginBtn.innerText = "LOGIN";
        loginBtn.disabled = false;
    }
});
