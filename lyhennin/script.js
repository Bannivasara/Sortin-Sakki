async function luoLyhytlinkki() {
    const inputKentta = document.getElementById('url-input');
    const tulosAlue = document.getElementById('result');
    const lyhennettyKentta = document.getElementById('lyhennetty-url');
    const lomake = document.getElementById('lyhennin-lomake');
    
    const pitkaUrl = inputKentta.value.trim();

    try {
        const response = await fetch('https://sorola-short.bannivasara.workers.dev/api/luo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: pitkaUrl })
        });

        const data = await response.json();

        if (response.ok) {
            // Asetetaan uusi linkki kenttään
            lyhennettyKentta.value = data.shortUrl;
            
            // Piilotetaan lomake ja näytetään tulos (tyylit säilyvät)
            lomake.style.display = 'none';
            tulosAlue.style.display = 'block';
        } else {
            alert(data.error || "Jotain meni pieleen.");
        }
    } catch (error) {
        console.error("Virhe:", error);
        alert("Yhteysvirhe palvelimeen.");
    }
}

function kopioiLinkki() {
    const copyText = document.getElementById("lyhennetty-url");
    copyText.select();
    copyText.setSelectionRange(0, 99999); // Mobiililaitteille
    navigator.clipboard.writeText(copyText.value);
    alert("Linkki kopioitu!");
}

function resetoiLomake() {
    document.getElementById('lyhennin-lomake').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    document.getElementById('url-input').value = '';

}

