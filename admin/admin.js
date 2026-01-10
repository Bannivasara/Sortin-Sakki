// scripts/admin.js
const API_URL = 'https://admin.bannivasara.workers.dev';

// Apufunktio, jolla päivitetään kaikki kolme palstaa yhdellä kertaa
async function lataaKaikki() {
    if (typeof lataaTiedot === 'function') {
        lataaTiedot('linkit', 'Osoitteet');
        lataaTiedot('linkkisalasanat', 'rekisterointiavaimet');
        lataaTiedot('korttiyritykset', 'admin-users');
    }
}