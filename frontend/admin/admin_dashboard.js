/* =========================
1. FIREBASE INITIALIZATION
========================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
   //Paste The Firebase API KEYS HERE
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

/* =========================
2. UI ELEMENTS
========================= */
const tableBody = document.getElementById("student_table_body");
const branchFilter = document.getElementById("branch_filter");
const yearFilter = document.getElementById("year_filter");
const sectionFilter = document.getElementById("section_filter");
const countBadge = document.getElementById("student_count");

// This array stores the students we fetched for the current Branch/Year
let fetchedStudents = [];

/* =========================
3. FETCH DATA (Branch > Year)
========================= */
async function loadStudentsFromFirebase() {
    const branch = branchFilter.value;
    const year = yearFilter.value;

    tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px;">Loading ${branch} ${year}...</td></tr>`;

    try {
        // Path: students -> [Branch Name] -> [Year Name]
        const colRef = collection(db, "students", branch, year);
        const snapshot = await getDocs(colRef);
        
        fetchedStudents = []; // Reset local list
        
        snapshot.forEach(doc => {
            fetchedStudents.push({ id: doc.id, ...doc.data() });
        });

        // Now show them in the table (applying the section filter)
        applyFiltersAndRender();

    } catch (error) {
        console.error("Firebase Error:", error);
        tableBody.innerHTML = `<tr><td colspan="4" style="color:red; text-align:center;">Error: Could not find data at students > ${branch} > ${year}.</td></tr>`;
    }
}

/* =========================
4. RENDER & SECTION FILTER
========================= */
function applyFiltersAndRender() {
    const selectedSection = sectionFilter.value;
    tableBody.innerHTML = "";

    // Filter the local array by section
    const filtered = fetchedStudents.filter(student => {
        if (selectedSection === "All") return true;
        // Matches the "section" field inside the document
        return student.section === selectedSection;
    });

    // Update the count badge
    countBadge.innerText = filtered.length;

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px;">No students found in Section ${selectedSection}.</td></tr>`;
        return;
    }

    // Generate table rows
    filtered.forEach(student => {
        const row = document.createElement("tr");
        row.style.borderBottom = "1px solid #eee";
        row.innerHTML = `
            <td style="padding:12px;">${student.name || "N/A"}</td>
            <td style="padding:12px;">${student.email || "N/A"}</td>
            <td style="padding:12px;"><b>${branchFilter.value}</b> (Sec ${student.section || '?'})</td>
            <td style="padding:12px;">
                <button class="delete-btn" data-id="${student.id}" style="background:red; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">Remove</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Attach Delete Logic
    attachDeleteListeners();
}

/* =========================
5. DELETE FUNCTIONALITY
========================= */
function attachDeleteListeners() {
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.onclick = async (e) => {
            const id = e.target.getAttribute("data-id");
            const branch = branchFilter.value;
            const year = yearFilter.value;

            if (confirm("Permanently delete this student from the records?")) {
                try {
                    // We must provide the FULL PATH to the doc to delete it
                    await deleteDoc(doc(db, "students", branch, year, id));
                    console.log("Deleted!");
                    loadStudentsFromFirebase(); // Reload the list
                } catch (err) {
                    alert("Delete failed. Check permissions.");
                }
            }
        };
    });
}

/* =========================
6. EVENT LISTENERS
========================= */

// If Branch or Year changes, we need a new Firebase fetch
branchFilter.onchange = loadStudentsFromFirebase;
yearFilter.onchange = loadStudentsFromFirebase;

// If only Section changes, we just filter what we already have
sectionFilter.onchange = applyFiltersAndRender;

// STARTUP: Check Auth
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Admin Verified. Initializing Dashboard...");
        loadStudentsFromFirebase(); // Initial load
    } else {
        tableBody.innerHTML = "<tr><td colspan='4' style='color:red; text-align:center;'>Access Denied. Please log in first.</td></tr>";
    }
});
