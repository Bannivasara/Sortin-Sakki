export async function onRequestGet(context) {
  const created = await context.env.STATS_KV.get('total_created') || "0";
  const clicks = await context.env.STATS_KV.get('total_clicks') || "0";
  return new Response(JSON.stringify({ created, clicks }), {
    headers: { "Content-Type": "application/json" }
  });
}