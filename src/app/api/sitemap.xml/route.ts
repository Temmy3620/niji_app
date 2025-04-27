export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://vtubertracker.info/</loc></url>
  <url><loc>https://vtubertracker.info/current/nijisanji</loc></url>
  <url><loc>https://vtubertracker.info/current/hololive</loc></url>
  <url><loc>https://vtubertracker.info/current/vspo</loc></url>
  <url><loc>https://vtubertracker.info/current/neoporte</loc></url>
  <url><loc>https://vtubertracker.info/current/nanashiiInc</loc></url>
  <url><loc>https://vtubertracker.info/current/aogiri</loc></url>
  <url><loc>https://vtubertracker.info/current/noripro</loc></url>
  <url><loc>https://vtubertracker.info/current/dotlive</loc></url>
  <url><loc>https://vtubertracker.info/subscribers/nijisanji</loc></url>
  <url><loc>https://vtubertracker.info/subscribers/hololive</loc></url>
  <url><loc>https://vtubertracker.info/subscribers/vspo</loc></url>
  <url><loc>https://vtubertracker.info/subscribers/neoporte</loc></url>
  <url><loc>https://vtubertracker.info/subscribers/nanashiiInc</loc></url>
  <url><loc>https://vtubertracker.info/subscribers/aogiri</loc></url>
  <url><loc>https://vtubertracker.info/subscribers/noripro</loc></url>
  <url><loc>https://vtubertracker.info/subscribers/dotlive</loc></url>
  <url><loc>https://vtubertracker.info/views/nijisanji</loc></url>
  <url><loc>https://vtubertracker.info/views/hololive</loc></url>
  <url><loc>https://vtubertracker.info/views/vspo</loc></url>
  <url><loc>https://vtubertracker.info/views/neoporte</loc></url>
  <url><loc>https://vtubertracker.info/views/nanashiiInc</loc></url>
  <url><loc>https://vtubertracker.info/views/aogiri</loc></url>
  <url><loc>https://vtubertracker.info/views/noripro</loc></url>
  <url><loc>https://vtubertracker.info/views/dotlive</loc></url>
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
