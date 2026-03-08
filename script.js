const cells = document.querySelectorAll(".cell")
const statusText = document.getElementById("status")

let board = ["","","","","","","","",""]
let gameRunning = true

const human = "X"
const ai = "O"

const winPatterns = [
[0,1,2],
[3,4,5],
[6,7,8],
[0,3,6],
[1,4,7],
[2,5,8],
[0,4,8],
[2,4,6]
]

cells.forEach(cell => cell.addEventListener("click", humanMove))
let currentPlayer = human; // Start with X
function humanMove() {
    let index = this.dataset.index;
    const mode = document.getElementById("gameMode").value;

    if (board[index] !== "" || !gameRunning) return;

    // Record the move
    board[index] = currentPlayer;
    this.textContent = currentPlayer;

    // Check for a winner or tie
    if (checkWinner(currentPlayer)) {
        statusText.textContent = `Player ${currentPlayer} Wins!`;
        gameRunning = false;
        return;
    } else if (board.every(cell => cell !== "")) {
        statusText.textContent = "It's a Tie!";
        gameRunning = false;
        return;
    }

    // Logic Branch: AI vs. PvP
    if (mode === "ai") {
        // AI always plays as "O", so human is always "X" here
        statusText.textContent = "AI is thinking...";
        setTimeout(aiMove, 500);
    } else {
        // PvP Mode: Switch turns between X and O
        currentPlayer = (currentPlayer === "X") ? "O" : "X";
        statusText.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

function aiMove() {
    if (!gameRunning) return;

    const difficulty = document.getElementById("difficulty").value;
    let move;

    if (difficulty === "easy") {
        move = getRandomMove();
    } else if (difficulty === "medium") {
        // 50% chance to play smart, 50% chance to play random
        move = Math.random() > 0.5 ? getBestMove() : getRandomMove();
    } else {
        move = getBestMove();
    }

    // Execute the move
    board[move] = ai;
    cells[move].textContent = ai;

    if (checkWinner(ai)) {
        statusText.textContent = "AI Wins!";
        gameRunning = false;
    } else if (board.every(cell => cell !== "")) {
        statusText.textContent = "It's a Tie!";
        gameRunning = false;
    }
}

// Logic for finding the BEST move (Minimax)
function getBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = ai;
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

// Logic for finding a RANDOM move
function getRandomMove() {
    let available = [];
    board.forEach((val, i) => { if (val === "") available.push(i); });
    return available[Math.floor(Math.random() * available.length)];
}

function minimax(currentBoard, depth, isMaximizing) {
    // Terminal states: AI wins, Human wins, or Tie
    if (checkWinner(ai)) return 10 - depth;
    if (checkWinner(human)) return depth - 10;
    if (currentBoard.every(cell => cell !== "")) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (currentBoard[i] === "") {
                currentBoard[i] = ai;
                let score = minimax(currentBoard, depth + 10, false);
                currentBoard[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (currentBoard[i] === "") {
                currentBoard[i] = human;
                let score = minimax(currentBoard, depth + 1, true);
                currentBoard[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner(player){

for(let pattern of winPatterns){

let a = pattern[0]
let b = pattern[1]
let c = pattern[2]

if(board[a]===player && board[b]===player && board[c]===player){
return true
}
}

return false
}

function restartGame() {
    board = ["","","","","","","","",""];
    gameRunning = true;
    currentPlayer = "X"; // Reset to X
    statusText.textContent = "Player X's Turn";
    
    cells.forEach(cell => {
        cell.textContent = "";
    });
}
document.getElementById("gameMode").addEventListener("change", function() {
    const difficultyLabel = document.querySelector('label[for="difficulty"]');
    const difficultySelect = document.getElementById("difficulty");
    
    if (this.value === "pvp") {
        difficultyLabel.style.display = "none";
        difficultySelect.style.display = "none";
    } else {
        difficultyLabel.style.display = "inline";
        difficultySelect.style.display = "inline";
    }
});