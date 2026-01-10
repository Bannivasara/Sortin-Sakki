window.muokkaaTietoa = async function(taulu, id) {
    const viesti = taulu === "Osoitteet" ? `Muokkaa linkin ${id} kohdetta:` : `Muokkaa avaimen ${id} käyttökertoja:`;
    const uusiArvo = prompt(viesti);
    
    if (uusiArvo !== null && uusiArvo.trim() !== "") {
        try {
            const r = await fetch(`${API_URL}/paivita`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taulu, id, uusiArvo: uusiArvo.trim() })
            });
            if (r.ok) {
                lataaKaikki();
            } else {
                alert("Muokkaus epäonnistui");
            }
        } catch (e) {
            alert("Yhteysvirhe muokkauksessa");
        }
    }
};

window.naytaLisays = function(taulu) {
    let d = {};
    if (taulu === "Osoitteet") { 
        d.lyhyt = prompt("Lyhytlinkki (ID):"); 
        d.kohde = prompt("Kohde-URL (esim. https://google.com):"); 
    } else if (taulu === "rekisterointiavaimet") { 
        d.avain = prompt("Uusi avain/salasana:"); 
        d.kerrat = prompt("Käyttökertojen määrä:", "10");
    }
    
    if (Object.values(d).every(v => v !== null && v.trim() !== "")) {
        fetch(`${API_URL}/tallenna`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taulu, data: d })
        }).then(r => {
            if (r.ok) lataaKaikki();
            else alert("Tallennus epäonnistui");
        });
    }
};

window.poistaTieto = async function(taulu, id) {
    if (!confirm(`Haluatko varmasti poistaa kohteen: ${id}?`)) return;
    try {
        const r = await fetch(`${API_URL}/poista`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taulu, id })
        });
        if (r.ok) lataaKaikki();
        else alert("Poisto epäonnistui");
    } catch (e) { 
        alert("Yhteysvirhe poistossa"); 
    }
};