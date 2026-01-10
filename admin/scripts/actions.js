window.poistaTieto = async function(taulu, id) {
    if (!confirm("Poistetaanko?")) return;
    await fetch(`${API_URL}/poista`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taulu, id })
    });
    lataaKaikki();
};

window.naytaLisays = function(taulu) {
    let d = {};
    if (taulu === "Osoitteet") { 
        d.lyhyt = prompt("Lyhytlinkki:"); 
        d.kohde = prompt("Kohde-URL:"); 
    } else if (taulu === "rekisterointiavaimet") { 
        d.avain = prompt("Uusi avain:"); 
    }
    if (Object.values(d).every(v => v)) {
        fetch(`${API_URL}/tallenna`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taulu, data: d })
        }).then(() => lataaKaikki());
    }
};