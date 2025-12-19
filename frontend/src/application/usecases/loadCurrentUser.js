import { fetchCurrentUser } from '../../infrastructure/repositories/authRepository';

export async function loadCurrentUser(token) {
  if (!token) return null;
  return fetchCurrentUser(token);
}
