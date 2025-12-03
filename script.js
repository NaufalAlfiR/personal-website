// Navbar scroll effect
const navbar = document.getElementById("navbar");
let lastScroll = 0;

window.addEventListener("scroll", () => {
	const currentScroll = window.pageYOffset;

	if (currentScroll > 100) {
		navbar.classList.add("scrolled");
	} else {
		navbar.classList.remove("scrolled");
	}

	lastScroll = currentScroll;
});

// Mobile menu toggle
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

hamburger.addEventListener("click", () => {
	navMenu.classList.toggle("active");
	hamburger.classList.toggle("active");
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach((link) => {
	link.addEventListener("click", () => {
		navMenu.classList.remove("active");
		hamburger.classList.remove("active");
	});
});

// Smooth scrolling for navigation links
navLinks.forEach((link) => {
	link.addEventListener("click", (e) => {
		e.preventDefault();
		const targetId = link.getAttribute("href");
		const targetSection = document.querySelector(targetId);

		if (targetSection) {
			const offsetTop = targetSection.offsetTop - 70;
			window.scrollTo({
				top: offsetTop,
				behavior: "smooth",
			});
		}
	});
});

// Skill bars animation
const observerOptions = {
	threshold: 0.5,
	rootMargin: "0px 0px -100px 0px",
};

const skillObserver = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			const progressBars = entry.target.querySelectorAll(".skill-progress");
			progressBars.forEach((bar) => {
				const progress = bar.getAttribute("data-progress");
				setTimeout(() => {
					bar.style.width = progress + "%";
				}, 200);
			});
			skillObserver.unobserve(entry.target);
		}
	});
}, observerOptions);

const skillsSection = document.querySelector(".skills-section");
if (skillsSection) {
	skillObserver.observe(skillsSection);
}

// Fade in animation on scroll
const fadeElements = document.querySelectorAll(
	".timeline-item, .project-card, .stat-item"
);

const fadeObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.style.opacity = "0";
				entry.target.style.transform = "translateY(30px)";
				entry.target.style.transition =
					"opacity 0.6s ease, transform 0.6s ease";

				setTimeout(() => {
					entry.target.style.opacity = "1";
					entry.target.style.transform = "translateY(0)";
				}, 100);

				fadeObserver.unobserve(entry.target);
			}
		});
	},
	{
		threshold: 0.1,
		rootMargin: "0px 0px -50px 0px",
	}
);

fadeElements.forEach((element) => {
	fadeObserver.observe(element);
});

// Contact form handling
const contactForm = document.getElementById("contactForm");

if (contactForm) {
	contactForm.addEventListener("submit", async (e) => {
		// Mencegah form submit default
		e.preventDefault();

		// Get form values
		const name = document.getElementById("name").value;
		const email = document.getElementById("email").value;
		const subject = document.getElementById("subject").value;
		const message = document.getElementById("message").value;

		// Basic validation
		if (!name || !email || !subject || !message) {
			alert("Harap isi semua kolom");
			return; // Berhenti di sini jika form kosong
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			alert("Harap masukkan alamat email yang valid");
			return; // Berhenti di sini jika email tidak valid
		}

		// --- PROSES PENGIRIMAN ---

		// Simulate form submission
		// Ambil elemen tombol submit
		const submitButton = contactForm.querySelector('button[type="submit"]');
		const originalText = submitButton.textContent;

		// Tampilkan status "Mengirim..."
		submitButton.textContent = "Mengirim...";
		submitButton.disabled = true;

		try {
			// 3. Kirim data ke Formspree pakai fetch
			const response = await fetch(contactForm.action, {
				method: "POST",
				body: new FormData(contactForm),
				headers: {
					Accept: "application/json",
				},
			});

			// 4. Cek hasil
			if (response.ok) {
				// Berhasil!
				submitButton.textContent = "Pesan Terkirim!";
				submitButton.style.background = "var(--secondary-color)";
				contactForm.reset(); // Kosongkan form

				// Kembalikan tombol ke normal setelah 3 detik
				setTimeout(() => {
					submitButton.textContent = originalText;
					submitButton.disabled = false;
					submitButton.style.background = "";
				}, 3000);
			} else {
				// Gagal di server Formspree
				throw new Error("Gagal mengirim ke server.");
			}
		} catch (error) {
			// 5. Tangani jika ada error jaringan
			console.error("Error:", error);
			alert("Maaf, terjadi kesalahan. Coba lagi nanti.");
			// Kembalikan tombol jika gagal
			submitButton.textContent = originalText;
			submitButton.disabled = false;
		}
	});
}

// Active navigation link highlighting
window.addEventListener("scroll", () => {
	let current = "";
	const sections = document.querySelectorAll("section");

	sections.forEach((section) => {
		const sectionTop = section.offsetTop;
		const sectionHeight = section.clientHeight;
		if (window.pageYOffset >= sectionTop - 100) {
			current = section.getAttribute("id");
		}
	});

	navLinks.forEach((link) => {
		link.classList.remove("active");
		if (link.getAttribute("href") === `#${current}`) {
			link.classList.add("active");
		}
	});
});

// Parallax effect for hero section
window.addEventListener("scroll", () => {
	const heroImage = document.querySelector(".hero-image");
	if (heroImage) {
		const scrolled = window.pageYOffset;
		heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
	}
});

// Add loading animation
window.addEventListener("load", () => {
	document.body.style.opacity = "0";
	document.body.style.transition = "opacity 0.5s ease";

	setTimeout(() => {
		document.body.style.opacity = "1";
	}, 100);
});

// Add cursor effect (optional - for modern touch)
const cursor = document.createElement("div");
cursor.className = "custom-cursor";
document.body.appendChild(cursor);

const cursorFollower = document.createElement("div");
cursorFollower.className = "cursor-follower";
document.body.appendChild(cursorFollower);

let mouseX = 0;
let mouseY = 0;
let followerX = 0;
let followerY = 0;

document.addEventListener("mousemove", (e) => {
	mouseX = e.clientX;
	mouseY = e.clientY;

	cursor.style.left = mouseX + "px";
	cursor.style.top = mouseY + "px";
});

function animateFollower() {
	const distX = mouseX - followerX;
	const distY = mouseY - followerY;

	followerX += distX / 10;
	followerY += distY / 10;

	cursorFollower.style.left = followerX + "px";
	cursorFollower.style.top = followerY + "px";

	requestAnimationFrame(animateFollower);
}

animateFollower();

// Add cursor styles dynamically
const cursorStyles = document.createElement("style");
cursorStyles.innerHTML = `
    .custom-cursor,
    .cursor-follower {
        position: fixed;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
    }
    
    .custom-cursor {
        width: 10px;
        height: 10px;
        background: var(--primary-color);
        transform: translate(-50%, -50%);
    }
    
    .cursor-follower {
        width: 40px;
        height: 40px;
        border: 2px solid var(--primary-color);
        transform: translate(-50%, -50%);
        transition: width 0.3s, height 0.3s;
    }
    
    @media (max-width: 768px) {
        .custom-cursor,
        .cursor-follower {
            display: none;
        }
    }
`;
document.head.appendChild(cursorStyles);

// Enhance cursor on hover over interactive elements
const interactiveElements = document.querySelectorAll(
	"a, button, .project-card"
);
interactiveElements.forEach((element) => {
	element.addEventListener("mouseenter", () => {
		cursorFollower.style.width = "60px";
		cursorFollower.style.height = "60px";
		cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
	});

	element.addEventListener("mouseleave", () => {
		cursorFollower.style.width = "40px";
		cursorFollower.style.height = "40px";
		cursor.style.transform = "translate(-50%, -50%) scale(1)";
	});
});
