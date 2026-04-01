let img;
let canvas;
let ctx;
let joueur;
let level = 0;
let chrono = 0;
let chronoAffich;
let levelIncremented = false;
let chronometersBool = false;
let resultat;
let resultatTitre;

document.addEventListener("DOMContentLoaded", (event) => {

    chronoAffich = document.getElementById('chronometersAfficher');
    resultatTitre = document.getElementById("resultatTitre");
    resultatTitre.innerHTML = "Niveau 1";
    
    setInterval(function () {
        chronometers();
    }, 1000);

    joueur = document.getElementById("joueur");
    canvas = document.getElementById("canvas");
    img = document.getElementById('labyrinthe');
    ctx = canvas.getContext("2d");

    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    img.src = '../../../assets/images/games/maze/labyrinthe.png';

    document.addEventListener("keydown", function(event) {
        chronometersBool = true;
        let left = parseInt(window.getComputedStyle(joueur).left, 10);
        let top = parseInt(window.getComputedStyle(joueur).top, 10);
        if (event.key === "ArrowLeft") {
            if (checkColor(left - 15, top)) {
                joueur.style.left = (left - 15) + "px";
            }
        }
        if (event.key === "ArrowRight") {
            if (checkColor(left + 15, top)) {
                joueur.style.left = (left + 15) + "px";
            }
        }
        if (event.key === "ArrowUp") {
            if (checkColor(left, top - 15)) {
                joueur.style.top = (top - 15) + "px";
            }
        }
        if (event.key === "ArrowDown") {
            if (checkColor(left, top + 15)) {
                joueur.style.top = (top + 15) + "px";
            }
        }
    });
});

function checkColor(x, y) {
    for (let offsetX = -2; offsetX <= 2; offsetX++) {
        for (let offsetY = -2; offsetY <= 2; offsetY++) {
            let pixel = ctx.getImageData(x + offsetX, y + offsetY, 1, 1);
            let data = pixel.data;

            if (data[0] >= 190 && data[0] <= 200 && data[1] >= 190 && data[1] <= 200 && data[2] >= 190 && data[2] <= 200) {
                chronometersBool = false;
                if (!levelIncremented) { 
                    level += 1; 
                    levelIncremented = true; 
                    resultat = document.getElementById("resultatDiv");
                    resultatTitre = document.getElementById("resultatTitre");
                    if (level < 3) {
                    resultatTitre.innerHTML = "Bravo !";
                    resultat.innerHTML = "<button onClick='nextLevel(level)' id='buttonNext'> > </button>";
                    document.getElementById("buttonNext").addEventListener("mouseenter", displayStyle);
                    document.getElementById("buttonNext").addEventListener("mouseleave", removeStyle);

                    }
                    if (level >= 3) {
                        resultatTitre.innerHTML = `Voici votre score : `;
                        const wrapperRows = document.getElementsByClassName('wrapperRow');
                        for (let i = 0; i < wrapperRows.length; i++) {
                            wrapperRows[i].innerHTML = ""; 
                        }
                        wrapperRows[0].innerHTML = chrono + "  secondes !";
                        wrapperRows[0].style.fontSize = "200%";
                        wrapperRows[0].style.fontWeight = "900";
                        wrapperRows[0].style.color = "rgba(255, 140, 0, 1)";
                    }
                
                }
            } else if (!(data[0] === 0 && data[1] === 0 && data[2] === 0 && data[3] === 0)) {
                levelIncremented = false; 
                return false;
            }
        }
    }
    return true;
}

function nextLevel(niveau) {
    resultat.innerHTML = "";
    levelIncremented = false;
    chronometersBool = false;

    let newMazeSrc, cssText;
    if (niveau >= 2) { 
        newMazeSrc = '../../../assets/images/games/maze/labyrinthe3.png';
        resultatTitre.innerHTML = "Niveau 3";
        cssText = `position: absolute; left: 495px; top: 710px; width: 10px; height: 10px;`;
    } else if (niveau >= 1) { 
        newMazeSrc = '../../../assets/images/games/maze/labyrinthe2.png';
        resultatTitre.innerHTML = "Niveau 2";
        cssText = `position: absolute; left: 885px; top: 665px; width: 10px; height: 10px;`;
    } else { 
        newMazeSrc = '../../../assets/images/games/maze/labyrinthe.png';
        resultatTitre.innerHTML = "Niveau 1";
        cssText = `position: absolute; left: 790px; top: 650px; width: 10px; height: 10px;`;
    }

    joueur.style.cssText = cssText;
    img.src = newMazeSrc;
    img.style.display = 'none';

    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
}



function chronometers() {

    if (chronometersBool === true) {
    chrono += 1;
    chronoAffich.innerHTML = chrono; 
    }

}

function displayStyle() {
    document.getElementById('buttonNext').innerHTML = '> Next level';
}

function removeStyle() {
    document.getElementById('buttonNext').innerHTML = '>';
}
