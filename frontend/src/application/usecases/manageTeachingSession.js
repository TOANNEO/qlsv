import { closeSession, startSession, studentCheckIn } from '../../infrastructure/repositories/attendanceRepository';

export async function startTeachingSession(courseId, token) {
  return startSession(courseId, token);
}

export async function closeTeachingSession(courseId, token) {
  return closeSession(courseId, token);
}

export async function submitStudentCheckIn(courseId, token) {
  return studentCheckIn(courseId, token);
}
