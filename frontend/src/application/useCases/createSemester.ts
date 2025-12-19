import { NewSemester, Semester } from '../../domain/models/semester';
import { semesterRepository } from '../../infrastructure/repositories/semesterRepository';

export async function createSemester(payload: NewSemester): Promise<Semester> {
  return semesterRepository.create(payload);
}
