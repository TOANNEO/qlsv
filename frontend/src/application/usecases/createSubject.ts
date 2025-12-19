import { CreateSubjectPayload, Subject } from "../../domain/models/Subject";
import { subjectRepository } from "../../infrastructure/repositories/subjectRepository";

export const createSubject = (payload: CreateSubjectPayload): Promise<Subject> => {
  return subjectRepository.createSubject(payload);
};
