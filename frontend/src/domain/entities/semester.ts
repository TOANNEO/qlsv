export interface Semester {
  id?: number;
  name: string;
  year: number;
  startDate: string;
  endDate: string;
}

export type CreateSemesterPayload = Omit<Semester, 'id'>;
