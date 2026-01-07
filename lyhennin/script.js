document.addEventListener('DOMContentLoaded', () => {
    const lomake = document.getElementById('lyhennin-lomake');
    const tulosAlue = document.getElementById('tulos-alue');
    const urlInput = document.getElementById('lyhennetty-url');
    const kopioiBtn = document.getElementById('kopioi-btn');
    const uusiBtn = document.getElementById('uusi-btn');

    if (lomake) {
        lomake.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const pitkaUrl = lomake.querySelector('input[name="url"]').value;
            const omaTunniste = document.getElementById('tunniste').value; // Uusi kenttä
            const salasanaAvain = document.getElementById('avain').value; // Uusi kenttä

            const btn = lomake.querySelector('button');
            const alkupTeksti = btn.innerText;
            btn.innerText = "Käsitellään...";

            try {
                const res = await fetch('https://soro.la/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        id: omaTunniste, // Lähetetään tyhjänä, jos ei täytetty
                        url: pitkaUrl,
                        avain: salasanaAvain 
                    })
                });

                const data = await res.json(); // Luetaan vastaus Workerilta

                if (res.ok) {
                    lomake.style.display = 'none';
                    tulosAlue.style.display = 'block';
                    // Worker palauttaa joko arvotun tai oman tunnisteen
                    urlInput.value = "soro.la/" + data.shortId; 
                } else {
                    alert("Virhe: " + (data.error || "Tarkista salasana tai tunniste."));
                }
            } catch (err) {
                alert("Yhteysvirhe palvelimeen.");
            } finally {
                btn.innerText = alkupTeksti;
            }
        });
    }

    // Kopiointi ja uusi linkki pysyvät samoina kuin alkuperäisessä koodissasi
    if (kopioiBtn) {
        kopioiBtn.addEventListener('click', () => {
            urlInput.select();
            navigator.clipboard.writeText(urlInput.value);
            kopioiBtn.innerText = "Kopioitu!";
            setTimeout(() => { kopioiBtn.innerText = "Kopioi linkki"; }, 2000);
        });
    }

    if (uusiBtn) {
        uusiBtn.addEventListener('click', () => {
            tulosAlue.style.display = 'none';
            lomake.style.display = 'block';
            lomake.reset();
        });
    }
});