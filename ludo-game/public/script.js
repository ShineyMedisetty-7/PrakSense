// ===== PATH (52 positions) =====
const path = [
[6,1],[6,2],[6,3],[6,4],[6,5],[5,6],[4,6],[3,6],[2,6],[1,6],[0,6],[0,7],[0,8],
[1,8],[2,8],[3,8],[4,8],[5,8],[6,9],[6,10],[6,11],[6,12],[6,13],[7,14],[8,14],
[8,13],[8,12],[8,11],[8,10],[8,9],[9,8],[10,8],[11,8],[12,8],[13,8],[14,8],
[14,7],[14,6],[13,6],[12,6],[11,6],[10,6],[9,6],[8,5],[8,4],[8,3],[8,2],[8,1],
[8,0],[7,0],[6,0]
];

const startIndex = {1:0, 2:13, 3:26, 4:39};
const safeZones = [0,8,13,21,26,34,39,47];
const cellSize = 30;

// ===== GAME STATE =====
let game = {
  currentPlayer: 1,
  dice: 0,
  tokens: {}
};

const board = document.getElementById("board");

// ===== CREATE TOKENS (4 each player) =====
for (let p = 1; p <= 4; p++) {
  game.tokens[p] = [];

  for (let i = 0; i < 4; i++) {
    game.tokens[p].push({ pos: -1 });

    let el = document.createElement("div");
    el.className = "token p" + p;
    el.id = `p${p}t${i}`;
    el.onclick = () => moveToken(p, i);
    board.appendChild(el);
  }
}

// ===== DRAW FUNCTION =====
function draw() {
  for (let p = 1; p <= 4; p++) {
    game.tokens[p].forEach((t, i) => {
      let el = document.getElementById(`p${p}t${i}`);

      let x = 20 + i * 10 + p * 40;
      let y = 400 - p * 40;

      if (t.pos >= 0) {
        let index = (startIndex[p] + t.pos) % 52;
        let [r, c] = path[index];

        x = c * cellSize + i * 5;
        y = r * cellSize + i * 5;
      }

      el.style.left = x + "px";
      el.style.top = y + "px";
    });
  }

  document.getElementById("status").innerText =
    "Player " + game.currentPlayer + " Turn";
}

// ===== DICE ANIMATION =====
function rollDice() {
  let diceBox = document.getElementById("diceBox");

  let rolls = 10;
  let interval = setInterval(() => {
    let temp = Math.floor(Math.random() * 6) + 1;
    diceBox.innerText = temp;
  }, 100);

  setTimeout(() => {
    clearInterval(interval);

    game.dice = Math.floor(Math.random() * 6) + 1;
    diceBox.innerText = game.dice;

    document.getElementById("dice").innerText =
      "Dice: " + game.dice;
  }, 1000);
}

// ===== MOVE TOKEN =====
function moveToken(player, index) {
  if (player !== game.currentPlayer) return;

  let token = game.tokens[player][index];

  // NEED 6 TO START
  if (token.pos === -1) {
    if (game.dice === 6) {
      token.pos = 0;
    } else {
      return switchTurn();
    }
  } else {
    token.pos += game.dice;
  }

  killCheck(player, index);

  // EXTRA TURN IF 6
  if (game.dice !== 6) switchTurn();

  draw();
}

// ===== KILL LOGIC =====
function killCheck(player, index) {
  let myToken = game.tokens[player][index];

  if (myToken.pos < 0) return;

  let myIndex = (startIndex[player] + myToken.pos) % 52;

  // SAFE ZONE
  if (safeZones.includes(myIndex)) return;

  for (let p = 1; p <= 4; p++) {
    if (p === player) continue;

    game.tokens[p].forEach(t => {
      if (t.pos >= 0) {
        let idx = (startIndex[p] + t.pos) % 52;

        if (idx === myIndex) {
          t.pos = -1; // send home
        }
      }
    });
  }
}

// ===== SWITCH TURN =====
function switchTurn() {
  game.currentPlayer++;
  if (game.currentPlayer > 4) game.currentPlayer = 1;
}

// ===== INIT =====
draw();