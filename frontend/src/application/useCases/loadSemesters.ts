import { Semester } from '../../domain/models/semester';
import { semesterRepository } from '../../infrastructure/repositories/semesterRepository';

export async function loadSemesters(): Promise<Semester[]> {
  return semesterRepository.getAll();
}
