/* ========================================
   APLIKASI TO-DO LIST
   File JavaScript untuk mengelola semua fungsi aplikasi
======================================== */

// Menunggu hingga seluruh halaman HTML selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
	/* ========================================
       AMBIL ELEMEN-ELEMEN HTML
    ======================================== */

	const taskInput = document.getElementById("taskInput");
	const addBtn = document.getElementById("addBtn");
	const taskList = document.getElementById("taskList");
	const emptyState = document.getElementById("emptyState");
	const taskCount = document.getElementById("taskCount");
	const progressBar = document.getElementById("progressBar");
	const progressPercentage = document.getElementById("progressPercentage");
	const motivationalText = document.getElementById("motivationalText");

	/* ========================================
       ARRAY UNTUK MENYIMPAN SEMUA TUGAS
    ======================================== */

	let tasks = [];
	let hasShownConfetti = false; // Flag untuk tracking confetti

	/* ========================================
       FUNGSI: LOAD TASKS DARI LOCALSTORAGE
       Mengambil data tugas yang sudah disimpan sebelumnya
    ======================================== */

	function loadTasks() {
		// Ambil data dari localStorage
		const savedTasks = localStorage.getItem("myTasks");

		// Jika ada data tersimpan, konversi dari JSON ke array
		if (savedTasks) {
			tasks = JSON.parse(savedTasks);
			renderTasks(); // Tampilkan tugas-tugas
		} else {
			// Jika belum ada tugas, tampilkan empty state
			showEmptyState();
		}

		// Update progress bar saat load
		updateProgressBar();
	}

	/* ========================================
       FUNGSI: SAVE TASKS KE LOCALSTORAGE
       Menyimpan array tasks ke localStorage
    ======================================== */

	function saveTasks() {
		// Konversi array tasks menjadi JSON string dan simpan
		localStorage.setItem("myTasks", JSON.stringify(tasks));
	}

	/* ========================================
       FUNGSI: TAMBAH TUGAS BARU
    ======================================== */

	function addTask() {
		// Ambil teks dari input dan hapus spasi di awal/akhir
		const taskText = taskInput.value.trim();

		// Validasi: pastikan input tidak kosong
		if (taskText === "") {
			// Beri efek shake pada input jika kosong
			taskInput.classList.add("shake");
			setTimeout(() => taskInput.classList.remove("shake"), 500);
			return;
		}

		// Buat objek tugas baru
		const newTask = {
			id: Date.now(), // ID unik berdasarkan timestamp
			text: taskText,
			completed: false, // Status awal: belum selesai
		};

		// Tambahkan tugas baru ke array
		tasks.push(newTask);

		// Simpan ke localStorage
		saveTasks();

		// Tampilkan ulang semua tugas
		renderTasks();

		// Update progress bar
		updateProgressBar();

		// Kosongkan input dan fokus kembali ke input
		taskInput.value = "";
		taskInput.focus();
	}

	/* ========================================
       FUNGSI: TOGGLE STATUS TUGAS (Selesai/Belum)
    ======================================== */

	function toggleTask(id) {
		// Cari tugas berdasarkan ID dan ubah status completed-nya
		tasks = tasks.map((task) => {
			if (task.id === id) {
				return { ...task, completed: !task.completed };
			}
			return task;
		});

		// Simpan perubahan
		saveTasks();

		// Tampilkan ulang tugas
		renderTasks();

		// Update progress bar
		updateProgressBar();
	}

	/* ========================================
       FUNGSI: EDIT TUGAS
       Mengubah teks tugas yang sudah ada
    ======================================== */

	function editTask(id) {
		// Cari task yang akan diedit
		const task = tasks.find((t) => t.id === id);
		if (!task) return;

		// Cari elemen task
		const taskElement = document.querySelector(`[data-id="${id}"]`);
		const taskTextElement = taskElement.querySelector(".task-text");

		// Buat input field untuk edit
		const input = document.createElement("input");
		input.type = "text";
		input.className = "task-text-input";
		input.value = task.text;

		// Replace text dengan input
		taskTextElement.replaceWith(input);
		input.focus();
		input.select();

		// Fungsi untuk save perubahan
		function saveEdit() {
			const newText = input.value.trim();

			if (newText && newText !== task.text) {
				// Update task text
				tasks = tasks.map((t) => {
					if (t.id === id) {
						return { ...t, text: newText };
					}
					return t;
				});

				// Simpan ke localStorage
				saveTasks();
			}

			// Render ulang
			renderTasks();
		}

		// Save saat Enter ditekan
		input.addEventListener("keypress", function (e) {
			if (e.key === "Enter") {
				saveEdit();
			}
		});

		// Save saat blur (kehilangan focus)
		input.addEventListener("blur", saveEdit);
	}

	/* ========================================
       FUNGSI: HAPUS TUGAS
    ======================================== */

	function deleteTask(id) {
		// Cari elemen tugas yang akan dihapus
		const taskElement = document.querySelector(`[data-id="${id}"]`);

		// Tambahkan class untuk animasi menghilang
		taskElement.classList.add("removing");

		// Tunggu animasi selesai (300ms), baru hapus dari array
		setTimeout(() => {
			// Filter array: ambil semua tugas kecuali yang ber-id ini
			tasks = tasks.filter((task) => task.id !== id);

			// Simpan perubahan
			saveTasks();

			// Tampilkan ulang tugas
			renderTasks();

			// Update progress bar
			updateProgressBar();
		}, 300);
	}

	/* ========================================
       FUNGSI: RENDER/TAMPILKAN SEMUA TUGAS
    ======================================== */

	function renderTasks() {
		// Kosongkan daftar tugas
		taskList.innerHTML = "";

		// Jika tidak ada tugas, tampilkan empty state
		if (tasks.length === 0) {
			showEmptyState();
			return;
		}

		// Sembunyikan empty state
		hideEmptyState();

		// Update counter jumlah tugas
		updateTaskCount();

		// Loop untuk setiap tugas dan buat elemen HTML-nya
		tasks.forEach((task) => {
			// Buat elemen <li> untuk tugas
			const li = document.createElement("li");
			li.className = "task-item";
			li.setAttribute("data-id", task.id);

			// Jika tugas sudah selesai, tambahkan class 'completed'
			if (task.completed) {
				li.classList.add("completed");
			}

			// Isi HTML untuk setiap tugas
			li.innerHTML = `
                <div class="task-checkbox ${
									task.completed ? "checked" : ""
								}" onclick="toggleTaskFromHTML(${task.id})"></div>
                <span class="task-text" ondblclick="editTaskFromHTML(${
									task.id
								})" title="Double-click untuk edit">${escapeHtml(
				task.text
			)}</span>
                <button class="edit-btn" onclick="editTaskFromHTML(${
									task.id
								})" title="Edit tugas">✏️</button>
                <button class="delete-btn" onclick="deleteTaskFromHTML(${
									task.id
								})" title="Hapus tugas">×</button>
            `;

			// Tambahkan elemen <li> ke dalam <ul>
			taskList.appendChild(li);
		});
	}

	/* ========================================
       FUNGSI: UPDATE COUNTER JUMLAH TUGAS
    ======================================== */

	function updateTaskCount() {
		const total = tasks.length;
		const completed = tasks.filter((task) => task.completed).length;
		const active = total - completed;

		// Update teks counter
		if (total === 0) {
			taskCount.textContent = "0 tugas";
		} else if (active === 0) {
			taskCount.textContent = `${total} tugas (semua selesai!)`;
		} else {
			taskCount.textContent = `${total} tugas (${active} aktif)`;
		}
	}

	/* ========================================
       FUNGSI: UPDATE PROGRESS BAR
       Menghitung dan menampilkan progress berdasarkan tugas yang selesai
    ======================================== */

	function updateProgressBar() {
		const total = tasks.length;
		const completed = tasks.filter((task) => task.completed).length;

		// Hitung persentase
		const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

		// Update progress bar width
		progressBar.style.width = percentage + "%";

		// Update teks persentase
		progressPercentage.textContent = percentage + "%";

		// Update motivational text berdasarkan progress
		updateMotivationalText(percentage);

		// Trigger confetti jika 100% dan belum ditampilkan
		if (percentage === 100 && total > 0 && !hasShownConfetti) {
			triggerConfetti();
			hasShownConfetti = true;
		}

		// Reset flag confetti jika progress turun dari 100%
		if (percentage < 100) {
			hasShownConfetti = false;
		}
	}

	/* ========================================
       FUNGSI: UPDATE MOTIVATIONAL TEXT
       Mengubah teks motivasi berdasarkan progress
    ======================================== */

	function updateMotivationalText(percentage) {
		let text = "";

		if (percentage === 0) {
			text = "Let's get started!";
		} else if (percentage < 25) {
			text = "Good start!";
		} else if (percentage < 50) {
			text = "Keep going!";
		} else if (percentage < 75) {
			text = "Almost there!";
		} else if (percentage < 100) {
			text = "So close!";
		} else if (percentage === 100) {
			text = "Perfect! 🎉";
		}

		motivationalText.textContent = text;
	}

	/* ========================================
       FUNGSI: TRIGGER CONFETTI ANIMATION
       Menampilkan animasi confetti saat semua tugas selesai
    ======================================== */

	function triggerConfetti() {
		// Pastikan library confetti sudah loaded
		if (typeof confetti === "undefined") {
			console.error("Confetti library tidak ditemukan");
			return;
		}

		// Konfigurasi confetti
		const duration = 3000; // 3 detik
		const animationEnd = Date.now() + duration;
		const defaults = {
			startVelocity: 30,
			spread: 360,
			ticks: 60,
			zIndex: 9999,
		};

		function randomInRange(min, max) {
			return Math.random() * (max - min) + min;
		}

		// Interval untuk confetti burst
		const interval = setInterval(function () {
			const timeLeft = animationEnd - Date.now();

			if (timeLeft <= 0) {
				return clearInterval(interval);
			}

			const particleCount = 50 * (timeLeft / duration);

			// Confetti dari kiri
			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
			});

			// Confetti dari kanan
			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
			});
		}, 250);
	}

	/* ========================================
       FUNGSI: TAMPILKAN EMPTY STATE
    ======================================== */

	function showEmptyState() {
		emptyState.classList.add("show");
		taskCount.textContent = "0 tugas";
		updateProgressBar();
	}

	/* ========================================
       FUNGSI: SEMBUNYIKAN EMPTY STATE
    ======================================== */

	function hideEmptyState() {
		emptyState.classList.remove("show");
	}

	/* ========================================
       FUNGSI: ESCAPE HTML (Keamanan)
       Mencegah XSS attack dengan escape karakter HTML
    ======================================== */

	function escapeHtml(text) {
		const div = document.createElement("div");
		div.textContent = text;
		return div.innerHTML;
	}

	/* ========================================
       EVENT LISTENERS
    ======================================== */

	// Klik tombol "Tambah"
	addBtn.addEventListener("click", addTask);

	// Tekan Enter pada input
	taskInput.addEventListener("keypress", function (e) {
		if (e.key === "Enter") {
			addTask();
		}
	});

	// Auto-focus ke input saat halaman dimuat
	taskInput.focus();

	/* ========================================
       FUNGSI GLOBAL (Dipanggil dari HTML onclick)
    ======================================== */

	// Membuat fungsi bisa diakses dari HTML
	window.toggleTaskFromHTML = toggleTask;
	window.deleteTaskFromHTML = deleteTask;
	window.editTaskFromHTML = editTask;

	/* ========================================
       INISIALISASI: LOAD TASKS SAAT HALAMAN DIMUAT
    ======================================== */

	loadTasks();
});

/* ========================================
   CSS UNTUK EFEK SHAKE (Ditambahkan via JavaScript)
======================================== */

// Tambahkan style untuk efek shake
const style = document.createElement("style");
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    .shake {
        animation: shake 0.3s ease-in-out;
    }
`;
document.head.appendChild(style);
