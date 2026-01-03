// --- 1. LINKIN LUONTI ---

async function luoLyhytlinkki() {
    const inputKentta = document.getElementById('url-input'); // Varmista että ID täsmää HTML:ssä
    const tulosAlue = document.getElementById('result');
    const pitkaUrl = inputKentta.value.trim();

    if (!pitkaUrl) {
        alert("Syötä ensin osoite!");
        return;
    }

    try {
        // Lähetetään pyyntö omalle Workerille
        const response = await fetch('/api/luo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: pitkaUrl })
        });

        const data = await response.json();

        if (response.ok) {
            // Näytetään uusi linkki käyttäjälle
            tulosAlue.innerHTML = `
                <p>Linkki luotu!</p>
                <input type="text" value="${data.shortUrl}" id="short-url-copy" readonly>
                <button onclick="kopioiLinkki()">Kopioi</button>
            `;
            inputKentta.value = ''; // Tyhjennetään kenttä
        } else {
            alert(data.error || "Jotain meni pieleen.");
        }
    } catch (error) {
        console.error("Virhe:", error);
        alert("Yhteysvirhe palvelimeen.");
    }
}

function kopioiLinkki() {
    const copyText = document.getElementById("short-url-copy");
    copyText.select();
    document.execCommand("copy");
    alert("Linkki kopioitu leikepöydälle!");
}

// --- 2. TEEMAN VAIHTO (Se sun aiempi koodi) ---

function vaihdaTeema(teema) {
    document.body.className = teema;
    localStorage.setItem('valittu-teema', teema);
}

// Ladataan teema kun sivu avataan
window.onload = () => {
    const tallennettuTeema = localStorage.getItem('valittu-teema');
    if (tallennettuTeema) {
        vaihdaTeema(tallennettuTeema);
    }
};