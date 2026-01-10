document.addEventListener('DOMContentLoaded', () => {
    const kirjautumisLomake = document.getElementById('kirjautuminen');
    
    if (kirjautumisLomake) {
        kirjautumisLomake.addEventListener('submit', async (e) => {
            // TÄMÄ ESTÄÄ SIVUN PÄIVITYKSEN JA TIETOJEN MENEMISEN OSOITEPALKKIIN
            e.preventDefault(); 
            
            console.log("Kirjautumista yritetään...");
            
            const formData = new FormData(kirjautumisLomake);
            const user = formData.get('user');
            const pass = formData.get('password');

            try {
                // Lähetetään tiedot palvelimelle
                const r = await fetch('https://admin.bannivasara.workers.dev/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: user, password: pass })
                });

                if (r.ok) {
                    console.log("Kirjautuminen onnistui!");
                    // Näytetään divit: linkit, linkkisalasanat ja korttiyritykset [cite: 2, 4, 6]
                    document.getElementById('kirjautuminen').style.display = 'none';
                    document.getElementById('linkit').style.display = 'block';
                    document.getElementById('linkkisalasanat').style.display = 'block';
                    document.getElementById('korttiyritykset').style.display = 'block';
                } else {
                    alert("Väärä käyttäjätunnus tai salasana.");
                }
            } catch (virhe) {
                console.error("Yhteysvirhe API:han:", virhe);
                alert("Palvelimeen ei saatu yhteyttä.");
            }
        });
    }
});