-- Execute este script no SQL Editor do seu projeto Supabase

CREATE TABLE public.movies (
    id BIGINT PRIMARY KEY, -- Usaremos o ID do próprio TMDB
    title TEXT NOT NULL,
    original_title TEXT,
    overview TEXT,
    poster_path TEXT,
    release_date TEXT,
    
    -- Campos de controle
    watched BOOLEAN DEFAULT false,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    watched_at TIMESTAMP WITH TIME ZONE,
    
    -- Avaliações
    rating_he NUMERIC DEFAULT 0,
    rating_she NUMERIC DEFAULT 0,
    comment TEXT
);

-- Configuração de segurança RLS (Row Level Security)
-- Como este é um app pessoal sem autenticação no momento, 
-- vamos permitir acesso total (leitura e escrita) para fins de facilidade.
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access"
ON public.movies FOR SELECT
USING (true);

CREATE POLICY "Allow anonymous insert access"
ON public.movies FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow anonymous update access"
ON public.movies FOR UPDATE
USING (true);

CREATE POLICY "Allow anonymous delete access"
ON public.movies FOR DELETE
USING (true);
