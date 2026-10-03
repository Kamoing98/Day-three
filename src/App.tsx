import { useState, useEffect } from "react";

// Starting data
const initialNotes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

// ============================================================
// searchNotes(word) - returns notes whose text contains word (case-insensitive)
// ============================================================
function searchNotes(notes: typeof initialNotes, word: string) {
  const lowerWord = word.toLowerCase();
  return notes.filter(note => note.text.toLowerCase().includes(lowerWord));
}

// ============================================================
// longestNote() - returns the note with the most characters, or null if empty
// ============================================================
function longestNote(notes: typeof initialNotes) {
  if (notes.length === 0) return null;
  return notes.reduce((longest, current) =>
    current.text.length > longest.text.length ? current : longest
  );
}

// ============================================================
// countByCategory() - returns an object counting notes per category
// ============================================================
function countByCategory(notes: typeof initialNotes) {
  const counts: Record<string, number> = {};
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

// ============================================================
// getSummary() - returns a sentence like "5 notes: 2 personal, 1 work, 2 study."
// ============================================================
function getSummary(notes: typeof initialNotes) {
  const counts = countByCategory(notes);
  const total = notes.length;
  const noteWord = total === 1 ? "note" : "notes";
  const categories = Object.keys(counts)
    .map(cat => `${counts[cat]} ${cat}`)
    .join(", ");
  return `${total} ${noteWord}: ${categories}.`;
}

// ============================================================
// isDuplicate(text) - returns true if a note with the same text exists
// ============================================================
function isDuplicate(notes: typeof initialNotes, text: string) {
  const normalized = text.trim().toLowerCase();
  return notes.some(note => note.text.trim().toLowerCase() === normalized);
}

// ============================================================
// addNote(text, category) - adds a note if valid, returns true/false
// ============================================================
function addNote(notes: typeof initialNotes, text: string, category: string): { success: boolean; reason: string; notes: typeof initialNotes } {
  const validCategories = ["personal", "work", "study"];

  if (text.length < 1 || text.length > 200) {
    return { success: false, reason: "text must be between 1 and 200 characters", notes };
  }

  if (isDuplicate(notes, text)) {
    return { success: false, reason: "this is a duplicate", notes };
  }

  if (!validCategories.includes(category)) {
    return { success: false, reason: "invalid category. Must be personal, work, or study", notes };
  }

  const newId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;
  const newNotes = [...notes, { id: newId, text, category }];
  return { success: true, reason: "added successfully", notes: newNotes };
}

interface TestResult {
  fn: string;
  args: string;
  expected: string;
  actual: string;
  pass: boolean;
}

function runTests(): TestResult[] {
  const results: TestResult[] = [];
  let notes = [...initialNotes];

  // searchNotes tests
  const r1 = searchNotes(notes, "milk");
  results.push({
    fn: "searchNotes",
    args: '"milk"',
    expected: "[{ id: 1, text: 'Buy milk and bread', category: 'personal' }]",
    actual: JSON.stringify(r1),
    pass: r1.length === 1 && r1[0].id === 1,
  });

  const r2 = searchNotes(notes, "xyz123");
  results.push({
    fn: "searchNotes",
    args: '"xyz123"',
    expected: "[]",
    actual: JSON.stringify(r2),
    pass: r2.length === 0,
  });

  // longestNote tests
  const r3 = longestNote(notes);
  results.push({
    fn: "longestNote",
    args: "()",
    expected: "{ id: 3, text: 'Email the project report to Grace', category: 'work' }",
    actual: JSON.stringify(r3),
    pass: r3 !== null && r3.id === 3,
  });

  const r4 = longestNote([]);
  results.push({
    fn: "longestNote",
    args: "([])",
    expected: "null",
    actual: JSON.stringify(r4),
    pass: r4 === null,
  });

  // countByCategory tests
  const r5 = countByCategory(notes);
  results.push({
    fn: "countByCategory",
    args: "()",
    expected: "{ personal: 2, study: 2, work: 1 }",
    actual: JSON.stringify(r5),
    pass: r5.personal === 2 && r5.study === 2 && r5.work === 1,
  });

  const r6 = countByCategory([]);
  results.push({
    fn: "countByCategory",
    args: "([])",
    expected: "{}",
    actual: JSON.stringify(r6),
    pass: Object.keys(r6).length === 0,
  });

  // getSummary tests
  const r7 = getSummary(notes);
  results.push({
    fn: "getSummary",
    args: "()",
    expected: '"5 notes: 2 personal, 2 study, 1 work."',
    actual: `"${r7}"`,
    pass: r7.includes("5 notes") && r7.includes("2 personal"),
  });

  const r8 = getSummary([{ id: 1, text: "Only one", category: "personal" }]);
  results.push({
    fn: "getSummary",
    args: "([{ id: 1, text: 'Only one', category: 'personal' }])",
    expected: '"1 note: 1 personal."',
    actual: `"${r8}"`,
    pass: r8.includes("1 note:"),
  });

  // isDuplicate tests
  const r9 = isDuplicate(notes, "Buy milk and bread");
  results.push({
    fn: "isDuplicate",
    args: '"Buy milk and bread"',
    expected: "true",
    actual: String(r9),
    pass: r9 === true,
  });

  const r10 = isDuplicate(notes, "  CALL MUM  ");
  results.push({
    fn: "isDuplicate",
    args: '"  CALL MUM  "',
    expected: "true",
    actual: String(r10),
    pass: r10 === true,
  });

  const r11 = isDuplicate(notes, "Buy milk");
  results.push({
    fn: "isDuplicate",
    args: '"Buy milk"',
    expected: "false",
    actual: String(r11),
    pass: r11 === false,
  });

  // addNote tests
  const r12 = addNote(notes, "Go for a walk", "personal");
  results.push({
    fn: "addNote",
    args: '"Go for a walk", "personal"',
    expected: "true",
    actual: String(r12.success),
    pass: r12.success === true,
  });
  notes = r12.notes;

  const r13 = addNote(notes, "Buy milk and bread", "personal");
  results.push({
    fn: "addNote",
    args: '"Buy milk and bread", "personal"',
    expected: "false (duplicate)",
    actual: `false (${r13.reason})`,
    pass: r13.success === false,
  });

  const r14 = addNote(notes, "", "work");
  results.push({
    fn: "addNote",
    args: '"", "work"',
    expected: "false (empty text)",
    actual: `false (${r14.reason})`,
    pass: r14.success === false,
  });

  const r15 = addNote(notes, "Test note", "hobby");
  results.push({
    fn: "addNote",
    args: '"Test note", "hobby"',
    expected: "false (invalid category)",
    actual: `false (${r15.reason})`,
    pass: r15.success === false,
  });

  return results;
}

export default function App() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [notes, setNotes] = useState(initialNotes);

  useEffect(() => {
    const testResults = runTests();
    setResults(testResults);

    // Also log to console as the assignment requires
    console.log("=== Notes Toolkit - Console Output ===");
    console.log("searchNotes('milk'):", searchNotes(initialNotes, "milk"));
    console.log("searchNotes('xyz123'):", searchNotes(initialNotes, "xyz123"));
    console.log("longestNote():", longestNote(initialNotes));
    console.log("longestNote([]):", longestNote([]));
    console.log("countByCategory():", countByCategory(initialNotes));
    console.log("getSummary():", getSummary(initialNotes));
    console.log("isDuplicate('Buy milk and bread'):", isDuplicate(initialNotes, "Buy milk and bread"));
    console.log("isDuplicate('  CALL MUM  '):", isDuplicate(initialNotes, "  CALL MUM  "));
    console.log("addNote('Go for a walk', 'personal'):", addNote(initialNotes, "Go for a walk", "personal"));
    console.log("addNote('Buy milk and bread', 'personal'):", addNote(initialNotes, "Buy milk and bread", "personal"));
    console.log("======================================");

    // Simulate the addNote for display
    const result = addNote(initialNotes, "Go for a walk", "personal");
    if (result.success) setNotes(result.notes);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-emerald-400 mb-2">📝 Notes Toolkit</h1>
          <p className="text-gray-400 text-lg">Day 3 Assignment — JavaScript Array & Object Methods</p>
        </header>

        {/* Current Notes */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-emerald-300 mb-4">Current Notes</h2>
          <div className="grid gap-3">
            {notes.map(note => (
              <div key={note.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center gap-4">
                <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded">#{note.id}</span>
                <span className="flex-1">{note.text}</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  note.category === "personal" ? "bg-blue-900 text-blue-300" :
                  note.category === "work" ? "bg-purple-900 text-purple-300" :
                  "bg-amber-900 text-amber-300"
                }`}>
                  {note.category}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-gray-500 text-sm">
            Summary: {getSummary(notes)}
          </p>
        </section>

        {/* Test Results */}
        <section>
          <h2 className="text-2xl font-semibold text-emerald-300 mb-4">Test Results</h2>
          <div className="space-y-2">
            {results.map((r, i) => (
              <div key={i} className={`rounded-lg p-3 border ${r.pass ? 'bg-gray-800 border-emerald-700' : 'bg-gray-800 border-red-700'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-lg ${r.pass ? 'text-emerald-400' : 'text-red-400'}`}>
                    {r.pass ? '✅' : '❌'}
                  </span>
                  <code className="text-emerald-300 font-mono text-sm">{r.fn}({r.args})</code>
                </div>
                <div className="ml-8 text-sm">
                  <p className="text-gray-400">Expected: <code className="text-gray-300">{r.expected}</code></p>
                  <p className="text-gray-400">Actual: <code className="text-gray-300">{r.actual}</code></p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-gray-500 text-sm">
            All {results.length} tests passed: {results.every(r => r.pass) ? "✅ Yes" : "❌ No"}
          </p>
        </section>

        {/* Console hint */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-gray-400">
            💡 <strong>Open the Console</strong> (F12) to see the raw console.log output from each function call.
          </p>
        </div>
      </div>
    </div>
  );
}
