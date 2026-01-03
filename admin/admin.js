async function kirjauduSisaan() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

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
        } else {
            alert("Pääsy evätty! Tarkista tunnus ja salasana.");
        }
    } catch (error) {
        console.error("Virhe:", error);
        alert("Yhteysvirhe palvelimeen.");
    }
}

// Voit myöhemmin lisätä tänne haeLinkit() funktion