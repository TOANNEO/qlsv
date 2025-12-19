import { apiClient } from "../apiClient";

const listUsers = async ({ page = 0, size = 10, sort, token } = {}) => {
  const params = { page, size };
  if (sort) params.sort = sort;
  return apiClient.get("/users", { params, token });
};

const getUserById = async (id, { token } = {}) => {
  return apiClient.get(`/users/${id}`, { token });
};

const createUser = async (payload, { token } = {}) => {
  return apiClient.post("/users/create", payload, { token });
};

const updateUser = async (id, payload, { token } = {}) => {
  return apiClient.put(`/users/${id}`, payload, { token });
};

const deleteUser = async (id, { token } = {}) => {
  return apiClient.delete(`/users/${id}`, { token });
};

export const userRepository = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

export default userRepository;
