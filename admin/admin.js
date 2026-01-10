// admin.js
const API_URL = 'https://admin.bannivasara.workers.dev';

// Suoritetaan heti kun sivu on ladattu
document.addEventListener('DOMContentLoaded', () => {
    const kirjautumisLomake = document.getElementById('kirjautuminen');
    
    if (kirjautumisLomake) {
        kirjautumisLomake.addEventListener('submit', async (e) => {
            // TÄRKEÄ: Estetään lomakkeen oletustoiminto (osoitepalkkiin meno)
            e.preventDefault(); 
            
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
                    // Näytetään hallintapaneelin osiot [cite: 2]
                    document.getElementById('kirjautuminen').style.display = 'none';
                    document.getElementById('linkit').style.display = 'block';
                    document.getElementById('linkkisalasanat').style.display = 'block';
                    document.getElementById('korttiyritykset').style.display = 'block';

                    // Haetaan tiedot tauluihin [cite: 3, 4, 5]
                    lataaTiedot('linkit', 'Osoitteet');
                    lataaTiedot('linkkisalasanat', 'rekisterointiavaimet');
                    lataaTiedot('korttiyritykset', 'admin-users');
                } else {
                    alert("Väärä käyttäjätunnus tai salasana.");
                }
            } catch (virhe) {
                console.error("Yhteysvirhe:", virhe);
            }
        });
    }
});

// Tehdään näistä globaaleja, jotta onclick-nappulat löytävät ne
window.lataaTiedot = async function(divId, tauluNimi) {
    const kohde = document.getElementById(divId);
    try {
        const r = await fetch(`${API_URL}/admin-hae?taulu=${tauluNimi}`);
        const data = await r.json();

        let otsikko = kohde.querySelector('h2').innerText;
        let html = `<h2 class="palstatekstit">${otsikko}</h2>`;
        html += `<button class="nappula" onclick="naytaLisays('${tauluNimi}')" style="margin-bottom:10px; width:100%;">+ Lisää uusi</button>`;
        html += '<ul style="list-style:none; padding:0; color:white;">';
        
        data.forEach(rivi => {
            // Tunnistetaan sarakkeet oikein [cite: 3, 4, 5]
            let teksti = rivi.lyhyt || rivi.avain || rivi.username || "Tieto";
            html += `
                <li style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px; border-bottom:1px solid #ff4500; padding:5px;">
                    <span>${teksti}</span>
                    <button onclick="poistaTieto('${tauluNimi}', '${rivi.id}')" style="background:red; color:white; border:none; padding:2px 8px; cursor:pointer;">X</button>
                </li>`;
        });
        
        html += '</ul>';
        kohde.innerHTML = html;
    } catch (e) {
        console.error("Virhe ladattaessa:", tauluNimi, e);
    }
};

window.poistaTieto = async function(taulu, id) {
    if (!confirm("Haluatko varmasti poistaa tämän? [cite: 3, 5, 6]")) return;
    try {
        const r = await fetch(`${API_URL}/admin-poista`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taulu, id })
        });
        if (r.ok) {
            // Päivitetään vain kyseinen palsta
            const divId = taulu === "Osoitteet" ? "linkit" : (taulu === "rekisterointiavaimet" ? "linkkisalasanat" : "korttiyritykset");
            lataaTiedot(divId, taulu);
        }
    } catch (e) { console.error(e); }
};

window.naytaLisays = function(taulu) {
    let data = {};
    if (taulu === "Osoitteet") {
        data.lyhyt = prompt("Lyhytlinkki:");
        data.kohde = prompt("Kohde-URL:");
    } else if (taulu === "rekisterointiavaimet") {
        data.avain = prompt("Uusi avain:");
    } else if (taulu === "admin-users") {
        data.username = prompt("Käyttäjätunnus:");
        data.password = prompt("Salasana:");
    }

    if (Object.values(data).every(v => v)) {
        tallennaTieto(taulu, data);
    }
};

window.tallennaTieto = async function(taulu, data) {
    try {
        const r = await fetch(`${API_URL}/admin-tallenna`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taulu, data })
        });
        if (r.ok) {
            const divId = taulu === "Osoitteet" ? "linkit" : (taulu === "rekisterointiavaimet" ? "linkkisalasanat" : "korttiyritykset");
            lataaTiedot(divId, taulu);
        }
    } catch (e) { console.error(e); }
};