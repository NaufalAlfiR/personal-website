const quoteTextEl = document.getElementById("quoteText");
const quoteAuthorEl = document.getElementById("quoteAuthor");
const quoteContentEl = document.getElementById("quoteContent");
const newQuoteBtn = document.getElementById("newQuoteBtn");

const apiUrl = "https://dummyjson.com/quotes/random";

async function getQuote() {
	try {
		quoteContentEl.classList.remove("fade-in");

		quoteTextEl.textContent = "Memuat kutipan...";
		quoteAuthorEl.textContent = "";

		newQuoteBtn.disabled = true;
		newQuoteBtn.style.opacity = "0.6";

		const response = await fetch(apiUrl);
		const data = await response.json();

		await new Promise((resolve) => setTimeout(resolve, 300));

		quoteTextEl.textContent = data.quote;
		quoteAuthorEl.textContent = data.author;

		quoteContentEl.classList.add("fade-in");

		newQuoteBtn.disabled = false;
		newQuoteBtn.style.opacity = "1";
	} catch (error) {
		quoteTextEl.textContent =
			"Maaf, terjadi kesalahan saat mengambil kutipan. Silakan coba lagi.";
		quoteAuthorEl.textContent = "";
		console.error("Error fetching quote:", error);

		newQuoteBtn.disabled = false;
		newQuoteBtn.style.opacity = "1";
	}
}

newQuoteBtn.addEventListener("click", getQuote);

window.addEventListener("DOMContentLoaded", () => {
	setTimeout(getQuote, 500);
});
