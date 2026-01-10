// actions.js - Lisäys ja poisto
window.poistaTieto = async function(taulu, id) {
    if (!confirm("Haluatko varmasti poistaa tämän?")) return;
    try {
        const r = await fetch(`${API_URL}/admin-poista`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taulu, id })
        });
        if (r.ok) lataaKaikki();
    } catch (e) { console.error("Poistovirhe:", e); }
};

window.naytaLisays = function(taulu) {
    let d = {};
    if (taulu === "Osoitteet") { 
        d.lyhyt = prompt("Lyhytlinkki:"); 
        d.kohde = prompt("URL:"); 
    } else if (taulu === "rekisterointiavaimet") { 
        d.avain = prompt("Uusi avain:"); 
    } else if (taulu === "admin-users") { 
        d.username = prompt("Käyttäjä:"); 
        d.password = prompt("Salasana:"); 
    }

    if (Object.values(d).every(v => v)) {
        fetch(`${API_URL}/admin-tallenna`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taulu, data: d })
        }).then(r => {
            if (r.ok) lataaKaikki();
            else alert("Tallennus epäonnistui");
        });
    }
};