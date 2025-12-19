import { userRepository } from "../../infrastructure/repositories/userRepository";

export const deleteUser = async (id, { token } = {}) => {
  return userRepository.deleteUser(id, { token });
};

export default deleteUser;
