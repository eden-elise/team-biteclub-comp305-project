document.addEventListener('DOMContentLoaded', () => {
    const playerAttackButton = document.getElementById('playerAttackButton');
    const playerHealButton = document.getElementById('playerHealButton');
    const playerHealthBar = document.getElementById('playerHealthBar');
    const enemyHealthBar = document.getElementById('enemyHealthBar');
    
    let playerTurn = true;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function enemyTurn() {
        const randomValue = getRandomInt(-15, 10); 

        if (randomValue > 0) {
            let newValue = enemyHealthBar.value + randomValue;
            enemyHealthBar.value = Math.min(newValue, 100);
        } else if (randomValue < 0) {
            let newValue = playerHealthBar.value + randomValue;
            playerHealthBar.value = Math.max(newValue, 0);
        }
        playerTurn = true;
    }

    playerAttackButton.addEventListener('click', () => {
        if (!playerTurn) return;
        const damage = getRandomInt(5, 15);
        enemyHealthBar.value = Math.max(enemyHealthBar.value - damage, 0);
        playerTurn = false;

        setTimeout(enemyTurn, 1000);
    });

    playerHealButton.addEventListener('click', () => {
        if (!playerTurn) return;
        const heal = getRandomInt(1, 10);
        playerHealthBar.value = Math.min(playerHealthBar.value + heal, 100);
        playerTurn = false;

        setTimeout(enemyTurn, 1000);
    });
});
