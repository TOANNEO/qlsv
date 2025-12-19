import { userRepository } from "../../infrastructure/repositories/userRepository";

export const createUser = async (data, { token } = {}) => {
  return userRepository.createUser(data, { token });
};

export default createUser;
