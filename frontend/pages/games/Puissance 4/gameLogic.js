/*
 * Function to check if a player has won
 * @param {number} row - The row index of the cell
 * @param {number} column - The column index of the cell
 * @returns {boolean} - Returns true if a player has won, otherwise false
 */
function checkWin(row, column) {
  let winPositions = checkHorizontal(row, column) || checkVertical(row, column) || checkDiagonal(row, column)
  if (winPositions) {

    // Apply animation to winning cells
    winPositions.forEach(pos => {
      const cell = document.querySelector(`.row[data-row="${pos.row}"] .cell[data-column="${pos.column}"]`)
      cell.classList.add('pulse')
      var winnerSound = document.getElementById("winner-sound")
      winnerSound.play()

    })

    // Remove animation after 3.5 seconds
    setTimeout(() => {
      winPositions.forEach(pos => {
        const cell = document.querySelector(`.row[data-row="${pos.row}"] .cell[data-column="${pos.column}"]`)
        cell.classList.remove('pulse')
      })
    }, 3500)

    return true
  }
  return false

}

// Function to check horizontally if a player has won
function checkHorizontal(row, column) {
  let count = 1

  // Store the winning positions
  let positions = [{
    row,
    column
  }]
  let color = board[row][column]

  // Check right
  for (let col = column + 1; col < columns && board[row][col] === color; col++) {
    count++
    positions.push({
      row,
      column: col
    })
  }
  // Check left
  for (let col = column - 1; col >= 0 && board[row][col] === color; col--) {
    count++
    positions.push({
      row,
      column: col
    })
  }
  if (count >= 4) {
    return positions
  }
  return false

}

// Function to check vertically if a player has won
function checkVertical(row, column) {
  let count = 1
  let positions = [{
    row,
    column
  }]
  let color = board[row][column]

  // Check down
  for (let r = row + 1; r < rows && board[r][column] === color; r++) {
    positions.push({
      row: r,
      column
    })
    count++
  }
  if (count >= 4) {
    return positions
  }

  return false
}

// Function to check diagonally if a player has won
function checkDiagonal(row, column) {
  let count = 1
  let color = board[row][column]
  let positions = [{
    row,
    column
  }]

  // Downward diagonal (top-left to bottom-right)
  // Check down-right
  for (let r = row + 1, c = column + 1; r < rows && c < columns && board[r][c] === color; r++, c++) {
    positions.push({
      row: r,
      column: c
    })
    count++
  }

  // Check up-left
  for (let r = row - 1, c = column - 1; r >= 0 && c >= 0 && board[r][c] === color; r--, c--) {
    positions.push({
      row: r,
      column: c
    })
    count++
  }
  if (count >= 4) return positions

  // Reset counter for upward diagonal (bottom-left to top-right)
  count = 1

  // Check up-right
  for (let r = row - 1, c = column + 1; r >= 0 && c < columns && board[r][c] === color; r--, c++) {
    positions.push({
      row: r,
      column: c
    })
    count++
  }
  // Check down-left
  for (let r = row + 1, c = column - 1; r < rows && c >= 0 && board[r][c] === color; r++, c--) {
    positions.push({
      row: r,
      column: c
    })
    count++
  }
  if (count >= 4) return positions
  return false
}

/*
 * Funcion to check if the board is full and there is no winner
 * @returns {boolean} - Returns true if the board is full and there is no winner, otherwise false
 */
function checkDraw() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (board[row][col] === null) {
        return false // Il reste des coups à jouer, pas d'égalité
      }
    }
  }
  // Animation d'égalité
  document.querySelectorAll('.cell').forEach(cell => {
    cell.classList.add('blink')
  })

  setTimeout(() => { // Retirer l'animation après qu'elle s'est jouée
    document.querySelectorAll('.cell').forEach(cell => {
      cell.classList.remove('blink')
    })
    alert("Égalité ! Le plateau est plein.")
    resetBoard()
  }, 1500) // Attendre que l'animation se termine

  return true
}