const res = await fetch('https://soro.la', { // Kutsu suoraan Workeria
    method: 'POST',
    body: new FormData(form)
});