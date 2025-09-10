console.log("App.js geladen!");

// ------------------- Navigation -------------------
function showPage(pageId){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}

// ------------------- Reifenlager -------------------
let reifen = JSON.parse(localStorage.getItem("reifen")) || [
  {name:"Michelin Power GP",druck:"2.1/1.9",turns:0,heizzyklen:0},
  {name:"Pirelli Diablo Superbike",druck:"2.2/2.0",turns:0,heizzyklen:0},
  {name:"Bridgestone RS10",druck:"2.0/1.8",turns:0,heizzyklen:0}
];
function saveReifen(){ localStorage.setItem("reifen", JSON.stringify(reifen)); }
function renderReifen(){
  const list=document.getElementById("reifenListe");
  list.innerHTML="";
  reifen.forEach((r,i)=>{
    const li=document.createElement("li");
    li.innerHTML=`<strong>${r.name}</strong> | Druck: ${r.druck} | Turns: ${r.turns} | Heizzyklen: ${r.heizzyklen} 
      <button onclick="addTurn(${i})">+Turn</button> 
      <button onclick="addHeat(${i})">+Heizzyklus</button>`;
    list.appendChild(li);
  });
  // Update Dropdowns
  const vorne=document.getElementById("reifenVorne");
  const hinten=document.getElementById("reifenHinten");
  vorne.innerHTML=hinten.innerHTML="";
  reifen.forEach(r=>{
    const opt1=document.createElement("option"); opt1.value=r.name; opt1.text=r.name; vorne.add(opt1);
    const opt2=document.createElement("option"); opt2.value=r.name; opt2.text=r.name; hinten.add(opt2);
  });
}
function addTurn(i){ reifen[i].turns++; saveReifen(); renderReifen(); }
function addHeat(i){ reifen[i].heizzyklen++; saveReifen(); renderReifen(); }
document.getElementById("reifenForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=document.getElementById("reifenName").value;
  const druck=document.getElementById("reifenDruck").value;
  reifen.push({name,druck,turns:0,heizzyklen:0});
  saveReifen(); renderReifen();
  e.target.reset();
});
renderReifen();

// ------------------- Fahrwerksprotokoll -------------------
let setups=JSON.parse(localStorage.getItem("setups"))||[];
function saveSetup(){
  const d=id=>document.getElementById(id)?.value||"-";
  const data={
    datum:d("datum"),
    motorrad:d("motorrad"),
    strecke:d("strecke")==="custom"?d("streckeCustom"):d("strecke"),
    session:d("session"),
    temp:d("temp"),
    wetter:d("wetter"),
    wind:d("wind"),
    min:d("min"),
    sek:d("sek"),
    zehntel:d("zehntel"),
    reifenVorne:d("reifenVorne"),
    reifenHinten:d("reifenHinten"),
    reifenBem:d("reifenBem"),
    gabelHoehe:d("gabelHoehe"),
    sagVStatisch:d("sagVStatisch"),
    sagVDynamisch:d("sagVDynamisch"),
    federV:d("federV"),
    vorspannungV:d("vorspannungV"),
    druckV:d("druckV"),
    zugV:d("zugV"),
    gabelBem:d("gabelBem"),
    heckhoehe:d("heckhoehe"),
    sagHStatisch:d("sagHStatisch"),
    sagHDynamisch:d("sagHDynamisch"),
    vorspannungH:d("vorspannungH"),
    federH:d("federH"),
    druckH:d("druckH"),
    zugH:d("zugH"),
    federBem:d("federBem"),
    uebersetzung:d("uebersetzung"),
    glieder:d("glieder"),
    antriebBem:d("antriebBem"),
    gesamtBem:d("gesamtBem")
  };
  setups.push(data);
  localStorage.setItem("setups", JSON.stringify(setups));
  alert("✅ Setup gespeichert!");
}

function exportMarkdown(){
  if(setups.length===0){ alert("Keine Daten vorhanden."); return; }
  const last=setups[setups.length-1];
  const text=`# Fahrwerksprotokoll
Datum: ${last.datum}
Motorrad: ${last.motorrad}
Strecke: ${last.strecke}
Session: ${last.session}

## Wetter
Temperatur: ${last.temp} °C
Wetter: ${last.wetter}
Wind: ${last.wind}

## Bestzeit
${last.min}:${last.sek.padStart(2,"0")}.${last.zehntel}

## Reifen
Vorne: ${last.reifenVorne}
Hinten: ${last.reifenHinten}
Bemerkungen Reifen: ${last.reifenBem}

## Vorderrad (Gabel)
Gabelhöhe: ${last.gabelHoehe} mm
SAG statisch: ${last.sagVStatisch} mm
SAG dynamisch: ${last.sagVDynamisch} mm
Federrate: ${last.federV} N/mm
Federvorspannung: ${last.vorspannungV} mm
Druckstufe: ${last.druckV} Umdr
Zugstufe: ${last.zugV} Umdr
Bemerkungen: ${last.gabelBem}

## Hinterrad (Federbein)
Heckhöhe: ${last.heckhoehe} mm
SAG statisch: ${last.sagHStatisch} mm
SAG dynamisch: ${last.sagHDynamisch} mm
Federvorspannung: ${last.vorspannungH} mm
Federrate: ${last.federH} N/mm
Druckstufe LS/HS: ${last.druckH}
Zugstufe: ${last.zugH}
Bemerkungen: ${last.federBem}

## Antrieb
Übersetzung: ${last.uebersetzung}
Kettenglieder: ${last.glieder}
Bemerkungen: ${last.antriebBem}

## Gesamtbemerkungen
${last.gesamtBem}`;
  const blob=new Blob([text],{type:"text/markdown"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download=`Fahrwerksprotokoll_${last.datum}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
