$(document).ready(function () {
    console.log("Assignment 6 jQuery script loaded successfully!");


    if ($('#scroll-progress').length === 0) {
        $('body').prepend('<div id="scroll-progress" style="position:fixed; top:0; left:0; height:5px; background:linear-gradient(90deg, #3b173d, #d8b47c); width:0%; z-index:9999; transition: width 0.05s ease;"></div>');
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
                    $({ countNum: 0 }).animate({
                        countNum: countTo
                    }, {
                        duration: 2000,
                        easing: 'swing',
                        step: function () {
                            $this.text(Math.floor(this.countNum));
                        },
                        complete: function () {
                            $this.text(this.countNum + "+");
                        }
                    });
                });
                counted = true;
            }
        }
    });


    $('form').on('submit', function (e) {
        const $btn = $(this).find('button[type="submit"]');
        if ($btn.length && !$btn.hasClass('loading')) {
            const originalText = $btn.html();
            $btn.addClass('loading').prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Please wait...');

            setTimeout(() => {
                $btn.removeClass('loading').prop('disabled', false).html(originalText);
                if (window.showToast) {
                    window.showToast("Action completed successfully!");
                }
            }, 2000);
        }
    });


    window.showToast = function (message) {
        const $toast = $(`
            <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1100;">
                <div class="toast show align-items-center text-white bg-dark border-0 shadow-lg" role="alert">
                    <div class="d-flex">
                        <div class="toast-body fw-semibold">✨ ${message}</div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                    </div>
                </div>
            </div>
        `).appendTo('body');

        setTimeout(() => {
            $toast.fadeOut(500, function () {
                $(this).remove();
            });
        }, 3000);
    };


    $(document).on('click', '.copy-btn', function () {
        const textToCopy = $(this).attr('data-clipboard-text') || "FLYORA2026";
        navigator.clipboard.writeText(textToCopy).then(() => {
            const $btn = $(this);
            const originalHTML = $btn.html();
            $btn.html('✓ Copied to clipboard!');
            if (window.showToast) {
                window.showToast("Promocode copied successfully!");
            }
            setTimeout(() => {
                $btn.html(originalHTML);
            }, 2000);
        });
    });


    $(window).on('scroll load', function () {
        $('img[data-src]').each(function () {
            const $img = $(this);
            if ($img.offset().top < $(window).scrollTop() + $(window).height() + 300) {
                if (!$img.attr('src')) {
                    $img.attr('src', $img.attr('data-src'));
                }
            }
        });
    });


    const suggestions = ["Astana", "Almaty", "Dubai", "Istanbul", "London", "Antalya", "Tashkent"];
    $('#liveSearchInput').on('input', function () {
        const val = $(this).val().toLowerCase();
        let $dropdown = $('#autocomplete-list');

        if ($dropdown.length === 0) {
            $dropdown = $('<div id="autocomplete-list" class="position-absolute bg-white shadow rounded-3 w-100 mt-1 overflow-hidden" style="z-index: 1000;"></div>');
            $(this).parent().css('position', 'relative').append($dropdown);
        }

        $dropdown.empty();
        if (!val) return;

        const matches = suggestions.filter(item => item.toLowerCase().includes(val));
        matches.forEach(match => {
            $dropdown.append(`<div class="p-2 border-bottom suggestion-item" style="cursor: pointer; color: #000;">${match}</div>`);
        });

        $('.suggestion-item').on('click', function () {
            $('#liveSearchInput').val($(this).text()).trigger('keyup');
            $dropdown.empty();
        });
    });


    $('#highlightSearchBtn').on('click', function () {
        const keyword = $('#highlightInput').val().trim();

        $('mark.search-highlight').each(function () {
            $(this).replaceWith($(this).text());
        });

        if (!keyword) return;

        let foundCount = 0;
        $('main p, main h1, main h2, main h3, main h4, main h5, main h6, .card').each(function () {
            const $el = $(this);
            const html = $el.html();

            const regex = new RegExp(`(${keyword})`, 'gi');
            if (regex.test(html)) {
                const newHtml = html.replace(regex, '<mark class="search-highlight bg-warning text-dark px-1 rounded">$1</mark>');
                $el.html(newHtml);
                foundCount++;
            }
        });

        if (window.showToast) {
            window.showToast(`Highlighted matches found: ${foundCount}`);
        }
    });

});


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
            osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);

            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.2);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 0.2);
        } catch (e) {
            console.log("Audio Context blocked:", e);
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
    let currentFilter = "all";

    function renderFlights(filterType = "all") {
        if (!flightsContainer) return;
        currentFilter = filterType;

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
        }

        if (filtered.length === 0) {
            flightsContainer.innerHTML = `<div class="card p-4 text-center border-0 rounded-4 shadow-sm"><p class="text-muted mb-0">No flights found matching your query.</p></div>`;
            return;
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
                if (window.showToast) {
                    window.showToast("Flight selected successfully!");
                } else {
                    alert("Flight successfully chosen!");
                }
            });
        });
    }

    window.renderFlights = renderFlights;
    renderFlights("all");


    const liveSearchInput = document.querySelector("#liveSearchInput");
    if (liveSearchInput) {
        liveSearchInput.addEventListener("keyup", function () {
            renderFlights(currentFilter);
        });
    }


    const navLinks = Array.from(document.querySelectorAll(".navbar-nav .nav-link, .navbar-nav button, .btn-explore, .navbar-brand"));
    let currentIndex = navLinks.findIndex(el => el.classList.contains("active")) || 0;
    if (currentIndex < 0) currentIndex = 0;

    if (navLinks.length > 0) {
        window.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                currentIndex = (currentIndex + 1) % navLinks.length;
                navLinks[currentIndex].focus();
            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                currentIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
                navLinks[currentIndex].focus();
            } else if (e.key === "Enter") {
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


    const readMoreBtn = document.getElementById("readMoreBtn");
    const moreGuidanceText = document.getElementById("moreGuidanceText");

    if (readMoreBtn && moreGuidanceText) {
        readMoreBtn.addEventListener("click", function () {
            if (moreGuidanceText.style.display === "none" || moreGuidanceText.style.display === "") {
                moreGuidanceText.style.display = "inline";
                readMoreBtn.innerText = "Read Less";
            } else {
                moreGuidanceText.style.display = "none";
                readMoreBtn.innerText = "Read More";
            }
        });
    }


    const stars = document.querySelectorAll(".rating-star");
    const ratingValueText = document.getElementById("ratingValueText");

    stars.forEach(star => {
        star.addEventListener("click", function () {
            const val = parseInt(this.getAttribute("data-value"));
            stars.forEach((s, idx) => {
                if (idx < val) {
                    s.style.color = "#ffc107";
                    s.classList.add("fw-bold");
                } else {
                    s.style.color = "#ccc";
                    s.classList.remove("fw-bold");
                }
            });
            if (ratingValueText) {
                ratingValueText.innerText = `You rated this service ${val} out of 5 stars. Thank you!`;
            }
            if (window.showToast) {
                window.showToast(`Rating submitted: ${val} stars!`);
            }
        });
    });


    let currentStep = 1;

    function showStep(step) {
        const steps = document.querySelectorAll(".form-step");
        steps.forEach((s, index) => {
            if (index + 1 === step) {
                s.classList.remove("d-none");
            } else {
                s.classList.add("d-none");
            }
        });

        for (let i = 1; i <= 3; i++) {
            const indicator = document.getElementById(`step${i}-indicator`);
            if (indicator) {
                indicator.className = (i === step) ? "badge bg-dark rounded-circle p-2" : "badge bg-secondary rounded-circle p-2";
            }
        }
    }

    document.querySelectorAll(".next-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            if (currentStep < 3) {
                currentStep++;
                showStep(currentStep);
            }
        });
    });

    document.querySelectorAll(".prev-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });

    const multiStepForm = document.getElementById("multiStepForm");
    if (multiStepForm) {
        multiStepForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (window.showToast) {
                window.showToast("Multi-step booking submitted!");
            } else {
                alert("Reservation completed!");
            }
            currentStep = 1;
            showStep(currentStep);
            multiStepForm.reset();
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
                    if (errorMsg) errorMsg.innerText = "Password must be at least 6 characters long.";
                    return;
                }
            }

            if (errorMsg) errorMsg.innerText = "";
            if (window.showToast) {
                window.showToast("Form submitted successfully!");
            } else {
                alert("Submitted successfully!");
            }
            contactForm.reset();
        });
    }



    const accButtons = document.querySelectorAll(".accordion-btn");
    accButtons.forEach(button => {
        button.addEventListener("click", function () {
            const content = this.nextElementSibling;
            if (content) {
                // Закрываем другие открытые пункты FAQ для чистоты (необязательно, но смотрится отлично)
                document.querySelectorAll(".accordion-content").forEach(item => {
                    if (item !== content) {
                        item.classList.remove("open");
                        const prevBtn = item.previousElementSibling;
                        if (prevBtn) {
                            const icon = prevBtn.querySelector("span");
                            if (icon) icon.textContent = "+";
                        }
                    }
                });

                content.classList.toggle("open");
                const spanIcon = this.querySelector("span");
                if (spanIcon) {
                    spanIcon.textContent = content.classList.contains("open") ? "−" : "+";
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