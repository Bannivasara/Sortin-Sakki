document.addEventListener('DOMContentLoaded', () => {
    const lomake = document.getElementById('lyhennin-lomake');
    const tulosAlue = document.getElementById('tulos-alue');
    const urlInput = document.getElementById('lyhennetty-url');
    const kopioiBtn = document.getElementById('kopioi-btn');
    const uusiBtn = document.getElementById('uusi-linkki-btn');
    const kopioituViesti = document.getElementById('kopioitu-viesti');

    // 1. Lataa tilastot heti
    async function lataaTilastot() {
        try {
            const vastaus = await fetch('https://soro.la/get-stats');
            const tiedot = await vastaus.json();
            document.getElementById('stat-linkit').innerText = tiedot.created;
            document.getElementById('stat-klikit').innerText = tiedot.clicks;
        } catch (e) { console.log("Stats error"); }
    }
    lataaTilastot();

    // 2. Linkin luominen
    lomake.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nappi = lomake.querySelector('button');
        nappi.innerText = "Käsitellään...";

        try {
            const vastaus = await fetch('https://soro.la', {
                method: 'POST',
                body: new FormData(lomake)
            });

            if (vastaus.ok) {
                const id = await vastaus.text();
                const lyhytUrl = "soro.la/" + id;

                // Päivitä input ja näytä tulos, piilota lomake
                urlInput.value = lyhytUrl;
                lomake.style.display = 'none';
                tulosAlue.style.display = 'block';
                lataaTilastot(); // Päivitä numerot heti
            }
        } catch (e) {
            alert("Yhteys katkesi.");
            nappi.innerText = "Lyhennä linkki";
        }
    });

    // 3. Kopiointi-nappi
    kopioiBtn.addEventListener('click', () => {
        urlInput.select(); // Valitsee tekstin
        urlInput.setSelectionRange(0, 99999); // Mobiililaitteille
        
        navigator.clipboard.writeText(urlInput.value).then(() => {
            kopioituViesti.style.display = 'block';
            kopioiBtn.innerText = "Kopioitu!";
            setTimeout(() => {
                kopioituViesti.style.display = 'none';
                kopioiBtn.innerText = "Kopioi linkki";
            }, 2000);
        });
    });

    // 4. Tee uusi linkki -nappi (palauttaa lomakkeen)
    uusiBtn.addEventListener('click', () => {
        tulosAlue.style.display = 'none';
        lomake.style.display = 'block';
        lomake.reset();
        lomake.querySelector('button').innerText = "Lyhennä linkki";
    });
});
