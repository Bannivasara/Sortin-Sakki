export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const body = request.method === 'POST' ? await request.json() : null;

    // 1. Kirjautuminen (Kayttajat-taulu LINKKI_DB:ssä)
    if (url.pathname === "/admin-kirjaudu") {
      const user = await env.LINKKI_DB.prepare("SELECT * FROM Kayttajat WHERE username = ? AND password = ?")
        .bind(body.username, body.password).first();
      return user ? new Response(JSON.stringify({ success: true })) : new Response("Error", { status: 401 });
    }

    // 2. Tiedon haku eri kannoista
    if (url.pathname === "/admin-hae") {
      const taulu = url.searchParams.get("taulu");
      
      if (taulu === "Osoitteet" || taulu === "rekisterointiavaimet") {
        const data = await env.LINKKI_DB.prepare(`SELECT * FROM ${taulu}`).all();
        return new Response(JSON.stringify(data.results));
      } 
      
      if (taulu === "admin-users") {
        const data = await env.KORTTI_DB.prepare(`SELECT * FROM "${taulu}"`).all();
        return new Response(JSON.stringify(data.results));
      }
    }
    
    // Lisää tänne poisto- ja muokkauslogiikka vastaavalla tavalla...
    return new Response("Not Found", { status: 404 });
  }
};