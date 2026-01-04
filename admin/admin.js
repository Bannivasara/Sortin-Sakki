async function kirjauduSisaan() {
    const userElement = document.getElementById('username');
    const passElement = document.getElementById('password');

    if (!userElement || !passElement) {
        console.error("Lomake-elementtejä ei löytynyt!");
        return;
    }

    const user = userElement.value;
    const pass = passElement.value;

    try {
        const response = await fetch('https://soro.la/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });

        const result = await response.json();

        if (result.success) {
            document.getElementById('login-overlay').style.display = 'none';
            document.getElementById('admin-content').style.display = 'block';
            console.log("Kirjautuminen onnistui!");
            haeLinkit();
        } else {
            alert("Pääsy evätty!");
        }
    } catch (error) {
        console.error("Kirjautumisvirhe:", error);
        alert("Yhteysvirhe palvelimeen.");
    }
}

async function haeLinkit() {
    const listaAlue = document.getElementById('linkki-lista-alue');
    if (!listaAlue) return;
    
    listaAlue.innerHTML = "<p style='color: white;'>Haetaan linkkejä...</p>";

    try {
        const response = await fetch('https://soro.la/api/listaa');
        const linkit = await response.json();

        if (!linkit || linkit.length === 0) {
            listaAlue.innerHTML = "<p style='color: white;'>Ei vielä linkkejä tietokannassa.</p>";
            return;
        }

        let html = `
            <table style="width:100%; color:white; border-collapse: collapse; margin-top:20px; font-family: Arial, sans-serif;">
                <thead>
                    <tr style="border-bottom: 2px solid #0e11e3; text-align: left;">
                        <th style="padding: 10px;">ID</th>
                        <th style="padding: 10px;">Kohde</th>
                        <th style="padding: 10px; text-align: center;">Klikit</th>
                        <th style="padding: 10px; text-align: center;">Toiminnot</th>
                    </tr>
                </thead>
                <tbody>
        `;

        linkit.forEach(l => {
            html += `
                <tr style="border-bottom: 1px solid #333;">
                    <td style="padding: 10px; color: #63b8ee; font-weight: bold;">${l.id}</td>
                    <td style="padding: 10px; font-size: 13px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        <a href="${l.url}" target="_blank" style="color: #aaa; text-decoration: none;">${l.url}</a>
                    </td>
                    <td style="padding: 10px; text-align: center;">${l.clicks || 0}</td>
                    <td style="padding: 10px; text-align: center;">
                        <button onclick="poistaLinkki('${l.id}')" class="adminappula" style="padding: 5px 15px; font-size: 12px; background-color: #d93025;">
                            Poista
                        </button>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        listaAlue.innerHTML = html;

    } catch (error) {
        listaAlue.innerHTML = "<p style='color: red;'>Virhe linkkien hakemisessa.</p>";
        console.error("Haku epäonnistui:", error);
    }
}

async function poistaLinkki(id) {
    if (!confirm("Haluatko varmasti poistaa linkin " + id + "?")) return;

    try {
        const response = await fetch(`https://soro.la/api/poista?id=${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            haeLinkit(); // Päivitetään lista
        } else {
            alert("Poisto epäonnistui.");
        }
    } catch (error) {
        console.error("Virhe poistaessa:", error);
        alert("Yhteysvirhe poistettaessa.");
    }
}

async function lisaaKuva() {
    const url = document.getElementById('kuva-url').value;
    const kuvaus = document.getElementById('kuva-kuvaus').value;
    
    await fetch('https://soro.la/api/lisaa-kuva', {
        method: 'POST',
        body: JSON.stringify({ url, kuvaus })
    });
    
    document.getElementById('kuva-url').value = '';
    document.getElementById('kuva-kuvaus').value = '';
    paivitaKuvaLista();
}

async function paivitaKuvaLista() {
    const listaAlue = document.getElementById('kuva-hallinta-alue');
    try {
        const response = await fetch('https://soro.la/api/kuvat');
        const kuvat = await response.json();

        let html = '<ul style="list-style:none; padding:0;">';
        kuvat.forEach(k => {
            html += `
                <li style="display:flex; align-items:center; gap:10px; margin-bottom:10px; background:#222; padding:10px; border-radius:5px;">
                    <img src="${k.kuva_url}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;">
                    <div style="flex-grow:1;">
                        <div style="color:white; font-size:12px;">${k.kuvaus || 'Ei kuvausta'}</div>
                    </div>
                    <button onclick="poistaKuva(${k.id})" class="adminappula" style="background:#d93025; padding:5px;">Poista</button>
                </li>
            `;
        });
        html += '</ul>';
        listaAlue.innerHTML = html;
    } catch (e) {
        console.error("Kuvien haku epäonnistui", e);
    }
}

async function poistaKuva(id) {
    if(!confirm("Poistetaanko kuva?")) return;
    await fetch(`https://soro.la/api/poista-kuva?id=${id}`, { method: 'DELETE' });
    paivitaKuvaLista();
}