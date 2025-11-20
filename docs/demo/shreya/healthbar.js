document.addEventListener('DOMContentLoaded', () => {
  const playerHealthBar = document.getElementById("health");
  const playerHealthText = playerHealthBar.querySelector("p");
  const enemyHealthBar = document.getElementById("attack");
  const enemyHealthText = enemyHealthBar.querySelector("p");
  const attackBtn = document.getElementById("attack-btn");
  const healBtn = document.getElementById("heal-btn");
  const storyPanel = document.querySelector("story-panel p");

  let playerTurn = true;
  let playerHealth = 100;
  let enemyHealth = 100;
  const maxHealth = 100;

  playerHealthBar.style.transition = "width 0.5s ease";
  enemyHealthBar.style.transition = "width 0.5s ease";

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function updateBars() {
    playerHealthBar.style.width = (playerHealth / maxHealth) * 90 + "vw";
    enemyHealthBar.style.width = (enemyHealth / maxHealth) * 90 + "vw";
    playerHealthText.textContent = `${playerHealth}/100`;
    enemyHealthText.textContent = `${enemyHealth}/100`;
  }

  function addStory(text) {
    storyPanel.innerHTML += `<br>${text}`;
    storyPanel.scrollTop = storyPanel.scrollHeight;
  }

  function enemyTurn() {
    const action = getRandomInt(0, 1); 
    if (action === 0) {
      const damage = getRandomInt(5, 15);
      playerHealth = Math.max(0, playerHealth - damage);
      addStory(`Enemy attacks! You take ${damage} damage.`);
    } else {
      const heal = getRandomInt(3, 10);
      enemyHealth = Math.min(maxHealth, enemyHealth + heal);
      addStory(`Enemy heals for ${heal} HP!`);
    }

    updateBars();
    playerTurn = true;
    if (playerHealth <= 0) endGame("You lost!");
  }

  attackBtn.addEventListener("click", () => {
    if (!playerTurn) return;
    const damage = getRandomInt(5, 15);
    enemyHealth = Math.max(0, enemyHealth - damage);
    addStory(`You attack! Enemy takes ${damage} damage.`);
    updateBars();

    playerTurn = false;
    if (enemyHealth <= 0) return endGame("You win!");

    setTimeout(enemyTurn, 1000);
  });

  healBtn.addEventListener("click", () => {
    if (!playerTurn) return;
    const heal = getRandomInt(5, 15);
    playerHealth = Math.min(maxHealth, playerHealth + heal);
    addStory(`You heal yourself for ${heal} HP.`);
    updateBars();

    playerTurn = false;
    setTimeout(enemyTurn, 1000);
  });

  function endGame(message) {
    addStory(`<br><strong>${message}</strong>`);
    attackBtn.disabled = true;
    healBtn.disabled = true;
  }

  updateBars();
});
