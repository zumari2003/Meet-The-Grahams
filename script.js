document.addEventListener('DOMContentLoaded', () => {
    const intro = document.getElementById('intro');
    const game = document.getElementById('game');
    const gameArea = document.getElementById('game-area');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('high-score');
    const timerDisplay = document.getElementById('timer');
    const homeLogo = document.getElementById('home-logo');
    const backgroundMusic = document.getElementById('background-music');
    const dialogueText = document.getElementById('dialogue-text');
    const nextButton = document.getElementById('next-button');
    const creditsButton = document.getElementById('credits-button');
    const creditsPage = document.getElementById('credits-page');
    const gameOverMessage = document.createElement('div');
    const menuClickSound = new Audio('menuclick.mp3');
    const correctSound = new Audio('correct.mp3');
    const wrongSound = new Audio('wrong.mp3');
    let score = 0;
    let highScore = 0;
    let timeLeft = 30;
    let gameInterval;
    let kidsInterval;
    let currentLocation = '';
    let currentMessageIndex = 0;
    let gameActive = false;

    const messages = [
        "Damn! Drake can't keep track of all his kids.",
        "We're going to have to go to all of his favorite places if we want to Meet the Grahams.",
        "Can you help us? Select which location you want to start with."
    ];

    // Display the first message
    dialogueText.textContent = messages[currentMessageIndex];

    // Unmute and play the background music
    backgroundMusic.muted = false;
    backgroundMusic.play();

    const locationKids = {
        toronto: ['torontoboy1.png', 'torontogirl1.png', 'kid1.png'],
        atlanta: ['atlantaboy1.png', 'atlantagirl1.png', 'kid1.png'],
        houston: ['houstonboy1.png', 'houstongirl1.png', 'kid1.png']
    };

    const distractions = ['ozempic.png'];

    homeLogo.addEventListener('click', () => {
        menuClickSound.play();
        showIntro();
    });

    creditsButton.addEventListener('click', () => {
        menuClickSound.play();
        showCredits();
    });

    document.querySelectorAll('.location-button').forEach(button => {
        button.addEventListener('click', () => {
            menuClickSound.play();
            startGame(button.dataset.location);
        });
    });

    nextButton.addEventListener('click', () => {
        menuClickSound.play();
        currentMessageIndex++;
        if (currentMessageIndex < messages.length) {
            dialogueText.textContent = messages[currentMessageIndex];
        } else {
            nextButton.disabled = true;
        }
    });

    gameOverMessage.id = 'game-over-message';
    gameOverMessage.innerHTML = `
        <p>Game Over! Your score is <span id="final-score"></span></p>
        <button id="restart-button">Restart</button>
    `;
    game.appendChild(gameOverMessage);

    document.getElementById('restart-button').addEventListener('click', () => {
        gameOverMessage.style.display = 'none';
        showIntro();
    });

    function showIntro() {
        intro.style.display = 'block';
        game.style.display = 'none';
        creditsPage.style.display = 'none';
        currentMessageIndex = 0;
        dialogueText.textContent = messages[currentMessageIndex];
        nextButton.disabled = false;
        gameActive = false;
    }

    function showCredits() {
        intro.style.display = 'none';
        game.style.display = 'none';
        creditsPage.style.display = 'block';
        gameActive = false;
    }

    function startGame(location) {
        currentLocation = location;
        intro.style.display = 'none';
        game.style.display = 'block';
        creditsPage.style.display = 'none';
        score = 0;
        timeLeft = 30;
        updateScore();
        updateTime();
        gameInterval = setInterval(countdown, 1000);
        kidsInterval = setInterval(spawnKidOrDistraction, 1000);
        gameActive = true;
    }

    function countdown() {
        if (timeLeft > 0) {
            timeLeft--;
            updateTime();
        } else {
            endGame();
        }
    }

    function updateTime() {
        timerDisplay.textContent = `Time: ${timeLeft}`;
    }

    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
        highScoreDisplay.textContent = `High Score: ${highScore}`;
    }

    function spawnKidOrDistraction() {
        if (!gameActive) return;

        const isDistraction = Math.random() < 0.2; // 20% chance to spawn a distraction

        const item = document.createElement('img');
        const itemsInLocation = isDistraction ? distractions : locationKids[currentLocation];
        const randomItem = itemsInLocation[Math.floor(Math.random() * itemsInLocation.length)];

        item.src = `images/${randomItem}`;
        item.classList.add(isDistraction ? 'distraction' : 'kid');
        item.style.top = `${Math.random() * (gameArea.clientHeight - 50)}px`;
        item.style.left = `${Math.random() * (gameArea.clientWidth - 50)}px`;

        item.addEventListener('click', () => {
            if (!gameActive) return;
            if (isDistraction) {
                score = Math.max(0, score - 5);
                wrongSound.play();
            } else {
                score++;
                correctSound.play();
            }
            updateScore();
            gameArea.removeChild(item);
        });

        gameArea.appendChild(item);

        setTimeout(() => {
            if (gameArea.contains(item)) {
                gameArea.removeChild(item);
            }
        }, 1000);
    }

    function endGame() {
        clearInterval(gameInterval);
        clearInterval(kidsInterval);
        gameActive = false;
        if (score > highScore) {
            highScore = score;
        }
        document.getElementById('final-score').textContent = score;
        gameOverMessage.style.display = 'block';
    }
});
