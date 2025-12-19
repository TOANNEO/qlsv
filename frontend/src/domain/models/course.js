import { toUser } from './user';

function formatTimeRange(start, end) {
  if (!start || !end) return null;
  return `${start} - ${end}`;
}

export function toCourse(dto = {}) {
  return {
    id: dto.id,
    code: dto.courseCode,
    subjectName: dto.subject?.name,
    subjectCode: dto.subject?.subjectCode,
    credits: dto.subject?.credits,
    semester: dto.semester?.name,
    semesterYear: dto.semester?.year,
    lecturers: (dto.lecturers || []).map(toUser),
    schedule: {
      dayOfWeek: dto.dayOfWeek,
      startTime: dto.startTime,
      endTime: dto.endTime,
      range: formatTimeRange(dto.startTime, dto.endTime),
    },
  };
}

export function toCourses(dtos = []) {
  return dtos.map(toCourse);
}
