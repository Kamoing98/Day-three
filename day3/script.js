// Starting data
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

// ============================================================
// searchNotes(word) - returns notes whose text contains word (case-insensitive)
// ============================================================
function searchNotes(word) {
  const lowerWord = word.toLowerCase();
  return notes.filter(note => note.text.toLowerCase().includes(lowerWord));
}

// Tests for searchNotes
console.log(searchNotes("milk"));
// Expected: [{ id: 1, text: "Buy milk and bread", category: "personal" }]

console.log(searchNotes("javascript"));
// Expected: [{ id: 4, text: "Revise JavaScript arrays", category: "study" }]

console.log(searchNotes("xyz123"));
// Expected: [] (no results)

// ============================================================
// longestNote() - returns the note with the most characters, or null if empty
// ============================================================
function longestNote() {
  if (notes.length === 0) return null;
  return notes.reduce((longest, current) =>
    current.text.length > longest.text.length ? current : longest
  );
}

// Tests for longestNote
console.log(longestNote());
// Expected: { id: 3, text: "Email the project report to Grace", category: "work" }

// Edge case: empty array
const originalNotes = notes;
notes = [];
console.log(longestNote());
// Expected: null
notes = originalNotes;

// ============================================================
// countByCategory() - returns an object counting notes per category
// ============================================================
function countByCategory() {
  const counts = {};
  for (let i = 0; i < notes.length; i++) {
    const cat = notes[i].category;
    if (counts[cat]) {
      counts[cat]++;
    } else {
      counts[cat] = 1;
    }
  }
  return counts;
}

// Tests for countByCategory
console.log(countByCategory());
// Expected: { personal: 2, study: 2, work: 1 }

// Edge case: empty array
notes = [];
console.log(countByCategory());
// Expected: {}
notes = originalNotes;

// ============================================================
// getSummary() - returns a sentence like "5 notes: 2 personal, 1 work, 2 study."
// ============================================================
function getSummary() {
  const counts = countByCategory();
  const total = notes.length;
  const noteWord = total === 1 ? "note" : "notes";
  const categories = Object.keys(counts)
    .map(cat => `${counts[cat]} ${cat}`)
    .join(", ");
  return `${total} ${noteWord}: ${categories}.`;
}

// Tests for getSummary
console.log(getSummary());
// Expected: "5 notes: 2 personal, 2 study, 1 work."

// Edge case: single note
notes = [{ id: 1, text: "Only one", category: "personal" }];
console.log(getSummary());
// Expected: "1 note: 1 personal."
notes = originalNotes;

// ============================================================
// isDuplicate(text) - returns true if a note with the same text exists
// (ignoring case and extra spaces)
// ============================================================
function isDuplicate(text) {
  const normalized = text.trim().toLowerCase();
  return notes.some(note => note.text.trim().toLowerCase() === normalized);
}

// Tests for isDuplicate
console.log(isDuplicate("Buy milk and bread"));
// Expected: true

console.log(isDuplicate("  CALL MUM  "));
// Expected: true (ignores case and extra spaces)

console.log(isDuplicate("Buy milk"));
// Expected: false

// ============================================================
// addNote(text, category) - adds a note if valid, returns true/false
// ============================================================
function addNote(text, category) {
  const validCategories = ["personal", "work", "study"];

  // Check length (1-200 characters)
  if (text.length < 1 || text.length > 200) {
    console.log("Note not added: text must be between 1 and 200 characters.");
    return false;
  }

  // Check duplicate
  if (isDuplicate(text)) {
    console.log("Note not added: this is a duplicate.");
    return false;
  }

  // Check valid category
  if (!validCategories.includes(category)) {
    console.log("Note not added: invalid category. Must be personal, work, or study.");
    return false;
  }

  // Add the note
  const newId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;
  notes.push({ id: newId, text: text, category: category });
  return true;
}

// Tests for addNote
console.log(addNote("Go for a walk", "personal"));
// Expected: true (note added successfully)

console.log(addNote("Buy milk and bread", "personal"));
// Expected: false (duplicate)
// Logs: "Note not added: this is a duplicate."

console.log(addNote("", "work"));
// Expected: false (empty text)
// Logs: "Note not added: text must be between 1 and 200 characters."

console.log(addNote("Test note", "hobby"));
// Expected: false (invalid category)
// Logs: "Note not added: invalid category. Must be personal, work, or study."

// Edge case: text longer than 200 characters
console.log(addNote("a".repeat(201), "study"));
// Expected: false (too long)
// Logs: "Note not added: text must be between 1 and 200 characters."

// Show final state of notes
console.log("Final notes array:", notes);
// Expected: 6 notes (original 5 + "Go for a walk")
