const API_URL = 'https://admin.bannivasara.workers.dev';

document.addEventListener('DOMContentLoaded', () => {
    const kirjautumisLomake = document.getElementById('kirjautuminen');
    
    if (kirjautumisLomake) {
        kirjautumisLomake.addEventListener('submit', async (e) => {
            e.preventDefault(); // Estää osoitepalkkiin menon
            
            const formData = new FormData(kirjautumisLomake);
            const user = formData.get('user');
            const pass = formData.get('password');

            try {
                const r = await fetch(`${API_URL}/admin-kirjaudu`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: user, password: pass })
                });

                if (r.ok) {
                    // Näytetään divit [cite: 2]
                    document.getElementById('kirjautuminen').style.display = 'none';
                    document.getElementById('linkit').style.display = 'block';
                    document.getElementById('linkkisalasanat').style.display = 'block';
                    document.getElementById('korttiyritykset').style.display = 'block';

                    // Ladataan tiedot
                    lataaTiedot('linkit', 'Osoitteet');
                    lataaTiedot('linkkisalasanat', 'rekisterointiavaimet');
                    lataaTiedot('korttiyritykset', 'admin-users');
                } else {
                    alert("Väärä käyttäjätunnus tai salasana.");
                }
            } catch (virhe) {
                console.error("Virhe:", virhe);
            }
        });
    }
});

// Funktio tietojen lataamiseen
window.lataaTiedot = async function(divId, tauluNimi) {
    const kohde = document.getElementById(divId);
    try {
        const r = await fetch(`${API_URL}/admin-hae?taulu=${tauluNimi}`);
        const json = await r.json();

        // Jos palvelin palautti virheen { error: "..." }
        if (json.error) {
            console.error("Palvelinvirhe taulussa " + tauluNimi + ":", json.error);
            kohde.innerHTML = `<h2 class="palstatekstit">${tauluNimi}</h2><p style="color:red;">Virhe: ${json.error}</p>`;
            return;
        }

        let html = `<h2 class="palstatekstit">${kohde.querySelector('h2').innerText}</h2>`;
        html += `<button class="nappula" onclick="naytaLisays('${tauluNimi}')">+ Lisää uusi</button><ul style="list-style:none; padding:10px 0;">`;
        
        // Varmistetaan että json on lista
        if (Array.isArray(json)) {
            json.forEach(rivi => {
                let teksti = rivi.lyhyt || rivi.avain || rivi.username || "Tieto";
                html += `
                    <li style="display:flex; justify-content:space-between; border-bottom:1px solid #ff4500; padding:5px; color:white;">
                        <span>${teksti}</span>
                        <button onclick="poistaTieto('${tauluNimi}', '${rivi.id}')" style="background:red; color:white; border:none; cursor:pointer; padding:2px 8px;">X</button>
                    </li>`;
            });
        }
        
        html += '</ul>';
        kohde.innerHTML = html;
    } catch (e) {
        console.error("Latausvirhe:", e);
    }
};

// Poistofunktio
window.poistaTieto = async function(taulu, id) {
    if (!confirm("Haluatko varmasti poistaa tämän?")) return;
    const r = await fetch(`${API_URL}/admin-poista`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taulu, id })
    });
    if (r.ok) {
        const idMap = { "Osoitteet": "linkit", "rekisterointiavaimet": "linkkisalasanat", "admin-users": "korttiyritykset" };
        lataaTiedot(idMap[taulu], taulu);
    }
};

// Lisäysfunktio (Prompt-malli testaukseen)
window.naytaLisays = function(taulu) {
    let d = {};
    if (taulu === "Osoitteet") { 
        d.lyhyt = prompt("Lyhytlinkki (esim. testi):"); d.kohde = prompt("Kohde (esim. https://google.com):"); 
    } else if (taulu === "rekisterointiavaimet") { 
        d.avain = prompt("Uusi avain:"); 
    } else if (taulu === "admin-users") { 
        d.username = prompt("Käyttäjätunnus:"); d.password = prompt("Salasana:"); 
    }

    if (Object.values(d).every(v => v)) {
        fetch(`${API_URL}/admin-tallenna`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taulu, data: d })
        }).then(r => { if(r.ok) { 
            const idMap = { "Osoitteet": "linkit", "rekisterointiavaimet": "linkkisalasanat", "admin-users": "korttiyritykset" };
            lataaTiedot(idMap[taulu], taulu);
        }});
    }
};