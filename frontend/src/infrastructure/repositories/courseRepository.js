import { httpClient } from '../api/httpClient';
import { toCourse, toCourses } from '../../domain/models/course';
import { toAttendanceSessions, toHistoryRecords } from '../../domain/models/attendance';

export async function fetchCourses({ token, role }) {
  const path = role === 'STUDENT' ? '/courses/my-courses' : '/courses';
  const data = await httpClient(path, { token });
  // Admin/secretary returns array; student returns array too
  return toCourses(data);
}

export async function fetchCourseSessions(courseId, token) {
  const sessions = await httpClient(`/attendance/course/${courseId}`, { token });
  return toAttendanceSessions(sessions);
}

export async function fetchStudentHistory(courseId, token) {
  const history = await httpClient(`/attendance/history/${courseId}`, { token });
  return toHistoryRecords(history);
}
