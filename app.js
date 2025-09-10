function showPage(page) {
  document.querySelectorAll("section").forEach(sec => sec.style.display = "none");
  document.getElementById(page).style.display = "block";
}

// --- Fahrwerksprotokoll speichern ---
document.getElementById("setupForm").addEventListener("submit", e => {
  e.preventDefault();

  const bike = document.getElementById("bike").value;
  const track = document.getElementById("track").value;
  const sagFork = document.getElementById("sagFork").value;

  const data = { bike, track, sagFork };

  localStorage.setItem("lastSetup", JSON.stringify(data));
  alert("Gespeichert!");
});

// --- Beim Laden alte Werte einsetzen ---
window.addEventListener("load", () => {
  const saved = localStorage.getItem("lastSetup");
  if (saved) {
    const data = JSON.parse(saved);
    document.getElementById("bike").value = data.bike || "";
    document.getElementById("track").value = data.track || "";
    document.getElementById("sagFork").value = data.sagFork || "";
  }
});
