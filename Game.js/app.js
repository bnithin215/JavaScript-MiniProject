"use strict";

const createBtn = document.getElementById("create");
const notesContainer = document.getElementById("notesContainer");

const COLORS = ["#fef68a", "#c5f7c1", "#aee1f9", "#ffc2f2", "#d3bfff"];

const updateStorage = () => {
  const notes = document.querySelectorAll(".note");
  const data = Array.from(notes).map(note => ({
    text: note.querySelector("textarea").value,
    timestamp: note.querySelector(".timestamp").textContent,
    color: note.style.backgroundColor
  }));
  localStorage.setItem("notes", JSON.stringify(data));
};

const createNote = (text = "", timestamp = null, color = null) => {
  const note = document.createElement("div");
  note.classList.add("note");

  const selectedColor = color || COLORS[Math.floor(Math.random() * COLORS.length)];
  note.style.backgroundColor = selectedColor;

  const time = timestamp || new Date().toLocaleString();

  note.innerHTML = `
    <div class="timestamp">${time}</div>
    <textarea spellcheck="false">${text}</textarea>
    <button title="Delete Note">&times;</button>
  `;

  note.querySelector("button").addEventListener("click", () => {
    note.remove();
    updateStorage();
  });

  note.querySelector("textarea").addEventListener("input", updateStorage);

  notesContainer.appendChild(note);
};

createBtn.addEventListener("click", () => createNote());

const loadNotes = () => {
  try {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.forEach(({ text, timestamp, color }) => createNote(text, timestamp, color));
  } catch (error) {
    console.error("Failed to load notes:", error);
  }
};

loadNotes();
