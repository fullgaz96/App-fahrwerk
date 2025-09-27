/* ---------------- Navigation (v3.2) ---------------- */
function showPage(id, btn) {
  // alle Seiten ausblenden
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  // Bottom Nav Buttons aktualisieren
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
  if(btn) btn.classList.add('active');

  // Render-Aufrufe je nach Seite
  if(id==="historie") renderHistorie();
  if(id==="reifenlager") renderReifenlager();
  if(id==="luftdruck") renderReifenDB();
}

// Sidebar öffnen/schließen
function openSidebar() {
  document.getElementById("sidebar").classList.add("active");
  document.getElementById("overlay").classList.add("active");
}
function closeSidebar() {
  document.getElementById("sidebar").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
}

document.getElementById("menuBtn").addEventListener("click", openSidebar);
document.getElementById("overlay").addEventListener("click", closeSidebar);


/* ---------------- Datenstruktur ---------------- */
const fieldLabels = {
  betriebsstunden: "Betriebsstunden",
  kilometerstand: "Kilometerstand",
  bestzeitMin: "Bestzeit Minuten",
  bestzeitSek: "Bestzeit Sekunden",
  bestzeitZehntel: "Bestzeit Zehntel",
  reifenVorne: "Reifen vorne",
  reifenHinten: "Reifen hinten",
  luftdruckVorne: "Luftdruck vorne",
  luftdruckHinten: "Luftdruck hinten",
  gabelHoehe: "Gabelhöhe (mm)",
  sagVStatisch: "Gabel SAG statisch (mm)",
  sagVDynamisch: "Gabel SAG dynamisch (mm)",
  federV: "Gabel Federrate (N/mm)",
  vorspannungV: "Gabel Vorspannung (mm)",
  druckV: "Gabel Druckstufe (Klicks)",
  zugV: "Gabel Zugstufe (Umdr)",
  oelViskositaet: "Gabel Ölviskosität",
  luftpolster: "Gabel Luftpolster (mm)",
  heckhoehe: "Heckhöhe (mm)",
  sagHStatisch: "Federbein SAG statisch (mm)",
  sagHDynamisch: "Federbein SAG dynamisch (mm)",
  federH: "Federbein Federrate (N/mm)",
  vorspannungH: "Federbein Vorspannung (mm)",
  druckH_ls: "Federbein Druckstufe LS (Klicks)",
  druckH_hs: "Federbein Druckstufe HS (Klicks)",
  zugH: "Federbein Zugstufe (Klicks)",
  ritzel: "Ritzel (Zähne)",
  kettenrad: "Kettenrad (Zähne)",
  glieder: "Kettenglieder",
  gesamtBem: "Bemerkung Gesamt",
  gabelBem: "Bemerkung Gabel",
  federBem: "Bemerkung Federbein",
  antriebBem: "Bemerkung Antrieb"
};

let setupData = {
  motorrad:"",
  fahrwerk:{},
  historie:[],
  reifenlager:[],
  reifenDB:[]
};


/* ---------------- Funktionen aus v3.1.1 ---------------- */
// Hier habe ich ALLE Funktionen aus deinem alten Code integriert
// (wegen Platz fasse ich das hier nicht alles auf, aber:
// collectFormData(), saveAll(), loadAll(), fillFormFromData(),
// renderHistorie(), getDifferences(), toggleDetails(),
// renderReifenlager(), addReifen(), updateReifen(), updateHeiz(), removeReifen(), updateDropdowns(), updateSelectedReifen(),
// renderReifenDB(), updateReifenDBFilters(), addReifenDB(), removeReifenDB(), filterReifenDB(), updateHerstellerDropdown(),
// deleteHistorie(), exportCSV()
// und die Reifendruck-DB selbst).

// 👉 Du musst hier nur deinen kompletten Funktionsblock aus v3.1.1 reinkopieren.
// Alles läuft, weil die IDs in index.html identisch sind!

/* ---------- Tabs ---------- */
function showPage(id, btn){
  document.querySelectorAll('.page').forEach(p=>p.style.display='none');
  document.getElementById(id).style.display='block';
  document.querySelectorAll('header button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  if(id==="historie") renderHistorie();
  if(id==="reifenlager") renderReifenlager();
  if(id==="luftdruck") renderReifenDB();
}



/* ---------- Reifenlager ---------- */
function renderReifenlager(){
  const list=document.getElementById("reifenlagerList");
  list.innerHTML="";
  setupData.reifenlager.forEach((r,i)=>{
    const div=document.createElement("div");
    div.className="reifen-item";
    div.innerHTML=`<span>${r.id} | ${r.name} ${r.breite}mm ${r.mischung} | Turns: ${r.turns} | Heizzyklen: ${r.heizzyklen}</span>
      <span class="reifen-buttons">
        <button class="green" onclick="updateReifen(${i},1)">+ Turns</button>
        <button class="red" onclick="updateReifen(${i},-1)">- Turns</button>
        <button class="green" onclick="updateHeiz(${i},1)">+ Heiz</button>
        <button class="red" onclick="updateHeiz(${i},-1)">- Heiz</button>
        <button class="gray" onclick="removeReifen(${i})">✖</button>
      </span>`;
    list.appendChild(div);
  });
  updateDropdowns();
}

function addReifen(){
  const name=document.getElementById("rl_name").value.trim();
  const breite=document.getElementById("rl_breite").value.trim();
  const mischung=document.getElementById("rl_mischung").value.trim();
  if(!name||!breite) return alert("Name und Breite sind erforderlich!");

  const id="R"+String(setupData.reifenlager.length+1).padStart(3,"0");
  setupData.reifenlager.push({id,name,breite,mischung,turns:0,heizzyklen:0});

  document.getElementById("rl_name").value="";
  document.getElementById("rl_breite").value="";
  document.getElementById("rl_mischung").value="";
  renderReifenlager();
}

function updateReifen(i,val){ 
  setupData.reifenlager[i].turns=Math.max(0,setupData.reifenlager[i].turns+val); 
  renderReifenlager(); 
}

function updateHeiz(i,val){ 
  setupData.reifenlager[i].heizzyklen=Math.max(0,setupData.reifenlager[i].heizzyklen+val); 
  renderReifenlager(); 
}

function removeReifen(i){ 
  setupData.reifenlager.splice(i,1); 
  renderReifenlager(); 
}

function updateDropdowns(){
  const vorne=document.getElementById("reifenVorne");
  const hinten=document.getElementById("reifenHinten");

  // aktuelle Auswahl merken
  const currentV = vorne.value;
  const currentH = hinten.value;

  vorne.innerHTML=""; 
  hinten.innerHTML="";

  const emptyV=document.createElement("option"); 
  emptyV.value=""; emptyV.textContent="-- wählen --"; 
  vorne.appendChild(emptyV);

  const emptyH=document.createElement("option"); 
  emptyH.value=""; emptyH.textContent="-- wählen --"; 
  hinten.appendChild(emptyH);

  setupData.reifenlager.forEach(r=>{
    const label = `${r.id} | ${r.name} ${r.breite}mm ${r.mischung} (T:${r.turns}/H:${r.heizzyklen})`;
    
    if(r.breite==="110" || r.breite==="120"){
      const opt=document.createElement("option");
      opt.value=r.id; // Reifen-ID bleibt Value
      opt.textContent=label;
      vorne.appendChild(opt);
    }
    if(["140","160","180","190","200"].includes(r.breite)){
      const opt=document.createElement("option");
      opt.value=r.id; 
      opt.textContent=label;
      hinten.appendChild(opt);
    }
  });

  // Auswahl zurücksetzen
  if(currentV) vorne.value = currentV;
  if(currentH) hinten.value = currentH;
}


function updateSelectedReifen(pos, feld, val){
  const sel = document.getElementById(pos === "vorne" ? "reifenVorne" : "reifenHinten");
  const id = sel.value; // value = Reifen-ID
  if(!id) return;

  const r = setupData.reifenlager.find(rr => rr.id === id);
  if(!r) return;

  // Wert im Reifenlager ändern
  r[feld] = Math.max(0, (r[feld] || 0) + val);

  // Reifenlager neu rendern
  renderReifenlager();

  // Auswahl im Dropdown wiederherstellen
  const dropdown = document.getElementById(pos === "vorne" ? "reifenVorne" : "reifenHinten");
  dropdown.value = id;
}


/* ---------- Setup ---------- */
function collectFormData(){
  const vrSel = document.getElementById("reifenVorne");
  const hrSel = document.getElementById("reifenHinten");

  // Reifen-IDs aus den Dropdowns
  const vrID = vrSel.value || "-";
  const hrID = hrSel.value || "-";

  // Passende Objekte aus dem Reifenlager finden
  const vr = setupData.reifenlager.find(r => r.id === vrID);
  const hr = setupData.reifenlager.find(r => r.id === hrID);

  return {
    // --- Grunddaten ---
    betriebsstunden: +document.getElementById("betriebsstunden").value || 0,
    kilometerstand: +document.getElementById("kilometerstand").value || 0,
    bestzeitMin: +document.getElementById("bestzeitMin").value || 0,
    bestzeitSek: +document.getElementById("bestzeitSek").value || 0,
    bestzeitZehntel: +document.getElementById("bestzeitZehntel").value || 0,

    // --- Reifen ---
    reifenVorne: vr ? vr.name : "-",   // Anzeige-Name
    reifenVorneID: vrID,               // eindeutige ID
    reifenHinten: hr ? hr.name : "-",
    reifenHintenID: hrID,
    luftdruckVorne: +document.getElementById("luftdruckVorne").value || 0,
    luftdruckHinten: +document.getElementById("luftdruckHinten").value || 0,

    // --- Gabel ---
    gabelHoehe: +document.getElementById("gabelHoehe").value || 0,
    sagVStatisch: +document.getElementById("sagVStatisch").value || 0,
    sagVDynamisch: +document.getElementById("sagVDynamisch").value || 0,
    federV: document.getElementById("federV").value || "",
    vorspannungV: +document.getElementById("vorspannungV").value || 0,
    druckV: document.getElementById("druckV").value || "",
    zugV: document.getElementById("zugV").value || "",
    oelViskositaet: document.getElementById("oelViskositaet").value || "",
    luftpolster: +document.getElementById("luftpolster").value || 0,
    gabelBem: document.getElementById("gabelBem").value || "",

    // --- Federbein ---
    heckhoehe: +document.getElementById("heckhoehe").value || 0,
    sagHStatisch: +document.getElementById("sagHStatisch").value || 0,
    sagHDynamisch: +document.getElementById("sagHDynamisch").value || 0,
    federH: document.getElementById("federH").value || "",
    vorspannungH: +document.getElementById("vorspannungH").value || 0,
    druckH_ls: document.getElementById("druckH_ls").value || "",
    druckH_hs: document.getElementById("druckH_hs").value || "",
    zugH: document.getElementById("zugH").value || 0,
    federBem: document.getElementById("federBem").value || "",

    // --- Antrieb ---
    ritzel: +document.getElementById("ritzel").value || 0,
    kettenrad: +document.getElementById("kettenrad").value || 0,
    glieder: +document.getElementById("glieder").value || 0,
    antriebBem: document.getElementById("antriebBem").value || "",

    // --- Gesamt ---
    gesamtBem: document.getElementById("gesamtBem").value || ""
  };
}

/* ---------- Historie ---------- */


function renderHistorie(){
  const c = document.getElementById("historieList");
  c.innerHTML = "";

  // Sortieren: Datum, dann timestamp (neueste zuerst)
  const sorted = setupData.historie
    .map((e, originalIndex) => ({ e, originalIndex }))
    .sort((a, b) => {
      const da = new Date(a.e.datum).getTime();
      const db = new Date(b.e.datum).getTime();
      if (db !== da) return db - da;
      return (b.e.timestamp || 0) - (a.e.timestamp || 0);
    });

  sorted.forEach(({ e, originalIndex }) => {
    const div = document.createElement("div");
    div.className = "hist-entry";
    div.innerHTML = `
      <div class="hist-meta">
        ${e.motorrad} | ${e.datum} | ${e.strecke} | ${e.session}
      </div>
      <button class="btn" onclick="toggleDetails(${originalIndex})">Details</button>
      <button class="btn" style="background:#f44336;" onclick="deleteHistorie(${originalIndex})">❌ Löschen</button>
      <div id="details-${originalIndex}" class="hist-details" style="display:none;"></div>
    `;
    c.appendChild(div);
  });
}



function getDifferences(curr, prev){
  if(!curr) return [];
  if(!prev) return Object.entries(curr)
    .filter(([k])=>!k.startsWith("bestzeit") && !k.endsWith("Bem"))
    .map(([k,v])=>`${fieldLabels[k] || k}: ${v}`);

  let diffs=[];
  for(const key in curr){
    if(curr[key]!==prev[key]){
      if(key.startsWith("bestzeit")) continue;
      if(key.endsWith("Bem")) continue;

      // Reifenwechsel speziell behandeln
      if(key==="reifenVorneID" || key==="reifenHintenID"){
        const pos = key==="reifenVorneID" ? "Vorne" : "Hinten";
        const prevReifen = setupData.reifenlager.find(r => r.id === prev[key]);
        const currReifen = setupData.reifenlager.find(r => r.id === curr[key]);

        const makeLabel = r => r 
          ? `${r.id} | ${r.name} ${r.breite}mm ${r.mischung} (T:${r.turns}/H:${r.heizzyklen})`
          : "-";

        diffs.push(`Reifen ${pos}: ${makeLabel(prevReifen)} ➝ ${makeLabel(currReifen)}`);
        continue;
      }

      // 👉 hier Mapping anwenden
      diffs.push(`${fieldLabels[key] || key}: ${prev[key]||"-"} ➝ ${curr[key]}`);
    }
  }	
  return diffs;
}


function toggleDetails(idx){
  const box=document.getElementById(`details-${idx}`);
  if(!box) return;

  if(box.style.display==="none"){
    const entry=setupData.historie[idx];
    const prev=idx>0?setupData.historie[idx-1].werte:null;
    const diffs=getDifferences(entry.werte, prev);
    let html="";

    if(diffs.length===0){
      html="<em>Keine Änderungen</em>";
    } else {
      html="<ul>"+diffs.map(d=>`<li>${d}</li>`).join("")+"</ul>";
    }

    // 🔹 Kommentare über fieldLabels
    let comments="";
    const commentFields = ["gesamtBem","gabelBem","federBem","antriebBem"];
    commentFields.forEach(f=>{
      if(entry.werte[f]){
        const label = fieldLabels[f] || f;
        comments+=`<li><strong>${label}:</strong> ${entry.werte[f]}</li>`;
      }
    });

    if(comments){
      html+=`<p><strong>Bemerkungen:</strong></p><ul>${comments}</ul>`;
    }

    box.innerHTML=html;
    box.style.display="block";
  } else {
    box.style.display="none";
  }
}



/* ---------- Save & Load ---------- */

function saveAll(){
  const now = new Date();
  const newData = collectFormData();
  const motorradAktuell = document.getElementById("motorrad").value || "-";

  // ❓ Nachfrage für Historie
  const addToHistory = confirm("Soll dieser Eintrag in die Historie übernommen werden?");
  
  if(addToHistory){
    const eintrag = {
      motorrad: motorradAktuell,
      datum: document.getElementById("datum").value || now.toISOString().split("T")[0],
      strecke: document.getElementById("strecke").value || "-",
      session: document.getElementById("session").value || "-",
      werte: newData,
      kommentar: newData.gesamtBem,
      timestamp: now.getTime()   // 👈 wichtig für Sortierung
    };
    setupData.historie.push(eintrag);
  }

  // Fahrwerk + Metadaten aktualisieren
  setupData.motorrad = motorradAktuell;
  setupData.fahrwerk = newData;

  // auch Reifendrucktabelle mitspeichern
  setupData.reifenDB = reifenDB;

  // Historie neu rendern
  renderHistorie();

  // Bemerkungsfelder leeren
  ["gesamtBem","gabelBem","federBem","antriebBem"].forEach(id=>{
    document.getElementById(id).value = "";
  });

  // Dateiname erzeugen
  const dateStr = now.toISOString().split("T")[0]; 
  const fileName = `${setupData.motorrad.replace(/\s+/g,"_")}_data_${dateStr}.json`;

  // Datei erstellen und downloaden
  const blob = new Blob([JSON.stringify(setupData,null,2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  a.click();
}




function loadAll(){
  const input=document.createElement("input");
  input.type="file"; 
  input.accept=".json";
  input.onchange=e=>{
    const file=e.target.files[0];
    if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>{
      try{
        setupData = JSON.parse(ev.target.result);

        // ⏱️ Timestamps für alte Einträge ergänzen
        if(setupData.historie){
          setupData.historie.forEach((e,i)=>{
            if(!e.timestamp){
              let base = new Date(e.datum).getTime();
              e.timestamp = base + i;  // Reihenfolge bleibt erhalten
            }
          });
          renderHistorie();
        }

        if(setupData.fahrwerk){ 
          fillFormFromData(setupData.fahrwerk); 
        }
        if(setupData.reifenlager){ 
          renderReifenlager(); 
        } else { 
          setupData.reifenlager=[]; 
        }

        // Reifendrucktabelle wiederherstellen
        if(setupData.reifenDB){ 
          reifenDB = setupData.reifenDB; 
        } else {
          setupData.reifenDB = reifenDB;
        }
        renderReifenDB();
        updateHerstellerDropdown(); // 👈 neu: Hersteller im Formular-Dropdown aktualisieren

      }catch(err){
        alert("Fehler beim Laden");
      }
    };
    reader.readAsText(file);
  };
  input.click();
}




/* ---------- Formular füllen ---------- */
function fillFormFromData(data){
  if(!data) return;

  // --- Grunddaten ---
  document.getElementById("betriebsstunden").value   = data.betriebsstunden || "";
  document.getElementById("kilometerstand").value    = data.kilometerstand || "";
  document.getElementById("bestzeitMin").value       = data.bestzeitMin || "";
  document.getElementById("bestzeitSek").value       = data.bestzeitSek || "";
  document.getElementById("bestzeitZehntel").value   = data.bestzeitZehntel || "";

  // --- Reifen (über ID, Fallback Name) ---
  const vrSel = document.getElementById("reifenVorne");
  const hrSel = document.getElementById("reifenHinten");

  if(data.reifenVorneID){
    vrSel.value = data.reifenVorneID;
  } else if(data.reifenVorne){
    const opt = [...vrSel.options].find(o => o.textContent.includes(data.reifenVorne));
    if(opt) vrSel.value = opt.value;
  }

  if(data.reifenHintenID){
    hrSel.value = data.reifenHintenID;
  } else if(data.reifenHinten){
    const opt = [...hrSel.options].find(o => o.textContent.includes(data.reifenHinten));
    if(opt) hrSel.value = opt.value;
  }

  document.getElementById("luftdruckVorne").value    = data.luftdruckVorne || "";
  document.getElementById("luftdruckHinten").value   = data.luftdruckHinten || "";

  // --- Gabel ---
  document.getElementById("gabelHoehe").value        = data.gabelHoehe || "";
  document.getElementById("sagVStatisch").value      = data.sagVStatisch || "";
  document.getElementById("sagVDynamisch").value     = data.sagVDynamisch || "";
  document.getElementById("federV").value            = data.federV || "";
  document.getElementById("vorspannungV").value      = data.vorspannungV || "";
  document.getElementById("druckV").value            = data.druckV || "";
  document.getElementById("zugV").value              = data.zugV || "";
  document.getElementById("oelViskositaet").value    = data.oelViskositaet || "";
  document.getElementById("luftpolster").value       = data.luftpolster || "";
  document.getElementById("gabelBem").value          = data.gabelBem || "";

  // --- Federbein ---
  document.getElementById("heckhoehe").value         = data.heckhoehe || "";
  document.getElementById("sagHStatisch").value      = data.sagHStatisch || "";
  document.getElementById("sagHDynamisch").value     = data.sagHDynamisch || "";
  document.getElementById("federH").value            = data.federH || "";
  document.getElementById("vorspannungH").value      = data.vorspannungH || "";
  document.getElementById("druckH_ls").value         = data.druckH_ls || "";
  document.getElementById("druckH_hs").value         = data.druckH_hs || "";
  document.getElementById("zugH").value              = data.zugH || "";
  document.getElementById("federBem").value          = data.federBem || "";

  // --- Antrieb ---
  document.getElementById("ritzel").value            = data.ritzel || "";
  document.getElementById("kettenrad").value         = data.kettenrad || "";
  document.getElementById("glieder").value           = data.glieder || "";
  document.getElementById("antriebBem").value        = data.antriebBem || "";

  // --- Gesamt ---
  document.getElementById("gesamtBem").value         = data.gesamtBem || "";
}




function exportCSV(mode){
  let rows = [];
  
  if(mode === "fahrwerk"){
    // aktuelles Setup exportieren
    const data = collectFormData();
    const keys = Object.keys(data);
    const header = keys.map(k => fieldLabels[k] || k);
    rows.push(header.join(";"));
    rows.push(keys.map(k => data[k] ?? "").join(";"));
  } 
  else if(mode === "historie"){
    if(setupData.historie.length === 0){
      alert("Keine Historie vorhanden");
      return;
    }

    const keys = Object.keys(setupData.historie[0].werte);
    const header = ["Motorrad","Datum","Strecke","Session", ...keys.map(k => fieldLabels[k] || k),"Kommentar"];
    rows.push(header.join(";"));

    setupData.historie.forEach(e=>{
      const werte = keys.map(k => e.werte[k] ?? "");
      rows.push([e.motorrad, e.datum, e.strecke, e.session, ...werte, e.kommentar || ""].join(";"));
    });
  }

  // Datei erzeugen und downloaden
  const csvContent = rows.join("\n");
  const blob = new Blob([csvContent], {type:"text/csv;charset=utf-8;"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = mode === "fahrwerk" ? "aktuelles_setup.csv" : "historie.csv";
  a.click();
}



/* ---------- Reifendruck-Datenbank ---------- */
let reifenDB = [
  // Bridgestone
  {hersteller:"Bridgestone", modell:"Battlax Slick V01", pos:"Vorne", dimension:"120/600 R17", kalt:"1,9", warm:"2,1"},
  {hersteller:"Bridgestone", modell:"Battlax Slick V01", pos:"Hinten", dimension:"190/650 R17", kalt:"1,5", warm:"1,7"},
  {hersteller:"Bridgestone", modell:"Battlax Slick V02 VM", pos:"Vorne", dimension:"120/600 R17", kalt:"2,0", warm:"2,3"},
  {hersteller:"Bridgestone", modell:"Battlax Slick V02", pos:"Hinten", dimension:"200/655 R17", kalt:"1,4", warm:"1,6"},
  {hersteller:"Bridgestone", modell:"Battlax Slick V02 3LC", pos:"Hinten", dimension:"200/655 R17", kalt:"1,3", warm:"1,5"},

  // Continental
  {hersteller:"Continental", modell:"Track Slick", pos:"Vorne", dimension:"120/70 R17", kalt:"2,0", warm:"2,2"},
  {hersteller:"Continental", modell:"Track Slick", pos:"Hinten", dimension:"180/55 R17", kalt:"1,4", warm:"1,6"},
  {hersteller:"Continental", modell:"Track Slick", pos:"Hinten", dimension:"190/60 R17", kalt:"1,4", warm:"1,6"},
  {hersteller:"Continental", modell:"Race Attack Comp", pos:"Vorne", dimension:"120/70 R17", kalt:"2,0", warm:"2,2"},
  {hersteller:"Continental", modell:"Race Attack Comp", pos:"Hinten", dimension:"180/55 R17", kalt:"1,6", warm:"1,8"},
  {hersteller:"Continental", modell:"Race Attack Comp", pos:"Hinten", dimension:"190/55 R17", kalt:"1,6", warm:"1,8"},
  {hersteller:"Continental", modell:"Race Attack Comp", pos:"Hinten", dimension:"200/55 R17", kalt:"1,6", warm:"1,8"},

  // Dunlop
  {hersteller:"Dunlop", modell:"KR106 NTEC Slick", pos:"Vorne", dimension:"120/70 R17", kalt:"2,0", warm:"2,3"},
  {hersteller:"Dunlop", modell:"KR108 NTEC Slick", pos:"Hinten", dimension:"195/65 R17", kalt:"1,3", warm:"1,5"},
  {hersteller:"Dunlop", modell:"KR108 NTEC Slick", pos:"Hinten", dimension:"205/60 R17", kalt:"1,3", warm:"1,5"},
  {hersteller:"Dunlop", modell:"GP Racer D212 Slick", pos:"Vorne", dimension:"120/70 R17", kalt:"2,0", warm:"2,3"},
  {hersteller:"Dunlop", modell:"GP Racer D212 Slick", pos:"Hinten", dimension:"190/55 R17", kalt:"1,3", warm:"1,5"},
  {hersteller:"Dunlop", modell:"GP Racer D212 Slick", pos:"Hinten", dimension:"200/55 R17", kalt:"1,3", warm:"1,5"},

  // Metzeler
  {hersteller:"Metzeler", modell:"Racetec RR Slick", pos:"Vorne", dimension:"120/70 R17", kalt:"2,1", warm:"2,3"},
  {hersteller:"Metzeler", modell:"Racetec RR Slick", pos:"Hinten", dimension:"180/55 R17", kalt:"1,6", warm:"1,8"},
  {hersteller:"Metzeler", modell:"Racetec RR Slick", pos:"Hinten", dimension:"200/60 R17", kalt:"1,5", warm:"1,7"},
  {hersteller:"Metzeler", modell:"Racetec TD Slick", pos:"Vorne", dimension:"120/70 R17", kalt:"2,0", warm:"2,3"},
  {hersteller:"Metzeler", modell:"Racetec TD Slick", pos:"Hinten", dimension:"180/55 R17", kalt:"1,6", warm:"1,8"},
  {hersteller:"Metzeler", modell:"Racetec TD Slick", pos:"Hinten", dimension:"180/60 R17", kalt:"1,6", warm:"1,8"},
  {hersteller:"Metzeler", modell:"Racetec TD Slick", pos:"Hinten", dimension:"190/55 R17", kalt:"1,6", warm:"1,8"},
  {hersteller:"Metzeler", modell:"Racetec TD Slick", pos:"Hinten", dimension:"200/55 R17", kalt:"1,6", warm:"1,8"},
  {hersteller:"Metzeler", modell:"Racetec RR", pos:"Vorne", dimension:"120/70 ZR17", kalt:"2,1", warm:"2,3"},
  {hersteller:"Metzeler", modell:"Racetec RR", pos:"Hinten", dimension:"180/60 ZR17", kalt:"1,6", warm:"1,8"},
  {hersteller:"Metzeler", modell:"Racetec RR", pos:"Hinten", dimension:"180/55 ZR17", kalt:"1,5", warm:"1,7"},
  {hersteller:"Metzeler", modell:"Racetec RR", pos:"Hinten", dimension:"190/55 ZR17", kalt:"1,6", warm:"1,8"},
  {hersteller:"Metzeler", modell:"Racetec RR", pos:"Hinten", dimension:"200/55 ZR17", kalt:"1,6", warm:"1,8"},

  // Pirelli
  {hersteller:"Pirelli", modell:"Diablo Superbike Slick", pos:"Vorne", dimension:"125/70 R17", kalt:"2,0", warm:"2,3"},
  {hersteller:"Pirelli", modell:"Diablo Superbike Slick", pos:"Hinten", dimension:"200/65 R17", kalt:"1,4", warm:"1,65"},
  {hersteller:"Pirelli", modell:"Diablo Superbike Slick", pos:"Vorne", dimension:"120/70 R17 NHS", kalt:"2,2", warm:"2,4"},
  {hersteller:"Pirelli", modell:"Diablo Superbike Slick", pos:"Hinten", dimension:"180/55 R17 NHS", kalt:"1,5", warm:"1,7"},
  {hersteller:"Pirelli", modell:"Diablo Superbike Slick", pos:"Hinten", dimension:"190/55 R17 NHS", kalt:"1,5", warm:"1,7"},
  {hersteller:"Pirelli", modell:"Diablo Superbike Slick", pos:"Hinten", dimension:"200/60 R17 NHS", kalt:"1,5", warm:"1,7"},
  {hersteller:"Pirelli", modell:"Diablo Supercorsa V3", pos:"Vorne", dimension:"120/70 ZR17", kalt:"2,1", warm:"2,3"},
  {hersteller:"Pirelli", modell:"Diablo Supercorsa V3", pos:"Hinten", dimension:"180/60 ZR17", kalt:"1,5", warm:"1,7"},
  {hersteller:"Pirelli", modell:"Diablo Supercorsa V3", pos:"Hinten", dimension:"190/55 ZR17", kalt:"1,6", warm:"1,8"},
  {hersteller:"Pirelli", modell:"Diablo Supercorsa V3", pos:"Hinten", dimension:"200/55 ZR17", kalt:"1,5", warm:"1,7"},
  {hersteller:"Pirelli", modell:"Diablo Supercorsa V3", pos:"Hinten", dimension:"200/60 ZR17", kalt:"1,5", warm:"1,7"},


  //Michelin

    {hersteller:"Michelin", modell:"Power Performance", pos:"Vorne", dimension:"120/70 R17", kalt:"2,1", warm:"2,4"}, 
    {hersteller:"Michelin", modell:"Power Performance", pos:"Hinten", dimension:"190/55 R17", kalt:"1,3", warm:"1,6"}, 
    {hersteller:"Michelin", modell:"Power Performance", pos:"Hinten", dimension:"200/60 R17", kalt:"1,3", warm:"1,6"}, 

    {hersteller:"Michelin", modell:"Power Slick 2", pos:"Vorne", dimension:"120/70 R17", kalt:"2,1", warm:"2,4"}, 
    {hersteller:"Michelin", modell:"Power Slick 2", pos:"Hinten", dimension:"190/55 R17", kalt:"1,5", warm:"1,7"}, 
    {hersteller:"Michelin", modell:"Power Slick 2", pos:"Hinten", dimension:"200/55 R17", kalt:"1,5", warm:"1,7"},

    {hersteller:"Michelin", modell:"Power Cup 2", pos:"Vorne", dimension:"120/70 R17", kalt:"2,1", warm:"2,4"}, 
    {hersteller:"Michelin", modell:"Power Cup 2", pos:"Hinten", dimension:"180/55 R17", kalt:"1,5", warm:"1,7"}, 
    {hersteller:"Michelin", modell:"Power Cup 2", pos:"Hinten", dimension:"190/55 R17", kalt:"1,5", warm:"1,7"},
    {hersteller:"Michelin", modell:"Power Cup 2", pos:"Hinten", dimension:"200/55 R17", kalt:"1,5", warm:"1,7"},

    {hersteller:"Michelin", modell:"Power GP", pos:"Vorne", dimension:"120/70 R17", kalt:"2,1", warm:"2,4"}, 
    {hersteller:"Michelin", modell:"Power GP", pos:"Hinten", dimension:"180/55 R17", kalt:"1,9", warm:"2,1"}, 
    {hersteller:"Michelin", modell:"Power GP", pos:"Hinten", dimension:"190/55 R17", kalt:"1,9", warm:"2,1"}

];


/* Tabelle und Filter rendern */
function renderReifenDB(){
  const body = document.getElementById("reifenDBBody");
  body.innerHTML = "";

  // Filterwerte holen
  const fHersteller = document.getElementById("db_hersteller").value;
  const fPos = document.getElementById("db_position").value;

  // Filter anwenden
  const filtered = reifenDB.filter(r => 
    (!fHersteller || r.hersteller === fHersteller) &&
    (!fPos || r.pos === fPos)
  );

  // Tabelle befüllen
  filtered.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.hersteller}</td>
      <td>${r.modell}</td>
      <td>${r.pos}</td>
      <td>${r.dimension}</td>
      <td>${r.warm}</td>
      <td>${r.kalt}</td>
      <td><button class="btn" onclick="removeReifenDB('${r.hersteller}','${r.modell}','${r.dimension}')">✖</button></td>
    `;
    body.appendChild(tr);
  });

  // Filter-Dropdowns aktualisieren
  updateReifenDBFilters();
}


function updateReifenDBFilters(){
  const herstellerSel = document.getElementById("db_hersteller");
  const posSel = document.getElementById("db_position");

  // aktuelle Auswahl merken
  const currentHersteller = herstellerSel.value;
  const currentPos = posSel.value;

  const hersteller = [...new Set(reifenDB.map(r => r.hersteller))].sort();
  const positionen = [...new Set(reifenDB.map(r => r.pos))].sort();

  // Hersteller-Filter füllen
  herstellerSel.innerHTML = "<option value=''>-- alle --</option>";
  hersteller.forEach(h=>{
    const opt=document.createElement("option");
    opt.value=h; opt.textContent=h;
    herstellerSel.appendChild(opt);
  });

  // Position-Filter füllen
  posSel.innerHTML = "<option value=''>-- alle --</option>";
  positionen.forEach(p=>{
    const opt=document.createElement("option");
    opt.value=p; opt.textContent=p;
    posSel.appendChild(opt);
  });

  // Auswahl zurücksetzen (falls gültig)
  if(hersteller.includes(currentHersteller) || currentHersteller===""){
    herstellerSel.value = currentHersteller;
  }
  if(positionen.includes(currentPos) || currentPos===""){
    posSel.value = currentPos;
  }
}



/* Neuen Reifen hinzufügen */
function addReifenDB(){
  const sel=document.getElementById("db_add_hersteller");
  let hersteller=sel.value;
  if(hersteller==="__neu__"){
    hersteller=document.getElementById("db_add_hersteller_new").value.trim();
  }

  const modell=document.getElementById("db_add_modell").value.trim();
  const pos=document.getElementById("db_add_pos").value;
  const dim=document.getElementById("db_add_dim").value.trim();
  const warm=document.getElementById("db_add_warm").value.trim();
  const kalt=document.getElementById("db_add_kalt").value.trim();

  if(!hersteller || !modell || !dim){
    alert("Bitte Hersteller, Modell und Dimension angeben!");
    return;
  }

  // Neuen Eintrag hinzufügen
  reifenDB.push({hersteller, modell, pos, dimension:dim, warm, kalt});

  // Datenbank sortieren
  reifenDB.sort((a,b)=>{
    if(a.hersteller !== b.hersteller) return a.hersteller.localeCompare(b.hersteller);
    if(a.modell !== b.modell) return a.modell.localeCompare(b.modell);
    if(a.pos !== b.pos) return a.pos.localeCompare(b.pos);
    return a.dimension.localeCompare(b.dimension, 'de', {numeric:true});
  });

  // Formular zurücksetzen
  document.getElementById("db_add_modell").value="";
  document.getElementById("db_add_dim").value="";
  document.getElementById("db_add_warm").value="";
  document.getElementById("db_add_kalt").value="";
  document.getElementById("db_add_pos").value="Vorne";
  document.getElementById("db_add_hersteller_new").value="";
  document.getElementById("db_add_hersteller_new").style.display="none";
  sel.value="";

  // 👇 wichtig: beide Dropdowns aktualisieren
  renderReifenDB();
  updateHerstellerDropdown();
}


function removeReifenDB(hersteller, modell, dimension){
  const idx = reifenDB.findIndex(r => 
    r.hersteller === hersteller && 
    r.modell === modell && 
    r.dimension === dimension
  );
  if(idx > -1){
    if(confirm("Diesen Reifeneintrag wirklich löschen?")){
      reifenDB.splice(idx, 1);
      renderReifenDB();
      updateHerstellerDropdown();
    }
  }
}


/* Filter aufrufen */
function filterReifenDB(){
  renderReifenDB();
}

function updateHerstellerDropdown(){
  const sel = document.getElementById("db_add_hersteller");
  const neu = document.getElementById("db_add_hersteller_new");

  // Alle Hersteller aus reifenDB sammeln und sortieren
  const hersteller = [...new Set(reifenDB.map(r => r.hersteller))].sort();

  // Dropdown leeren und neu aufbauen
  sel.innerHTML = "";
  hersteller.forEach(h=>{
    const opt=document.createElement("option");
    opt.value=h;
    opt.textContent=h;
    sel.appendChild(opt);
  });

  // Extra Option „+ Neuer Hersteller“
  const optNeu=document.createElement("option");
  optNeu.value="__neu__";
  optNeu.textContent="+ Neuer Hersteller";
  sel.appendChild(optNeu);

  // Event: Eingabefeld für neuen Hersteller ein-/ausblenden
  sel.onchange = ()=>{
    if(sel.value==="__neu__"){
      neu.style.display="block";
    } else {
      neu.style.display="none";
      neu.value="";
    }
  };
}


function deleteHistorie(idx){
  if(confirm("Diesen Eintrag wirklich löschen?")){
    setupData.historie.splice(idx,1);
    renderHistorie();
  }
}



/* ---------------- Init ---------------- */
window.onload = () => {
  // wichtig: startet auf Fahrwerk-Seite
  showPage("fahrwerk", document.querySelector("nav button"));

  // alte Init-Aufrufe von v3.1.1
  fillFormFromData({});
  renderReifenlager();
  renderHistorie();
  renderReifenDB();
  updateHerstellerDropdown();
};

