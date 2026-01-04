async function lisaaLinkki() {
    const id = document.getElementById('uusi-id').value;
    const url = document.getElementById('uusi-url').value;

    if (!id || !url) return alert("Täytä kentät!");

    try {
        // HUOM! Lisätty /api/ polkuun
        const response = await fetch('https://soro.la/api/lisaa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, url })
        });
        
        if (response.ok) {
            document.getElementById('uusi-id').value = '';
            document.getElementById('uusi-url').value = '';
            haeLinkit();
        } else {
            alert("Palvelin vastasi virheellä (404 tai 500).");
        }
    } catch (e) {
        alert("Yhteysvirhe: " + e.message);
    }
}

async function haeLinkit() {
    const listaAlue = document.getElementById('linkki-lista-alue');
    try {
        // HUOM! Lisätty /api/ polkuun
        const response = await fetch('https://soro.la/api/listaa');
        const linkit = await response.json();
        // ... listauksen generointi ...
    } catch (e) {
        console.error(e);
    }
}