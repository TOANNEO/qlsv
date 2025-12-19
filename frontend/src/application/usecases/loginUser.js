import { login as loginRepository, logout as logoutRepository } from '../../infrastructure/repositories/authRepository';

export async function loginUser(credentials) {
  return loginRepository(credentials);
}

export function logoutUser() {
  logoutRepository();
}
