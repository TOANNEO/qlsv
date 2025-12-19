import { CreateSemesterPayload, Semester } from '../../domain/entities/semester';
import { SemesterRepository, semesterRepository } from '../../infrastructure/repositories/semesterRepository';

export async function createSemester(
  payload: CreateSemesterPayload,
  repository: SemesterRepository = semesterRepository
): Promise<Semester> {
  return repository.createSemester(payload);
}
