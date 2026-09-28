document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('flyora_theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('flyora_theme', 'dark');
            } else {
                localStorage.setItem('flyora_theme', 'light');
            }
        });
    }
    // 2. FLIGHT SEARCH ALERT
    const searchForm = document.getElementById('flightSearch') || document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Беттің қайта жүктелуін тоқтату
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

});