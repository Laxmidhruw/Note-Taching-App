// DOM Elements
const themeToggle = document.getElementById("theme-toggle");
const addNoteButton = document.getElementById("add-note");
const noteInput = document.getElementById("note-input");
const notesList = document.querySelector(".notes-list");
const deletedList = document.querySelector(".deleted-list");
const showDeletedButton = document.getElementById("show-deleted");

// Local Storage Keys
const NOTES_KEY = "notes";
const DELETED_NOTES_KEY = "deletedNotes";

// Utility Functions
function loadLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Load Notes on Page Load
function loadNotes() {
  const notes = loadLocalStorage(NOTES_KEY);
  notes.forEach((note) => createNoteElement(note));
}

// Load Deleted Notes
function loadDeletedNotes() {
  deletedList.innerHTML = ""; // Clear the list before adding items
  const deletedNotes = loadLocalStorage(DELETED_NOTES_KEY);
  deletedNotes.forEach((note) => createDeletedNoteElement(note));
}

// Create a Note Element
function createNoteElement(content) {
  const note = document.createElement("div");
  note.classList.add("note");

  note.innerHTML = `
    <textarea readonly>${content}</textarea>
    <button class="edit"><i class="fas fa-pen"></i></button>
    <button class="delete"><i class="fas fa-trash"></i></button>
  `;

  const editButton = note.querySelector(".edit");
  const deleteButton = note.querySelector(".delete");
  const textarea = note.querySelector("textarea");

  // Edit Note
  editButton.addEventListener("click", () => {
    textarea.toggleAttribute("readonly");
    textarea.focus();
    editButton.innerHTML = textarea.hasAttribute("readonly")
      ? `<i class="fas fa-pen"></i>` // Show edit icon
      : `<i class="fas fa-save"></i>`; // Show save icon
    saveNotes(); // Save notes after editing
  });

  // Delete Note
  deleteButton.addEventListener("click", () => {
    const deletedNotes = loadLocalStorage(DELETED_NOTES_KEY);
    deletedNotes.push(textarea.value);
    saveToLocalStorage(DELETED_NOTES_KEY, deletedNotes);

    note.remove();
    saveNotes();
    loadDeletedNotes(); // Reload deleted notes
  });

  notesList.appendChild(note);
}

/// Create a Deleted Note Element
function createDeletedNoteElement(content) {
  const deletedNote = document.createElement("div");
  deletedNote.classList.add("deleted-note");

  deletedNote.innerHTML = `
    <textarea readonly>${content}</textarea>
    <div class="buttons">
      <button class="restore"><i class="fas fa-undo"></i></button>
      <button class="permanent-delete"><i class="fas fa-times"></i></button>
    </div>
  `;

  const restoreButton = deletedNote.querySelector(".restore");
  const permanentDeleteButton = deletedNote.querySelector(".permanent-delete");

  // Restore Note
  restoreButton.addEventListener("click", () => {
    const notes = loadLocalStorage(NOTES_KEY);
    notes.push(content);
    saveToLocalStorage(NOTES_KEY, notes);

    deletedNote.remove();
    saveDeletedNotes(); // Update deleted list
    createNoteElement(content);
  });

  // Permanently Delete Note
  permanentDeleteButton.addEventListener("click", () => {
    const deletedNotes = loadLocalStorage(DELETED_NOTES_KEY).filter(
      (note) => note !== content
    );
    saveToLocalStorage(DELETED_NOTES_KEY, deletedNotes);

    deletedNote.remove();
  });

  deletedList.appendChild(deletedNote);
}

// Add Note
addNoteButton.addEventListener("click", () => {
  const noteContent = noteInput.value.trim();
  if (noteContent === "") {
    alert("Note cannot be empty!");
    return;
  }

  const notes = loadLocalStorage(NOTES_KEY);
  notes.push(noteContent);
  saveToLocalStorage(NOTES_KEY, notes);

  createNoteElement(noteContent);
  noteInput.value = ""; // Clear input field
});

// Save Notes
function saveNotes() {
  const notes = Array.from(document.querySelectorAll(".note textarea")).map(
    (textarea) => textarea.value
  );
  saveToLocalStorage(NOTES_KEY, notes);
}

// Save Deleted Notes
function saveDeletedNotes() {
  const deletedNotes = Array.from(
    document.querySelectorAll(".deleted-note span")
  ).map((span) => span.textContent);
  saveToLocalStorage(DELETED_NOTES_KEY, deletedNotes);
}

// Show/Hide Deleted Notes
showDeletedButton.addEventListener("click", () => {
  deletedList.classList.toggle("hidden");
  showDeletedButton.textContent = deletedList.classList.contains("hidden")
    ? "View Deleted Notes"
    : "Hide Deleted Notes";
});

// Theme Toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.innerHTML = document.body.classList.contains("dark")
    ? `<i class="fas fa-sun"></i>` // Light mode icon
    : `<i class="fas fa-adjust"></i>`; // Dark mode icon
});

// Initial Page Load
loadNotes();
loadDeletedNotes();
