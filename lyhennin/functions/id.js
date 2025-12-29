export async function onRequestGet(context) {
  const { env, params, request } = context;
  const id = params.id;

  const linkRaw = await env.LYHENNIN_KV.get(id);
  
  if (linkRaw) {
    let linkData = JSON.parse(linkRaw);
    
    // Kasvata klikkausta linkissä
    linkData.clicks = (linkData.clicks || 0) + 1;
    await env.LYHENNIN_KV.put(id, JSON.stringify(linkData));
    
    // PÄIVITYS: Kasvata kokonaisklikkauksia STATS_KV:ssä
    const currentClicks = await env.STATS_KV.get('total_clicks') || "0";
    await env.STATS_KV.put('total_clicks', (parseInt(currentClicks) + 1).toString());
    
    return Response.redirect(linkData.url, 302);
  }

  const url = new URL(request.url);
  return Response.redirect(`${url.protocol}//${url.host}`, 302);
}