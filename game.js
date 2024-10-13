let coffeeCount = 0;
let moneyCount = 0;
let coffeePerClick = 1;
let upgradeCost = 50;
let upgradeLevel = 1;

let espressoUnlocked = false;
let cappuccinoUnlocked = false;
let assistantCount = 0;
let assistantCost = 200;

let espressoCost = 100;
let cappuccinoCost = 250;

// Variables pour les événements
let eventActive = false;
let eventDuration = 0;
let eventTimer;
let activeEvent = null;

// Éléments DOM
const clickBtn = document.getElementById("click-btn");
const coffeeCountEl = document.getElementById("coffee-count");
const moneyCountEl = document.getElementById("money-count");
const upgradeBtn = document.getElementById("upgrade-btn");
const espressoBtn = document.getElementById("espresso-btn");
const cappuccinoBtn = document.getElementById("cappuccino-btn");
const assistantBtn = document.getElementById("assistant-btn");
const upgradeLevelEl = document.getElementById("upgrade-level");
const assistantCountEl = document.getElementById("assistant-count");
const eventMessageEl = document.createElement("p");

document.body.appendChild(eventMessageEl); // Ajoute un élément pour afficher les événements

// Fonction pour servir un café
clickBtn.addEventListener("click", () => {
    let coffeeValue = coffeePerClick;

    // Si un événement spécial est actif
    if (activeEvent === "happyHour") {
        coffeeValue *= 2; // Double les gains pendant le Happy Hour
    } else if (activeEvent === "machineDown") {
        coffeeValue = Math.max(1, coffeeValue - 1); // Réduit les gains pendant une panne
    }

    // Si espresso ou cappuccino est débloqué
    if (espressoUnlocked) {
        coffeeValue = 2;
    }
    if (cappuccinoUnlocked) {
        coffeeValue = 5;
    }

    coffeeCount += coffeePerClick;
    moneyCount += coffeeValue;
    
    updateDisplay();
    checkUpgradeAvailability();
});

// Fonction pour améliorer la machine à café
upgradeBtn.addEventListener("click", () => {
    if (moneyCount >= upgradeCost) {
        moneyCount -= upgradeCost;
        coffeePerClick++;
        upgradeLevel++;
        upgradeCost *= 2;

        updateDisplay();
        upgradeBtn.textContent = `Améliorer la machine à café (coût: ${upgradeCost} $)`;
    }
});

// Fonction pour débloquer l'expresso
espressoBtn.addEventListener("click", () => {
    if (moneyCount >= espressoCost) {
        moneyCount -= espressoCost;
        espressoUnlocked = true;
        espressoBtn.disabled = true; // Désactiver après achat
    }
});

// Fonction pour débloquer le cappuccino
cappuccinoBtn.addEventListener("click", () => {
    if (moneyCount >= cappuccinoCost) {
        moneyCount -= cappuccinoCost;
        cappuccinoUnlocked = true;
        cappuccinoBtn.disabled = true; // Désactiver après achat
    }
});

// Fonction pour recruter un assistant
assistantBtn.addEventListener("click", () => {
    if (moneyCount >= assistantCost) {
        moneyCount -= assistantCost;
        assistantCount++;
        assistantCost *= 2;
        assistantCountEl.textContent = assistantCount;
    }
});

// Automatisation : les assistants servent des cafés toutes les 5 secondes
setInterval(() => {
    if (assistantCount > 0) {
        coffeeCount += assistantCount * coffeePerClick;
        moneyCount += assistantCount * coffeePerClick * 2; // chaque café rapporte 2 $
        updateDisplay();
    }
}, 5000);

// Mettre à jour l'affichage
function updateDisplay() {
    coffeeCountEl.textContent = coffeeCount;
    moneyCountEl.textContent = moneyCount;
    assistantCountEl.textContent = assistantCount;
}

// Vérifie si les améliorations sont disponibles
function checkUpgradeAvailability() {
    upgradeBtn.disabled = moneyCount < upgradeCost;
    espressoBtn.disabled = moneyCount < espressoCost || espressoUnlocked;
    cappuccinoBtn.disabled = moneyCount < cappuccinoCost || cappuccinoUnlocked;
    assistantBtn.disabled = moneyCount < assistantCost;
}

// Fonction pour lancer un événement aléatoire
function triggerRandomEvent() {
    if (!eventActive) {
        const events = ["happyHour", "machineDown", "rushHour", "inspection", "viralAd"];
        const event = events[Math.floor(Math.random() * events.length)];

        activateEvent(event);
    }
}

// Active l'événement avec des effets spécifiques
function activateEvent(event) {
    eventActive = true;
    activeEvent = event;

    switch (event) {
        case "happyHour":
            eventMessageEl.textContent = "Happy Hour ! Les gains sont doublés pendant 10 secondes !";
            eventDuration = 10;
            break;
        case "machineDown":
            eventMessageEl.textContent = "Panne de la machine à café ! Les gains sont réduits pendant 10 secondes.";
            eventDuration = 10;
            break;
        case "rushHour":
            eventMessageEl.textContent = "Heure de pointe ! Beaucoup de clients affluent, vous gagnez plus d'argent pendant 10 secondes !";
            coffeePerClick += 1; // Augmente les gains temporairement
            eventDuration = 10;
            break;
        case "inspection":
            eventMessageEl.textContent = "Inspection sanitaire ! Si vous n'avez pas d'assistants, vous perdez de l'argent !";
            if (assistantCount === 0) {
                moneyCount = Math.max(0, moneyCount - 50); // Pénalité si aucun assistant
            }
            eventDuration = 10;
            break;
        case "viralAd":
            eventMessageEl.textContent = "Publicité virale ! Vos clients se multiplient, augmentant vos ventes pendant 10 secondes !";
            coffeePerClick *= 2;
            eventDuration = 10;
            break;
    }

    // Lance un minuteur pour la fin de l'événement
    eventTimer = setInterval(() => {
        eventDuration--;
        if (eventDuration <= 0) {
            endEvent(event);
        }
    }, 1000);
}

// Terminer l'événement
function endEvent(event) {
    clearInterval(eventTimer);
    eventActive = false;
    activeEvent = null;
    eventMessageEl.textContent = "";

    // Réinitialise les effets temporaires
    if (event === "rushHour") {
        coffeePerClick -= 1;
    } else if (event === "viralAd") {
        coffeePerClick /= 2;
    }
}

// Générer des événements aléatoires toutes les 30 à 60 secondes
setInterval(() => {
    const randomTime = Math.floor(Math.random() * (60000 - 30000)) + 30000;
    setTimeout(triggerRandomEvent, randomTime);
}, 60000);
