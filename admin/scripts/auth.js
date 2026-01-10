document.addEventListener('DOMContentLoaded', () => {
    const lomake = document.getElementById('kirjautuminen');
    if (!lomake) return;
    lomake.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(lomake);
        try {
            // TÄRKEÄ: API_URL tulee admin.js:stä ja on "/api"
            const r = await fetch(`${API_URL}/kirjaudu`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username: fd.get('user'), 
                    password: fd.get('password') 
                })
            });
            if (r.ok) {
                document.getElementById('kirjautuminen').style.display = 'none';
                document.getElementById('linkit').style.display = 'block';
                document.getElementById('linkkisalasanat').style.display = 'block';
                lataaKaikki();
            } else { 
                alert("Kirjautuminen epäonnistui - tarkista tunnukset"); 
            }
        } catch (err) { 
            alert("Yhteysvirhe palvelimeen"); 
        }
    });
});