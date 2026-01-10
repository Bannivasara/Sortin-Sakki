// auth.js - Kirjautumislogiikka
document.addEventListener('DOMContentLoaded', () => {
    const lomake = document.getElementById('kirjautuminen');
    if (!lomake) return;

    lomake.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(lomake);
        const u = fd.get('user'); // HTML: name="user"
        const p = fd.get('password'); // HTML: name="password"

        try {
            const r = await fetch(`${API_URL}/admin-kirjaudu`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: u, password: p })
            });

            const data = await r.json();

            if (r.ok) {
                document.getElementById('kirjautuminen').style.display = 'none';
                ['linkit', 'linkkisalasanat', 'korttiyritykset'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.style.display = 'block';
                });
                lataaKaikki();
            } else {
                alert("Virhe: " + (data.error || "Väärät tunnukset"));
            }
        } catch (err) {
            console.error("Yhteysvirhe:", err);
        }
    });
});