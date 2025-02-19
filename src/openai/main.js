document.addEventListener("DOMContentLoaded", function () {
  // Globaler Spielstatus
  const gameState = {
    points: 0
  };

  // Exponentielle Konfiguration der 10 Work-Buttons:
  // Button 1: delay: 2 sec, basePoints: 1, level: 1, levelUpgradeCount: 0, cooldownActive: false
  // Jeder weitere Button: delay = vorheriger Delay * 5, basePoints = vorheriger basePoints * 10, level: 0, levelUpgradeCount: 0, cooldownActive: false
  const workButtonsConfig = [
    { id: 1, caption: "Task 1", delay: 2,       basePoints: 1,         bonusMultiplier: 1, managerHired: false, level: 1, levelUpgradeCount: 0, cooldownActive: false },
    { id: 2, caption: "Task 2", delay: 2 * 5,   basePoints: 1 * 10,      bonusMultiplier: 1, managerHired: false, level: 0, levelUpgradeCount: 0, cooldownActive: false },
    { id: 3, caption: "Task 3", delay: 2 * 5**2, basePoints: 1 * 10**2,   bonusMultiplier: 1, managerHired: false, level: 0, levelUpgradeCount: 0, cooldownActive: false },
    { id: 4, caption: "Task 4", delay: 2 * 5**3, basePoints: 1 * 10**3,   bonusMultiplier: 1, managerHired: false, level: 0, levelUpgradeCount: 0, cooldownActive: false },
    { id: 5, caption: "Task 5", delay: 2 * 5**4, basePoints: 1 * 10**4,   bonusMultiplier: 1, managerHired: false, level: 0, levelUpgradeCount: 0, cooldownActive: false },
    { id: 6, caption: "Task 6", delay: 2 * 5**5, basePoints: 1 * 10**5,   bonusMultiplier: 1, managerHired: false, level: 0, levelUpgradeCount: 0, cooldownActive: false },
    { id: 7, caption: "Task 7", delay: 2 * 5**6, basePoints: 1 * 10**6,   bonusMultiplier: 1, managerHired: false, level: 0, levelUpgradeCount: 0, cooldownActive: false },
    { id: 8, caption: "Task 8", delay: 2 * 5**7, basePoints: 1 * 10**7,   bonusMultiplier: 1, managerHired: false, level: 0, levelUpgradeCount: 0, cooldownActive: false },
    { id: 9, caption: "Task 9", delay: 2 * 5**8, basePoints: 1 * 10**8,   bonusMultiplier: 1, managerHired: false, level: 0, levelUpgradeCount: 0, cooldownActive: false },
    { id: 10, caption: "Task 10", delay: 2 * 5**9, basePoints: 1 * 10**9, bonusMultiplier: 1, managerHired: false, level: 0, levelUpgradeCount: 0, cooldownActive: false }
  ];

  // Konfiguration der Updates
  // Die aktuellen Kosten werden berechnet als: baseCost * (1.1^level)
  const updatesConfig = [
    {
      id: 1,
      name: "Alle Buttons +10%",
      baseCost: 50,
      level: 0,
      apply: function () {
        workButtonsConfig.forEach(btn => {
          btn.bonusMultiplier *= 1.1;
        });
      }
    },
    {
      id: 2,
      name: "Button 3 +50%",
      baseCost: 100,
      level: 0,
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

    // Erstelle einen Row-Container mit zwei Spalten (je 6 von 12 Spaltenbreiten)
    const row = document.createElement("div");
    row.className = "row";

    const leftCol = document.createElement("div");
    leftCol.className = "col-md-6";
    const rightCol = document.createElement("div");
    rightCol.className = "col-md-6";

    // Buttons 1-5 in der linken, 6-10 in der rechten Spalte
    workButtonsConfig.forEach((btnConfig, index) => {
      // Erstelle eine Card für den Button
      const card = document.createElement("div");
      card.className = "card text-center mb-3";

      const cardBody = document.createElement("div");
      cardBody.className = "card-body";

      // Der Work-Button
      const workButton = document.createElement("button");
      workButton.textContent = btnConfig.caption;
      workButton.id = "work-btn-" + btnConfig.id;
      workButton.className = "btn btn-primary w-100 mb-2";
      // Buttons mit Level 0 sind deaktiviert
      workButton.disabled = (btnConfig.level === 0);

      // Countdown-Anzeige mit Default-Wert "Bereit"
      const countdownText = document.createElement("div");
      countdownText.className = "countdown mb-2";
      countdownText.textContent = "Bereit";

      // Anzeige des aktuellen Levels
      const levelInfo = document.createElement("div");
      levelInfo.className = "mb-2";
      levelInfo.textContent = "Level: " + btnConfig.level;

      // Level Up Button mit dynamischen Kosten:
      // Kosten = Math.floor(10 * basePoints * (1.1^levelUpgradeCount))
      let levelUpCost = Math.floor(10 * btnConfig.basePoints * Math.pow(1.1, btnConfig.levelUpgradeCount));
      const levelUpButton = document.createElement("button");
      levelUpButton.textContent = "Level Up (Cost: " + levelUpCost + ")";
      levelUpButton.className = "btn btn-secondary btn-sm";

      levelUpButton.addEventListener("click", function () {
        // Neuberechnung der Kosten
        levelUpCost = Math.floor(10 * btnConfig.basePoints * Math.pow(1.1, btnConfig.levelUpgradeCount));
        if (gameState.points >= levelUpCost) {
          gameState.points -= levelUpCost;
          btnConfig.level++;
          btnConfig.levelUpgradeCount++;
          levelInfo.textContent = "Level: " + btnConfig.level;
          updateStatus();
          // Kosten-Display aktualisieren
          levelUpButton.textContent = "Level Up (Cost: " +
            Math.floor(10 * btnConfig.basePoints * Math.pow(1.1, btnConfig.levelUpgradeCount)) + ")";
          // Nur reaktivieren, wenn nicht im Cooldown
          if (btnConfig.level > 0 && !btnConfig.cooldownActive) {
            workButton.disabled = false;
          }
        } else {
          alert("Nicht genügend Punkte zum Leveln!");
        }
      });

      // Klick-Event für den Work-Button:
      // Punkte werden erst nach Ablauf des Countdowns gutgeschrieben.
      workButton.addEventListener("click", function () {
        workButton.disabled = true;
        btnConfig.cooldownActive = true;
        let remaining = btnConfig.delay;
        countdownText.textContent = remaining + " Sekunden";
        const interval = setInterval(() => {
          remaining--;
          if (remaining > 0) {
            countdownText.textContent = remaining + " Sekunden";
          } else {
            clearInterval(interval);
            countdownText.textContent = "Bereit";
            btnConfig.cooldownActive = false;
            // Punkte werden jetzt gutgeschrieben
            const earnedPoints = btnConfig.basePoints * btnConfig.level * btnConfig.bonusMultiplier;
            addPoints(earnedPoints);
            // Nur aktivieren, wenn nicht im Cooldown (sollte jetzt false sein)
            if (btnConfig.level > 0 && !btnConfig.cooldownActive) {
              workButton.disabled = false;
            }
            // Falls ein Manager eingestellt wurde, wird der Button automatisch gedrückt
            if (btnConfig.managerHired) {
              workButton.click();
            }
          }
        }, 1000);
      });

      // Elemente in die Card einfügen
      cardBody.appendChild(workButton);
      cardBody.appendChild(countdownText);
      cardBody.appendChild(levelInfo);
      cardBody.appendChild(levelUpButton);
      card.appendChild(cardBody);

      // Buttons 1-5 in die linke Spalte, 6-10 in die rechte Spalte
      if (index < 5) {
        leftCol.appendChild(card);
      } else {
        rightCol.appendChild(card);
      }
    });

    row.appendChild(leftCol);
    row.appendChild(rightCol);
    content.appendChild(row);
  }

  // ---------------------------
  // Screen: Update
  // ---------------------------
  function showUpdate() {
    const content = document.getElementById("content");
    content.innerHTML = "";

    // Bootstrap List Group
    const list = document.createElement("ul");
    list.className = "list-group";

    updatesConfig.forEach(update => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";

      // Aktuelle Kosten: baseCost * (1.1^level)
      const currentCost = Math.floor(update.baseCost * Math.pow(1.1, update.level));
      li.textContent = update.name + " (Kosten: " + currentCost + " Punkte)";

      const btn = document.createElement("button");
      btn.textContent = "Kaufen";
      btn.className = "btn btn-success btn-sm";
      btn.addEventListener("click", function () {
        if (gameState.points >= currentCost) {
          gameState.points -= currentCost;
          update.apply();
          updateStatus();
          update.level++;
          // Aktualisieren des Listeneintrags
          li.textContent = update.name + " (Kosten: " +
            Math.floor(update.baseCost * Math.pow(1.1, update.level)) +
            " Punkte)";
          li.appendChild(btn);
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

    // Bootstrap List Group für Manager
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

  // Initial anzeigen
  showWork();
  updateStatus();
});
