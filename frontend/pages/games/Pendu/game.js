// Variables globales
let chosenWord = ""
let guessedLetters = []
let mistakes = 0
const maxMistakes = 10
let words = []
let scoreAlreadySent = false

// Charger les mots depuis le fichier JSON
async function loadWords() {
    if (words.length === 0) {
        try {
            const response = await fetch('../../../assets/data/games/Pendu/words.json')
            const data = await response.json()
            words = data.words
            console.log("Mots charges : ", words)
        } catch (error) {
            console.error("Erreur lors du chargement des mots : ", error)
        }
    }
}

// Selectionner un mot aleatoire au debut
function selectRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length)
    chosenWord = words[randomIndex]
}

// Met a jour le mot cache avec des underscores pour les lettres non devinees
function updateHiddenWord() {
    const hiddenWord = chosenWord.split('').map(letter => guessedLetters.includes(letter) ? letter : '_').join(' ')
    document.getElementById('hidden-word').textContent = hiddenWord
}

// Verifier la lettre soumise par l'utilisateur
function handleGuess() {
    const letter = document.getElementById('letter-input').value.toLowerCase();
    document.getElementById('letter-input').value = ''
    document.getElementById('message').textContent = ''

    if (!letter.match(/[a-z]/) || guessedLetters.includes(letter)) {
        document.getElementById('message').textContent = "Saisie invalide ou lettre deja devinee"
        return
    }

    guessedLetters.push(letter)

    if (chosenWord.includes(letter)) {
        updateHiddenWord()
        checkWin()
        const findLetter = document.getElementById('findLetter')
        findLetter.play()
    } else {
        mistakes++
        drawHangman(mistakes)
        checkLoss()
        const noLetterFound = document.getElementById('losingSound')
        noLetterFound.play()
    }
}

function initScores() {
    if (!localStorage.getItem('winScore')) {
        localStorage.setItem('winScore', 0)
    }
    if (!localStorage.getItem('loseScore')) {
        localStorage.setItem('loseScore', 0)
    }

    updateScoreDisplay()
}

function updateScoreDisplay() {
    document.getElementById('win-score').textContent = `Victoires : ${localStorage.getItem('winScore')}`
    document.getElementById('lose-score').textContent = `Defaites : ${localStorage.getItem('loseScore')}`
}

function incrementWinScore() {
    const winScore = parseInt(localStorage.getItem('winScore'), 10)
    localStorage.setItem('winScore', winScore + 1)
    updateScoreDisplay()
}

function incrementLoseScore() {
    const loseScore = parseInt(localStorage.getItem('loseScore'), 10)
    localStorage.setItem('loseScore', loseScore + 1)
    updateScoreDisplay()
}

function checkWin() {
    if (chosenWord.split('').every(letter => guessedLetters.includes(letter))) {
        document.getElementById('message').textContent = "Bravo tu as gagne !"
        incrementWinScore()
        showRestartButton()
        const winningGame = document.getElementById('winningGame')
        winningGame.play()

        if (!scoreAlreadySent && window.submitGameScore) {
            scoreAlreadySent = true
            const scoreValue = Math.max(10, 100 - mistakes * 10)
            window.submitGameScore('Pendu', scoreValue, { result: 'win', mistakes })
        }
    }
}

function checkLoss() {
    if (mistakes >= maxMistakes) {
        document.getElementById('message').textContent = `Perdu ! Le mot etait : ${chosenWord}`
        disableInput()
        incrementLoseScore()
        showRestartButton()
        const losingGame = document.getElementById('losingGame')
        losingGame.play()

        if (!scoreAlreadySent && window.submitGameScore) {
            scoreAlreadySent = true
            window.submitGameScore('Pendu', 0, { result: 'loss', mistakes })
        }
    }
}

// Fonction pour afficher le bouton "Recommencer"
function showRestartButton() {
    const restartButton = document.getElementById('restart-button')
    const guessButton = document.getElementById('guess-button')

    restartButton.style.visibility = "visible"
    guessButton.style.display = "none"

    restartButton.addEventListener('click', () => {
        location.reload()
    })
}

function disableInput() {
    document.getElementById('letter-input').disabled = true
    document.getElementById('guess-button').disabled = true
}

function drawHangman(step) {
    const canvas = document.getElementById('hangman-canvas')
    const ctx = canvas.getContext('2d')

    ctx.strokeStyle = 'white'
    ctx.lineWidth = 4

    switch (step) {
        case 1:
            ctx.beginPath()
            ctx.moveTo(20, canvas.height - 20)
            ctx.lineTo(canvas.width - 20, canvas.height - 20)
            ctx.stroke()
            break
        case 2:
            ctx.beginPath()
            ctx.moveTo(60, canvas.height - 20)
            ctx.lineTo(60, 20)
            ctx.stroke()
            break
        case 3:
            ctx.beginPath()
            ctx.moveTo(60, 20)
            ctx.lineTo(canvas.width / 2, 20)
            ctx.stroke()
            break
        case 4:
            ctx.beginPath()
            ctx.moveTo(canvas.width / 2, 20)
            ctx.lineTo(canvas.width / 2, 70)
            ctx.stroke()
            break
        case 5:
            ctx.beginPath()
            ctx.arc(canvas.width / 2, 100, 30, 0, Math.PI * 2)
            ctx.stroke()
            break
        case 6:
            ctx.beginPath()
            ctx.moveTo(canvas.width / 2, 130)
            ctx.lineTo(canvas.width / 2, 230)
            ctx.stroke()
            break
        case 7:
            ctx.beginPath()
            ctx.moveTo(canvas.width / 2, 160)
            ctx.lineTo(canvas.width / 2 - 50, 180)
            ctx.stroke()
            break
        case 8:
            ctx.beginPath()
            ctx.moveTo(canvas.width / 2, 160)
            ctx.lineTo(canvas.width / 2 + 50, 180)
            ctx.stroke()
            break
        case 9:
            ctx.beginPath()
            ctx.moveTo(canvas.width / 2, 230)
            ctx.lineTo(canvas.width / 2 - 40, canvas.height - 40)
            ctx.stroke()
            break
        case 10:
            ctx.beginPath()
            ctx.moveTo(canvas.width / 2, 230)
            ctx.lineTo(canvas.width / 2 + 40, canvas.height - 40)
            break
    }
    ctx.stroke()
}

async function startGame() {
    await loadWords()
    selectRandomWord()
    guessedLetters = []
    mistakes = 0
    scoreAlreadySent = false
    updateHiddenWord()

    document.getElementById('letter-input').disabled = false
    document.getElementById('guess-button').disabled = false
    document.getElementById('guess-button').style.display = "inline-block"
    document.getElementById('message').textContent = ""
    document.getElementById('guess-button').addEventListener('click', handleGuess)

    document.getElementById('letter-input').addEventListener('keydown', function (event) {
        if (event.key === "Enter") {
            handleGuess()

            const backgroundSound = document.getElementById('backgroundSound')
            backgroundSound.volume = 0.3
            backgroundSound.play()
        }
    })
}

function init() {
    initScores()
    startGame()
}

init()
