// admin.js - Globaalit määritykset
const API_URL = 'https://admin.bannivasara.workers.dev';

// Funktio, joka päivittää kaikki palstat kerralla
async function lataaKaikki() {
    if (typeof lataaTiedot === 'function') {
        lataaTiedot('linkit', 'Osoitteet');
        lataaTiedot('linkkisalasanat', 'rekisterointiavaimet');
        lataaTiedot('korttiyritykset', 'admin-users');
    }
}