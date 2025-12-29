document.addEventListener('DOMContentLoaded', () => {
    const lomake = document.getElementById('lyhennin-lomake');
    const tulosAlue = document.getElementById('tulos-alue');
    const urlInput = document.getElementById('lyhennetty-url');
    const kopioiBtn = document.getElementById('kopioi-btn');
    const uusiBtn = document.getElementById('uusi-btn');

    // 1. Linkin luominen
    lomake.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = lomake.querySelector('button');
        btn.innerText = "Käsitellään...";

        try {
            const res = await fetch('https://soro.la', {
                method: 'POST',
                body: new FormData(lomake)
            });

            if (res.ok) {
                const id = await res.text();
                lomake.style.display = 'none'; // Piilota vanha
                tulosAlue.style.display = 'block'; // Näytä uusi
                urlInput.value = "soro.la/" + id;
            }
        } catch (e) { alert("Virhe!"); }
        btn.innerText = "Lyhennä linkki";
    });

    // 2. Kopiointi
    kopioiBtn.addEventListener('click', () => {
        urlInput.select();
        navigator.clipboard.writeText(urlInput.value);
        const alkupTeksti = kopioiBtn.innerText;
        kopioiBtn.innerText = "Kopioitu!";
        setTimeout(() => { kopioiBtn.innerText = alkupTeksti; }, 2000);
    });

    // 3. Tee uusi
    uusiBtn.addEventListener('click', () => {
        tulosAlue.style.display = 'none';
        lomake.style.display = 'block';
        lomake.reset();
    });
});
