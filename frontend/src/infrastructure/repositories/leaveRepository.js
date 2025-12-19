import { httpClient } from '../api/httpClient';
import { toLeaveRequest, toLeaveRequests } from '../../domain/models/leaveRequest';

export async function createLeaveRequest(input, token) {
  const data = await httpClient('/leave-requests', {
    method: 'POST',
    token,
    body: input,
  });
  return toLeaveRequest(data);
}

export async function fetchStudentLeaves(token) {
  const data = await httpClient('/leave-requests/my-history', { token });
  return toLeaveRequests(data);
}

export async function fetchLecturerLeaves(courseId, token) {
  const data = await httpClient(`/leave-requests/course/${courseId}`, { token });
  return toLeaveRequests(data);
}

export async function updateLeaveStatus(requestId, status, token) {
  const data = await httpClient(`/leave-requests/${requestId}/status`, {
    method: 'PATCH',
    token,
    body: { status },
  });
  return toLeaveRequest(data);
}
