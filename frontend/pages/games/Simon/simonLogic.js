// Variables globales
let powerOn = false
const sequence = []
let userSequence = []
let level = 1

const levelCount = document.querySelector('.level-count')

/**
 * Fonction qui permet de démarrer le jeu
 * @returns {void}
 */
function startGame() {
	sequence.length = 0
	userSequence.length = 0
	level = 1
	levelCount.textContent = level
	nextRound()

	// Cache le bouton de démarrage
	const powerButton = document.getElementById("power-btn")
	powerButton.disabled = true
	powerButton.classList.add('hidden')
}

/**
 * Fonction qui permet de passer au niveau suivant
 */
function nextRound() {
	addToSequence()
	playSequence()
}

/**
 * Fonction qui permet d'ajouter une couleur aléatoire à la séquence
 */
function addToSequence() {
	const randomColor = Math.floor(Math.random() * 4) + 1
	sequence.push(randomColor)
}

/**
 * Fonction qui permet de jouer la séquence de couleurs
 */
function playSequence() {
	let i = 0
	const intervalId = setInterval(() => {
		highlightButton(sequence[i])
		i++
		if (i >= sequence.length) {
			clearInterval(intervalId)
			enableButtons()
		}
	}, 1000)
}

/**
 * Fonction qui permet de gérer le clic sur un bouton
 * @param {HTMLElement} button - Le bouton
 * @returns {void}
 */
function handleClick(button) {
	if (powerOn) {
		const userColor = button.getAttribute("data-color")
		userSequence.push(Number(userColor))
		highlightButton(userColor)

		// Vérifie si la séquence de l'utilisateur est correcte
		if (!checkSequence()) {
			var loserSound = document.getElementById('loserSound')
			loserSound.volume = 0.2
        	loserSound.play()
			alert(`PERDU !!! La page va se recharger et vous pourrez recommencer`)
			updateBestScore(level - 1)
			setTimeout(() => {
                window.location.reload()
            }, 2000)

		// Vérifie si la séquence de l'utilisateur est égale à la séquence et augmente le niveau
		} else if (userSequence.length === sequence.length) {
			userSequence = []
			level++
			levelCount.textContent = level
			if (level <= 20) {
				setTimeout(() => {
					nextRound()
				}, 1000)
			// Si le joueur atteint le niveau 20, il a gagné
			} else {
				alert('Bravo vous avez gagné !')
				setTimeout(() => {
                    window.location.reload()
                }, 2000)
			}
		}
	}
}

/**
 * Fonction qui permet de vérifier si la séquence de l'utilisateur est correcte
 * @returns {boolean} - Retourne true si la séquence de l'utilisateur est correcte, sinon false
 */
function checkSequence() {
	// Vérifie si la séquence de l'utilisateur est égale à la séquence en cours
	for (let i = 0; i < userSequence.length; i++) {
		if (userSequence[i] !== sequence[i]) {
			// Si la séquence de l'utilisateur est incorrecte, on retourne false
			return false
		}
	}
	return true
}

/**
 * Fonction qui permet de mettre en surbrillance un bouton quand il est cliqué
 * @param {string} color - La couleur du bouton
 */
function highlightButton(color) {
    const button = document.querySelector(`[data-color="${color}"]`)
    let className = ''
	let soundId = ''
    switch (Number(color)) {
        case 1:
            className = 'highlight-red'
			soundId = 'sound1'
            break
        case 2:
            className = 'highlight-green'
			soundId = 'sound2'
            break
        case 3:
            className = 'highlight-yellow'
			soundId = 'sound3'
            break
        case 4:
            className = 'highlight-blue'
			soundId = 'sound4'
            break
    }
	// Ajoute la classe highlight à l'élément button
    button.classList.add(className)
	document.getElementById(soundId).play()
    setTimeout(() => {
		// Supprime la classe highlight de l'élément button après 300ms
        button.classList.remove(className)
    }, 300)  
}

/**
 * Fonction qui permet d'activer les boutons de couleurs
 */
function enableButtons() {
	const buttons = document
		.querySelectorAll('.simon-btn')
	buttons.forEach(button =>
		button.removeAttribute('disabled'))
}

/**
 * Fonction qui permet de désactiver les boutons de couleurs pendant la séquence
 */
function disableButtons() {
	const buttons = document
		.querySelectorAll('.simon-btn')
	buttons.forEach(button =>
		button.setAttribute('disabled', 'true'))
}

/**
 * Fonction qui permet d'activer ou de désactiver le jeu
 */
function togglePower() {
	powerOn = !powerOn
	const powerButton = document.getElementById("power-btn")

	// Si le jeu est activé, on démarre le jeu et on active les boutons
	if (powerOn) {
		startGame()
		enableButtons()
		powerButton.disabled = false

	// Si le jeu est désactivé, on désactive les boutons et on réinitialise les variables
	} else {
		userSequence = []
		disableButtons()
		powerButton.disabled = true
		powerButton.classList.remove('hidden')
	}
}

/**
 * Fonction qui permet de récupérer le meilleur score dans le stockage local
 * @returns {number} - Le meilleur score
 */
function getBestScore() {
    return localStorage.getItem('bestScore') || 0
}

/**
 * Fonction qui permet de mettre à jour le meilleur score en fonction du score actuel
 * @param {number} currentScore 
 */
function updateBestScore(currentScore) {
    let bestScore = getBestScore()
    if (currentScore > bestScore) {
        localStorage.setItem('bestScore', currentScore)
        displayBestScore()
    }
}

/**
 * Fonction qui permet d'afficher le meilleur score sur la page
 */
function displayBestScore() {
    document.getElementById('best-score-value').textContent = getBestScore()
}

// Événement pour afficher le meilleur score
document.addEventListener('DOMContentLoaded', displayBestScore)

// Evénement qui lance le son du jeu au démarrage
document.getElementById('power-btn').addEventListener('click', function() {
    var music = document.getElementById('backgroundSound')
	music.volume = 0.3
    music.play()
})
