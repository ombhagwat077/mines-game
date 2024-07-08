document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('game-grid');
    const startGameButton = document.getElementById('start-game');
    const cashoutButton = document.getElementById('cashout');
    const mineCountSelect = document.getElementById('mine-count');
    const boomSound = document.getElementById('boom-sound');
    const gemSound = document.getElementById('gem-sound');
    const revealSound = document.getElementById('reveal-sound');
    const cells = [];
    let mines = [];
    let mineCount = parseInt(mineCountSelect.value, 10);
    let gameInProgress = false;
    let cellClicked = false; // Track if any cell has been clicked

    // Images
    const gemImageSrc = 'gem3.jpg';
    const mineImageSrc = 'mine2.jpg';

    // Create grid
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', () => revealCell(i));
        grid.appendChild(cell);
        cells.push(cell);
    }

    function startGame() {
        resetGame(); // Ensure all cells are reset
        mineCount = parseInt(mineCountSelect.value, 10);
        mines = [];

        while (mines.length < mineCount) {
            const randomIndex = Math.floor(Math.random() * cells.length);
            if (!mines.includes(randomIndex)) {
                mines.push(randomIndex);
            }
        }

        gameInProgress = true;
        cashoutButton.disabled = false;
        mineCountSelect.disabled = true; // Disable mine count selector when game starts
        startGameButton.disabled = true; // Disable start game button when game starts
    }

    function revealCell(index) {
        if (!gameInProgress) return;
        if (!cellClicked) cellClicked = true;

        const cell = cells[index];
        if (cell.classList.contains('revealed')) return;

        cell.classList.add('revealed', 'selected');
        if (mines.includes(index)) {
            const img = document.createElement('img');
            img.src = mineImageSrc;
            img.classList.add('mine-img');
            cell.appendChild(img);
            boomSound.play(); // Play boom sound
            img.addEventListener('animationiteration', () => {
                img.style.animation = 'none'; // Reset animation to repeat boom effect
                void img.offsetWidth; // Trigger reflow to restart animation
                img.style.animation = null;
            });
            cell.classList.add('mine');
            revealAllCells();
            endGame(false);
        } else {
            const img = document.createElement('img');
            img.src = gemImageSrc;
            cell.appendChild(img);
            gemSound.play(); // Play gem sound
        }
    }

    function revealAllCells() {
        cells.forEach((cell, index) => {
            if (!cell.classList.contains('revealed')) {
                const img = document.createElement('img');
                img.src = mines.includes(index) ? mineImageSrc : gemImageSrc;
                cell.appendChild(img);
                cell.classList.add('revealed');
                revealSound.play();

            } else {
                cell.classList.remove('dim');
            }
            if (!cell.classList.contains('selected')) {
                cell.classList.add('dim');
            }
        });
    }

    function endGame(win) {
        gameInProgress = false;
        cashoutButton.disabled = true;
        mineCountSelect.disabled = false; // Re-enable mine count selector after game over
        startGameButton.disabled = false; // Re-enable start game button after game over
    }

    function resetGame() {
        cells.forEach(cell => {
            cell.classList.remove('revealed', 'selected', 'mine', 'dim');
            cell.innerHTML = '';
        });
        cellClicked = false; // Reset cellClicked state for new game
    }

    function cashout() {
        if (!cellClicked) return;
        revealAllCells();
        revealSound.play();
        gameInProgress = false;
        cashoutButton.disabled = true;
        mineCountSelect.disabled = false; // Re-enable mine count selector after cashout
        startGameButton.disabled = false; // Re-enable start game button after cashout
    }

    startGameButton.addEventListener('click', startGame);
    cashoutButton.addEventListener('click', cashout);

    const navTogglerBtn = document.querySelector(".nav-toggler"),
        aside = document.querySelector("aside");
    navTogglerBtn.addEventListener("click", () => {
        asideSectionTogglerBtn();
    })

    function asideSectionTogglerBtn() {
        aside.classList.toggle("open");
        navTogglerBtn.classList.toggle("open");
        for (let i = 0; i < totalSection; i++) {
            allSection[i].classList.toggle("open");
        }
    }
});