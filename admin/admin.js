const API_URL = 'https://admin.bannivasara.workers.dev';

document.addEventListener('DOMContentLoaded', () => {
    const kirjautumisLomake = document.getElementById('kirjautuminen');
    if (kirjautumisLomake) {
        kirjautumisLomake.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(kirjautumisLomake);
            try {
                const r = await fetch(`${API_URL}/admin-kirjaudu`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(Object.fromEntries(formData))
                });
                if (r.ok) {
                    document.getElementById('kirjautuminen').style.display = 'none';
                    const osiot = ['linkit', 'linkkisalasanat', 'korttiyritykset'];
                    osiot.forEach(id => document.getElementById(id).style.display = 'block');
                    lataaKaikki();
                } else { alert("Kirjautuminen epäonnistui."); }
            } catch (err) { console.error(err); }
        });
    }
});

async function lataaKaikki() {
    lataaTiedot('linkit', 'Osoitteet');
    lataaTiedot('linkkisalasanat', 'rekisterointiavaimet');
    lataaTiedot('korttiyritykset', 'admin-users');
}

window.lataaTiedot = async function(divId, tauluNimi) {
    const kohde = document.getElementById(divId);
    try {
        const r = await fetch(`${API_URL}/admin-hae?taulu=${tauluNimi}`);
        const data = await r.json();

        if (data.error) throw new Error(data.error);

        let html = `<h2 class="palstatekstit">${kohde.querySelector('h2').innerText}</h2>`;
        html += `<button class="nappula" onclick="naytaLisays('${tauluNimi}')">+ Lisää uusi</button><ul style="list-style:none; padding:0;">`;
        
        if (Array.isArray(data)) {
            data.forEach(rivi => {
                let teksti = rivi.lyhyt || rivi.avain || rivi.username || "Tieto";
                html += `
                    <li style="display:flex; justify-content:space-between; border-bottom:1px solid #ff4500; padding:5px; color:white;">
                        <span>${teksti}</span>
                        <button onclick="poistaTieto('${tauluNimi}', '${rivi.id}')" style="background:red; color:white; border:none; cursor:pointer;">X</button>
                    </li>`;
            });
        }
        kohde.innerHTML = html + '</ul>';
    } catch (e) {
        console.error("Virhe palstalla " + tauluNimi, e);
        kohde.innerHTML = `<h2 class="palstatekstit">${tauluNimi}</h2><p style="color:red;">Lataus epäonnistui.</p>`;
    }
};

window.poistaTieto = async function(taulu, id) {
    if (!confirm("Poistetaanko?")) return;
    await fetch(`${API_URL}/admin-poista`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taulu, id })
    });
    lataaKaikki();
};

window.naytaLisays = function(taulu) {
    let d = {};
    if (taulu === "Osoitteet") { d.lyhyt = prompt("Lyhytlinkki:"); d.kohde = prompt("URL:"); }
    else if (taulu === "rekisterointiavaimet") { d.avain = prompt("Avain:"); }
    else if (taulu === "admin-users") { d.username = prompt("Käyttäjä:"); d.password = prompt("Salasana:"); }

    if (Object.values(d).every(v => v)) {
        fetch(`${API_URL}/admin-tallenna`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taulu, data: d })
        }).then(() => lataaKaikki());
    }
};