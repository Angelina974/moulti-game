// Variables globales
let powerOn = false
const sequence = []
let userSequence = []
let level = 1
let simonScoreSent = false

const levelCount = document.querySelector('.level-count')

function sendSimonScore(scoreValue, metadata = {}) {
	if (simonScoreSent || !window.submitGameScore) {
		return
	}

	simonScoreSent = true
	window.submitGameScore('Simon', scoreValue, metadata)
}

/**
 * Fonction qui permet de demarrer le jeu
 */
function startGame() {
	sequence.length = 0
	userSequence.length = 0
	level = 1
	simonScoreSent = false
	levelCount.textContent = level
	nextRound()

	const powerButton = document.getElementById('power-btn')
	powerButton.disabled = true
	powerButton.classList.add('hidden')
}

function nextRound() {
	addToSequence()
	playSequence()
}

function addToSequence() {
	const randomColor = Math.floor(Math.random() * 4) + 1
	sequence.push(randomColor)
}

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

function handleClick(button) {
	if (powerOn) {
		const userColor = button.getAttribute('data-color')
		userSequence.push(Number(userColor))
		highlightButton(userColor)

		if (!checkSequence()) {
			const loserSound = document.getElementById('loserSound')
			loserSound.volume = 0.2
			loserSound.play()
			alert('PERDU !!! La page va se recharger et vous pourrez recommencer')
			updateBestScore(level - 1)
			sendSimonScore(level - 1, { result: 'loss' })
			setTimeout(() => {
				window.location.reload()
			}, 2000)
		} else if (userSequence.length === sequence.length) {
			userSequence = []
			level++
			levelCount.textContent = level
			if (level <= 20) {
				setTimeout(() => {
					nextRound()
				}, 1000)
			} else {
				alert('Bravo vous avez gagne !')
				sendSimonScore(20, { result: 'win' })
				setTimeout(() => {
					window.location.reload()
				}, 2000)
			}
		}
	}
}

function checkSequence() {
	for (let i = 0; i < userSequence.length; i++) {
		if (userSequence[i] !== sequence[i]) {
			return false
		}
	}
	return true
}

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

	button.classList.add(className)
	document.getElementById(soundId).play()
	setTimeout(() => {
		button.classList.remove(className)
	}, 300)
}

function enableButtons() {
	const buttons = document.querySelectorAll('.simon-btn')
	buttons.forEach((button) => button.removeAttribute('disabled'))
}

function disableButtons() {
	const buttons = document.querySelectorAll('.simon-btn')
	buttons.forEach((button) => button.setAttribute('disabled', 'true'))
}

function togglePower() {
	powerOn = !powerOn
	const powerButton = document.getElementById('power-btn')

	if (powerOn) {
		startGame()
		enableButtons()
		powerButton.disabled = false
	} else {
		userSequence = []
		disableButtons()
		powerButton.disabled = true
		powerButton.classList.remove('hidden')
	}
}

function getBestScore() {
	return localStorage.getItem('bestScore') || 0
}

function updateBestScore(currentScore) {
	const bestScore = getBestScore()
	if (currentScore > bestScore) {
		localStorage.setItem('bestScore', currentScore)
		displayBestScore()
	}
}

function displayBestScore() {
	document.getElementById('best-score-value').textContent = getBestScore()
}

document.addEventListener('DOMContentLoaded', displayBestScore)

document.getElementById('power-btn').addEventListener('click', function () {
	const music = document.getElementById('backgroundSound')
	music.volume = 0.3
	music.play()
})
