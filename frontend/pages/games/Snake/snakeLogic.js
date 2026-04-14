const canvas = document.getElementById('snakeGame')
const ctx = canvas.getContext('2d')
const box = 20

let snake = [{
    x: 160,
    y: 160
}, {
    x: 140,
    y: 160
}] // Le serpent commence avec 2 segments

let food = {
    x: 80,
    y: 80
} // Position initiale de la nourriture

let dx = box // dÃ©placement horizontal
let dy = 0 // dÃ©placement vertical
let score = 0
let gameStarted = false
let snakeScoreSent = false


/**
 * Fonction qui dessine un segment du serpent
 * @param {object} snakePart - Segment du serpent
 * @param {number} snakePart.x - Position x du segment
 * @param {number} snakePart.y - Position y du segment
 */
function drawSnakePart(snakePart) {
    ctx.fillStyle = 'green'
    ctx.fillRect(snakePart.x, snakePart.y, box, box)
}

/**
 * Fonction qui dessine le serpent
 * @returns {void} - Retourne rien
 */
function drawSnake() {
    snake.forEach(drawSnakePart)
}

/**
 * Fonction qui dÃ©place le serpent
 * @returns {void} - Retourne rien
 */
function moveSnake() {
    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    }
    snake.unshift(head)
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score += 10
        var eatingSound = document.getElementById('eatingSound')
        volume = 0.5
        eatingSound.play()
        generateFood()
    } else {
        snake.pop()
    }
}

/**
 * Fonction qui permet au serpent de changer de direction
 * @param {object} event - Objet event de la touche pressÃ©e
 */
function changeDirection(event) {

    const keyPressed = event.keyCode
    const LEFT_KEY = 37
    const RIGHT_KEY = 39
    const UP_KEY = 38
    const DOWN_KEY = 40

    const validKeys = [LEFT_KEY, UP_KEY, RIGHT_KEY, DOWN_KEY]

    // Le jeu se lance uniquement si une touche directionnelle est pressÃ©e
    if (validKeys.includes(keyPressed)) {
        if (!gameStarted && !didGameEnd()) {
            gameStarted = true
            main()

            // On lance la musique de fond
            var music = document.getElementById('backgroundSound')
            music.volume = 0.1
            music.play()
        }

        const goingUp = dy === -box
        const goingDown = dy === box
        const goingRight = dx === box
        const goingLeft = dx === -box

        if (keyPressed === LEFT_KEY && !goingRight) {
            dx = -box
            dy = 0
        } else if (keyPressed === UP_KEY && !goingDown) {
            dx = 0
            dy = -box
        } else if (keyPressed === RIGHT_KEY && !goingLeft) {
            dx = box
            dy = 0
        } else if (keyPressed === DOWN_KEY && !goingUp) {
            dx = 0
            dy = box
        }
    }
}

/**
 * Fonction qui gÃ©nÃ¨re un nombre alÃ©atoire entre min et max
 * @param {number} min - Valeur minimale
 * @param {number} max - Valeur maximale
 * @returns {number} - Retourne un nombre alÃ©atoire
 */
function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / box) * box
}

/**
 * Fonction qui gÃ©nÃ¨re la nourriture
 */
function generateFood() {
    food.x = randomTen(0, canvas.width - box)
    food.y = randomTen(0, canvas.height - box)
    snake.forEach(function isFoodOnSnake(part) {
        if (part.x == food.x && part.y == food.y) generateFood()
    })
}

/**
 * Fonction qui dessine la nourriture
 * @returns {void} - Retourne rien
 */
function drawFood() {
    ctx.fillStyle = 'red'
    ctx.fillRect(food.x, food.y, box, box)
}

/**
 * Fonction qui efface le canvas
 */
function clearCanvas() {
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

/**
 * Fonction qui met Ã  jour le jeu 
 */
function resetGame() {
    snake = [{x: 160, y: 160}, {x: 140, y: 160}]
    dx = box
    dy = 0
    score = 0
    snakeScoreSent = false
    gameStarted = false
    clearCanvas()
}

/**
 * Fonction principale du jeu qui lance et termine le jeu
 * @returns {void} - Retourne rien
 */
function main() {
    if (!gameStarted) return
    if (didGameEnd()) {
        return
    }
    setTimeout(function onTick() {
        clearCanvas()
        drawFood()
        moveSnake()
        drawSnake()
        main()
    }, 100)
}

/**
 * Fonction qui vÃ©rifie si le jeu est terminÃ©
 * @returns {boolean} - Retourne true si le jeu est terminÃ©, false sinon
 */
function didGameEnd() {
    // Si le serpent se mord la queue
    for (let i = 4; i < snake.length; i++) {
        // Si la tÃªte du serpent touche un autre segment du serpent
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
        if (!snakeScoreSent && window.submitGameScore) {
            snakeScoreSent = true
            window.submitGameScore('Snake', score, { result: 'self_collision' })
        }
        return true
    }
    }
    const hitLeftWall = snake[0].x < 0
    const hitRightWall = snake[0].x > canvas.width - box
    const hitTopWall = snake[0].y < 0
    const hitBottomWall = snake[0].y > canvas.height - box
    if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {

        // On joue le son de dÃ©faite
        var loosingSound = document.getElementById('loosingSound')
        loosingSound.play()

        // On affiche un message d'alerte
        alert('Vous avez perdu !')

                // On met à jour le meilleur score
        updateBestScore()
        if (!snakeScoreSent && window.submitGameScore) {
            snakeScoreSent = true
            window.submitGameScore('Snake', score, { result: 'game_over' })
        }
        localStorage.setItem('currentScore', 0)

        // On rÃ©initialise le jeu
        resetGame()

        // On arrÃªte la musique de fond
        var music = document.getElementById('backgroundSound')
        music.pause()

        return true
    }
    return false
}

/**
 * Fonction qui met Ã  jour le meilleur score
 */
function updateBestScore() {
    const bestScore = localStorage.getItem('bestScore') || 0
    if (score > bestScore) {
        localStorage.setItem('bestScore', score)
        document.getElementById('bestScore').textContent = score
    }
}

// Fonction qui stock le meilleur score en local storage
function displayBestScore() {
    const bestScore = localStorage.getItem('bestScore') || 0
    document.getElementById('bestScore').textContent = bestScore
}

document.addEventListener('DOMContentLoaded', function () {
    displayBestScore()
})

document.addEventListener("keydown", changeDirection)


