// ------------------ Reifenlager ------------------
const testReifen = [
  { name: "Michelin Power GP", druck: "2.1/1.9", turns: 0, heizzyklen: 0 },
  { name: "Pirelli Diablo Superbike", druck: "2.2/2.0", turns: 0, heizzyklen: 0 },
  { name: "Bridgestone RS10", druck: "2.0/1.8", turns: 0, heizzyklen: 0 }
];

// Beim ersten Laden, falls leer, Testreifen speichern
if (!localStorage.getItem("reifen")) {
  localStorage.setItem("reifen", JSON.stringify(testReifen));
}

function loadReifen() {
  return JSON.parse(localStorage.getItem("reifen")) || [];
}

function saveReifen(reifen) {
  localStorage.setItem("reifen", JSON.stringify(reifen));
}

function renderReifen() {
  const reifen = loadReifen();
  const list = document.getElementById("reifenListe");
  list.innerHTML = "";
  reifen.forEach((r, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${r.name} (Druck: ${r.druck}) – Turns: ${r.turns}, Heizzyklen: ${r.heizzyklen}
      <button onclick="addTurn(${i})">+Turn</button>
      <button onclick="addHeat(${i})">+Heizzyklus</button>`;
    list.appendChild(li);
  });
}

function addTurn(index) {
  const reifen = loadReifen();
  reifen[index].turns++;
  saveReifen(reifen);
  renderReifen();
}

function addHeat(index) {
  const reifen = loadReifen();
  reifen[index].heizzyklen++;
  saveReifen(reifen);
  renderReifen();
}

// Reifen hinzufügen
document.getElementById("reifenForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("reifenName").value;
  const druck = document.getElementById("reifenDruck").value;
  const reifen = loadReifen();
  reifen.push({ name, druck, turns: 0, heizzyklen: 0 });
  saveReifen(reifen);
  renderReifen();
  updateReifenSelect();
  e.target.reset();
});

// ------------------ Fahrwerksprotokoll ------------------
function loadSetups() {
  return JSON.parse(localStorage.getItem("setups")) || [];
}

function saveSetups(setups) {
  localStorage.setItem("setups", JSON.stringify(setups));
}

window.addEventListener("load", () => {
  renderReifen();
  updateReifenSelect();
});

// Seitenwechsel
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  if (pageId === "setup") updateReifenSelect();
  if (pageId === "reifen") renderReifen();
}

// Setup speichern
document.getElementById("setupForm").addEventListener("submit", e => {
  e.preventDefault();
  const setups = loadSetups();
  const data = {
    datum: new Date().toLocaleDateString(),
    modell: document.getElementById("modell").value,
    strecke: document.getElementById("strecke").value,
    sag: document.getElementById("sag").value,
    reifen: document.getElementById("reifenSelect").value
  };
  setups.push(data);
  saveSetups(setups);

  // Turn-Zähler für gewählten Reifen erhöhen
  const reifen = loadReifen();
  const idx = reifen.findIndex(r => r.name === data.reifen);
  if (idx >= 0) {
    reifen[idx].turns++;
    saveReifen(reifen);
  }

  alert("Setup gespeichert!");
  e.target.reset();
});

// Update Reifen-Auswahl
function updateReifenSelect() {
  const select = document.getElementById("reifenSelect");
  select.innerHTML = "";
  loadReifen().forEach(r => {
    const opt = document.createElement("option");
    opt.value = r.name;
    opt.textContent = r.name;
    select.appendChild(opt);
  });
}

// ------------------ Markdown Export ------------------
document.getElementById("export").addEventListener("click", () => {
  const setups = loadSetups();
  const reifen = loadReifen();

  let md = `# 🏍️ Fahrwerksdaten Export\n\n`;

  md += `## Fahrwerksprotokolle\n\n`;
  if (setups.length === 0) {
    md += "_Keine Protokolle vorhanden_\n\n";
  } else {
    setups.forEach((s, i) => {
      md += `### Session ${i+1} - ${s.datum}\n`;
      md += `- Motorradmodell: ${s.modell}\n`;
      md += `- Rennstrecke: ${s.strecke}\n`;
      md += `- Sag Gabel: ${s.sag} mm\n`;
      md += `- Reifen: ${s.reifen}\n\n`;
    });
  }

  md += `## Reifenlager\n\n`;
  if (reifen.length === 0) {
    md += "_Keine Reifen vorhanden_\n\n";
  } else {
    reifen.forEach(r => {
      md += `- **${r.name}**\n`;
      md += `  - Empfohlener Luftdruck: ${r.druck}\n`;
      md += `  - Turns: ${r.turns}\n`;
      md += `  - Heizzyklen: ${r.heizzyklen}\n\n`;
    });
  }

  // Markdown-Datei erstellen
  const blob = new Blob([md], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "fahrwerksdaten.md";
  a.click();
  URL.revokeObjectURL(url);
});
