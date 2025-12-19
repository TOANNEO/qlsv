import { updateLeaveStatus } from '../../infrastructure/repositories/leaveRepository';

export async function approveLeave(requestId, token) {
  return updateLeaveStatus(requestId, 'APPROVED', token);
}

export async function rejectLeave(requestId, token) {
  return updateLeaveStatus(requestId, 'REJECTED', token);
}
