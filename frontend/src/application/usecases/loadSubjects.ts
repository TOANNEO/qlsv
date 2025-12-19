import { Subject } from "../../domain/models/Subject";
import { subjectRepository } from "../../infrastructure/repositories/subjectRepository";

export const loadSubjects = (): Promise<Subject[]> => {
  return subjectRepository.getSubjects();
};
