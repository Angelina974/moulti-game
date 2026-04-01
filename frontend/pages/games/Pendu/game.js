// Variables globales
let chosenWord = ""
let guessedLetters = []
let mistakes = 0
const maxMistakes = 10
let words = []

// Charger les mots depuis le fichier JSON
async function loadWords() {
    if (words.length === 0) {
        try {
            const response = await fetch('../../../assets/data/games/Pendu/words.json')
            const data = await response.json()
            words = data.words
            console.log("Mots chargés : ", words)
        } catch (error) {
            console.error("Erreur lors du chargement des mots : ", error)
        }
    }
}

// Sélectionner un mot aléatoire au début
function selectRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length)
    chosenWord = words[randomIndex]
}

// Met à jour le mot caché avec des underscores pour les lettres non devinées
function updateHiddenWord() {
    const hiddenWord = chosenWord.split('').map(letter => guessedLetters.includes(letter) ? letter : '_').join(' ')
    document.getElementById('hidden-word').textContent = hiddenWord
}

// Vérifier la lettre soumise par l'utilisateur
function handleGuess() {
    const letter = document.getElementById('letter-input').value.toLowerCase();
    document.getElementById('letter-input').value = ''
    document.getElementById('message').textContent = ''

    if (!letter.match(/[a-z]/) || guessedLetters.includes(letter)) {
        document.getElementById('message').textContent = "Saisie invalide ou lettre déjà devinée"
        return
    }

    guessedLetters.push(letter)

    if (chosenWord.includes(letter)) {
        updateHiddenWord()
        checkWin()
        // Jouer le son de la lettre trouvée
        var findLetter = document.getElementById('findLetter')
        findLetter.play()

    } else {
        mistakes++
        drawHangman(mistakes)
        checkLoss()
        // Jouer le son de la lettre non trouvée
        var noLetterFound = document.getElementById('losingSound')
        noLetterFound.play()
    }
}

// Initialiser et afficher les scores
function initScores() {
    // Si les scores n'existent pas encore dans le localStorage, les initialiser
    if (!localStorage.getItem('winScore')) {
        localStorage.setItem('winScore', 0)
    }
    if (!localStorage.getItem('loseScore')) {
        localStorage.setItem('loseScore', 0)
    }

    // Afficher les scores actuels
    updateScoreDisplay()
}

// Mettre à jour l'affichage des scores
function updateScoreDisplay() {
    document.getElementById('win-score').textContent = `Victoires : ${localStorage.getItem('winScore')}`
    document.getElementById('lose-score').textContent = `Défaites : ${localStorage.getItem('loseScore')}`
}

// Incrémenter le score de victoire
function incrementWinScore() {
    let winScore = parseInt(localStorage.getItem('winScore'), 10)
    localStorage.setItem('winScore', winScore + 1)
    updateScoreDisplay()
}

// Incrémenter le score de défaite
function incrementLoseScore() {
    let loseScore = parseInt(localStorage.getItem('loseScore'), 10)
    localStorage.setItem('loseScore', loseScore + 1)
    updateScoreDisplay()
}

// Vérifie si l'utilisateur a gagné
function checkWin() {
    if (chosenWord.split('').every(letter => guessedLetters.includes(letter))) {
        document.getElementById('message').textContent = "Bravo tu as gagné !"
        incrementWinScore()
        showRestartButton()
        var winningGame = document.getElementById('winningGame')
        winningGame.play()
    }
}

// Vérifie si l'utilisateur a perdu
function checkLoss() {
    if (mistakes >= maxMistakes) {
        document.getElementById('message').textContent = `Perdu ! Le mot était : ${chosenWord}`
        disableInput()
        incrementLoseScore()
        showRestartButton()
        var losingGame = document.getElementById('losingGame')
        losingGame.play()
    
    }
}

// Fonction pour afficher le bouton "Recommencer"
function showRestartButton() {
    const restartButton = document.getElementById('restart-button')
    restartButton.style.visibility = "visible" // Rendre visible le bouton "Recommencer"

    // Ajouter un événement pour recharger la page lorsque le bouton est cliqué
    restartButton.addEventListener('click', () => {
        location.reload() // Recharger la page pour recommencer le jeu
    })
}


// Désactive l'input une fois la partie finie
function disableInput() {
    document.getElementById('letter-input').disabled = true
    document.getElementById('guess-button').disabled = true
}

// Dessine le pendu étape par étape
function drawHangman(step) {
    const canvas = document.getElementById('hangman-canvas')
    const ctx = canvas.getContext('2d')

    ctx.strokeStyle = 'white'
    ctx.lineWidth = 4

    // Différentes étapes du pendu
    switch (step) {
        case 1:
            // Base du pendu (ligne horizontale en bas)
            ctx.beginPath()
            ctx.moveTo(20, canvas.height - 20); // à gauche
            ctx.lineTo(canvas.width - 20, canvas.height - 20) // à droite
            ctx.stroke()
            break;
        case 2:
            // Poteau vertical
            ctx.beginPath()
            ctx.moveTo(60, canvas.height - 20) // Bas gauche
            ctx.lineTo(60, 20) // En haut
            ctx.stroke()
            break
        case 3:
            // Poteau horizontal
            ctx.beginPath()
            ctx.moveTo(60, 20) // Coin supérieur gauche
            ctx.lineTo(canvas.width / 2, 20) // Milieu supérieur
            ctx.stroke()
            break
        case 4:
            // Corde
            ctx.beginPath()
            ctx.moveTo(canvas.width / 2, 20) // Centre en haut
            ctx.lineTo(canvas.width / 2, 70) // Longueur de la corde
            ctx.stroke()
            break
        case 5:
            // Tête
            ctx.beginPath();
            ctx.arc(canvas.width / 2, 100, 30, 0, Math.PI * 2) // Tête (x, y, rayon)
            ctx.stroke()
            break
        case 6:
            // Corps
            ctx.beginPath()
            ctx.moveTo(canvas.width / 2, 130) // Bas de la tête
            ctx.lineTo(canvas.width / 2, 230) // Longueur du corps
            ctx.stroke()
            break
        case 7:
            // Bras gauche
            ctx.beginPath()
            ctx.moveTo(canvas.width / 2, 160) // Centre du corps
            ctx.lineTo(canvas.width / 2 - 50, 180) // Vers la gauche
            ctx.stroke()
            break
        case 8:
            // Bras droit
            ctx.beginPath()
            ctx.moveTo(canvas.width / 2, 160) // Centre du corps
            ctx.lineTo(canvas.width / 2 + 50, 180) // Vers la droite
            ctx.stroke()
            break
        case 9:
            // Jambe gauche
            ctx.beginPath()
            ctx.moveTo(canvas.width / 2, 230) // Bas du corps
            ctx.lineTo(canvas.width / 2 - 40, canvas.height - 40) // Vers la gauche
            ctx.stroke()
            break
        case 10:
            // Jambe droite
            ctx.beginPath()
            ctx.moveTo(canvas.width / 2, 230) // Bas du corps
            ctx.lineTo(canvas.width / 2 + 40, canvas.height - 40) // Vers la droite
            break
    }
    ctx.stroke()
}

// Démarre le jeu une fois les mots chargés
async function startGame() {
    await loadWords()
    selectRandomWord()
    guessedLetters = []
    mistakes = 0
    updateHiddenWord()

    document.getElementById('letter-input').disabled = false
    document.getElementById('guess-button').disabled = false
    document.getElementById('message').textContent = ""
    document.getElementById('guess-button').addEventListener('click', handleGuess)

    // Ajouter un écouteur d'événement pour la touche "Entrée" pour envoyer une lettre
    document.getElementById('letter-input').addEventListener('keydown', function (event) {
        if (event.key === "Enter") {
            handleGuess() // Appeler handleGuess si la touche "Entrée" est pressée

            // Jouer le son de fond
            var backgroundSound = document.getElementById('backgroundSound')
            backgroundSound.volume = 0.3
            backgroundSound.play()
        }
    })
}

// Initialiser le jeu
function init() {
    initScores()
    startGame()
}

init()
