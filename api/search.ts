export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query) {
    return new Response(JSON.stringify({ error: 'Query parameter is missing' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  // A Vercel injetará essa variável em produção
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API Key do servidor não configurada' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  const tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=pt-BR&query=${encodeURIComponent(query)}&page=1&include_adult=false`;

  try {
    const response = await fetch(tmdbUrl);
    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Falha ao buscar no TMDB' }), {
        status: response.status,
        headers: { 'content-type': 'application/json' },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
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
