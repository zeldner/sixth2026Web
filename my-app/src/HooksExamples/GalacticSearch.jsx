// Ilya Zeldner
import React, { useState, useTransition } from "react";

// --- EXPLANATION ---
// useTransition lets you update the state without blocking the UI.
// It marks a state update as "low priority."
// This is useful for keeping the interface responsive during heavy rendering tasks.
// -------------------
// USAGE SCENARIO:
// we have a large list or complex UI that takes time to render.
// we want to keep input fields or other interactions smooth while rendering updates.
// we want to show a pending state while the update is being processed.
// we are optimizing for user experience in CPU-intensive applications.

// ADVANTAGES:
// 1. Keeps the UI responsive (typing remains smooth) even if the result list takes time to render.
// 2. Provides an 'isPending' flag to show loading states.

// DISADVANTAGES:
// 1. Only for CPU-bound updates (rendering lists), NOT for network waits.
// 2. Rendering is still done twice (once for old state, once for new).

// Simulate large dataset
const database = Array.from({ length: 5000 }, (_, i) => `Planet Sector ${i}`);

function GalacticSearch() {
  const [query, setQuery] = useState("");
  const [list, setList] = useState(database);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const value = e.target.value;

    // 1. High Priority: Update Input immediately
    setQuery(value);

    // 2. Low Priority: Filter the list
    startTransition(() => {
      // In a real app, filtering 10,000 items would lag.
      // useTransition allows the input to keep typing while this crunch happens.
      const filtered = database.filter((item) => item.includes(value));
      setList(filtered);
    });
  };

  return (
    <div style={{ border: "1px solid lime", padding: "20px" }}>
      <h2>Galactic Database</h2>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search..."
      />

      {isPending && <span style={{ color: "yellow" }}> Scanning...</span>}

      <ul>
        {list.slice(0, 10).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default GalacticSearch;
