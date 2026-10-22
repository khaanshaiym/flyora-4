document.addEventListener("DOMContentLoaded", function () {


    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-theme");
    }

    const toggleBtn = document.getElementById("theme-toggle");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", function () {
            document.body.classList.toggle("dark-theme");
            if (document.body.classList.contains("dark-theme")) {
                localStorage.setItem("theme", "dark");
            } else {
                localStorage.setItem("theme", "light");
            }
        });
    }

    // ==========================================
    // 2. TASK 1: FORM VALIDATION
    // ==========================================
    const contactForm = document.querySelector("#contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Предотвращаем стандартную отправку для проверки

            const emailInput = document.querySelector("#email");
            const passInput = document.querySelector("#password");
            const errorMsg = document.querySelector("#errorMsg");


            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput && !emailRegex.test(emailInput.value)) {
                if (errorMsg) errorMsg.innerText = "Please enter a valid email address.";
                return;
            }


            if (passInput && passInput.value.length < 6) {
                if (errorMsg) errorMsg.innerText = "Password must be at least 6 characters long.";
                return;
            }


            if (errorMsg) errorMsg.innerText = "";
            alert("Form submitted successfully!");
            contactForm.reset();
        });
    }

    const accButtons = document.querySelectorAll(".accordion-btn");
    accButtons.forEach(button => {
        button.addEventListener("click", () => {
            const content = button.nextElementSibling;
            if (content) {
                if (content.style.display === "block") {
                    content.style.display = "none";
                } else {
                    content.style.display = "block";
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