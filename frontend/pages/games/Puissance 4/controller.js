document.querySelectorAll('.cell').forEach(cell => {
  cell.addEventListener('click', handleCellClick)
})

/**
 * Function to handle cell click event
 */
function handleCellClick(event) {
  const cell = event.target
  const column = parseInt(cell.dataset.column)
  animateTokenDrop(column, cell.getBoundingClientRect().top)
  var coinDrop = document.getElementById("coin-drop")
  coinDrop.play()
}

/**
 * Function to initialize the game
 * This function initialize the click event on each cell of the game board
 */
function initializeGame() {
  document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', handleCellClick)
  })
}

/**
 * Function to place a token in the game board
 * @param {number} column - The column where the token should be placed
 */
function placeToken(column) {
  for (let row = rows - 1; row >= 0; row--) {
    if (board[row][column] === null) {
      board[row][column] = currentPlayer
      updateUI(board)
      if (checkWin(row, column)) {
        displayGameMessage(currentPlayer)
        incrementScore(currentPlayer)
        if (window.submitGameScore) {
          const winnerScore = currentPlayer === 'RED' ? scoreRed : scoreYellow
          window.submitGameScore('Puissance4', winnerScore, { winner: currentPlayer })
        }
        setTimeout(() => {
          resetBoard()
        }, 4000)
        return
      } else if (checkDraw()) {
        displayGameMessage("Match nul !")
        if (window.submitGameScore) {
          window.submitGameScore('Puissance4', 0, { result: 'draw' })
        }
        setTimeout(() => {
          resetBoard()
        }, 150)
        return
      }
      switchPlayer()
      break
    }
  }
}

// Start the game
document.addEventListener('DOMContentLoaded', () => {
  initializeGame()
  updateTurnDisplay()
  updateScore()
})
