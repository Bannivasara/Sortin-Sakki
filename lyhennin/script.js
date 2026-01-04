document.addEventListener('DOMContentLoaded', () => {
    const lomake = document.getElementById('lyhennin-lomake');
    const tulosAlue = document.getElementById('tulos-alue');
    const urlInput = document.getElementById('lyhennetty-url');
    const kopioiBtn = document.getElementById('kopioi-btn');
    const uusiBtn = document.getElementById('uusi-btn');

    if (lomake) {
        lomake.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Haetaan se pitkä URL-osoite input-kentästä nimen perusteella
            const pitkaUrl = lomake.querySelector('input[name="url"]').value;
            
            // Koska HTML:ssä ei ole kenttää lyhenteelle (id), arvotaan tässä lyhyt pätkä
            // tai voit lisätä HTML:ään <input id="uusi-id"> jos haluat itse päättää sen.
            const arvottuId = Math.random().toString(36).substring(2, 7);

            const btn = lomake.querySelector('button');
            const alkupTeksti = btn.innerText;
            btn.innerText = "Käsitellään...";

            try {
                const res = await fetch('https://soro.la', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        id: arvottuId, 
                        url: pitkaUrl 
                    })
                });

                if (res.ok) {
                    lomake.style.display = 'none';
                    tulosAlue.style.display = 'block';
                    urlInput.value = "soro.la/" + arvottuId;
                } else {
                    const errorMsg = await res.json();
                    alert("Virhe: " + (errorMsg.error || "Tallennus epäonnistui"));
                }
            } catch (err) {
                alert("Yhteysvirhe palvelimeen. Tarkista Workerin CORS-asetukset.");
            } finally {
                btn.innerText = alkupTeksti;
            }
        });
    }

    // Kopiointi-nappi
    if (kopioiBtn) {
        kopioiBtn.addEventListener('click', () => {
            urlInput.select();
            navigator.clipboard.writeText(urlInput.value);
            const teksti = kopioiBtn.innerText;
            kopioiBtn.innerText = "Kopioitu!";
            setTimeout(() => { kopioiBtn.innerText = teksti; }, 2000);
        });
    }

    // Uusi linkki -nappi
    if (uusiBtn) {
        uusiBtn.addEventListener('click', () => {
            tulosAlue.style.display = 'none';
            lomake.style.display = 'block';
            lomake.reset();
        });
    }
});