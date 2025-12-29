document.addEventListener('DOMContentLoaded', () => {
    const lomake = document.getElementById('lyhennin-lomake');
    const linkitElem = document.getElementById('stat-linkit');
    const klikitElem = document.getElementById('stat-klikit');

    // 1. Haetaan tilastot soro.la:sta heti kun sivu latautuu
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
    lataaTilastot();

    // 2. Lähetetään uusi linkki soro.la:han
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
                    // Näytetään valmis linkki käyttäjälle
                    alert("Linkki on valmis! Osoitteesi on: soro.la/" + id);
                    window.location.reload(); // Päivitetään sivu ja tilastot
                }
            } catch (e) {
                alert("Hups! Yhteys soro.la-moottoriin epäonnistui.");
            } finally {
                btn.innerText = alkuperainenTeksti;
            }
        });
    }
});
