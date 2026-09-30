export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ error: 'Movie ID is missing' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API Key do servidor não configurada' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  const detailsUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=pt-BR`;
  const providersUrl = `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${apiKey}`;

  try {
    const [detailsRes, providersRes] = await Promise.all([
      fetch(detailsUrl),
      fetch(providersUrl)
    ]);

    if (!detailsRes.ok) {
      return new Response(JSON.stringify({ error: 'Falha ao buscar detalhes no TMDB' }), {
        status: detailsRes.status,
        headers: { 'content-type': 'application/json' },
      });
    }

    const details = await detailsRes.json();
    let watch_providers = undefined;

    if (providersRes.ok) {
      const providersData = await providersRes.json();
      // Pegar os provedores do Brasil (BR)
      watch_providers = providersData.results?.BR;
    }

    const combinedData = {
      ...details,
      watch_providers
    };

    return new Response(JSON.stringify(combinedData), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
