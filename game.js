let coffeeCount = 0;
let moneyCount = 0;
let coffeePerClick = 1;
let upgradeCost = 50;
let upgradeLevel = 1;

const clickBtn = document.getElementById("click-btn");
const coffeeCountEl = document.getElementById("coffee-count");
const moneyCountEl = document.getElementById("money-count");
const upgradeBtn = document.getElementById("upgrade-btn");
const upgradeLevelEl = document.getElementById("upgrade-level");

// Fonction pour servir un café
clickBtn.addEventListener("click", () => {
    coffeeCount += coffeePerClick;
    moneyCount += coffeePerClick * 2; // chaque café rapporte 2 $
    coffeeCountEl.textContent = coffeeCount;
    moneyCountEl.textContent = moneyCount;
    checkUpgradeAvailability();
});

// Fonction pour améliorer la machine à café
upgradeBtn.addEventListener("click", () => {
    if (moneyCount >= upgradeCost) {
        moneyCount -= upgradeCost;
        coffeePerClick++;
        upgradeLevel++;
        upgradeCost *= 2; // le coût de la prochaine amélioration double
        moneyCountEl.textContent = moneyCount;
        upgradeLevelEl.textContent = upgradeLevel;
        upgradeBtn.textContent = `Améliorer la machine à café (coût: ${upgradeCost} $)`;
        checkUpgradeAvailability();
    }
});

// Vérifie si l'amélioration est disponible
function checkUpgradeAvailability() {
    if (moneyCount >= upgradeCost) {
        upgradeBtn.disabled = false;
    } else {
        upgradeBtn.disabled = true;
    }
}
