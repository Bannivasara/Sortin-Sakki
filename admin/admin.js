async function haeLinkit() {
    const listaAlue = document.getElementById('linkki-lista-alue');
    listaAlue.innerHTML = "<p style='color: white;'>Haetaan linkkejä...</p>";

    try {
        // Kutsutaan Workerin uutta rajapintaa
        const response = await fetch('https://soro.la/api/listaa');
        const linkit = await response.json();

        if (linkit.length === 0) {
            listaAlue.innerHTML = "<p style='color: white;'>Ei vielä linkkejä tietokannassa.</p>";
            return;
        }

        // Luodaan taulukko
        let html = `
            <table style="width:100%; color:white; border-collapse: collapse; margin-top:20px; font-family: Arial, sans-serif;">
                <thead>
                    <tr style="border-bottom: 2px solid #0e11e3; text-align: left;">
                        <th style="padding: 10px;">ID</th>
                        <th style="padding: 10px;">Kohde</th>
                        <th style="padding: 10px; text-align: center;">Klikit</th>
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
                </tr>
            `;
        });

        html += '</tbody></table>';
        listaAlue.innerHTML = html;

    } catch (error) {
        listaAlue.innerHTML = "<p style='color: red;'>Virhe linkkien hakemisessa. Tarkista konsoli.</p>";
        console.error("Haku epäonnistui:", error);
    }
}