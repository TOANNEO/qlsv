export function toAttendanceSession(dto = {}) {
  return {
    id: dto.sessionId,
    courseId: dto.courseId,
    courseName: dto.courseName,
    startTime: dto.startTime,
    status: dto.status,
    qrCodeData: dto.qrCodeData,
  };
}

export function toAttendanceSessions(dtos = []) {
  return dtos.map(toAttendanceSession);
}

export function toHistoryRecord(dto = {}) {
  return {
    sessionId: dto.sessionId,
    sessionDate: dto.sessionDate,
    checkInTime: dto.checkInTime,
    status: dto.status,
  };
}

export function toHistoryRecords(dtos = []) {
  return dtos.map(toHistoryRecord);
}
