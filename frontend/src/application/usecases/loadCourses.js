import { fetchCourses, fetchCourseSessions, fetchStudentHistory } from '../../infrastructure/repositories/courseRepository';

export async function loadCourses({ token, role }) {
  return fetchCourses({ token, role });
}

export async function loadCourseSessions(courseId, token) {
  if (!courseId) return [];
  return fetchCourseSessions(courseId, token);
}

export async function loadStudentHistory(courseId, token) {
  if (!courseId) return [];
  return fetchStudentHistory(courseId, token);
}
