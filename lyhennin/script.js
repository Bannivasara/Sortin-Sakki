document.addEventListener('DOMContentLoaded', () => {
    const lomake = document.getElementById('lyhennin-lomake');
    const tulosAlue = document.getElementById('tulos-alue');
    const urlInput = document.getElementById('lyhennetty-url');
    const kopioiBtn = document.getElementById('kopioi-btn');
    const uusiBtn = document.getElementById('uusi-btn');

    // Funktio statsien hakuun
    async function paivitaStatsit() {
        try {
            const res = await fetch('https://soro.la/get-stats');
            const data = await res.json();
            document.getElementById('stat-linkit').innerText = data.created;
            document.getElementById('stat-klikit').innerText = data.clicks;
        } catch (e) {}
    }
    paivitaStatsit();

    // Lähetys
    lomake.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = lomake.querySelector('button');
        btn.innerText = "Hetki...";

        try {
            const res = await fetch('https://soro.la', {
                method: 'POST',
                body: new FormData(lomake)
            });

            if (res.ok) {
                const id = await res.text();
                // Piilota lomake ja näytä tulos
                lomake.style.display = 'none';
                tulosAlue.style.display = 'block';
                urlInput.value = "soro.la/" + id;
                paivitaStatsit();
            }
        } catch (e) { alert("Virhe!"); }
        btn.innerText = "Lyhennä linkki";
    });

    // KOPIOI-NAPPI
    kopioiBtn.addEventListener('click', () => {
        urlInput.select();
        navigator.clipboard.writeText(urlInput.value);
        kopioiBtn.innerText = "Kopioitu!";
        kopioiBtn.style.background = "#2e7d32";
        setTimeout(() => {
            kopioiBtn.innerText = "Kopioi";
            kopioiBtn.style.background = "#4CAF50";
        }, 2000);
    });

    // UUSI-NAPPI
    uusiBtn.addEventListener('click', () => {
        tulosAlue.style.display = 'none';
        lomake.style.display = 'block';
        lomake.reset();
    });
});
