document.addEventListener('DOMContentLoaded', () => {
    const lomake = document.getElementById('lyhennin-lomake');
    const linkitElem = document.getElementById('stat-linkit');
    const klikitElem = document.getElementById('stat-klikit');
    
    // Tulosalueen elementit
    const tulosAlue = document.getElementById('tulos-alue');
    const urlInput = document.getElementById('lyhennetty-url');
    const kopioiBtn = document.getElementById('kopioi-btn');
    const kopioituViesti = document.getElementById('kopioitu-viesti');

    // 1. Funktio tilastojen lataamiseen soro.la-workerista
    async function lataaTilastot() {
        try {
            const vastaus = await fetch('https://soro.la/get-stats');
            if (vastaus.ok) {
                const tiedot = await vastaus.json();
                if (linkitElem) linkitElem.innerText = tiedot.created;
                if (klikitElem) klikitElem.innerText = tiedot.clicks;
            }
        } catch (e) {
            console.error("Tilastoja ei saatu haettua soro.la:sta");
        }
    }

    // Ladataan tilastot heti kun sivu avataan
    lataaTilastot();

    // 2. Lomakkeen lähetys (Linkin luominen)
    if (lomake) {
        lomake.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = lomake.querySelector('button');
            const alkuperainenTeksti = btn.innerText;
            btn.innerText = "Hetki...";

            try {
                const vastaus = await fetch('https://soro.la', {
                    method: 'POST',
                    body: new FormData(lomake)
                });

                if (vastaus.ok) {
                    const id = await vastaus.text();
                    const lyhytUrl = "soro.la/" + id;

                    // Näytetään tuloslaatikko ja asetetaan linkki siihen
                    urlInput.value = lyhytUrl;
                    tulosAlue.style.display = 'block';
                    
                    // Tyhjennetään lomake uutta käyttöä varten
                    lomake.reset(); 
                    
                    // Päivitetään tilastot (koska uusi linkki luotiin)
                    lataaTilastot();

                    // 3. Kopiointitoiminto
                    kopioiBtn.onclick = () => {
                        navigator.clipboard.writeText(lyhytUrl).then(() => {
                            kopioituViesti.style.display = 'block';
                            // Piilotetaan "Kopioitu!"-teksti 2 sekunnin kuluttua
                            setTimeout(() => { 
                                kopioituViesti.style.display = 'none'; 
                            }, 2000);
                        });
                    };
                } else {
                    alert("Worker hylkäsi pyynnön. Tarkista URL.");
                }
            } catch (e) {
                alert("Yhteysvirhe soro.la-moottoriin.");
            } finally {
                btn.innerText = alkuperainenTeksti;
            }
        });
    }
});
