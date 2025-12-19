import { userRepository } from "../../infrastructure/repositories/userRepository";

export const updateUser = async (id, data, { token } = {}) => {
  return userRepository.updateUser(id, data, { token });
};

export default updateUser;
