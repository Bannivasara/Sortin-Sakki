const API_URL = '/api';

async function lataaKaikki() {
    if (typeof lataaTiedot === 'function') {
        lataaTiedot('linkit', 'Osoitteet');
        lataaTiedot('linkkisalasanat', 'rekisterointiavaimet');
    }
}