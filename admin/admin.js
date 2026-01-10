const API_URL = 'https://admin.bannivasara.workers.dev';

document.addEventListener('DOMContentLoaded', () => {
    const kirjautumisLomake = document.getElementById('kirjautuminen');
    
    if (kirjautumisLomake) {
        kirjautumisLomake.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            const formData = new FormData(kirjautumisLomake);
            // Haetaan kentät 'user' ja 'password' (index.html:n mukaisesti)
            const u = formData.get('user'); 
            const p = formData.get('password');

            // Tarkistetaan etteivät ne ole tyhjiä ennen lähetystä
            if (!u || !p) {
                alert("Täytä molemmat kentät!");
                return;
            }

            try {
                const r = await fetch(`${API_URL}/admin-kirjaudu`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: u, password: p })
                });

                const data = await r.json();

                if (r.ok) {
                    document.getElementById('kirjautuminen').style.display = 'none';
                    document.getElementById('linkit').style.display = 'block';
                    document.getElementById('linkkisalasanat').style.display = 'block';
                    document.getElementById('korttiyritykset').style.display = 'block';
                    lataaKaikki();
                } else {
                    alert("Virhe: " + (data.error || "Kirjautuminen epäonnistui"));
                }
            } catch (virhe) {
                console.error("Yhteysvirhe:", virhe);
                alert("Palvelinvirhe. Tarkista konsoli.");
            }
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

        let otsikko = kohde.querySelector('h2').innerText;
        let html = `<h2 class="palstatekstit">${otsikko}</h2>`;
        html += `<button class="nappula" onclick="naytaLisays('${tauluNimi}')">+ Lisää uusi</button><ul style="list-style:none; padding:0;">`;
        
        data.forEach(rivi => {
            let teksti = rivi.lyhyt || rivi.avain || rivi.username || "Tieto";
            html += `
                <li style="display:flex; justify-content:space-between; border-bottom:1px solid #ff4500; padding:5px; color:white;">
                    <span>${teksti}</span>
                    <button onclick="poistaTieto('${tauluNimi}', '${rivi.id}')" style="background:red; color:white; border:none; cursor:pointer; padding:2px 8px;">X</button>
                </li>`;
        });
        kohde.innerHTML = html + '</ul>';
    } catch (e) {
        console.error(e);
        kohde.innerHTML = `<h2 class="palstatekstit">${tauluNimi}</h2><p style="color:red;">Virhe: ${e.message}</p>`;
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