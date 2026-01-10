// fetcher.js - Datan haku ja listaus
window.lataaTiedot = async function(divId, taulu) {
    const kohde = document.getElementById(divId);
    try {
        const r = await fetch(`${API_URL}/admin-hae?taulu=${taulu}`);
        const data = await r.json();

        if (data.error) throw new Error(data.error);

        let h2 = kohde.querySelector('h2');
        let otsikko = h2 ? h2.innerText : taulu;
        
        let html = `<h2 class="palstatekstit">${otsikko}</h2>`;
        html += `<button class="nappula" onclick="naytaLisays('${taulu}')">+ Lisää uusi</button><ul>`;
        
        if (Array.isArray(data)) {
            data.forEach(rivi => {
                // Etsitään sisältö eri sarakkeista
                let teksti = rivi.lyhyt || rivi.avain || rivi.username || "Tieto";
                html += `
                <li style="display:flex; justify-content:space-between; border-bottom:1px solid #ff4500; padding:5px; color:white;">
                    <span>${teksti}</span>
                    <button onclick="poistaTieto('${taulu}', '${rivi.id}')" style="background:red; color:white; border:none; cursor:pointer; padding:2px 8px;">X</button>
                </li>`;
            });
        }
        kohde.innerHTML = html + '</ul>';
    } catch (e) {
        console.error("Virhe ladattaessa taulua " + taulu, e);
        kohde.innerHTML = `<h2 class="palstatekstit">${taulu}</h2><p style="color:red;">Virhe: ${e.message}</p>`;
    }
};