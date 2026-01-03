async function kirjauduSisaan() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    const response = await fetch('https://sorola-short.bannivasara.workers.dev/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
    });

    const result = await response.json();

    if (result.success) {
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('admin-content').style.display = 'block';
        haeLinkit(); // Haetaan heti linkkilista näkyviin
    } else {
        alert("Pääsy evätty!");
    }
}