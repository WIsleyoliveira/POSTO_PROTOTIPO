export const API_BASE = import.meta.env.VITE_API_URL ?? '';

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`Falha ao carregar ${path} (${res.status})`);
  const json = await res.json();
  if (!json.ok) throw new Error('Resposta inválida da API');
  return json.data as T;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok || !json.ok) throw new Error(json?.error ?? `Falha ao enviar ${path} (${res.status})`);
  return json.data as T;
}