/**
 * Function to update the UI of the game board
 */
function updateUI() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const cell = document.querySelector(`.row[data-row="${row}"] .cell[data-column="${col}"]`)
      if (board[row][col] === 'RED') {
        cell.style.backgroundColor = '#c11700'
      } else if (board[row][col] === 'YELLOW') {
        cell.style.backgroundColor = '#e19600'
      } else {
        cell.style.backgroundColor = 'white'
      }
    }
  }
}

/**
 * Function to switch player with the next one
 */
function switchPlayer() {
  currentPlayer = (currentPlayer === 'RED') ? 'YELLOW' : 'RED'
  updateTurnDisplay()
}

/*
 * Function to update the display of the current player
 */
function updateTurnDisplay() {
  const playerDisplay = document.getElementById('currentPlayer')
  playerDisplay.textContent = currentPlayer
  playerDisplay.style.color = (currentPlayer === 'RED') ? '#c11700' : '#e19600'
}

/*
 * Function to show a winning message by display the hidden message element
 * @param {string} message - Le message à afficher
 */
function displayGameMessage(player) {
  const messageElement = document.getElementById('gameMessage')
  const turnElement = document.getElementById('playerTurn')
  let color = player === 'RED' ? '#c11700' : '#e19600'

  // Create a colored message for the winning player
  messageElement.innerHTML = `Well done, the <span style="color: ${color};">${player}</span> player won the game!`
  messageElement.style.visibility = 'visible'
  turnElement.style.visibility = 'hidden'

  setTimeout(() => {
    messageElement.style.visibility = 'hidden'
    turnElement.style.visibility = 'visible'
  }, 5000)
}

/*
 * Function to animate the token drop
 * @param {number} column - The column in which the token should be placed
 * @param {number} startY - The starting position of the token
 * @returns {void}
 */
function animateTokenDrop(column, startY) {
  const token = document.createElement('div')
  token.classList.add('falling-token')
  token.style.width = '50px'
  token.style.height = '50px'
  token.style.backgroundColor = currentPlayer === 'RED' ? '#c11700' : '#e19600'

  // Position the token at the top of the column
  token.style.position = 'absolute'
  token.style.left = `${document.querySelector(`.cell[data-column="${column}"]`).getBoundingClientRect().left}px`
  token.style.top = `${startY}px`

  document.body.appendChild(token)

  // Find the last empty cell in the column
  let targetRow = 0
  for (let row = rows - 1; row >= 0; row--) {
    if (board[row][column] === null) {
      targetRow = row
      break
    }
  }

  // Calculate the final position of the token
  const finalY = document.querySelector(`.row[data-row="${targetRow}"] .cell[data-column="${column}"]`).getBoundingClientRect().top

  // Add an annimation to the token
  setTimeout(() => {
    token.style.transform = `translateY(${finalY - startY}px)`
  }, 100)

  // Remove the animation after 600ms
  setTimeout(() => {
    document.body.removeChild(token)
    placeToken(column)
  }, 600)
}