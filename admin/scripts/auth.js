// scripts/auth.js
document.addEventListener('DOMContentLoaded', () => {
    const lomake = document.getElementById('kirjautuminen');
    if (!lomake) return;

    lomake.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(lomake);
        const u = fd.get('user'); // Käytetään HTML:n name="user"
        const p = fd.get('password');

        try {
            const r = await fetch(`${API_URL}/admin-kirjaudu`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: u, password: p })
            });

            const data = await r.json();

            if (r.ok) {
                // Piilotetaan kirjautuminen ja näytetään hallintapaneelit
                document.getElementById('kirjautuminen').style.display = 'none';
                document.getElementById('linkit').style.display = 'block';
                document.getElementById('linkkisalasanat').style.display = 'block';
                document.getElementById('korttiyritykset').style.display = 'block';
                lataaKaikki();
            } else {
                alert("Virhe: " + (data.error || "Kirjautuminen epäonnistui"));
            }
        } catch (err) {
            console.error("Yhteysvirhe:", err);
            alert("Palvelinvirhe 500. Varmista että Worker on pystyssä.");
        }
    });
});