// Datenstruktur für die Buttons
const buttons = [];
for (let i = 0; i < 10; i++) {
    const delay = 2 * (5 ** i);   // Verzögerung: 2 * 5^i
    const points = 1 * (10 ** i); // Punkte: 1 * 10^i
    buttons.push({ caption: `Button ${i + 1}`, delay, points, level: 0 });
}
buttons[0].level = 1; // Start-Level für Button 1

// Datenstruktur für Updates
const availableUpdates = [
    { name: "Alle Buttons +10%", cost: 100, effect: { type: 'global', multiplier: 1.1 } },
    { name: "Button 3 +50%", cost: 50, effect: { type: 'single', index: 2, multiplier: 1.5 } }
];

// Spielzustand
let points = 0;
let managers = []; // Indizes der Buttons mit Managern
const buttonStates = buttons.map(() => ({ availableAt: 0, isProcessing: false })); // Zeitpunkt und Bearbeitungsstatus

// DOM-Elemente
const content = document.getElementById('content');
const pointsDisplay = document.getElementById('points');
const sidebarBtns = document.querySelectorAll('aside button');

// Arrays zur Speicherung der UI-Elemente
let buttonElements = [];
let timeDisplays = [];

// Funktion zum Rendern der Work-Seite
function renderWork() {
    content.innerHTML = `
        <div class="container">
            <div class="column left"></div>
            <div class="column right"></div>
        </div>
    `;

    buttonElements = []; // Zurücksetzen der gespeicherten Buttons
    timeDisplays = [];   // Zurücksetzen der Zeitangaben

    buttons.forEach((btn, index) => {
        // Panel erstellen
        const panel = document.createElement('div');
        panel.classList.add('card', 'm-2');
        panel.style.width = '500px';

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // Hauptbutton
        const button = document.createElement('button');
        button.textContent = `${btn.caption} (Level ${btn.level})`;
        button.classList.add('btn', 'btn-secondary', 'btn-block');
        // Button nur aktiv, wenn Level > 0 und nicht in Bearbeitung
        button.disabled = (btn.level === 0 || buttonStates[index].isProcessing);
        button.addEventListener('click', () => clickButton(index));
        buttonElements[index] = button; // Button speichern

        // Zeitanzeige
        const timeDisplay = document.createElement('span');
        timeDisplay.classList.add('time-display');
        timeDisplay.textContent = 'Bereit';
        timeDisplays[index] = timeDisplay; // Zeitangabe speichern

        // Level-Up-Button
        const levelUpBtn = document.createElement('button');
        levelUpBtn.textContent = `Level Up - Kosten: ${10 * btn.points}`;
        levelUpBtn.classList.add('btn', 'btn-info', 'btn-block');
        levelUpBtn.addEventListener('click', () => handleLevelUp(index));

        // Elemente zum Panel hinzufügen
        cardBody.appendChild(button);
        cardBody.appendChild(timeDisplay);
        cardBody.appendChild(levelUpBtn);
        panel.appendChild(cardBody);
        if (index < 5) {
            document.querySelector('.column.left').appendChild(panel);
        } else {
            document.querySelector('.column.right').appendChild(panel);
        }
    });
}

// Button-Klick-Logik: Startet nur den Timer
function clickButton(index) {
    const btn = buttons[index];
    // Nur klickbar, wenn Level > 0 und nicht in Bearbeitung
    if (btn.level > 0 && !buttonStates[index].isProcessing) {
        buttonStates[index].isProcessing = true;
        buttonStates[index].availableAt = Date.now() + btn.delay * 1000;
        buttonElements[index].disabled = true; // Button deaktivieren
    }
}

// Globale Aktualisierung: Prüft Timer und schreibt Punkte gut
function updateButtonStates() {
    buttons.forEach((btn, index) => {
        if (buttonStates[index].isProcessing) {
            if (Date.now() >= buttonStates[index].availableAt) {
                // Zeit abgelaufen: Punkte gutschreiben
                points += btn.points * btn.level;
                pointsDisplay.textContent = `Punkte: ${points}`;
                buttonStates[index].isProcessing = false;
                buttonElements[index].disabled = false; // Button aktivieren
                timeDisplays[index].textContent = 'Bereit';
            } else {
                // Restzeit anzeigen
                const remaining = Math.ceil((buttonStates[index].availableAt - Date.now()) / 1000);
                timeDisplays[index].textContent = `${remaining} Sekunden`;
            }
        } else {
            timeDisplays[index].textContent = 'Bereit';
        }
    });
}

// Globaler Timer für die Aktualisierung
setInterval(updateButtonStates, 1000);

// Level-Up-Logik
function handleLevelUp(index) {
    const btn = buttons[index];
    const cost = 10 * btn.points;
    if (points >= cost) {
        points -= cost;
        btn.level += 1;
        pointsDisplay.textContent = `Punkte: ${points}`;
        renderWork(); // UI neu rendern
    }
}

// Funktion zum Rendern der Update-Seite
function renderUpdate() {
    content.innerHTML = '';
    availableUpdates.forEach((update, index) => {
        const updateBtn = document.createElement('button');
        updateBtn.textContent = `${update.name} - Kosten: ${update.cost}`;
        updateBtn.classList.add('btn', 'btn-success', 'm-2');
        updateBtn.addEventListener('click', () => {
            if (points >= update.cost) {
                points -= update.cost;
                pointsDisplay.textContent = `Punkte: ${points}`;
                applyUpdate(update);
                availableUpdates.splice(index, 1);
                renderUpdate();
            }
        });
        content.appendChild(updateBtn);
    });
}

// Update anwenden
function applyUpdate(update) {
    if (update.effect.type === 'global') {
        buttons.forEach(btn => btn.points *= update.effect.multiplier);
    } else if (update.effect.type === 'single') {
        buttons[update.effect.index].points *= update.effect.multiplier;
    }
}

// Funktion zum Rendern der Manager-Seite
function renderManager() {
    content.innerHTML = '';
    buttons.forEach((btn, index) => {
        if (!managers.includes(index)) {
            const managerBtn = document.createElement('button');
            managerBtn.textContent = `Manager für ${btn.caption} - Kosten: ${btn.delay * 10}`;
            managerBtn.classList.add('btn', 'btn-warning', 'm-2');
            managerBtn.addEventListener('click', () => {
                const cost = btn.delay * 10;
                if (points >= cost) {
                    points -= cost;
                    pointsDisplay.textContent = `Punkte: ${points}`;
                    managers.push(index);
                    renderManager();
                    renderWork();
                }
            });
            content.appendChild(managerBtn);
        }
    });
}

// Manager-Logik: Startet Timer, keine direkte Punktgutschrift
function runManagers() {
    setInterval(() => {
        managers.forEach(index => {
            if (buttons[index].level > 0 && !buttonStates[index].isProcessing) {
                clickButton(index); // Timer starten
            }
        });
    }, 1000);
}

// Event Listener für Seitenleisten-Buttons
sidebarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        sidebarBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (btn.id === 'workBtn') renderWork();
        else if (btn.id === 'updateBtn') renderUpdate();
        else if (btn.id === 'managerBtn') renderManager();
    });
});

// Initiales Rendern und Manager starten
renderWork();
runManagers();