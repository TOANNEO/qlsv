import { fetchLecturerLeaves, fetchStudentLeaves } from '../../infrastructure/repositories/leaveRepository';

export async function loadLeaveRequests({ token, role, courseId }) {
  if (role === 'LECTURER') {
    return courseId ? fetchLecturerLeaves(courseId, token) : [];
  }
  return fetchStudentLeaves(token);
}
