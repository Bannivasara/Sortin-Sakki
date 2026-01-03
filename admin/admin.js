async function haeLinkit() {
    const listaAlue = document.getElementById('linkki-lista-alue');
    listaAlue.innerHTML = "Haetaan linkkejä...";

    try {
        // Huom: Tarvitset Workeriin /api/listaa -reitin, jotta tämä toimii
        const response = await fetch('https://soro.la/api/listaa');
        const linkit = await response.json();

        if (linkit.length === 0) {
            listaAlue.innerHTML = "Ei vielä linkkejä tietokannassa.";
            return;
        }

        let html = '<table style="width:100%; color:white; border-collapse: collapse; margin-top:20px;">';
        html += '<tr style="border-bottom: 1px solid #444;"><th>ID</th><th>Alkuperäinen</th><th>Klikit</th></tr>';
        
        linkit.forEach(l => {
            html += `<tr style="border-bottom: 1px solid #222;">
                <td style="padding:10px;">${l.id}</td>
                <td style="padding:10px; font-size:12px; max-width:150px; overflow:hidden;">${l.url}</td>
                <td style="padding:10px; text-align:center;">${l.clicks || 0}</td>
            </tr>`;
        });
        html += '</table>';
        
        listaAlue.innerHTML = html;

    } catch (error) {
        listaAlue.innerHTML = "Virhe linkkien hakemisessa.";
        console.error(error);
    }
}