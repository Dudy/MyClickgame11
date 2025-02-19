document.addEventListener("DOMContentLoaded", function () {
  // Globaler Spielstatus
  const gameState = {
    points: 0
  };

  // Konfiguration der 10 Work-Buttons
  const workButtonsConfig = [
    { id: 1, caption: "Task 1", delay: 10, basePoints: 10, bonusMultiplier: 1, managerHired: false },
    { id: 2, caption: "Task 2", delay: 12, basePoints: 12, bonusMultiplier: 1, managerHired: false },
    { id: 3, caption: "Task 3", delay: 15, basePoints: 15, bonusMultiplier: 1, managerHired: false },
    { id: 4, caption: "Task 4", delay: 8,  basePoints: 8,  bonusMultiplier: 1, managerHired: false },
    { id: 5, caption: "Task 5", delay: 20, basePoints: 20, bonusMultiplier: 1, managerHired: false },
    { id: 6, caption: "Task 6", delay: 5,  basePoints: 5,  bonusMultiplier: 1, managerHired: false },
    { id: 7, caption: "Task 7", delay: 18, basePoints: 18, bonusMultiplier: 1, managerHired: false },
    { id: 8, caption: "Task 8", delay: 7,  basePoints: 7,  bonusMultiplier: 1, managerHired: false },
    { id: 9, caption: "Task 9", delay: 14, basePoints: 14, bonusMultiplier: 1, managerHired: false },
    { id: 10, caption: "Task 10", delay: 9, basePoints: 9, bonusMultiplier: 1, managerHired: false }
  ];

  // Konfiguration der Updates
  const updatesConfig = [
    {
      id: 1,
      name: "Alle Buttons +10%",
      cost: 50,
      apply: function () {
        workButtonsConfig.forEach(btn => {
          btn.bonusMultiplier *= 1.1;
        });
      }
    },
    {
      id: 2,
      name: "Button 3 +50%",
      cost: 100,
      apply: function () {
        const btn = workButtonsConfig.find(b => b.id === 3);
        if (btn) {
          btn.bonusMultiplier *= 1.5;
        }
      }
    }
    // Weitere Updates können hier ergänzt werden.
  ];

  // Navigation: Event Listener für die Sidebar-Buttons
  document.getElementById("btnWork").addEventListener("click", showWork);
  document.getElementById("btnUpdate").addEventListener("click", showUpdate);
  document.getElementById("btnManager").addEventListener("click", showManager);

  // Aktualisiere die Punkteanzeige im Header
  function updateStatus() {
    document.getElementById("status").textContent = "Points: " + Math.floor(gameState.points);
  }

  // Punkte hinzufügen und UI aktualisieren
  function addPoints(pts) {
    gameState.points += pts;
    updateStatus();
  }

  // ---------------------------
  // Screen: Work
  // ---------------------------
  function showWork() {
    const content = document.getElementById("content");
    content.innerHTML = "";

    // Erstelle ein Bootstrap-Grid: 2 Spalten, mit Abstand (g-3)
    const grid = document.createElement("div");
    grid.className = "row row-cols-2 g-3";

    workButtonsConfig.forEach(btnConfig => {
      // Bootstrap-Spalte
      const col = document.createElement("div");
      col.className = "col";

      // Erstelle eine Card für den Button
      const card = document.createElement("div");
      card.className = "card text-center";

      const cardBody = document.createElement("div");
      cardBody.className = "card-body";

      // Der eigentliche Button
      const button = document.createElement("button");
      button.textContent = btnConfig.caption;
      button.id = "work-btn-" + btnConfig.id;
      button.className = "btn btn-primary w-100";
      button.disabled = false;

      // Countdown-Anzeige
      const countdownText = document.createElement("div");
      countdownText.className = "countdown";

      // Elemente zusammenfügen
      cardBody.appendChild(button);
      cardBody.appendChild(countdownText);
      card.appendChild(cardBody);
      col.appendChild(card);
      grid.appendChild(col);

      // Klick-Event: Punkte vergeben, Button deaktivieren und Cooldown starten
      button.addEventListener("click", function () {
        button.disabled = true;
        const earnedPoints = btnConfig.basePoints * btnConfig.bonusMultiplier;
        addPoints(earnedPoints);

        let remaining = btnConfig.delay;
        countdownText.textContent = remaining + " Sekunden";
        const interval = setInterval(() => {
          remaining--;
          if (remaining > 0) {
            countdownText.textContent = remaining + " Sekunden";
          } else {
            clearInterval(interval);
            countdownText.textContent = "";
            button.disabled = false;
            // Falls ein Manager eingestellt wurde, wird der Button automatisch gedrückt
            if (btnConfig.managerHired) {
              button.click();
            }
          }
        }, 1000);
      });
    });

    content.appendChild(grid);
  }

  // ---------------------------
  // Screen: Update
  // ---------------------------
  function showUpdate() {
    const content = document.getElementById("content");
    content.innerHTML = "";

    // Verwende eine Bootstrap List Group
    const list = document.createElement("ul");
    list.className = "list-group";

    updatesConfig.forEach(update => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.textContent = update.name + " (Kosten: " + update.cost + " Punkte)";

      const btn = document.createElement("button");
      btn.textContent = "Kaufen";
      btn.className = "btn btn-success btn-sm";
      btn.addEventListener("click", function () {
        if (gameState.points >= update.cost) {
          gameState.points -= update.cost;
          update.apply();
          updateStatus();
          btn.disabled = true; // Einmaliger Kauf – danach deaktivieren
        } else {
          alert("Nicht genügend Punkte!");
        }
      });
      li.appendChild(btn);
      list.appendChild(li);
    });

    content.appendChild(list);
  }

  // ---------------------------
  // Screen: Manager
  // ---------------------------
  function showManager() {
    const content = document.getElementById("content");
    content.innerHTML = "";

    // Verwende eine Bootstrap List Group für Manager
    const list = document.createElement("ul");
    list.className = "list-group";

    workButtonsConfig.forEach(btnConfig => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.textContent = "Manager für " + btnConfig.caption + " (Kosten: 150 Punkte)";

      const btn = document.createElement("button");
      btn.textContent = btnConfig.managerHired ? "Eingestellt" : "Manager einstellen";
      btn.className = "btn btn-secondary btn-sm";
      btn.disabled = btnConfig.managerHired;
      btn.addEventListener("click", function () {
        const cost = 150;
        if (gameState.points >= cost) {
          gameState.points -= cost;
          btnConfig.managerHired = true;
          btn.textContent = "Eingestellt";
          btn.disabled = true;
          updateStatus();
        } else {
          alert("Nicht genügend Punkte!");
        }
      });
      li.appendChild(btn);
      list.appendChild(li);
    });

    content.appendChild(list);
  }

  // Zeige initial den Work-Bereich an
  showWork();
  updateStatus();
});
