console.log("App.js geladen!");

// --------------- Storage & Navigation ---------------
function showPage(pageId){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}

// Reifendaten initial
let reifen = JSON.parse(localStorage.getItem("reifen")) || [
  {name:"Michelin Power GP",druck:"2.1/1.9",turns:0,heizzyklen:0},
  {name:"Pirelli Diablo Superbike",druck:"2.2/2.0",turns:0,heizzyklen:0},
  {name:"Bridgestone RS10",druck:"2.0/1.8",turns:0,heizzyklen:0}
];
function saveReifen(){localStorage.setItem("reifen",JSON.stringify(reifen));}
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
}
function addTurn(i){reifen[i].turns++; saveReifen(); renderReifen();}
function addHeat(i){reifen[i].heizzyklen++; saveReifen(); renderReifen();}
document.getElementById("reifenForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=document.getElementById("reifenName").value;
  const druck=document.getElementById("reifenDruck").value;
  reifen.push({name,druck,turns:0,heizzyklen:0});
  saveReifen();
  renderReifen();
  e.target.reset();
});
renderReifen();

// --------------- Fahrwerksprotokoll ---------------
let setups=JSON.parse(localStorage.getItem("setups"))||[];
function saveSetup(){
  const d=id=>document.getElementById(id)?.value||"-";
  const data={
    datum:d("datum"),
    motorrad:d("motorrad"),
    strecke:d("strecke")==="custom"?d("streckeCustom"):d("strecke"),
    session:d("session"),
    reifenVorne:d("reifenVorne"),
    turnsVorne:+d("turnsVorne")||0,
    heizVorne:+d("heizVorne")||0,
    reifenHinten:d("reifenHinten"),
    turnsHinten:+d("turnsHinten")||0,
    heizHinten:+d("heizHinten")||0,
    sagVDynamisch:+d("sagVDynamisch")||0,
    sagHDynamisch:+d("sagHDynamisch")||0
  };
  setups.push(data);
  localStorage.setItem("setups",JSON.stringify(setups));

  // Update Reifenlager Turns
  const idxV=reifen.findIndex(r=>r.name===data.reifenVorne);
  if(idxV>=0){reifen[idxV].turns+=data.turnsVorne; reifen[idxV].heizzyklen+=data.heizVorne;}
  const idxH=reifen.findIndex(r=>r.name===data.reifenHinten);
  if(idxH>=0){reifen[idxH].turns+=data.turnsHinten; reifen[idxH].heizzyklen+=data.heizHinten;}
  saveReifen(); renderReifen();

  alert("✅ Setup gespeichert!");
}

// Markdown Export
function exportMarkdown(){
  let md=`# 🏍️ Fahrwerksdaten Export\n\n## Fahrwerksprotokolle\n`;
  if(setups.length===0){ md+="_Keine Protokolle_\n"; }
  else setups.forEach((s,i)=>{
    md+=`### Session ${i+1} - ${s.datum}\n- Motorrad: ${s.motorrad}\n- Strecke: ${s.strecke}\n- Session: ${s.session}\n- Reifen vorne: ${s.reifenVorne} (Turns: ${s.turnsVorne}, Heizzyklen: ${s.heizVorne})\n- Reifen hinten: ${s.reifenHinten} (Turns: ${s.turnsHinten}, Heizzyklen: ${s.heizHinten})\n- Sag Gabel: ${s.sagVDynamisch} mm\n- Sag Federbein: ${s.sagHDynamisch} mm\n\n`;
  });

  md+="## Reifenlager\n";
  reifen.forEach(r=>{md+=`- **${r.name}** | Druck: ${r.druck} | Turns: ${r.turns} | Heizzyklen: ${r.heizzyklen}\n`;});

  const blob=new Blob([md],{type:"text/markdown"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a"); a.href=url; a.download="fahrwerksdaten.md"; a.click();
  URL.revokeObjectURL(url);
}
