// ===== DOM ELEMENTS =====
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loadingScreen = document.getElementById('loading-screen');
    const loadingBar = document.getElementById('loading-bar');
    const loadingTip = document.getElementById('loading-tip');
    const messageEl = document.getElementById('message');
    const reactionGif = document.getElementById('reaction-gif');
    const guessInput = document.getElementById('guess-input');
    const guessButton = document.getElementById('guess-button');
    const attemptsEl = document.getElementById('attempts-count');
    const maxAttemptsEl = document.getElementById('max-attempts');
    const maxAttemptsDisplay = document.getElementById('max-attempts-display');
    const rangeDisplay = document.getElementById('range-display');
    const historyEl = document.getElementById('guess-history');
    const newGameButton = document.getElementById('new-game-button');

    const progressContainer = document.getElementById('progress-container');
    const progressFill = document.getElementById('progress-fill');
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    const timerEl = document.getElementById('timer');
    const hintButton = document.getElementById('hint-button');
    const hintCount = document.getElementById('hint-count');
    const hintMessage = document.getElementById('hint-message');
    const themeToggle = document.getElementById('theme-toggle');
    const winModal = document.getElementById('win-modal');
    const winAttempts = document.getElementById('win-attempts');
    const winTime = document.getElementById('win-time');
    const winScore = document.getElementById('win-score');
    const playAgainBtn = document.getElementById('play-again-btn');
    const shareBtn = document.getElementById('share-btn');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const confettiCanvas = document.getElementById('confetti-canvas');

    const notificationsContainer = document.getElementById('notifications');
    const startGameButton = document.getElementById('start-game-button');
    const gameArea = document.getElementById('game-area');


    ;
    const header = document.querySelector('.site-header');

    // Audio elements
    const clickSound = document.getElementById('click-sound');
    const winSound = document.getElementById('win-sound');
    const loseSound = document.getElementById('lose-sound');
    const hintSound = document.getElementById('hint-sound');

    // ===== GAME VARIABLES =====
    let targetNumber;
    let attempts;
    let gameWon;
    let guessHistory;
    let proximity;
    let maxRange = 100;
    let maxAttempts = 10;
    let hintsLeft = 1;
    let maxHints = 1;
    let difficulty = 'easy';
    let timerInterval;
    let timeElapsed = 0;
    let isDarkTheme = false;
    let currentUser = null;

    let lastGuessTime = 0;
    let adaptiveRange = { min: 1, max: 100 };
    let decoyNumber = null;
    let gameActive = false;

    // Loading tips
    const loadingTips = [
        "Tip: The harder the difficulty, the fewer hints you get!",
        "Tip: Your score is based on time and number of attempts.",

        "Tip: The progress bar shows how close you are to the answer.",
        "Tip: Try to guess strategically to narrow down the range.",
        "Tip: On hard mode, the game might mislead you sometimes...",
        "Tip: The number might change in harder difficulty levels!",
        "Tip: Watch out for pattern disruptions in medium and hard modes.",

    ];

    // Reaction GIFs for different scenarios
    const reactionGIFs = {
        veryClose: [
            "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif",
            "https://media.giphy.com/media/3o7buirYcmV5nSwIRW/giphy.gif"
        ],
        close: [
            "https://media.giphy.com/media/1zjQiLGfgb10nc7Wou/giphy.gif",
            "https://media.giphy.com/media/xTiTnGQNF0KMMRiVVe/giphy.gif"
        ],
        far: [
            "https://media.giphy.com/media/3o7aD2d7hy9ktXNDP2/giphy.gif",
            "https://media.giphy.com/media/FxTcyJKmxWys88EWHD/giphy.gif"
        ],
        veryFar: [
            "https://media.giphy.com/media/3o7btZ1Gm7ZL25pLMs/giphy.gif",
            "https://media.giphy.com/media/3o7ZetIsjtbkgNE1I4/giphy.gif"
        ],
        correct: [
            "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
            "https://media.giphy.com/media/3ohzdIuqJoo8QdKlnW/giphy.gif"
        ],
        wrong: [
            "https://media.giphy.com/media/pPhyAv5t9V8djyRFJH/giphy.gif",
            "https://media.giphy.com/media/l4FGuhL4U2WyjdkaY/giphy.gif"
        ],
        tricky: [
            "https://media.giphy.com/media/3oKIPBxpm5tHqcL1Ic/giphy.gif",
            "https://media.giphy.com/media/jTHttUZXzFMBF35H1P/giphy.gif"
        ]
    };

    // ===== INITIALIZATION =====
    // Simulated loading
    simulateLoading();

    // Initialize reveal elements for scroll animations
    const revealElements = document.querySelectorAll('.reveal-element');
    initScrollReveal(revealElements);


    // ===== FUNCTIONS =====
    function updateProgressBar() {
        let percent = 0;
        if (gameWon || attempts >= maxAttempts) {
            percent = 100;
        } else if (typeof proximity === 'number') {
            percent = Math.max(0, Math.min(100, proximity));
        }
        progressContainer.style.display = 'block';
        progressFill.style.width = percent + '%';
    }

    function simulateLoading() {
        let progress = 0;
        let tipIndex = 0;

        const loadInterval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadInterval);

                // Fade out loading screen
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }, 500);
            }
            loadingBar.style.width = progress + '%';

            // Rotate tips with fancy animation
            if (Math.random() > 0.9) {
                loadingTip.style.opacity = 0;
                loadingTip.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    tipIndex = (tipIndex + 1) % loadingTips.length;
                    loadingTip.textContent = loadingTips[tipIndex];
                    loadingTip.style.opacity = 1;
                    loadingTip.style.transform = 'translateY(0)';
                }, 300);
            }
        }, 150);
    }
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            document.querySelectorAll('.nav-menu a').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    function initScrollReveal(elements) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(element => {
            observer.observe(element);
        });
    }

    function playSound(soundElement) {
        // Reset the sound to the beginning
        soundElement.currentTime = 0;

        // Play the sound
        soundElement.play().catch(error => {
            console.log("Audio playback error:", error);
        });
    }

    function startNewGame() {
        // Reset game variables
        targetNumber = Math.floor(Math.random() * maxRange) + 1;
        attempts = 0;
        gameWon = false;
        guessHistory = [];
        proximity = 0;
        timeElapsed = 0;
        adaptiveRange = { min: 1, max: maxRange };
        gameActive = true;
        // Hide and clear confetti canvas
        confettiCanvas.style.display = 'none';
        const ctx = confettiCanvas.getContext('2d');
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        // Set decoy number for hard mode to confuse players
        if (difficulty === 'hard') {
            decoyNumber = Math.floor(Math.random() * maxRange) + 1;
            while (decoyNumber === targetNumber) {
                decoyNumber = Math.floor(Math.random() * maxRange) + 1;
            }
        } else {
            decoyNumber = null;
        }

        // Set hints based on difficulty
        setupHints();

        // Reset UI
        messageEl.innerHTML = `<span>Guess a number between 1 and ${maxRange}</span>`;
        messageEl.className = 'message-area';
        reactionGif.style.display = 'none';
        guessInput.value = '';
        attemptsEl.textContent = '0';
        maxAttemptsEl.textContent = maxAttempts;
        maxAttemptsDisplay.textContent = maxAttempts;
        rangeDisplay.textContent = `1-${maxRange}`;
        historyEl.innerHTML = '';
        progressContainer.style.display = 'none';
        progressFill.style.width = '0%';
        hintMessage.style.display = 'none';
        hintMessage.textContent = '';


        // Enable input and button
        guessInput.disabled = false;
        guessButton.disabled = false;

        // Focus on input
        guessInput.focus();

        // Start the timer
        startTimer();

        console.log("New game started! Target:", targetNumber);
        if (decoyNumber) console.log("Decoy number for hard mode:", decoyNumber);
    }

    function setupHints() {
        // Set hints based on difficulty
        const activeButton = document.querySelector('.difficulty-btn.active');
        if (activeButton) {
            maxHints = parseInt(activeButton.dataset.hints);
            hintsLeft = maxHints;
            hintCount.textContent = `${hintsLeft} left`;
        }
    }

    function startTimer() {
        // Clear previous interval if exists
        if (timerInterval) clearInterval(timerInterval);

        timeElapsed = 0;
        updateTimerDisplay();

        timerInterval = setInterval(() => {
            timeElapsed++;
            updateTimerDisplay();

            // Occasionally shift the target number slightly in hard mode (evil feature)
            if (difficulty === 'hard' && Math.random() < 0.01 && !gameWon && gameActive) {
                const shift = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
                if (shift !== 0) {
                    const newTarget = targetNumber + shift;
                    if (newTarget >= 1 && newTarget <= maxRange) {
                        targetNumber = newTarget;
                        console.log("Hard mode: Target number shifted to", targetNumber);
                    }
                }
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeElapsed / 60).toString().padStart(2, '0');
        const seconds = (timeElapsed % 60).toString().padStart(2, '0');
        timerEl.textContent = `${minutes}:${seconds}`;
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function checkGuess() {
        playSound(clickSound);

        const guess = parseInt(guessInput.value);

        if (isNaN(guess) || guess < 1 || guess > maxRange) {
            showMessage(`Please enter a valid number between 1 and ${maxRange}.`, 'error');
            showReaction('wrong');
            return;
        }

        // Anti-spam measure
        const currentTime = Date.now();
        if (currentTime - lastGuessTime < 500) {
            showNotification('Slow down!', 'Please wait a moment before guessing again.', 'warning');
            return;
        }
        lastGuessTime = currentTime;

        // Increase attempts and update UI
        attempts++;
        attemptsEl.textContent = attempts.toString();

        // Add to history
        guessHistory.push(guess);

        // Check if correct
        if (guess === targetNumber) {
            handleWin();
        } else {
            // For medium and hard difficulties, apply complex logic
            if (difficulty === 'medium' || difficulty === 'hard') {
                handleComplexGuessLogic(guess);
            } else {
                // Simple logic for easy mode
                handleSimpleGuessLogic(guess);
            }

            // Check if out of attempts
            if (attempts >= maxAttempts) {
                handleLoss();
            }
        }

        // Clear input for next guess
        guessInput.value = '';
        guessInput.focus();
    }

    function handleSimpleGuessLogic(guess) {
        // Calculate proximity (0-100 where 100 is correct)
        proximity = 100 - Math.abs(((targetNumber - guess) / maxRange) * 100);
        updateProgressBar();

        // Update progress bar
        progressContainer.style.display = 'block';
        progressFill.style.width = `${proximity}%`;

        // Generate hint message and show reaction
        const message = generateHintMessage(guess, false);
        showMessage(message, guess > targetNumber ? 'warning' : 'warning');
        showReaction(getReactionType(guess, false));

        // Add guess to history with visual indicator
        addGuessToHistory(guess);
    }

    function handleComplexGuessLogic(guess) {
        // Update adaptive range
        if (guess < targetNumber) {
            adaptiveRange.min = Math.max(adaptiveRange.min, guess);
        } else {
            adaptiveRange.max = Math.min(adaptiveRange.max, guess);
        }

        // Calculate proximity but with some randomness for medium/hard
        let proximityBase = 100 - Math.abs(((targetNumber - guess) / maxRange) * 100);

        // Add noise to proximity in hard mode
        if (difficulty === 'hard') {
            const noise = (Math.random() * 20) - 10; // -10 to +10
            proximityBase = Math.min(95, Math.max(5, proximityBase + noise)); // Cap at 95% to avoid confusion
        }
        proximity = proximityBase;
        updateProgressBar();

        // Update progress bar
        progressContainer.style.display = 'block';
        progressFill.style.width = `${proximity}%`;

        // Sometimes use the decoy number in hard mode to confuse players
        const useDecoy = difficulty === 'hard' && decoyNumber && Math.random() < 0.3;

        // Generate hint message and show reaction
        const message = generateHintMessage(guess, useDecoy);
        showMessage(message, useDecoy ? 'tricky' : (guess > targetNumber ? 'warning' : 'warning'));
        showReaction(getReactionType(guess, useDecoy));

        // Add guess to history with visual indicator
        addGuessToHistory(guess);
    }

    function generateHintMessage(guess, useDecoy) {
        const compareNumber = useDecoy ? decoyNumber : targetNumber;
        const difference = Math.abs(compareNumber - guess);
        const percentDifference = (difference / maxRange) * 100;

        // Add some misleading messages for hard mode
        if (difficulty === 'hard' && Math.random() < 0.2) {
            const misleadingMessages = [
                "Hmm, that's an interesting guess...",
                "The number is being sneaky!",
                "Not quite what I was thinking...",
                "You're on an interesting path...",
                "The number might be playing tricks on you..."
            ];
            return misleadingMessages[Math.floor(Math.random() * misleadingMessages.length)];
        }

        if (guess > compareNumber) {
            if (percentDifference <= 5) return "Too high, but you're very close!";
            if (percentDifference <= 10) return "Too high, getting warmer!";
            if (percentDifference <= 20) return "Too high! Try a lower number.";
            return "Way too high!";
        } else {
            if (percentDifference <= 5) return "Too low, but you're very close!";
            if (percentDifference <= 10) return "Too low, getting warmer!";
            if (percentDifference <= 20) return "Too low! Try a higher number.";
            return "Way too low!";
        }
    }

    function getReactionType(guess, useDecoy) {
        // If using decoy in hard mode, show tricky reaction sometimes
        if (useDecoy && Math.random() < 0.5) {
            return 'tricky';
        }

        const compareNumber = useDecoy ? decoyNumber : targetNumber;
        const difference = Math.abs(compareNumber - guess);
        const percentDifference = (difference / maxRange) * 100;

        if (percentDifference <= 5) return 'veryClose';
        if (percentDifference <= 15) return 'close';
        if (percentDifference <= 30) return 'far';
        return 'veryFar';
    }

    function showReaction(type) {
        if (!reactionGIFs[type]) return;

        const randomGif = reactionGIFs[type][Math.floor(Math.random() * reactionGIFs[type].length)];
        reactionGif.innerHTML = `<img src="${randomGif}" alt="Reaction">`;
        reactionGif.style.display = 'block';

        // Add animation for reaction gif
        reactionGif.style.transform = 'scale(0.8)';
        setTimeout(() => {
            reactionGif.style.transform = 'scale(1)';
        }, 50);
    }

    function showMessage(text, type = '') {
        messageEl.innerHTML = `<span>${text}</span>`;
        messageEl.className = 'message-area';
        if (type) {
            messageEl.classList.add(type);
        }

        // Animation effect
        messageEl.style.transform = 'scale(1.05)';
        setTimeout(() => {
            messageEl.style.transform = 'scale(1)';
        }, 200);
    }

    function addGuessToHistory(guess) {
        const guessItem = document.createElement('div');
        guessItem.textContent = guess;

        if (guess > targetNumber) {
            guessItem.className = 'guess-item high';
        } else if (guess < targetNumber) {
            guessItem.className = 'guess-item low';
        } else {
            guessItem.className = 'guess-item correct';
        }

        historyEl.appendChild(guessItem);

        // Add animation delay for staggered effect
        setTimeout(() => {
            guessItem.style.opacity = '1';
            guessItem.style.transform = 'scale(1)';
        }, 100);
    }

    function handleWin() {
        gameWon = true;
        gameActive = false;
        stopTimer();
        playSound(winSound);
        updateProgressBar();
        const minutesPart = Math.floor(timeElapsed / 60);
        const secondsPart = timeElapsed % 60;
        const timeString = `${minutesPart.toString().padStart(2, '0')}:${secondsPart.toString().padStart(2, '0')}`;

        // Calculate score: lower attempts and time = higher score
        // Add bonus for higher difficulties
        const maxScore = 1000;
        const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2;
        const timePenalty = Math.min(timeElapsed / 2, 400) / difficultyMultiplier; // Less penalty for harder difficulties
        const attemptPenalty = (attempts / maxAttempts) * 300 / difficultyMultiplier;
        const score = Math.floor((maxScore - timePenalty - attemptPenalty) * difficultyMultiplier);

        showMessage(`Congratulations! You guessed the number ${targetNumber} correctly!`, 'success');
        showReaction('correct');

        // Add final correct guess to history
        addGuessToHistory(targetNumber);

        // Disable input
        guessInput.disabled = true;
        guessButton.disabled = true;


        // Show win modal with stats
        winAttempts.textContent = attempts;
        winTime.textContent = timeString;
        winScore.textContent = score;

        // Show confetti
        startConfetti();

        // Show modal with delay for dramatic effect
        setTimeout(() => {
            winModal.style.display = 'flex';
            setTimeout(() => {
                winModal.classList.add('show');
            }, 50);
        }, 1000);
    }

    function handleLoss() {
        gameActive = false;
        stopTimer();
        playSound(loseSound);
        showMessage(`Game over! The number was ${targetNumber}. Try again!`, 'error');
        showReaction('wrong');
        updateProgressBar();
        guessInput.disabled = true;
        guessButton.disabled = true;
    }

    function startConfetti() {
        confettiCanvas.style.display = 'block';
        const ctx = confettiCanvas.getContext('2d');
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;

        const pieces = [];
        const colors = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];

        for (let i = 0; i < 200; i++) {
            pieces.push({
                x: Math.random() * confettiCanvas.width,
                y: Math.random() * confettiCanvas.height - confettiCanvas.height,
                size: Math.random() * 10 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: Math.random() * 3 + 1,
                angle: Math.random() * 360,
                rotation: Math.random() * 3 - 1.5,
                shape: Math.random() > 0.5 ? 'circle' : Math.random() > 0.5 ? 'rect' : 'triangle'
            });
        }

        function drawConfetti() {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            let completed = true;

            pieces.forEach(piece => {
                ctx.save(); // Save context state
                ctx.translate(piece.x, piece.y);
                ctx.rotate((piece.angle * Math.PI) / 180);
                ctx.fillStyle = piece.color;

                if (piece.shape === 'circle') {
                    ctx.beginPath();
                    ctx.arc(0, 0, piece.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (piece.shape === 'triangle') {
                    ctx.beginPath();
                    ctx.moveTo(0, -piece.size / 2);
                    ctx.lineTo(piece.size / 2, piece.size / 2);
                    ctx.lineTo(-piece.size / 2, piece.size / 2);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
                }

                ctx.restore(); // Restore context state

                piece.y += piece.speed;
                piece.angle += piece.rotation;

                if (piece.y < confettiCanvas.height + 100) {
                    completed = false;
                }
            });

            if (!completed) {
                requestAnimationFrame(drawConfetti);
            } else {
                setTimeout(() => {
                    confettiCanvas.style.display = 'none';
                }, 1000);
            }
        }

        drawConfetti();
    }

    function getHint() {
        playSound(hintSound);

        if (hintsLeft <= 0) {
            hintMessage.textContent = "No more hints left!";
            hintMessage.style.display = 'flex';
            showNotification('Warning', 'You have no hints left!', 'warning');
            return;
        }

        hintsLeft--;
        hintCount.textContent = `${hintsLeft} left`;

        // Generate numerical hint based on difficulty
        let hintText = "";

        if (difficulty === 'easy') {
            // For easy, give a narrower range
            const range = Math.max(30, Math.floor(maxRange * 0.1)); // 10% of max range
            const min = Math.max(1, targetNumber - range);
            const max = Math.min(maxRange, targetNumber + range);
            hintText = `The number is between ${min} and ${max}`;
        } else if (difficulty === 'medium') {
            // For medium, give more vague hints
            if (targetNumber <= maxRange / 3) {
                hintText = "The number is in the lower third of the range";
            } else if (targetNumber <= (maxRange * 2) / 3) {
                hintText = "The number is in the middle third of the range";
            } else {
                hintText = "The number is in the upper third of the range";
            }
        } else {
            // For hard, give very vague or occasionally misleading hints
            const isCorrect = Math.random() < 0.7; // 70% chance of correct hint

            if (isCorrect) {
                if (targetNumber % 2 === 0) {
                    hintText = "The number is even";
                } else {
                    hintText = "The number is odd";
                }
            } else {
                // Misleading hint
                if (targetNumber % 2 === 0) {
                    hintText = "The number might be odd";
                } else {
                    hintText = "The number might be even";
                }
            }
        }

        hintMessage.textContent = hintText;
        hintMessage.style.display = 'flex';

        // Animation
        hintMessage.style.opacity = '0';
        hintMessage.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            hintMessage.style.opacity = '1';
            hintMessage.style.transform = 'translateY(0)';
        }, 10);
    }

    function toggleTheme() {
        playSound(clickSound);
        isDarkTheme = !isDarkTheme;
        document.body.classList.toggle('dark-theme', isDarkTheme);

        // Ensure navbar gets the dark theme class too
        if (header) {
            header.classList.toggle('dark-theme', isDarkTheme);
        }

        // Update icon
        themeToggle.innerHTML = isDarkTheme ?
            '<i class="fas fa-sun"></i>' :
            '<i class="fas fa-moon"></i>';

        // Store preference
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
        showNotification('Theme Changed', isDarkTheme ? 'Dark mode activated' : 'Light mode activated', 'info');
    }

    function setDifficulty(event) {
        const button = event.target;
        if (!button.classList.contains('difficulty-btn')) return;

        playSound(clickSound);

        // Update active state
        difficultyButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Update game settings
        maxRange = parseInt(button.dataset.range);
        maxAttempts = parseInt(button.dataset.attempts);
        difficulty = button.textContent.toLowerCase();

        // Update display
        rangeDisplay.textContent = `1-${maxRange}`;
        maxAttemptsEl.textContent = maxAttempts;
        maxAttemptsDisplay.textContent = maxAttempts;

        showNotification('Difficulty Changed', `Difficulty set to ${button.textContent}`, 'info');
    }

    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error("Error parsing JWT", e);
            return null;
        }
    }



    function showNotification(title, message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        let icon;
        switch (type) {
            case 'success':
                icon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'error':
                icon = '<i class="fas fa-times-circle"></i>';
                break;
            case 'warning':
                icon = '<i class="fas fa-exclamation-triangle"></i>';
                break;
            default:
                icon = '<i class="fas fa-info-circle"></i>';
        }

        notification.innerHTML = `
            <div class="notification-icon">${icon}</div>
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <div class="notification-close">&times;</div>
            <div class="notification-progress"></div>
        `;

        notificationsContainer.appendChild(notification);

        // Animation
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';

            // Auto dismiss after 5 seconds
            setTimeout(() => {
                notification.style.animation = 'slide-out-right 0.3s forwards';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 5000);
        }, 10);

        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slide-out-right 0.3s forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }




    function prepareGame() {
        gameArea.style.display = 'block';
        startGameButton.style.display = 'none';
        startNewGame();
        playSound(clickSound);
    }

    // ===== EVENT LISTENERS =====
    startGameButton.addEventListener('click', prepareGame);

    guessButton.addEventListener('click', checkGuess);

    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !guessInput.disabled) {
            checkGuess();
        }
    });

    newGameButton.addEventListener('click', () => {
        playSound(clickSound);
        gameArea.style.display = 'block';
        startGameButton.style.display = 'none';
        startNewGame();
    });



    hintButton.addEventListener('click', getHint);

    themeToggle.addEventListener('click', toggleTheme);

    document.querySelector('.difficulty-buttons').addEventListener('click', setDifficulty);



    playAgainBtn.addEventListener('click', () => {
        playSound(clickSound);
        winModal.classList.remove('show');
        setTimeout(() => {
            winModal.style.display = 'none';
            gameArea.style.display = 'block';
            startGameButton.style.display = 'none';
            startNewGame();
        }, 300);
    });

    shareBtn.addEventListener('click', () => {
        playSound(clickSound);
        const text = `I guessed the number ${targetNumber} in ${attempts} attempts with a score of ${winScore.textContent}! Can you beat me at GuessMe? https://guess-me.vercel.app/`;

        if (navigator.share) {
            navigator.share({
                title: 'GuessMe Game Result',
                text: text,
                url: window.location.href
            }).catch((error) => {
                console.log('Sharing failed:', error);
                copyToClipboard(text);
            });
        } else {
            // Fallback for desktop: open specific share options or copy to clipboard
            if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                // For mobile, create WhatsApp link
                const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(text)}`;
                window.location.href = whatsappUrl;
            } else {
                copyToClipboard(text);
            }
        }
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            playSound(clickSound);
            // Find parent modal
            const modal = btn.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            }
        });
    });

    contactLink.addEventListener('click', (e) => {
        e.preventDefault();
        playSound(clickSound);
        contactModal.style.display = 'flex';
        setTimeout(() => {
            contactModal.classList.add('show');
        }, 50);
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        playSound(clickSound);
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        // Simple validation
        if (nameInput.value && emailInput.value && messageInput.value) {
            // In a real app, you would send this data to a server
            showNotification('Message Sent', 'Thank you for your message! We will get back to you soon.', 'success');
            contactModal.classList.remove('show');
            setTimeout(() => {
                contactModal.style.display = 'none';
                // Reset form
                nameInput.value = '';
                emailInput.value = '';
                messageInput.value = '';
            }, 300);
        } else {
            showNotification('Error', 'Please fill in all fields.', 'error');
        }
    });

    window.addEventListener('resize', () => {
        if (confettiCanvas.style.display !== 'none') {
            confettiCanvas.width = window.innerWidth;
            confettiCanvas.height = window.innerHeight;
        }
    });

    // Helper function for clipboard
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('Success', 'Result copied to clipboard!', 'success');
    }

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        isDarkTheme = true;
        document.body.classList.add('dark-theme');

        // Ensure header also gets dark theme
        if (header) {
            header.classList.add('dark-theme');
        }

        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
});