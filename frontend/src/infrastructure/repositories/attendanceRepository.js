import { httpClient } from '../api/httpClient';
import { toAttendanceSession } from '../../domain/models/attendance';

export async function startSession(courseId, token) {
  const payload = await httpClient('/attendance/start-session', {
    method: 'POST',
    token,
    body: { courseId },
  });
  return toAttendanceSession(payload);
}

export async function closeSession(courseId, token) {
  const payload = await httpClient('/attendance/close-session', {
    method: 'POST',
    token,
    body: { courseId },
  });
  return toAttendanceSession(payload);
}

export async function studentCheckIn(courseId, token) {
  const payload = await httpClient('/attendance/check-in', {
    method: 'POST',
    token,
    body: { courseId },
  });
  return payload;
}
