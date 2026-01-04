// Asetetaan Workerin osoite vakioiksi, ettei tule kirjoitusvirheitä
const API_BASE = "https://soro.la/api";

async function kirjauduSisaan() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });
        const data = await res.json();
        if (data.success) {
            document.getElementById('login-overlay').style.display = 'none';
            document.getElementById('admin-content').style.display = 'block';
            haeLinkit();
            paivitaKuvaLista();
        } else {
            alert("Väärä tunnus tai salasana!");
        }
    } catch (err) {
        alert("Kirjautumisvirhe: " + err.message);
    }
}

// --- LINKKIEN HALLINTA ---

async function haeLinkit() {
    const lista = document.getElementById('linkki-lista-alue');
    try {
        const res = await fetch(`${API_BASE}/listaa`);
        const linkit = await res.json();
        let html = '<table style="width:100%; color:white; border-collapse:collapse;">';
        linkit.forEach(l => {
            html += `<tr style="border-bottom:1px solid #333;">
                <td style="padding:10px;">${l.id}</td>
                <td style="padding:10px; font-size:12px;">${l.url}</td>
                <td style="padding:10px; text-align:center;">${l.clicks || 0}</td>
                <td style="padding:10px;"><button onclick="poistaLinkki('${l.id}')" style="background:red; color:white;">X</button></td>
            </tr>`;
        });
        lista.innerHTML = html + '</table>';
    } catch (err) {
        lista.innerHTML = "Virhe linkkien haussa.";
    }
}

async function lisaaLinkki() {
    const id = document.getElementById('uusi-id').value;
    const url = document.getElementById('uusi-url').value;

    if(!id || !url) return alert("Täytä molemmat kentät!");

    try {
        // TÄSSÄ KOHTAA tapahtuu se lyhennys. 
        // Jos sulla on Workerissa eri reitti tälle, varmista että se on oikein.
        const res = await fetch(`${API_BASE}/lisaa`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, url })
        });
        if(res.ok) {
            document.getElementById('uusi-id').value = '';
            document.getElementById('uusi-url').value = '';
            haeLinkit();
        }
    } catch (err) {
        alert("Virhe linkin luonnissa.");
    }
}

async function poistaLinkki(id) {
    if(!confirm("Poistetaanko " + id + "?")) return;
    await fetch(`${API_BASE}/poista?id=${id}`, { method: 'DELETE' });
    haeLinkit();
}

// --- KUVIEN HALLINTA ---

async function paivitaKuvaLista() {
    const lista = document.getElementById('kuva-hallinta-alue');
    const res = await fetch(`${API_BASE}/kuvat`);
    const kuvat = await res.json();
    let html = '';
    kuvat.forEach(k => {
        html += `<div style="display:flex; gap:10px; margin-bottom:5px; align-items:center;">
            <img src="${k.kuva_url}" width="40">
            <span>${k.kuvaus}</span>
            <button onclick="poistaKuva(${k.id})" style="background:red; border:none; color:white;">Poista</button>
        </div>`;
    });
    lista.innerHTML = html;
}

async function lisaaKuva() {
    const url = document.getElementById('kuva-url').value;
    const kuvaus = document.getElementById('kuva-kuvaus').value;
    await fetch(`${API_BASE}/lisaa-kuva`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, kuvaus })
    });
    paivitaKuvaLista();
}

async function poistaKuva(id) {
    await fetch(`${API_BASE}/poista-kuva?id=${id}`, { method: 'DELETE' });
    paivitaKuvaLista();
}