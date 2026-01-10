document.addEventListener('DOMContentLoaded', () => {
    const kirjautumisLomake = document.getElementById('kirjautuminen');
    const API_URL = 'https://admin.bannivasara.workers.dev';

    if (kirjautumisLomake) {
        kirjautumisLomake.addEventListener('submit', async (e) => {
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
                    // 1. Piilotetaan kirjautuminen ja näytetään palstat 
                    document.getElementById('kirjautuminen').style.display = 'none';
                    document.getElementById('linkit').style.display = 'block';
                    document.getElementById('linkkisalasanat').style.display = 'block';
                    document.getElementById('korttiyritykset').style.display = 'block';

                    // 2. Haetaan tiedot tauluihin 
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

    async function lataaTiedot(divId, tauluNimi) {
        const kohde = document.getElementById(divId);
        try {
            const r = await fetch(`${API_URL}/admin-hae?taulu=${tauluNimi}`);
            const data = await r.json();

            // Luodaan listaus 
            let html = `<h2 class="palstatekstit">${kohde.querySelector('h2').innerText}</h2>`;
            html += '<ul style="list-style:none; padding:0; color:white;">';
            
            data.forEach(rivi => {
                // Valitaan näytettävä teksti sen mukaan, mitä sarakkeita taulussa on 
                let naytettavaTeksti = rivi.lyhytlinkki || rivi.avain || rivi.username || "Tuntematon tieto";
                html += `<li style="margin-bottom:5px; border-bottom:1px solid #ff4500; padding:5px;">${naytettavaTeksti}</li>`;
            });
            
            html += '</ul>';
            kohde.innerHTML = html;
        } catch (e) {
            console.error(`Virhe ladattaessa taulua ${tauluNimi}:`, e);
        }
    }
});