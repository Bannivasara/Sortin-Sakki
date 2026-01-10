// scripts/actions.js
window.poistaTieto = async function(taulu, id) {
    if (!confirm("Haluatko varmasti poistaa tämän?")) return;
    try {
        const r = await fetch(`${API_URL}/admin-poista`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taulu, id })
        });
        if (r.ok) {
            lataaKaikki();
        } else {
            alert("Poisto epäonnistui");
        }
    } catch (e) { console.error("Poistovirhe:", e); }
};

window.naytaLisays = function(taulu) {
    let d = {};
    if (taulu === "Osoitteet") { 
        d.lyhyt = prompt("Lyhytlinkki (esim. youtube):"); 
        d.kohde = prompt("Kohde-URL (esim. https://youtube.com):"); 
    } else if (taulu === "rekisterointiavaimet") { 
        d.avain = prompt("Anna uusi rekisteröintiavain:"); 
    } else if (taulu === "admin-users") { 
        d.username = prompt("Uuden yrityksen käyttäjätunnus:"); 
        d.password = prompt("Salasana:"); 
    }

    if (Object.values(d).every(v => v !== null && v !== "")) {
        fetch(`${API_URL}/admin-tallenna`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taulu, data: d })
        }).then(r => {
            if (r.ok) lataaKaikki();
            else alert("Tallennus epäonnistui palvelimella.");
        });
    }
};