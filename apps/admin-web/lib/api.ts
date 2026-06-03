// Petites aides fetch côté client.

export async function apiGet<T>(url: string): Promise<T> {
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error(`GET ${url} → ${r.status}`);
  return r.json();
}

async function send<T>(method: string, url: string, body?: unknown): Promise<T> {
  const r = await fetch(url, {
    method,
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!r.ok) {
    let msg = `${method} ${url} → ${r.status}`;
    try {
      const j = await r.json();
      if (j?.error) msg = j.error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  return r.json();
}

export const apiPost = <T>(url: string, body?: unknown) => send<T>('POST', url, body);
export const apiPatch = <T>(url: string, body?: unknown) => send<T>('PATCH', url, body);
export const apiPut = <T>(url: string, body?: unknown) => send<T>('PUT', url, body);
export const apiDelete = <T>(url: string) => send<T>('DELETE', url);
