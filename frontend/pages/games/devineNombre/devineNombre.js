document.addEventListener('DOMContentLoaded', () => {
    const secretCode = generateSecretCode();
    const form = document.getElementById('guessForm');
    const input = document.getElementById('guessInput');
    const resultDiv = document.getElementById('result');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const guess = input.value;
        if (isValidGuess(guess)) {
            const feedback = evaluateGuess(guess, secretCode);
            resultDiv.innerHTML += `<p>${guess}: ${feedback.correctPosition} bien placé, ${feedback.wrongPosition} mal placé</p>`;
            input.value = '';
        } else {
            alert('Veuillez entrer un nombre à 4 chiffres avec des chiffres uniques.');
        }
    });

    function generateSecretCode() {
        const digits = Array.from({ length: 10 }, (_, i) => i.toString());
        let code = '';
        while (code.length < 4) {
            const randomIndex = Math.floor(Math.random() * digits.length);
            code += digits.splice(randomIndex, 1);
        }
        return code;
    }

    function isValidGuess(guess) {
        return guess.length === 4 && new Set(guess).size === 4;
    }

    function evaluateGuess(guess, secret) {
        let correctPosition = 0;
        let wrongPosition = 0;
        for (let i = 0; i < 4; i++) {
            if (guess[i] === secret[i]) {
                correctPosition++;
            } else if (secret.includes(guess[i])) {
                wrongPosition++;
            }
        }
        return { correctPosition, wrongPosition };
    }
});

