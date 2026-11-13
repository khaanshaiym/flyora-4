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
            // Переходим к следующей вкладке (с цикличным возвратом к началу)
            currentIndex = (currentIndex + 1) % navLinks.length;
            window.location.href = navLinks[currentIndex].href;
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            // Переходим к предыдущей вкладке
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

    const toggleBtn = document.getElementById("theme-toggle");
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-theme");
        if (toggleBtn) toggleBtn.textContent = "Light Theme";
    } else {
        document.body.classList.remove("dark-theme");
        if (toggleBtn) toggleBtn.textContent = "Toggle Theme";
    }

    if (toggleBtn) {
        toggleBtn.addEventListener("click", function () {
            document.body.classList.toggle("dark-theme");
            const isDark = document.body.classList.contains("dark-theme");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            toggleBtn.textContent = isDark ? "Light Theme" : "Toggle Theme";


            if (isDark) {
                document.body.style.backgroundColor = "";
            } else {
                const savedBgColor = localStorage.getItem("customBgColor");
                if (savedBgColor) document.body.style.backgroundColor = savedBgColor;
            }
        });
    }


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


    document.querySelectorAll("form").forEach(form => {
        if (form.id === "flightSearchForm") return;
        form.addEventListener("submit", function (e) {
            const btn = this.querySelector('button[type="submit"]');
            if (btn && !btn.classList.contains("loading")) {
                e.preventDefault();
                const originalText = btn.innerHTML;
                btn.classList.add("loading");
                btn.disabled = true;
                btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Please wait...';

                setTimeout(() => {
                    btn.classList.remove("loading");
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                    if (window.showToast) window.showToast("Action completed successfully!");
                }, 1500);
            }
        });
    });

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
});

// ==========================================
// 11. JQUERY ФУНКЦИИ (ПРОГРЕСС СКРОЛЛА, СЧЕТЧИКИ, TOAST)
// ==========================================
function runJQueryFeatures() {
    if (typeof jQuery === "undefined") {
        setTimeout(runJQueryFeatures, 100);
        return;
    }

    $(document).ready(function () {
        // Прогресс скролла
        if ($('#scroll-progress').length === 0) {
            $('body').prepend('<div id="scroll-progress" style="position:fixed; top:0; left:0; height:5px; background:linear-gradient(90deg, #3b173d, #d8b47c); width:0%; z-index:9999;"></div>');
        }
        $(window).on('scroll', function () {
            const sTop = $(window).scrollTop();
            const dHeight = $(document).height() - $(window).height();
            const progress = dHeight > 0 ? (sTop / dHeight) * 100 : 0;
            $('#scroll-progress').css('width', progress + '%');
        });

        // Анимация счетчиков (с исправленной формулой)
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

        // Toast уведомления
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
// ==========================================
// 12. TASK 3: SEARCH HIGHLIGHTING (ПОДСВЕТКА ПОИСКА)
// ==========================================
// Создаем поле поиска для подсветки, если его нет, или ищем существующий input
const highlightInput = document.querySelector("#highlightInput");
const highlightBtn = document.querySelector("#highlightSearchBtn");

if (highlightInput && highlightBtn) {
    highlightBtn.addEventListener("click", function () {
        const keyword = highlightInput.value.trim();

        // Сначала убираем старую подсветку
        removeHighlights();

        if (!keyword) return;

        // Ищем совпадения в текстовых узлах и оборачиваем в тег <mark>
        highlightTextInElement(document.body, keyword);
    });
}

function highlightTextInElement(element, keyword) {
    const regex = new RegExp(`(${keyword})`, "gi");

    // Рекурсивно обходим дочерние элементы страницы (исключая скрипты, стили и саму панель поиска)
    $(element).find(":not(script, style, noscript, header, nav)").contents().each(function() {
        if (this.nodeType === 3) { // Текстовый узел
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

// ==========================================
// 13. TASK 9: IMAGE LAZY LOADING
// ==========================================
function checkLazyImages() {
    const $lazyImages = $("img[data-src]");
    const windowHeight = $(window).height();
    const scrollTop = $(window).scrollTop();

    $lazyImages.each(function () {
        const $img = $(this);
        // Если картинка приближается к области видимости (с запасом в 300px)
        if ($img.offset().top < scrollTop + windowHeight + 300) {
            if (!$img.attr('src')) {
                $img.attr('src', $img.attr('data-src'));
                $img.hide().fadeIn(600); // Плавное появление при загрузке
            }
        }
    });
}

// Запускаем при скролле и при загрузке страницы
$(window).on("scroll load", checkLazyImages);
// Первичный вызов на случай, если картинки уже в зоне видимости
checkLazyImages();
runJQueryFeatures();