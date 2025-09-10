document.getElementById("export").addEventListener("click", () => {
  const data = localStorage.getItem("lastSetup"); // oder alle Setups, wenn du mehrere speicherst
  if (!data) {
    alert("Keine Daten vorhanden!");
    return;
  }

  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "fahrwerksdaten.json";
  a.click();

  URL.revokeObjectURL(url);
});
