const teemaNappi = document.getElementById('teeman-vaihto');

teemaNappi.addEventListener('click', () => {
    document.body.classList.toggle('yoteema');
	if (document.body.classList.contains('yoteema')) {
        localStorage.setItem('teema', 'tumma');
        teemaNappi.textContent = '☀️ Vaalea teema';
    } else {
        localStorage.setItem('teema', 'vaalea');
        teemaNappi.textContent = '🌙 Tumma teema';
    }
});

if (localStorage.getItem('teema') === 'tumma') {
    document.body.classList.add('yoteema');
    teemaNappi.textContent = '☀️ Vaalea teema';
}