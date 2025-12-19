import { createLeaveRequest } from '../../infrastructure/repositories/leaveRepository';

export async function submitLeaveRequest(input, token) {
  return createLeaveRequest(input, token);
}
