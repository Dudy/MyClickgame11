// Datenstruktur für die Work-Buttons
const buttons = [
    { caption: "Button 1", delay: 2, points: 5 },
    { caption: "Button 2", delay: 4, points: 10 },
    { caption: "Button 3", delay: 6, points: 15 },
    { caption: "Button 4", delay: 8, points: 20 },
    { caption: "Button 5", delay: 10, points: 25 },
    { caption: "Button 6", delay: 12, points: 30 },
    { caption: "Button 7", delay: 14, points: 35 },
    { caption: "Button 8", delay: 16, points: 40 },
    { caption: "Button 9", delay: 18, points: 45 },
    { caption: "Button 10", delay: 20, points: 50 }
];

// Datenstruktur für Updates
const availableUpdates = [
    { name: "Alle Buttons +10%", cost: 100, effect: { type: 'global', multiplier: 1.1 } },
    { name: "Button 3 +50%", cost: 50, effect: { type: 'single', index: 2, multiplier: 1.5 } }
];

// Spielzustand
let points = 0;
let managers = []; // Indizes der Buttons, für die ein Manager aktiv ist

// DOM-Elemente
const content = document.getElementById('content');
const pointsDisplay = document.getElementById('points');
const sidebarBtns = document.querySelectorAll('aside button');

// Funktion zum Rendern der Work-Seite
function renderWork() {
    content.innerHTML = '';
    buttons.forEach((btn, index) => {
        const button = document.createElement('button');
        button.textContent = btn.caption;
        button.classList.add('btn', 'btn-secondary', 'm-2'); // Bootstrap-Button mit Abstand
        const timeDisplay = document.createElement('span');
        timeDisplay.textContent = 'Bereit';
        timeDisplay.classList.add('badge', 'badge-info', 'm-2'); // Bootstrap-Badge

        button.addEventListener('click', () => handleButtonClick(index, button, timeDisplay));
        content.appendChild(button);
        content.appendChild(timeDisplay);

        if (managers.includes(index)) {
            automateButton(index, button, timeDisplay);
        }
    });
}

// Logik für einen Button-Klick
function handleButtonClick(index, button, timeDisplay) {
    if (!button.disabled) {
        const btn = buttons[index];
        points += btn.points;
        pointsDisplay.textContent = `Punkte: ${points}`;
        button.disabled = true;

        let remainingTime = btn.delay;
        timeDisplay.textContent = `${remainingTime} Sekunden`;

        const interval = setInterval(() => {
            remainingTime--;
            if (remainingTime > 0) {
                timeDisplay.textContent = `${remainingTime} Sekunden`;
            } else {
                clearInterval(interval);
                button.disabled = false;
                timeDisplay.textContent = 'Bereit';
            }
        }, 1000);
    }
}

// Automatisierung durch Manager
function automateButton(index, button, timeDisplay) {
    setInterval(() => {
        if (!button.disabled) {
            handleButtonClick(index, button, timeDisplay);
        }
    }, 1000); // Prüft jede Sekunde, ob der Button verfügbar ist
}

// Funktion zum Rendern der Update-Seite
function renderUpdate() {
    content.innerHTML = '';
    availableUpdates.forEach((update, index) => {
        const updateBtn = document.createElement('button');
        updateBtn.textContent = `${update.name} - Kosten: ${update.cost}`;
        updateBtn.classList.add('btn', 'btn-success', 'm-2'); // Grüner Button
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
            managerBtn.classList.add('btn', 'btn-warning', 'm-2'); // Gelber Button
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

// Initiales Rendern der Work-Seite
renderWork();