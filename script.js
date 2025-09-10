let games = JSON.parse(localStorage.getItem('games') || '[]');

function saveGames() {
  localStorage.setItem('games', JSON.stringify(games));
}

function renderGames() {
  const container = document.getElementById('games');
  container.innerHTML = '';

  games.forEach((game, index) => {
    const gameDiv = document.createElement('div');
    gameDiv.className = 'game';

    const title = document.createElement('h2');
    title.textContent = game.name;
    gameDiv.appendChild(title);

    const scores = document.createElement('div');
    scores.className = 'scores';

    ['david', 'audrey'].forEach(player => {
      const playerDiv = document.createElement('div');
      playerDiv.className = 'player';

      const nameSpan = document.createElement('span');
      nameSpan.textContent = player.charAt(0).toUpperCase() + player.slice(1);
      playerDiv.appendChild(nameSpan);

      const scoreDiv = document.createElement('div');
      scoreDiv.textContent = game[player];
      scoreDiv.id = `score-${index}-${player}`;
      playerDiv.appendChild(scoreDiv);

      const controls = document.createElement('div');
      controls.className = 'controls';

      const plus = document.createElement('button');
      plus.textContent = '+';
      plus.addEventListener('click', () => updateScore(index, player, 1));
      controls.appendChild(plus);

      const minus = document.createElement('button');
      minus.textContent = '-';
      minus.addEventListener('click', () => updateScore(index, player, -1));
      controls.appendChild(minus);

      playerDiv.appendChild(controls);
      scores.appendChild(playerDiv);
    });

    gameDiv.appendChild(scores);
    container.appendChild(gameDiv);
  });
}

function updateScore(index, player, delta) {
  games[index][player] = Math.max(0, games[index][player] + delta);
  saveGames();
  document.getElementById(`score-${index}-${player}`).textContent = games[index][player];
}

function addGame() {
  const name = prompt('Enter game name:');
  if (!name) return;
  games.push({ name, david: 0, audrey: 0 });
  saveGames();
  renderGames();
}

document.getElementById('add-game').addEventListener('click', addGame);

renderGames();
