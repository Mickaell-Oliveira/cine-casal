export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const { password } = await req.json();
    const correctPassword = process.env.EDIT_PASSWORD;

    if (!correctPassword) {
      return new Response(
        JSON.stringify({ error: 'Senha de edição não configurada no servidor (Vercel).' }),
        {
          status: 500,
          headers: { 'content-type': 'application/json' },
        }
      );
    }

    if (password === correctPassword) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ success: false, error: 'Senha incorreta' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Bad request' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }
}
