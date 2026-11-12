const TOKEN_KEY = '@CondoManager:token';
const ROLE_KEY = '@CondoManager:role';

export function parseRoleFromToken(token: string): string | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(normalized));
    return typeof decoded.role === 'string' ? decoded.role : null;
  } catch {
    return null;
  }
}

export function saveSession(token: string, role?: string | null): string {
  localStorage.setItem(TOKEN_KEY, token);

  const resolvedRole = role ?? parseRoleFromToken(token) ?? '';
  localStorage.setItem(ROLE_KEY, resolvedRole);

  return resolvedRole;
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUserRole(): string {
  const storedRole = localStorage.getItem(ROLE_KEY);
  if (storedRole) return storedRole;

  const token = getStoredToken();
  if (!token) return '';

  const roleFromToken = parseRoleFromToken(token);
  if (roleFromToken) {
    localStorage.setItem(ROLE_KEY, roleFromToken);
    return roleFromToken;
  }

  return '';
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}

export function isAdm(role: string): boolean {
  return role === 'ADM';
}
