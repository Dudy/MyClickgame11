const buttons = [];
for (let i = 0; i < 10; i++) {
    const delay = 2 * (5 ** i);   // 2 * 5^i
    const points = 1 * (10 ** i); // 1 * 10^i
    buttons.push({ caption: `Button ${i + 1}`, delay, points, level: 0 });
}
buttons[0].level = 1

// Datenstruktur für Updates
const availableUpdates = [
    { name: "Alle Buttons +10%", cost: 100, effect: { type: 'global', multiplier: 1.1 } },
    { name: "Button 3 +50%", cost: 50, effect: { type: 'single', index: 2, multiplier: 1.5 } }
];

// Spielzustand
let points = 0;
let managers = []; // Indizes der Buttons mit Managern
const buttonStates = buttons.map(() => ({ availableAt: 0 })); // Zeitpunkt, wann der Button wieder verfügbar ist

// DOM-Elemente
const content = document.getElementById('content');
const pointsDisplay = document.getElementById('points');
const sidebarBtns = document.querySelectorAll('aside button');

// Funktion zum Rendern der Work-Seite
function renderWork() {
//    content.innerHTML = '';
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
        if (btn.level === 0) {
            button.disabled = true;
        } else {
            button.addEventListener('click', () => clickButton(index));
        }

        // Zeitanzeige
        const timeDisplay = document.createElement('span');
        timeDisplay.classList.add('time-display');
        timeDisplay.textContent = 'Bereit';

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

//        content.appendChild(panel);
        if (index <= 5) {
            document.querySelector('.column.left').appendChild(panel);
        } else {
            document.querySelector('.column.right').appendChild(panel);
        }
        console.log(document);
//        console.log(document.querySelector('div.column.left'));

        // Timer für Zeitaktualisierung
        setInterval(() => updateTimeDisplay(index, timeDisplay), 1000);
    });
}

// Button-Klick-Logik
function clickButton(index) {
    const btn = buttons[index];
    if (btn.level > 0 && Date.now() >= buttonStates[index].availableAt) {
        points += btn.points * btn.level; // Neue Logik
        buttonStates[index].availableAt = Date.now() + btn.delay * 1000;
        render();
    }
}

// Zeitaktualisierung für die UI
function updateTimeDisplay(index, timeDisplay) {
    const state = buttonStates[index];
    if (Date.now() < state.availableAt) {
        const remaining = Math.ceil((state.availableAt - Date.now()) / 1000);
        timeDisplay.textContent = `${remaining} Sekunden`;
    } else {
        timeDisplay.textContent = 'Bereit';
    }
}

// Level-Up-Logik
function handleLevelUp(index) {
    const btn = buttons[index];
    const cost = 10 * btn.points;
    if (points >= cost) {
        points -= cost;
        btn.level += 1;
        pointsDisplay.textContent = `Punkte: ${points}`;
        renderWork(); // UI aktualisieren
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

// Manager-Logik
function runManagers() {
    setInterval(() => {
        managers.forEach(index => {
            if (buttons[index].level > 0 && Date.now() >= buttonStates[index].availableAt) {
                clickButton(index);
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