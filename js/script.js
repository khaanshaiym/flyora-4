
document.addEventListener("DOMContentLoaded", function () {
    console.log("Flyora script initialized successfully!");
    document.addEventListener("keydown", function (e) {
        if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
            return;
        }

        const navLinks = Array.from(document.querySelectorAll(".navbar-nav .nav-link"));
        if (navLinks.length === 0) return;

        let currentIndex = navLinks.findIndex(link => link.classList.contains("active"));
        if (currentIndex === -1) currentIndex = 0;

        if (e.key === "ArrowRight") {
            e.preventDefault();
            currentIndex = (currentIndex + 1) % navLinks.length;
            window.location.href = navLinks[currentIndex].href;
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            currentIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
            window.location.href = navLinks[currentIndex].href;
        }
    });

    const changeBgBtn = document.getElementById("changeBgBtn");
    const savedBgColor = localStorage.getItem("customBgColor");
    if (savedBgColor && !document.body.classList.contains("dark-theme")) {
        document.body.style.backgroundColor = savedBgColor;
    }

    if (changeBgBtn) {
        const bgColors = ["#faf7f5", "#f0e6f2", "#e2d5e5", "#fcf4d9", "#e3f2fd", "#e8f5e9"];
        let colorIndex = 0;

        changeBgBtn.addEventListener("click", function () {
            if (!document.body.classList.contains("dark-theme")) {
                colorIndex = (colorIndex + 1) % bgColors.length;
                const newColor = bgColors[colorIndex];
                document.body.style.backgroundColor = newColor;
                localStorage.setItem("customBgColor", newColor);
                if (window.showToast) window.showToast("Background color changed & saved!");
            } else {
                if (window.showToast) window.showToast("Switch to light theme to change custom colors!");
            }
        });
    }


    const toggleBtns = document.querySelectorAll(".theme-toggle-btn, #theme-toggle");
    const isDarkTheme = localStorage.getItem("theme") === "dark";

    if (isDarkTheme) {
        document.body.classList.add("dark-theme");
        toggleBtns.forEach(btn => btn.textContent = "Light Theme");
    } else {
        document.body.classList.remove("dark-theme");
        toggleBtns.forEach(btn => btn.textContent = "Toggle Theme");
    }

    toggleBtns.forEach(toggleBtn => {
        toggleBtn.addEventListener("click", function () {
            document.body.classList.toggle("dark-theme");
            const isDark = document.body.classList.contains("dark-theme");
            localStorage.setItem("theme", isDark ? "dark" : "light");

            toggleBtns.forEach(b => b.textContent = isDark ? "Light Theme" : "Toggle Theme");

            if (isDark) {
                document.body.style.backgroundColor = "";
            } else {
                const savedBgColor = localStorage.getItem("customBgColor");
                if (savedBgColor) document.body.style.backgroundColor = savedBgColor;
            }
        });
    });


    const clockEl = document.getElementById("liveClock");
    if (clockEl) {
        setInterval(() => {
            const now = new Date();
            clockEl.textContent = now.toLocaleDateString() + " " + now.toLocaleTimeString();
        }, 1000);
    }


    const accButtons = document.querySelectorAll(".accordion-btn");
    accButtons.forEach(button => {
        button.addEventListener("click", function () {
            const content = this.nextElementSibling;
            if (content) {
                content.classList.toggle("open");
                const spanIcon = this.querySelector("span");
                if (spanIcon) spanIcon.textContent = content.classList.contains("open") ? "−" : "+";
            }
        });
    });


    const readMoreBtn = document.getElementById("readMoreBtn");
    const moreGuidanceText = document.getElementById("moreGuidanceText");
    if (readMoreBtn && moreGuidanceText) {
        readMoreBtn.addEventListener("click", function () {
            if (moreGuidanceText.style.display === "none" || !moreGuidanceText.style.display) {
                moreGuidanceText.style.display = "inline";
                readMoreBtn.textContent = "Read Less";
            } else {
                moreGuidanceText.style.display = "none";
                readMoreBtn.textContent = "Read More";
            }
        });
    }


    const stars = document.querySelectorAll(".rating-star");
    const ratingText = document.getElementById("ratingValueText");
    stars.forEach((star, index) => {
        star.addEventListener("click", () => {
            const val = index + 1;
            stars.forEach((s, i) => { s.style.color = i < val ? "#ffc107" : "#ccc"; });
            if (ratingText) ratingText.textContent = `You rated us ${val} out of 5 stars! Thank you!`;
            if (window.showToast) window.showToast(`Thank you for your ${val}-star rating!`);
        });
    });


    const openPopupBtn = document.getElementById("openPopupBtn");
    const closePopupBtn = document.getElementById("closePopupBtn");
    const popupModal = document.getElementById("popupModal");

    if (openPopupBtn && popupModal) openPopupBtn.addEventListener("click", () => { popupModal.style.display = "block"; });
    if (closePopupBtn && popupModal) closePopupBtn.addEventListener("click", () => { popupModal.style.display = "none"; });


    const copyBtn = document.querySelector(".copy-btn");
    if (copyBtn) {
        copyBtn.addEventListener("click", function () {
            const textToCopy = this.getAttribute("data-clipboard-text") || "FLYORA2026";
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalHTML = this.innerHTML;
                this.innerHTML = "✓ Copied to clipboard!";
                if (window.showToast) {
                    window.showToast("Promocode copied successfully!");
                } else {
                    alert("Promocode copied successfully!");
                }
                setTimeout(() => { this.innerHTML = originalHTML; }, 2000);
            });
        });
    }


    const flightSearchForm = document.getElementById("flightSearchForm");
    if (flightSearchForm) {
        flightSearchForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const selects = this.querySelectorAll("select");
            const fromVal = selects[0] ? selects[0].value : "";
            const toVal = selects[1] ? selects[1].value : "";

            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Searching...';

                setTimeout(() => {
                    const searchParams = new URLSearchParams();
                    if (fromVal) searchParams.append("from", fromVal);
                    if (toVal) searchParams.append("to", toVal);
                    window.location.href = `flights.html?${searchParams.toString()}`;
                }, 1000);
            }
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
    const urlParams = new URLSearchParams(window.location.search);
    const urlFrom = urlParams.get("from") ? urlParams.get("from").toLowerCase() : "";
    const urlTo = urlParams.get("to") ? urlParams.get("to").toLowerCase() : "";

    window.renderFlights = function(filterType = "all") {
        if (!flightsContainer) return;

        const searchInput = document.querySelector("#liveSearchInput");
        const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : "";

        let filtered = flightsData.filter(flight => {
            if (filterType === "direct") return flight.type === "direct";
            if (filterType === "cheap") return flight.price < 50000;
            return true;
        });

        if (searchQuery !== "") {
            filtered = filtered.filter(flight => {
                const text = `${flight.airline} ${flight.from} ${flight.to} ${flight.type} ${flight.price}`.toLowerCase();
                return text.includes(searchQuery);
            });
        } else if (urlFrom || urlTo) {
            filtered = filtered.filter(flight => {
                const matchFrom = urlFrom ? flight.from.toLowerCase().includes(urlFrom) : true;
                const matchTo = urlTo ? flight.to.toLowerCase().includes(urlTo) : true;
                return matchFrom && matchTo;
            });
        }

        if (filtered.length === 0) {
            flightsContainer.innerHTML = `<div class="card p-4 text-center border-0 rounded-4 shadow-sm"><p class="text-muted mb-0">No flights found matching your query.</p></div>`;
            return;
        }

        flightsContainer.innerHTML = filtered.map(flight => `
            <div class="card p-4 shadow-sm border-0 rounded-4 d-flex flex-row align-items-center justify-content-between mb-3">
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
                if (window.showToast) window.showToast("Flight selected successfully!");
            });
        });
    }

    if (flightsContainer) renderFlights("all");

    const liveSearchInput = document.querySelector("#liveSearchInput");
    if (liveSearchInput) {
        liveSearchInput.addEventListener("keyup", () => renderFlights("all"));
    }


    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            let isValid = true;

            const nameEl = document.getElementById("name");
            const emailEl = document.getElementById("email");
            const msgEl = document.getElementById("message");

            document.getElementById("contactNameError").textContent = "";
            document.getElementById("contactEmailError").textContent = "";
            document.getElementById("contactMessageError").textContent = "";

            if (!nameEl.value.trim()) {
                document.getElementById("contactNameError").textContent = "Please enter your name.";
                isValid = false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailEl.value.trim() || !emailRegex.test(emailEl.value)) {
                document.getElementById("contactEmailError").textContent = "Please enter a valid email address.";
                isValid = false;
            }

            if (!msgEl.value.trim()) {
                document.getElementById("contactMessageError").textContent = "Message cannot be empty.";
                isValid = false;
            }

            if (!isValid) return;

            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';

            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalText;
                contactForm.reset();
                if (window.showToast) window.showToast("Message sent successfully!");
            }, 1000);
        });
    }


    const navAuthLink = document.getElementById("navAuthLink");
    if (navAuthLink) {
        const currentUser = JSON.parse(localStorage.getItem("flyoraUser"));
        if (currentUser) {
            navAuthLink.textContent = "Profile";
            navAuthLink.href = "profile.html";
        }
    }


    const authForm = document.getElementById("authForm");
    let isSignUp = false;
    const switchBtn = document.getElementById("switchAuthMode");
    const nameContainer = document.getElementById("nameFieldContainer");
    const submitBtn = document.getElementById("authSubmitBtn");

    if (switchBtn && nameContainer && submitBtn) {
        nameContainer.style.display = "none";
        switchBtn.addEventListener("click", () => {
            isSignUp = !isSignUp;
            nameContainer.style.display = isSignUp ? "block" : "none";
            submitBtn.textContent = isSignUp ? "Sign Up" : "Log In";
            switchBtn.textContent = isSignUp ? "Already have an account? Log In" : "Don't have an account? Sign Up";
        });
    }

    if (authForm) {
        authForm.addEventListener("submit", function (e) {
            e.preventDefault();
            let isValid = true;

            const nameInput = document.getElementById("authName");
            const emailInput = document.getElementById("authEmail");
            const passInput = document.getElementById("authPassword");
            const phoneInput = document.getElementById("authPhone");

            document.querySelectorAll(".invalid-feedback").forEach(el => el.textContent = "");
            document.querySelectorAll(".form-control").forEach(el => el.classList.remove("is-invalid"));

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
                document.getElementById("emailError").textContent = "Please enter a valid email address.";
                emailInput.classList.add("is-invalid");
                isValid = false;
            }

            if (!passInput.value || passInput.value.length < 6) {
                document.getElementById("passwordError").textContent = "Password must be at least 6 characters long.";
                passInput.classList.add("is-invalid");
                isValid = false;
            }

            if (phoneInput && !phoneInput.value.trim()) {
                document.getElementById("phoneError").textContent = "Phone number is required.";
                phoneInput.classList.add("is-invalid");
                isValid = false;
            }

            if (isSignUp && nameInput && !nameInput.value.trim()) {
                document.getElementById("nameError").textContent = "Name is required.";
                nameInput.classList.add("is-invalid");
                isValid = false;
            }

            if (!isValid) return;

            const userData = {
                name: isSignUp ? nameInput.value : "Flyora Traveler",
                email: emailInput.value,
                phone: phoneInput ? phoneInput.value : "+7 (700) 000-00-00"
            };

            localStorage.setItem("flyoraUser", JSON.stringify(userData));
            if (window.showToast) window.showToast("Authentication successful! Redirecting...");
            setTimeout(() => {
                window.location.href = "profile.html";
            }, 1000);
        });
    }


    if (window.location.pathname.includes("profile.html")) {
        const storedUser = JSON.parse(localStorage.getItem("flyoraUser"));
        if (!storedUser) {
            window.location.href = "login.html";
        } else {
            document.getElementById("profileName").textContent = storedUser.name;
            document.getElementById("profileEmail").textContent = storedUser.email;
            document.getElementById("profilePhone").textContent = storedUser.phone;
            document.getElementById("profileAvatar").textContent = storedUser.name.charAt(0).toUpperCase();
        }

        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                localStorage.removeItem("flyoraUser");
                window.location.href = "index.html";
            });
        }
    }


    const apiContainer = document.getElementById("externalApiContainer");
    if (apiContainer) {
        apiContainer.innerHTML = `<div class="text-center py-3"><div class="spinner-border spinner-border-sm" role="status"></div> Loading live weather...</div>`;

        fetch("https://api.open-meteo.com/v1/forecast?latitude=51.1694&longitude=71.4491&current_weather=true")
            .then(res => {
                if (!res.ok) throw new Error("Weather API error");
                return res.json();
            })
            .then(data => {
                const weather = data.current_weather;
                const temp = Math.round(weather.temperature);
                const wind = weather.windspeed;

                apiContainer.innerHTML = `
                    <div class="d-flex align-items-center justify-content-between text-start">
                        <div>
                            <h6 class="fw-bold mb-1">🌤️ Live Weather in Astana (NQZ)</h6>
                            <p class="text-muted small mb-0">Wind speed: ${wind} km/h | Flight conditions: Good</p>
                        </div>
                        <div class="text-end">
                            <span class="h4 fw-bold mb-0 d-block">${temp > 0 ? '+' + temp : temp}°C</span>
                            <span class="badge bg-success rounded-pill">Live API</span>
                        </div>
                    </div>
                `;
            })
            .catch(() => {
                apiContainer.innerHTML = `
                    <div class="d-flex align-items-center justify-content-between text-start">
                        <div>
                            <h6 class="fw-bold mb-1">🌍 Flyora Global Network</h6>
                            <p class="text-muted small mb-0">Active Hub: Astana (NQZ) | Status: Operational</p>
                        </div>
                        <span class="badge bg-primary px-3 py-2 rounded-pill">Online 24/7</span>
                    </div>
                `;
            });
    }


    const highlightInput = document.querySelector("#highlightInput");
    const highlightBtn = document.querySelector("#highlightSearchBtn");

    if (highlightInput && highlightBtn) {
        highlightBtn.addEventListener("click", function () {
            const keyword = highlightInput.value.trim();
            removeHighlights();
            if (!keyword) return;
            highlightTextInElement(document.body, keyword);
        });
    }

    function highlightTextInElement(element, keyword) {
        const regex = new RegExp(`(${keyword})`, "gi");
        $(element).find(":not(script, style, noscript, header, nav)").contents().each(function() {
            if (this.nodeType === 3) {
                let text = this.nodeValue;
                if (regex.test(text)) {
                    let newHtml = text.replace(regex, '<mark class="search-highlight">$1</mark>');
                    let $wrapper = $("<span>").html(newHtml);
                    $(this).replaceWith($wrapper);
                }
            }
        });
    }

    function removeHighlights() {
        $("mark.search-highlight").each(function () {
            let parent = this.parentNode;
            parent.replaceChild(document.createTextNode(this.textContent), this);
            parent.normalize();
        });
    }

    function checkLazyImages() {
        const $lazyImages = $("img[data-src]");
        const windowHeight = $(window).height();
        const scrollTop = $(window).scrollTop();

        $lazyImages.each(function () {
            const $img = $(this);
            if ($img.offset().top < scrollTop + windowHeight + 300) {
                if (!$img.attr('src')) {
                    $img.attr('src', $img.attr('data-src'));
                    $img.hide().fadeIn(600);
                }
            }
        });
    }

    $(window).on("scroll load", checkLazyImages);
    checkLazyImages();
});


function runJQueryFeatures() {
    if (typeof jQuery === "undefined") {
        setTimeout(runJQueryFeatures, 100);
        return;
    }

    $(document).ready(function () {
        if ($('#scroll-progress').length === 0) {
            $('body').prepend('<div id="scroll-progress" style="position:fixed; top:0; left:0; height:5px; background:linear-gradient(90deg, #3b173d, #d8b47c); width:0%; z-index:9999;"></div>');
        }
        $(window).on('scroll', function () {
            const sTop = $(window).scrollTop();
            const dHeight = $(document).height() - $(window).height();
            const progress = dHeight > 0 ? (sTop / dHeight) * 100 : 0;
            $('#scroll-progress').css('width', progress + '%');
        });

        let counted = false;
        $(window).on('scroll', function () {
            const $statsSection = $('#stats-section');
            if ($statsSection.length && !counted) {
                const oTop = $statsSection.offset().top - window.innerHeight;
                if ($(window).scrollTop() > oTop) {
                    $('.counter').each(function () {
                        const $this = $(this);
                        const countTo = parseInt($this.attr('data-count')) || 100;
                        $({ countNum: 0 }).animate({ countNum: countTo }, {
                            duration: 2000,
                            easing: 'swing',
                            step: function () { $this.text(Math.floor(this.countNum)); },
                            complete: function () { $this.text(this.countNum + "+"); }
                        });
                    });
                    counted = true;
                }
            }
        });

        window.showToast = function (message) {
            const $toast = $(`
                <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1100;">
                    <div class="toast show align-items-center bg-dark border-0 shadow-lg" role="alert">
                        <div class="d-flex">
                            <div class="toast-body fw-semibold">✨ ${message}</div>
                            <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"></button>
                        </div>
                    </div>
                </div>
            `).appendTo('body');
            setTimeout(() => { $toast.fadeOut(500, function () { $(this).remove(); }); }, 3000);
        };
    });
}
runJQueryFeatures();