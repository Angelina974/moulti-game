const arrowRight = document.querySelector('.arrowRight');
const arrowLeft = document.querySelector('.arrowLeft');
const gameDivContainer = document.querySelector('.gameDivContainer');
const playButton = document.querySelector('.playButton'); // Selectionne le bouton "PLAY"

const audio = new Audio('../assets/audio/click.mp3');

// Liste des images pour chaque jeu
const gameImages = [
    '',
    '../assets/images/devinenombre.png',// Jeu de Enzo - Devine le nombre
    '../assets/images/pendu.png',// Jeu de Julia - Pendu
    '../assets/images/puissance4.png',// Jeu de Julia - Puissance 4
    '../assets/images/simongame.png',// Jeu de Julia - Simon
    '../assets/images/snake.png',// Jeu de Julia - Snake
    '../assets/images/maze.png'// Jeu de Manon - Labyrinthe
];

// Liste des URLs des pages de chaque jeu
const gameUrls = [
    '',
    'games/devineNombre/devineNombre.html', // Jeu de Enzo - Devine le nombre
    'games/Pendu/pendu.html',  // Jeu de Julia - Pendu
    'games/Puissance 4/index.html',    // Jeu de Julia - Puissance 4
    'games/Simon/simon.html',  // Jeu de Julia - Simon
    'games/Snake/snake.html',   // Jeu de Julia - Snake
    'games/maze/labyrinth.html'  // Jeu de Manon - Labyrinthe
];

let currentGameIndex = 0;


function updateGameImage() {    
    gameDivContainer.style.backgroundImage = `url(${gameImages[currentGameIndex]})`;
    playButton.href = gameUrls[currentGameIndex];
    gameDivContainer.style.backgroundSize = 'cover';
    gameDivContainer.style.backgroundPosition = 'center'; // Place l'image vers la droite et la centre verticalement

}

updateGameImage();

arrowRight.addEventListener('click', () => {
    audio.play();
    currentGameIndex = (currentGameIndex + 1) % gameImages.length;
    updateGameImage();
});

arrowLeft.addEventListener('click', () => {
    audio.play();
    currentGameIndex = (currentGameIndex - 1 + gameImages.length) % gameImages.length;
    updateGameImage();
});

const logoutButton = document.querySelector('.logoutRight');

if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('player');
        window.location.href = '/pages/auth/login.html';
    });
}
