import { userRepository } from "../../infrastructure/repositories/userRepository";

export const loadUsers = async ({ page = 0, size = 10, sort, token } = {}) => {
  return userRepository.listUsers({ page, size, sort, token });
};

export default loadUsers;
