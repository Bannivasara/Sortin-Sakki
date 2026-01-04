// 1. Linkin luominen
lomake.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = lomake.querySelector('button');
    const idValue = document.getElementById('uusi-id').value; // Varmista että ID-kentän ID on tämä
    const urlValue = document.getElementById('uusi-url').value; // Varmista että URL-kentän ID on tämä

    btn.innerText = "Käsitellään...";

    try {
        const res = await fetch('https://soro.la', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // Kerrotaan että lähetetään JSONia
            body: JSON.stringify({ id: idValue, url: urlValue }) // Muutetaan JSONiksi
        });

        if (res.ok) {
            // Worker palauttaa nyt JSONin {success: true}, mutta tarvitset sen ID:n
            // Joten käytetään suoraan sitä idValuea jonka annoit
            lomake.style.display = 'none';
            tulosAlue.style.display = 'block';
            urlInput.value = "soro.la/" + idValue;
        } else {
            alert("Virhe tallennuksessa.");
        }
    } catch (e) { 
        alert("Yhteysvirhe!"); 
    }
    btn.innerText = "Lyhennä linkki";
});