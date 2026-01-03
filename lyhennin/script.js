document.addEventListener('DOMContentLoaded', () => {
    const lomake = document.getElementById('lyhennin-lomake');
    const tulosAlue = document.getElementById('tulos-alue');
    const urlInput = document.getElementById('lyhennetty-url');
    const kopioiBtn = document.getElementById('kopioi-btn');
    const uusiBtn = document.getElementById('uusi-btn');

<<<<<<< HEAD
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
=======
    if (!pitkaUrl) {
        alert("Syötä osoite ensin!");
        return;
    }

    try {
        // Käytetään suoraa Worker-osoitetta ja pakotetaan CORS päälle
        const response = await fetch('https://sorola-short.bannivasara.workers.dev/api/luo', {
            method: 'POST',
            mode: 'cors', 
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ url: pitkaUrl })
        });

        // Testivaiheessa: jos palvelin vastaa mitä tahansa, kokeillaan lukea se
        const data = await response.json();

        if (response.ok) {
            // Jos testiworker palauttaa shortUrl:n, näytetään se. 
            // Jos se palauttaa vain testiviestin, näytetään se debug-mielessä.
            lyhennettyKentta.value = data.shortUrl || "Yhteys OK: " + data.viesti;
            
            lomake.style.display = 'none';
            tulosAlue.style.display = 'block';
        } else {
            alert("Palvelin vastasi virheellä: " + (data.error || response.status));
        }
    } catch (error) {
        console.error("Virhe:", error);
        alert("Yhteysvirhe: " + error.message);
    }
}

function kopioiLinkki() {
    const copyText = document.getElementById("lyhennetty-url");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    alert("Kopioitu!");
}

function resetoiLomake() {
    document.getElementById('lyhennin-lomake').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    document.getElementById('url-input').value = '';
}
>>>>>>> 5d96e5d9e16d017c9fb4c5e587df1e97da0694e4
