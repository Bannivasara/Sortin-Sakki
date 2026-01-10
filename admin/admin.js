const API_URL = 'https://admin.bannivasara.workers.dev';

async function lataaTiedot(divId, tauluNimi) {
    const kohde = document.getElementById(divId);
    try {
        const r = await fetch(`${API_URL}/admin-hae?taulu=${tauluNimi}`);
        const data = await r.json();

        let html = `<h2 class="palstatekstit">${kohde.querySelector('h2').innerText}</h2>`;
        html += `<button class="nappula" onclick="naytaLisays('${tauluNimi}')" style="margin-bottom:10px; width:100%;">+ Lisää uusi</button>`;
        html += '<ul style="list-style:none; padding:0; color:white; max-height:300px; overflow-y:auto;">';
        
        data.forEach(rivi => {
            // Korjattu sarakkeiden tunnistus [cite: 3, 4, 6]
            let teksti = rivi.lyhyt || rivi.avain || rivi.username || "Tieto";
            html += `
                <li style="display:flex; justify-content:space-between; margin-bottom:5px; border-bottom:1px solid #ff4500; padding:5px;">
                    <span>${teksti}</span>
                    <button onclick="poistaTieto('${tauluNimi}', '${rivi.id}')" style="background:red; color:white; border:none; border-radius:4px; cursor:pointer;">X</button>
                </li>`;
        });
        
        html += '</ul>';
        kohde.innerHTML = html;
    } catch (e) { console.error(e); }
}

async function poistaTieto(taulu, id) {
    if (!confirm("Haluatko varmasti poistaa tämän?")) return;
    const r = await fetch(`${API_URL}/admin-poista`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taulu, id })
    });
    if (r.ok) location.reload(); // Päivitetään näkymä
}

function naytaLisays(taulu) {
    let viesti = "";
    let data = {};
    
    if (taulu === "Osoitteet") {
        data.lyhyt = prompt("Lyhytlinkin nimi (esim. testi):");
        data.kohde = prompt("Mihin linkki johtaa (esim. https://google.com):");
    } else if (taulu === "rekisterointiavaimet") {
        data.avain = prompt("Uusi rekisteröintiavain:");
    } else if (taulu === "admin-users") {
        data.username = prompt("Käyttäjätunnus:");
        data.password = prompt("Salasana:");
    }

    if (Object.values(data).every(v => v)) {
        tallennaTieto(taulu, data);
    }
}

async function tallennaTieto(taulu, data) {
    const r = await fetch(`${API_URL}/admin-tallenna`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taulu, data })
    });
    if (r.ok) location.reload();
}