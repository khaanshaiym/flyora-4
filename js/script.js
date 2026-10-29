document.addEventListener("DOMContentLoaded", function () {
    function playNotificationSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioCtx = new AudioContext();

            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 нотасы

            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.2);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 0.2);
        } catch (e) {
            console.log("Audio Context blocked or not supported:", e);
        }
    }
    document.querySelectorAll("button, .btn, a").forEach(element => {
        element.addEventListener("click", playNotificationSound);
    });


    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-theme");
    }

    const toggleBtn = document.getElementById("theme-toggle");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", function () {
            document.body.classList.toggle("dark-theme");
            const isDark = document.body.classList.contains("dark-theme");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            toggleBtn.textContent = isDark ? "☀️ Light Theme" : "🌙 Dark Theme";
        });
    }
    const flightsData = [
        { id: 1, airline: "Flyora Air", from: "Astana (NQZ)", to: "Almaty (ALA)", price: 32900, type: "direct", duration: "1h 35m" },
        { id: 2, airline: "Air Astana", from: "Almaty (ALA)", to: "Dubai (DXB)", price: 91500, type: "direct", duration: "4h 15m" },
        { id: 3, airline: "Flyora Air", from: "Astana (NQZ)", to: "Istanbul (IST)", price: 78000, type: "connecting", duration: "6h 45m" },
        { id: 4, airline: "Air Astana", from: "Astana (NQZ)", to: "London (LHR)", price: 185000, type: "connecting", duration: "9h 20m" },
        { id: 5, airline: "Flyora Air", from: "Almaty (ALA)", to: "Antalya (AYT)", price: 84000, type: "direct", duration: "5h 10m" },
        { id: 6, airline: "Air Astana", from: "Shymkent (CIT)", to: "Istanbul (IST)", price: 72000, type: "direct", duration: "4h 50m" },
        { id: 7, airline: "Flyora Air", from: "Astana (NQZ)", to: "Tashkent (TAS)", price: 45000, type: "direct", duration: "1h 55m" }
    ];

    const flightsContainer = document.querySelector("#flightsContainer");

    function renderFlights(filterType = "all") {
        if (!flightsContainer) return;

        let filtered = [];
        switch (filterType) {
            case "direct":
                filtered = flightsData.filter(f => f.type === "direct"); // HOF (.filter)
                break;
            case "cheap":
                filtered = flightsData.filter(f => f.price < 50000);
                break;
            case "all":
            default:
                filtered = [...flightsData];
                break;
        }
        flightsContainer.innerHTML = filtered.map(flight => `
            <div class="card p-4 shadow-sm border-0 rounded-4 d-flex flex-row align-items-center justify-content-between mb-3 animate-fade">
                <div>
                    <h6 class="fw-bold mb-1">${flight.airline}</h6>
                    <p class="text-muted small mb-0">${flight.from} → ${flight.to}</p>
                </div>
                <div class="text-center">
                    <span class="fw-bold d-block">${flight.type.toUpperCase()}</span>
                    <small class="text-muted">${flight.duration}</small>
                </div>
                <div class="text-end">
                    <div class="h5 fw-bold mb-1">₸${flight.price.toLocaleString()}</div>
                    <button class="btn btn-dark btn-sm rounded-pill px-4 dynamic-select-btn">Select</button>
                </div>
            </div>
        `).join("");

        document.querySelectorAll(".dynamic-select-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                alert("Flight successfully chosen!");
            });
        });
    }
    window.renderFlights = renderFlights;
    renderFlights("all");
    const navLinks = Array.from(document.querySelectorAll(".navbar-nav .nav-link, .navbar-nav button, .btn-explore, .navbar-brand"));
    let currentIndex = navLinks.findIndex(el => el.classList.contains("active")) || 0;
    if (currentIndex < 0) currentIndex = 0;

    if (navLinks.length > 0) {
        window.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                currentIndex = (currentIndex + 1) % navLinks.length;
                navLinks[currentIndex].focus();
            }
            else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                currentIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
                navLinks[currentIndex].focus();
            }
            else if (e.key === "Enter") {
                const activeEl = document.activeElement;
                if (activeEl && (activeEl.tagName === 'A' || activeEl.tagName === 'BUTTON')) {
                    const href = activeEl.getAttribute("href");
                    if (href) {
                        window.location.href = href;
                    } else {
                        activeEl.click();
                    }
                }
            }
        });
    }

    const contactForm = document.querySelector("#contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const emailInput = document.querySelector("#email");
            const passInput = document.querySelector("#password");
            const errorMsg = document.querySelector("#errorMsg");

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput && !emailRegex.test(emailInput.value)) {
                if (errorMsg) errorMsg.innerText = "Please enter a valid email address.";
                return;
            }
            if (passInput) {
                const passValue = passInput.value;
                if (!passValue || passValue.trim() === "" || passValue.length < 6) {
                    if (errorMsg) errorMsg.innerText = "Password must be at least 6 characters long and cannot be empty spaces.";
                    return;
                }
            }

            if (errorMsg) errorMsg.innerText = "";
            alert("Reservation submitted successfully!");
            contactForm.reset();
        });
    }

    const accButtons = document.querySelectorAll(".accordion-btn");
    accButtons.forEach(button => {
        button.addEventListener("click", function() {
            const content = this.nextElementSibling;
            if (content) {
                content.classList.toggle("open");
                const spanIcon = this.querySelector("span");
                if (spanIcon) {
                    spanIcon.textContent = content.classList.contains("open") ? "-" : "+";
                }
            }
        });
    });

    const popupModal = document.getElementById("popupModal");
    const openPopupBtn = document.getElementById("openPopupBtn");
    const closePopupBtn = document.getElementById("closePopupBtn");

    if (openPopupBtn && popupModal) {
        openPopupBtn.addEventListener("click", () => {
            popupModal.style.display = "block";
        });
    }

    if (closePopupBtn && popupModal) {
        closePopupBtn.addEventListener("click", () => {
            popupModal.style.display = "none";
        });
    }

    window.addEventListener("click", (e) => {
        if (popupModal && e.target === popupModal) {
            popupModal.style.display = "none";
        }
    });

    const bgColors = ["#faf7f5", "#e3f2fd", "#e8f5e9", "#fff3e0", "#f3e5f5"];
    let colorIdx = 0;
    const colorBtn = document.getElementById("changeBgBtn");

    if (colorBtn) {
        colorBtn.addEventListener("click", () => {
            colorIdx = (colorIdx + 1) % bgColors.length;
            document.body.style.backgroundColor = bgColors[colorIdx];
        });
    }

    function updateLiveClock() {
        const clockEl = document.getElementById("liveClock");
        if (clockEl) {
            const now = new Date();
            const options = {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
            clockEl.innerText = now.toLocaleDateString('en-US', options);
        }
    }

    setInterval(updateLiveClock, 1000);
    updateLiveClock();
});