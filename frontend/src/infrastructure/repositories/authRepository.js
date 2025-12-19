import { httpClient } from '../api/httpClient';
import { tokenStorage } from '../storage/tokenStorage';
import { toAuthUser, toUser } from '../../domain/models/user';

export async function login(credentials) {
  const data = await httpClient('/auth/login', { method: 'POST', body: credentials });
  const token = data.accessToken || data.token;
  tokenStorage.save(token);

  return {
    token,
    user: toAuthUser(data),
  };
}

export async function fetchCurrentUser(token) {
  const data = await httpClient('/users/me', { token });
  return toUser(data);
}

export function logout() {
  tokenStorage.clear();
}
