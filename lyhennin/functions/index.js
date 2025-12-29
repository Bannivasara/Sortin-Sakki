export async function onRequestPost(context) {
  const { request, env } = context;
  const formData = await request.formData();
  let targetUrl = formData.get('url')?.trim(); // Varmista, että HTML:ssä on name="url"

  if (!targetUrl) return new Response("Osoite puuttuu", { status: 400 });
  if (!/^https?:\/\//i.test(targetUrl)) targetUrl = 'https://' + targetUrl;

  const id = Math.random().toString(36).substring(2, 7);
  const linkData = { url: targetUrl, clicks: 0, created: new Date().toISOString() };
  
  // Tallenna linkki
  await env.LYHENNIN_KV.put(id, JSON.stringify(linkData));
  
  // PÄIVITYS: Kasvata kokonaismäärää STATS_KV:ssä
  const currentCreated = await env.STATS_KV.get('total_created') || "0";
  await env.STATS_KV.put('total_created', (parseInt(currentCreated) + 1).toString());

  return new Response(id, { status: 200 });
}