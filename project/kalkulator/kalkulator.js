const contentDiv = document.getElementById("content");
			const menuButtons = document.querySelectorAll(".menu-card");
			let activeMenu = null;

			function showMenu(menu) {
				if (activeMenu === menu) return;
				activeMenu = menu;

				menuButtons.forEach((btn) => btn.classList.remove("active"));
				document.getElementById(`btn-${menu}`).classList.add("active");

				let formHTML = "";
				switch (menu) {
					case "kalkulator":
						formHTML = `
                        <h2 class="form-title">Kalkulator Ilmiah</h2>
                        <form id="formKalkulator" class="form-container">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label id="labelAngka1" for="angka1">Angka 1</label>
                                    <input type="number" step="any" id="angka1" required />
                                </div>
                                <div class="form-group">
                                    <label for="operator">Operator</label>
                                    <select id="operator" required onchange="handleOperatorChange(this.value)">
                                        <option value="+">Tambah (+)</option>
                                        <option value="-">Kurang (-)</option>
                                        <option value="*">Kali (×)</option>
                                        <option value="/">Bagi (÷)</option>
                                        <option value="^">Pangkat (a^b)</option>
                                        <option value="sqrt">Akar (√a)</option>
                                        <option value="log">Logaritma (log a)</option>
                                        <option value="mod">Modulus (a mod b)</option>
                                        <option value="sin">Sin(a)</option>
                                        <option value="cos">Cos(a)</option>
                                        <option value="tan">Tan(a)</option>
                                        <option value="fact">Faktorial (a!)</option>
                                        <option value="kuadrat">Persamaan Kuadrat</option>
                                    </select>
                                </div>
                            </div>
                            <div id="inputAngka2Container" class="form-group">
                                <label id="labelAngka2" for="angka2">Angka 2</label>
                                <input type="number" step="any" id="angka2" />
                            </div>
                            <div id="inputAngka3Container" class="form-group" style="display: none;">
                                <label for="angka3">Nilai c</label>
                                <input type="number" step="any" id="angka3" />
                            </div>
                            <button type="submit" class="btn-soft btn-orange">Hitung</button>
                        </form>
                        <div id="hasil"></div>
                    `;
						break;
					case "trapesium":
						formHTML = `
                        <h2 class="form-title">Luas Trapesium</h2>
                        <form id="formTrapesium" class="form-container">
                            <div class="form-group">
                                <label for="alasAtas">Alas Atas (a)</label>
                                <input type="number" step="any" id="alasAtas" required />
                            </div>
                            <div class="form-group">
                                <label for="alasBawah">Alas Bawah (b)</label>
                                <input type="number" step="any" id="alasBawah" required />
                            </div>
                            <div class="form-group">
                                <label for="tinggi">Tinggi (t)</label>
                                <input type="number" step="any" id="tinggi" required />
                            </div>
                            <button type="submit" class="btn-soft btn-pink">Hitung Luas</button>
                        </form>
                        <div id="hasil"></div>
                    `;
						break;
					case "deret":
						formHTML = `
                        <h2 class="form-title">Deret Bilangan</h2>
                        <form id="formDeret" class="form-container">
                            <div class="form-group">
                                <label for="jumlah">Jumlah Bilangan</label>
                                <input type="number" id="jumlah" min="1" required />
                            </div>
                            <div class="form-group">
                                <label for="awal">Nilai Awal</label>
                                <input type="number" id="awal" required />
                            </div>
                            <div class="form-group">
                                <label for="selisih">Selisih</label>
                                <input type="number" id="selisih" required />
                            </div>
                            <button type="submit" class="btn-soft btn-red">Tampilkan Deret</button>
                        </form>
                        <div id="hasil"></div>
                    `;
						break;
				}
				contentDiv.innerHTML = formHTML;
				attachFormListeners(menu);
			}

			function attachFormListeners(menu) {
				const form = document.querySelector("form");
				if (form) {
					form.onsubmit = function (e) {
						e.preventDefault();
						switch (menu) {
							case "kalkulator":
								kalkulator();
								break;
							case "trapesium":
								luasTrapesium();
								break;
							case "deret":
								deretBilangan();
								break;
						}
					};
				}
			}

			function handleOperatorChange(operator) {
				const singleOperandOps = ["sqrt", "log", "sin", "cos", "tan", "fact"];
				const isSingle = singleOperandOps.includes(operator);
				const isQuadratic = operator === "kuadrat";

				const input2Container = document.getElementById("inputAngka2Container");
				const input3Container = document.getElementById("inputAngka3Container");
				const label1 = document.getElementById("labelAngka1");
				const label2 = document.getElementById("labelAngka2");

				input2Container.style.display = isSingle ? "none" : "block";
				input3Container.style.display = isQuadratic ? "block" : "none";

				if (isQuadratic) {
					label1.textContent = "Nilai a";
					label2.textContent = "Nilai b";
				} else {
					label1.textContent = "Angka 1";
					label2.textContent = "Angka 2";
				}
			}

			function displayHasil(title, value) {
				const hasilDiv = document.getElementById("hasil");
				hasilDiv.innerHTML = `
                <div class="result-box">
                    <p>${title}:</p>
                    <p>${value}</p>
                </div>
            `;
			}

			function kalkulator() {
				const a = parseFloat(document.getElementById("angka1").value);
				const b = parseFloat(document.getElementById("angka2").value);
				const c = parseFloat(document.getElementById("angka3").value);
				const operator = document.getElementById("operator").value;
				let hasil = "";

				if (isNaN(a)) {
					hasil = "Angka pertama (a) tidak valid.";
				} else {
					switch (operator) {
						case "+":
							hasil = a + b;
							break;
						case "-":
							hasil = a - b;
							break;
						case "*":
							hasil = a * b;
							break;
						case "/":
							hasil = b !== 0 ? a / b : "Tidak bisa dibagi 0";
							break;
						case "^":
							hasil = Math.pow(a, b);
							break;
						case "sqrt":
							hasil = a >= 0 ? Math.sqrt(a) : "Input akar tidak valid";
							break;
						case "log":
							hasil = a > 0 ? Math.log10(a) : "Input logaritma tidak valid";
							break;
						case "mod":
							hasil = a % b;
							break;
						case "sin":
							hasil = Math.sin((a * Math.PI) / 180).toFixed(5);
							break;
						case "cos":
							hasil = Math.cos((a * Math.PI) / 180).toFixed(5);
							break;
						case "tan":
							hasil = Math.tan((a * Math.PI) / 180).toFixed(5);
							break;
						case "fact":
							if (a < 0 || !Number.isInteger(a)) {
								hasil = "Faktorial hanya untuk bilangan bulat >= 0";
							} else {
								let f = 1;
								for (let i = 2; i <= a; i++) f *= i;
								hasil = f;
							}
							break;
						case "kuadrat":
							if (isNaN(b) || isNaN(c)) {
								hasil = "Nilai b dan c harus valid.";
							} else if (a === 0) {
								hasil = "Nilai 'a' tidak boleh nol.";
							} else {
								const D = b * b - 4 * a * c;
								if (D < 0) {
									hasil = "Tidak ada akar real (D < 0).";
								} else {
									const x1 = (-b + Math.sqrt(D)) / (2 * a);
									const x2 = (-b - Math.sqrt(D)) / (2 * a);
									hasil = `x1 = ${x1.toFixed(3)}, x2 = ${x2.toFixed(3)}`;
								}
							}
							break;
						default:
							hasil = "Operator tidak valid";
					}
				}

				if (typeof hasil === "number" && isNaN(hasil)) {
					hasil = "Input kedua (b) tidak valid untuk operasi ini.";
				}
				displayHasil("Hasil", hasil);
			}

			function luasTrapesium() {
				const a = parseFloat(document.getElementById("alasAtas").value);
				const b = parseFloat(document.getElementById("alasBawah").value);
				const t = parseFloat(document.getElementById("tinggi").value);

				if (isNaN(a) || isNaN(b) || isNaN(t)) {
					displayHasil("Error", "Mohon masukkan semua nilai yang valid.");
					return;
				}

				const luas = ((a + b) * t) / 2;
				displayHasil("Luas Trapesium", luas);
			}

			function deretBilangan() {
				const jumlah = parseInt(document.getElementById("jumlah").value);
				const awal = parseInt(document.getElementById("awal").value);
				const selisih = parseInt(document.getElementById("selisih").value);

				if (isNaN(jumlah) || isNaN(awal) || isNaN(selisih)) {
					displayHasil("Error", "Mohon masukkan semua nilai yang valid.");
					return;
				}
				if (jumlah < 1) {
					displayHasil("Error", "Jumlah bilangan harus minimal 1.");
					return;
				}
				if (jumlah > 1000) {
					displayHasil(
						"Warning",
						"Untuk performa, jumlah bilangan dibatasi hingga 1000."
					);
					return;
				}

				const arr = [];
				for (let i = 0; i < jumlah; i++) {
					arr.push(awal + i * selisih);
				}
				displayHasil("Deret Bilangan", arr.join(", "));
			}