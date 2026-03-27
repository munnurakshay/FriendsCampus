import { getAuth, onAuthStateChanged, updateProfile } 
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import { getFirestore, doc, setDoc, serverTimestamp } 
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { app } from "./firebaseConfig.js";

const auth = getAuth(app);
const db = getFirestore(app);

// Form Elements
const name = document.getElementById("name");
const username = document.getElementById("username");
const branch = document.getElementById("branch");
const year = document.getElementById("year");
const section = document.getElementById("section");
const rollno = document.getElementById("rollno");
const linkedin = document.getElementById("linkedin");
const submitBtn = document.getElementById("submitBtn");

let currentUser = null;

// Check Authentication
onAuthStateChanged(auth, user => {
    if (!user) {
        window.location.href = "login.html";
    } else {
        currentUser = user;
    }
});

// Auto Avatar Generator (Gender Based)
function getAutoAvatar(name, gender) {
    let backgroundColor = "77c1f6"; // Default blue

    if (gender === "Female") {
        backgroundColor = "f672c1"; // Pink
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${backgroundColor}&color=fff`;
}

// Convert Year Number to Text
function getYearText(year) {
    const map = {
        "1": "1st Year",
        "2": "2nd Year",
        "3": "3rd Year",
        "4": "4th Year"
    };
    return map[year];
}

// Submit Button
submitBtn.addEventListener("click", async () => {

    if (!currentUser) {
        alert("Please login again");
        return;
    }

    // Get Selected Gender
    const selectedGender = document.querySelector('input[name="gender"]:checked')?.value;

    // Validation
    if (
        !name.value ||
        !username.value ||
        !branch.value ||
        !year.value ||
        !section.value ||
        !rollno.value ||
        !selectedGender
    ) {
        alert("Please fill all required fields");
        return;
    }

    try {

        let photoURL;

        // Use existing photo or generate one
        if (currentUser.photoURL) {
            photoURL = currentUser.photoURL;
        } else {
            photoURL = getAutoAvatar(name.value, selectedGender);
        }

        // Update Firebase Auth Profile
        await updateProfile(currentUser, {
            displayName: name.value,
            photoURL: photoURL
        });

        const yearText = getYearText(year.value);

        const userData = {
            uid: currentUser.uid,
            name: name.value.trim(),
            username: username.value.trim(),
            email: currentUser.email,
            branch: branch.value,
            year: yearText,
            section: section.value,
            rollno: rollno.value.trim(),
            linkedin: linkedin.value.trim(),
            gender: selectedGender,
            photoURL: photoURL,
            createdAt: serverTimestamp()
        };

        // Save inside structured branch/year collection
        await setDoc(
            doc(db, "students", branch.value, yearText, currentUser.uid),
            userData
        );

        // Save inside general users collection
        await setDoc(
            doc(db, "users", currentUser.uid),
            userData
        );

        // Redirect
        window.location.href = "dashboard.html";

    } catch (err) {
        console.error(err);
        alert(err.message);
    }
});