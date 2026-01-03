async function luoLyhytlinkki() {
    const inputKentta = document.getElementById('url-input');
    const tulosAlue = document.getElementById('result');
    const lyhennettyKentta = document.getElementById('lyhennetty-url');
    const lomake = document.getElementById('lyhennin-lomake');
    
    const pitkaUrl = inputKentta.value.trim();

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
