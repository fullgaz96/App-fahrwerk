console.log("App.js geladen!"); // Test, ob die neue Datei geladen wird

// ------------------ Reifenlager ------------------
const testReifen = [
  { name: "Michelin Power GP", druck: "2.1/1.9", turns: 0, heizzyklen: 0 },
  { name: "Pirelli Diablo Superbike", druck: "2.2/2.0", turns: 0, heizzyklen: 0 },
  { name: "Bridgestone RS10", druck: "2.0/1.8", turns: 0, heizzyklen: 0 }
];

if (!localStorage.getItem("reifen")) {
  localStorage.setItem("reifen", JSON.stringify(testReifen));
}

function loadReifen() { return JSON.parse(localStorage.getItem("reifen")) || []; }
function saveReifen(reifen) { localStorage.setItem("reifen", JSON.stringify(reifen)); }

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

function addTurn(i) { const r = loadReifen(); r[i].turns++; saveReifen(r); renderReifen(); }
function addHeat(i) { const r = loadReifen(); r[i].heizzyklen++; saveReifen(r); renderReifen(); }

document.getElementById("reifenForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("reifenName").value;
  const druck = document.getElementById("reifenDruck").value;
  const r = loadReifen();
  r.push({ name, druck, turns: 0, heizzyklen: 0 });
  saveReifen(r);
  renderReifen();
  updateReifenSelect();
  e.target.reset();
});

// ------------------ Fahrwerksprotokoll ------------------
function loadSetups() { return JSON.parse(localStorage.getItem("setups")) || []; }
function saveSetups(setups) { localStorage.setItem("setups", JSON.stringify(setups)); }

window.addEventListener("load", () => {
  renderReifen();
  updateReifenSelect();
});

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  if(pageId==="setup") updateReifenSelect();
  if(pageId==="reifen") renderReifen();
}

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

  const r = loadReifen();
  const idx = r.findIndex(x => x.name === data.reifen);
  if(idx>=0){ r[idx].turns++; saveReifen(r); }

  alert("Setup gespeichert!");
  e.target.reset();
});

function updateReifenSelect() {
  const sel = document.getElementById("reifenSelect");
  sel.innerHTML = "";
  loadReifen().forEach(r => {
    const opt = document.createElement("option");
    opt.value = r.name;
    opt.textContent = r.name;
    sel.appendChild(opt);
  });
}

// ------------------ Markdown Export ------------------
document.getElementById("export").addEventListener("click", () => {
  const setups = loadSetups();
  const reifen = loadReifen();

  let md = `# 🏍️ Fahrwerksdaten Export\n\n## Fahrwerksprotokolle\n\n`;
  if(setups.length===0){ md+="_Keine Protokolle vorhanden_\n\n"; }
  else setups.forEach((s,i)=>{
    md+=`### Session ${i+1} - ${s.datum}\n- Motorradmodell: ${s.modell}\n- Rennstrecke: ${s.strecke}\n- Sag Gabel: ${s.sag} mm\n- Reifen: ${s.reifen}\n\n`;
  });

  md+="## Reifenlager\n\n";
  if(reifen.length===0){ md+="_Keine Reifen vorhanden_\n\n"; }
  else reifen.forEach(r=>{
    md+=`- **${r.name}**\n  - Empfohlener Luftdruck: ${r.druck}\n  - Turns: ${r.turns}\n  - Heizzyklen: ${r.heizzyklen}\n\n`;
  });

  const blob = new Blob([md],{type:"text/markdown"});
  const url = URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download="fahrwerksdaten.md";
  a.click();
  URL.revokeObjectURL(url);
});
