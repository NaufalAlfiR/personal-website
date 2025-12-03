const icons = [
	"fa-gamepad",
	"fa-ghost",
	"fa-dragon",
	"fa-headset",
	"fa-puzzle-piece",
	"fa-rocket",
	"fa-trophy",
	"fa-heart",
];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let canFlip = true;

const gameBoard = document.getElementById("gameBoard");
const movesDisplay = document.getElementById("moves");
const restartBtn = document.getElementById("restartBtn");

// --- ELEMEN BARU UNTUK MODAL ---
const winModal = document.getElementById("winModal");
const finalMoves = document.getElementById("finalMoves");
const playAgainBtn = document.getElementById("playAgainBtn");

function initGame() {
	cards = [...icons, ...icons];
	shuffleArray(cards);
	matchedPairs = 0;
	moves = 0;
	flippedCards = [];
	canFlip = true;
	movesDisplay.textContent = moves;

	// Pastikan modal tertutup saat restart
	closeModal();

	gameBoard.innerHTML = "";

	cards.forEach((icon, index) => {
		const card = createCard(icon, index);
		gameBoard.appendChild(card);
	});
}

function createCard(icon, index) {
	const card = document.createElement("div");
	card.classList.add("card");
	card.dataset.index = index;
	card.dataset.icon = icon;

	card.innerHTML = `
        <div class="card-face card-back">
            <i class="fas fa-question"></i>
        </div>
        <div class="card-face card-front">
            <i class="fas ${icon}"></i>
        </div>
    `;

	card.addEventListener("click", () => flipCard(card));
	return card;
}

function flipCard(card) {
	if (!canFlip) return;
	if (card.classList.contains("flipped")) return;
	if (card.classList.contains("matched")) return;

	card.classList.add("flipped");
	flippedCards.push(card);

	if (flippedCards.length === 2) {
		moves++;
		movesDisplay.textContent = moves;
		checkMatch();
	}
}

function checkMatch() {
	canFlip = false;

	const [card1, card2] = flippedCards;
	const icon1 = card1.dataset.icon;
	const icon2 = card2.dataset.icon;

	if (icon1 === icon2) {
		card1.classList.add("matched");
		card2.classList.add("matched");
		matchedPairs++;

		flippedCards = [];
		canFlip = true;

		if (matchedPairs === icons.length) {
			setTimeout(() => {
				// --- GANTI ALERT DENGAN MODAL ---
				showModal();
				triggerConfetti();
			}, 500);
		}
	} else {
		setTimeout(() => {
			card1.classList.remove("flipped");
			card2.classList.remove("flipped");
			flippedCards = [];
			canFlip = true;
		}, 1000);
	}
}

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

// --- FUNGSI BARU: MODAL CONTROL ---
function showModal() {
	finalMoves.textContent = moves;
	winModal.classList.remove("hidden");
}

function closeModal() {
	winModal.classList.add("hidden");
}

// --- FUNGSI BARU: EFEK CONFETTI ---
function triggerConfetti() {
	const duration = 3000; // Durasi 3 detik
	const animationEnd = Date.now() + duration;
	const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2000 };

	function randomInRange(min, max) {
		return Math.random() * (max - min) + min;
	}

	const interval = setInterval(function () {
		const timeLeft = animationEnd - Date.now();

		if (timeLeft <= 0) {
			return clearInterval(interval);
		}

		const particleCount = 50 * (timeLeft / duration);

		// Tembak dari kiri
		confetti(
			Object.assign({}, defaults, {
				particleCount,
				origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
			})
		);
		// Tembak dari kanan
		confetti(
			Object.assign({}, defaults, {
				particleCount,
				origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
			})
		);
	}, 250);
}

restartBtn.addEventListener("click", initGame);
playAgainBtn.addEventListener("click", initGame); // Tombol di dalam modal

initGame();
