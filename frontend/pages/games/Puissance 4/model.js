// Variables for the gameboard
const rows = 6
const columns = 7

// Variables for the game board
var board = Array.from({
  length: rows
}, () => Array(columns).fill(null))

// Variables for the game score
var scoreRed = 0
var scoreYellow = 0

// The game begin with the 'RED' player
var currentPlayer = 'RED'

/*
 * Function to reset the game board and the current player
 * @returns {void}
 */
function resetBoard() {
  // Renialized the game board to null
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      board[row][col] = null
    }
  }

  // Reset the current player to 'RED'
  currentPlayer = 'RED'
  console.log('The first player must be RED')

  // Update the UI with the new empty game board
  updateUI()
  updateTurnDisplay()
}

/**
 * Function to uddapte the UI to show the score of each player
 */
function updateScore() {
  document.getElementById('score-red').textContent = scoreRed
  document.getElementById('score-yellow').textContent = scoreYellow
}

/*
 * Function to increment the score of a player
 * @param {string} player - The player which score should be incremented
 */
function incrementScore(player) {
  if (player === 'RED') {
    scoreRed++
  } else if (player === 'YELLOW') {
    scoreYellow++
  }
  updateScore()
}