document.addEventListener('DOMContentLoaded', () => {

    // 1. THEME TOGGLE (Тема: Light / Dark)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('flyora_theme');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
            localStorage.setItem('flyora_theme', currentTheme);
        });
    }

    // 2. FLIGHT SEARCH FORM (Поиск билетов на главной)
    const searchForm = document.getElementById('flightSearch') || document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fromSelect = document.getElementById('from') || document.querySelector('select[name="from"]');
            const toSelect = document.getElementById('to') || document.querySelector('select[name="to"]');

            let fromVal = fromSelect ? fromSelect.value : '';
            let toVal = toSelect ? toSelect.value : '';

            if (!fromVal && fromSelect && fromSelect.selectedIndex >= 0) {
                fromVal = fromSelect.options[fromSelect.selectedIndex].text;
            }
            if (!toVal && toSelect && toSelect.selectedIndex >= 0) {
                toVal = toSelect.options[toSelect.selectedIndex].text;
            }

            const isFromValid = fromVal && !fromVal.toLowerCase().includes('choose');
            const isToValid = toVal && !toVal.toLowerCase().includes('choose');

            if (!isFromValid || !isToValid) {
                alert('Please select both origin and destination cities!');
            } else {
                alert(`Searching flights from ${fromVal} to ${toVal}... Flight options found!`);
            }
        });
    }

    // 3. BOOKING FORM (Страница Flights)
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const passengers = document.getElementById('passengers').value;

            alert(`Thank you, ${name}! Reservation for ${passengers} passenger(s) confirmed.`);
            bookingForm.reset();
        });
    }

    // 4. CONTACT FORM (Страница Contact)
    const contactForm = document.getElementById('contactForm');
    const formNotice = document.getElementById('formNotice');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const topic = document.getElementById('topic').value;

            if (formNotice) {
                formNotice.className = 'form-text text-success mt-2 fw-bold';
                formNotice.textContent = `Thank you, ${name}! Your message regarding "${topic}" has been sent successfully.`;
            } else {
                alert(`Thank you, ${name}! Your message has been sent.`);
            }

            contactForm.reset();
        });
    }

    // 5. FLIGHT SELECT BUTTONS (Кнопки "Select" в карточках билетов)
    const selectButtons = document.querySelectorAll('.flight-list button, article button');
    selectButtons.forEach((button) => {
        button.addEventListener('click', () => {
            alert('Flight selected! Please complete the Quick Reservation form below.');
            const bookingSection = document.getElementById('booking-form');
            if (bookingSection) {
                bookingSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});