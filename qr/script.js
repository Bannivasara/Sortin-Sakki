document.addEventListener('DOMContentLoaded', () => {
    const tyyppiValikko = document.getElementById('qr-tyyppi');
    const s1 = document.getElementById('syote1');
    const s2 = document.getElementById('syote2');
    const s3 = document.getElementById('syote3');
    const nappi = document.getElementById('generoi-btn');
    const qrKuva = document.getElementById('qr-kuva');
    const qrTulos = document.getElementById('qr-tulos');

    // Vaihdetaan kenttiä valinnan mukaan
    tyyppiValikko.addEventListener('change', () =>  
    {   s2.style.display = 'none';
        s3.style.display = 'none';
        if (tyyppiValikko.value === 'text') {
            s1.placeholder = "Kirjoita tekstiä"
        } else if (tyyppiValikko.value === 'url') {
            s1.placeholder = "Kirjoita osoite (https://...)"
        } else if (tyyppiValikko.value === 'wifi') {
            s1.placeholder = "Verkon Nimi(SSID)";
            s2.placeholder = "Verkon salasana";
            s2.type = "password"
            s2.style.display = 'block'
        } else if (tyyppiValikko.value === 'vcard') {
            s1.placeholder = "Nimi";
            s2.placeholder = "Puhelinnumero";
            s3.placeholder = "Sähköposti";
            s2.style.display = 'block'
            s3.style.display = 'block'
        }
    });

    nappi.addEventListener('click', () => {
        let lopullinenData = "";
        const v1 = s1.value;
        const v2 = s2.value;
        const v3 = s3.value;

        // Muotoillaan teksti oikeaan "bitti"-muotoon
        if (tyyppiValikko.value === 'text') {
            lopullinenData = v1;
        } else if (tyyppiValikko.value === 'url') {
            lopullinenData = v1;
        } else if (tyyppiValikko.value === 'wifi') {
            lopullinenData = `WIFI:T:WPA;S:${v1};P:${v2};;`;
        } else if (tyyppiValikko.value === 'vcard') {
            lopullinenData = `BEGIN:VCARD\nVERSION:3.0\nFN:${v1}\nTEL:${v2}\nEMAIL:${v3}\nEND:VCARD`;
        }

        if (v1.trim() !== "") {
            // Käytetään ilmaista APIa kuvan luomiseen
            qrKuva.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(lopullinenData)}`;
            qrTulos.style.display = 'block';
        }
    });
});

