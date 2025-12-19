import { Semester } from '../../domain/entities/semester';
import { SemesterRepository, semesterRepository } from '../../infrastructure/repositories/semesterRepository';

export async function loadSemesters(
  repository: SemesterRepository = semesterRepository
): Promise<Semester[]> {
  return repository.getSemesters();
}
