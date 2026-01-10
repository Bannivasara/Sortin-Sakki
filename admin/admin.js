// admin.js
const API_URL = '/api'; // Käytetään suhteellista polkua samassa domainissa

async function lataaKaikki() {
    if (typeof lataaTiedot === 'function') {
        lataaTiedot('linkit', 'Osoitteet');
        lataaTiedot('linkkisalasanat', 'rekisterointiavaimet');
    }
}