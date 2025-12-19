export function toLeaveRequest(dto = {}) {
  return {
    id: dto.id,
    courseName: dto.courseName,
    studentName: dto.studentName,
    studentCode: dto.studentCode,
    requestDate: dto.requestDate,
    reason: dto.reason,
    status: dto.status,
    type: dto.type,
    createdAt: dto.createdAt,
  };
}

export function toLeaveRequests(dtos = []) {
  return dtos.map(toLeaveRequest);
}
