let games = [];

async function loadGames() {
  try {
    const res = await fetch('/.netlify/functions/scoreboard');
    const data = await res.json();
    games = data.games || [];
    renderGames();
  } catch (e) {
    console.error('Failed to load games', e);
  }
}

async function saveGames() {
  try {
    await fetch('/.netlify/functions/scoreboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ games })
    });
  } catch (e) {
    console.error('Failed to save games', e);
  }
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

      const scoreRow = document.createElement('div');
      scoreRow.className = 'score-row';

      const scoreDiv = document.createElement('div');
      scoreDiv.textContent = game[player];
      scoreDiv.id = `score-${index}-${player}`;
      scoreRow.appendChild(scoreDiv);

      const plus = document.createElement('button');
      plus.textContent = '+';
      plus.addEventListener('click', () => updateScore(index, player, 1));
      scoreRow.appendChild(plus);

      playerDiv.appendChild(scoreRow);
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

loadGames();
