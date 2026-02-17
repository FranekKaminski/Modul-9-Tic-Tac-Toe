const WIN_COMBINATIONS = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

let fields = Array(9).fill(null);
let currentPlayer = 'X'; // X (kreuz) startet immer
let gameOver = false;
let winningCombo = null;

function init() {
  resetGame();
}

function resetGame() {
  fields = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  winningCombo = null;
  const status = document.getElementById('status');
  if (status) status.textContent = 'kreuz startet';
  draw();
}

function draw() {
  const content = document.getElementById('content');
  content.innerHTML = '';

  const boardWrap = document.createElement('div');
  boardWrap.className = 'board-wrap';

  const table = document.createElement('table');

  for (let i = 0; i < 3; i++) {
    const row = document.createElement('tr');

    for (let j = 0; j < 3; j++) {
      const cell = document.createElement('td');
      const index = i * 3 + j;
      cell.dataset.index = index;
      cell.className = 'cell';
      cell.textContent = fields[index] || '';
      cell.onclick = () => makeMove(index);
      if (winningCombo && winningCombo.includes(index)) cell.classList.add('win-cell');
      row.appendChild(cell);
    }

    table.appendChild(row);
  }

  boardWrap.appendChild(table);
  content.appendChild(boardWrap);

  if (winningCombo) {
    const line = document.createElement('div');
    line.className = 'win-line';
    boardWrap.appendChild(line);
    requestAnimationFrame(() => positionWinLine(winningCombo));
  }

  const controls = document.createElement('div');
  controls.className = 'controls';
  const resetBtn = document.createElement('button');
  resetBtn.id = 'reset';
  resetBtn.textContent = 'Neu starten';
  resetBtn.onclick = resetGame;
  controls.appendChild(resetBtn);
  content.appendChild(controls);
}

function makeMove(index) {
  if (gameOver || fields[index]) return;

  fields[index] = currentPlayer;

  const combo = checkWin();
  if (combo) {
    gameOver = true;
    winningCombo = combo;
    document.getElementById('status').textContent = (currentPlayer === 'X') ? 'Kreuz gewinnt!' : 'Kreis gewinnt!';
  } else if (fields.every(Boolean)) {
    gameOver = true;
    document.getElementById('status').textContent = 'Unentschieden!';
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('status').textContent = (currentPlayer === 'X') ? 'kreuz ist dran' : 'kreis ist dran';
  }

  draw();
}

function checkWin() {
  for (const combo of WIN_COMBINATIONS) {
    const [a, b, c] = combo;
    if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) return combo;
  }
  return null;
}

function positionWinLine(combo) {
  const wrap = document.querySelector('.board-wrap');
  if (!wrap) return;
  const cells = combo.map(i => wrap.querySelector(`td[data-index="${i}"]`));
  if (!cells[0] || !cells[2]) return;

  const wrapRect = wrap.getBoundingClientRect();
  const r1 = cells[0].getBoundingClientRect();
  const r3 = cells[2].getBoundingClientRect();

  const startX = r1.left - wrapRect.left + r1.width / 2;
  const startY = r1.top - wrapRect.top + r1.height / 2;
  const endX = r3.left - wrapRect.left + r3.width / 2;
  const endY = r3.top - wrapRect.top + r3.height / 2;

  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

  const line = wrap.querySelector('.win-line');
  if (!line) return;
  line.style.width = length + 'px';
  line.style.left = startX + 'px';
  line.style.top = (startY - 3) + 'px'; /* center the 6px line */
  line.style.transform = `rotate(${angle}deg)`;
  line.style.opacity = '1';
}

