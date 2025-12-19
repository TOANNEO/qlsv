export interface Subject {
  id?: number;
  subjectCode: string;
  name: string;
  credits: number;
}

export interface CreateSubjectPayload {
  subjectCode: string;
  name: string;
  credits: number;
}
