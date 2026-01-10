window.lataaTiedot = async function(divId, taulu) {
    const kohde = document.getElementById(divId);
    try {
        const r = await fetch(`${API_URL}/hae?taulu=${taulu}`);
        const data = await r.json();
        let h2 = kohde.querySelector('h2');
        let html = `<h2 class="palstatekstit">${h2 ? h2.innerText : taulu}</h2>`;
        html += `<button class="nappula" onclick="naytaLisays('${taulu}')">+ Lisää uusi</button><ul style="list-style:none; padding:0;">`;
        
        if (Array.isArray(data)) {
            data.forEach(rivi => {
                const id = rivi.id || rivi.avain;
                const lisatieto = taulu === "Osoitteet" ? rivi.url : `Käyttökertoja jäljellä: ${rivi.kayttokerrat}`;
                
                html += `<li style="border-bottom:1px solid #ff4500; padding:10px; color:white;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong>${id}</strong>
                        <div>
                            <button onclick="muokkaaTietoa('${taulu}', '${id}')" style="background:orange; color:white; border:none; padding:4px 10px; border-radius:3px; cursor:pointer; margin-right:5px;">Muokkaa</button>
                            <button onclick="poistaTieto('${taulu}', '${id}')" style="background:red; color:white; border:none; padding:4px 10px; border-radius:3px; cursor:pointer;">X</button>
                        </div>
                    </div>
                    <div style="font-size:0.85em; opacity:0.9; margin-top:5px; word-break:break-all; background: rgba(0,0,0,0.2); padding: 5px; border-radius: 3px;">
                        ${lisatieto}
                    </div>
                </li>`;
            });
        }
        kohde.innerHTML = html + '</ul>';
    } catch (e) { 
        kohde.innerHTML += `<p style="color:red;">Virhe ladattaessa tietoja</p>`; 
    }
};