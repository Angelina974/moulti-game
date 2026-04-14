const arrowRight = document.querySelector('.arrowRight');
const arrowLeft = document.querySelector('.arrowLeft');
const gamePreview = document.querySelector('#gamePreview');
const playButton = document.querySelector('.playButton');
const logoutButton = document.querySelector('.logoutRight');

const audio = new Audio('../assets/audio/click.mp3');

const games = [
    {
        name: 'DevineNombre',
        image: '../assets/images/devinenombre.png',
        url: 'games/devineNombre/devineNombre.html'
    },
    {
        name: 'Pendu',
        image: '../assets/images/pendu.png',
        url: 'games/Pendu/pendu.html'
    },
    {
        name: 'Puissance4',
        image: '../assets/images/puissance4.png',
        url: 'games/Puissance 4/index.html'
    },
    {
        name: 'Simon',
        image: '../assets/images/simongame.png',
        url: 'games/Simon/simon.html'
    },
    {
        name: 'Snake',
        image: '../assets/images/snake.png',
        url: 'games/Snake/snake.html'
    }
];

let currentGameIndex = 0;

function updateGamePreview() {
    if (!gamePreview || !playButton) {
        return;
    }

    const selectedGame = games[currentGameIndex];
    gamePreview.src = selectedGame.image;
    gamePreview.alt = `Apercu ${selectedGame.name}`;
    playButton.href = selectedGame.url;
}

updateGamePreview();

if (arrowRight) {
    arrowRight.addEventListener('click', () => {
        audio.play();
        currentGameIndex = (currentGameIndex + 1) % games.length;
        updateGamePreview();
    });
}

if (arrowLeft) {
    arrowLeft.addEventListener('click', () => {
        audio.play();
        currentGameIndex = (currentGameIndex - 1 + games.length) % games.length;
        updateGamePreview();
    });
}

if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('player');
        window.location.href = '/pages/auth/login.html';
    });
}
