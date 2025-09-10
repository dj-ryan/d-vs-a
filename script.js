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

    if (!game.name) {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Game name';
      input.addEventListener('blur', () => handleNameInput(index, input));
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') input.blur();
      });
      gameDiv.appendChild(input);
    } else {
      const title = document.createElement('h2');
      title.textContent = game.name;
      gameDiv.appendChild(title);
    }

    const menuBtn = document.createElement('button');
    menuBtn.textContent = '⋮';
    menuBtn.className = 'menu-btn';
    gameDiv.appendChild(menuBtn);

    const menu = document.createElement('div');
    menu.className = 'menu hidden';

    ['david', 'audrey'].forEach(player => {
      const minus = document.createElement('button');
      minus.textContent = `- ${player.charAt(0).toUpperCase() + player.slice(1)}`;
      minus.addEventListener('click', () => {
        updateScore(index, player, -1);
        menu.classList.add('hidden');
      });
      menu.appendChild(minus);
    });

    const del = document.createElement('button');
    del.textContent = 'Delete Game';
    del.addEventListener('click', () => deleteGame(index));
    menu.appendChild(del);

    menuBtn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });

    gameDiv.appendChild(menu);

    const scores = document.createElement('div');
    scores.className = 'scores';

    ['david', 'audrey'].forEach(player => {
      const playerDiv = document.createElement('div');
      playerDiv.className = 'player';

      const nameSpan = document.createElement('span');
      nameSpan.textContent = player.charAt(0).toUpperCase() + player.slice(1);
      playerDiv.appendChild(nameSpan);

      const row = document.createElement('div');
      row.className = 'score-row';

      const plus = document.createElement('button');
      plus.textContent = '+';
      plus.addEventListener('click', () => updateScore(index, player, 1));
      row.appendChild(plus);

      const scoreSpan = document.createElement('span');
      scoreSpan.textContent = game[player];
      scoreSpan.id = `score-${index}-${player}`;
      row.appendChild(scoreSpan);

      playerDiv.appendChild(row);
      scores.appendChild(playerDiv);
    });

    gameDiv.appendChild(scores);
    container.appendChild(gameDiv);
  });
}

function updateScore(index, player, delta) {
  games[index][player] = Math.max(0, games[index][player] + delta);
  saveGames();
  const el = document.getElementById(`score-${index}-${player}`);
  if (el) el.textContent = games[index][player];
}

function handleNameInput(index, input) {
  const val = input.value.trim();
  if (!val) return;
  games[index].name = val;
  saveGames();
  renderGames();
}

function deleteGame(index) {
  games.splice(index, 1);
  saveGames();
  renderGames();
}

function addGame() {
  games.push({ name: '', david: 0, audrey: 0 });
  renderGames();
}

document.getElementById('add-game').addEventListener('click', addGame);

loadGames();
