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
                let teksti = rivi.id || rivi.avain || "Tieto";
                html += `<li style="display:flex; justify-content:space-between; border-bottom:1px solid #ff4500; padding:10px; color:white;">
                    <span>${teksti}</span>
                    <button onclick="poistaTieto('${taulu}', '${rivi.id || rivi.avain}')" style="background:red; color:white; border:none; padding:2px 8px; border-radius:3px;">X</button>
                </li>`;
            });
        }
        kohde.innerHTML = html + '</ul>';
    } catch (e) { kohde.innerHTML += `<p style="color:red;">Virhe: ${e.message}</p>`; }
};