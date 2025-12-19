import { CreateSemesterPayload, Semester } from '../../domain/entities/semester';
import { apiClient } from '../httpClient';

const stubSemesters: Semester[] = [
  {
    id: 1,
    name: 'Học kỳ Thu',
    year: 2024,
    startDate: '2024-09-01',
    endDate: '2024-12-20'
  },
  {
    id: 2,
    name: 'Học kỳ Xuân',
    year: 2025,
    startDate: '2025-01-10',
    endDate: '2025-05-05'
  },
  {
    id: 3,
    name: 'Học kỳ Hè',
    year: 2025,
    startDate: '2025-06-01',
    endDate: '2025-07-30'
  }
];

export interface SemesterRepository {
  createSemester(payload: CreateSemesterPayload): Promise<Semester>;
  getSemesters(): Promise<Semester[]>;
}

export const semesterRepository: SemesterRepository = {
  async createSemester(payload) {
    const response = await apiClient.post<Semester>('/semesters', payload);
    return response.data;
  },

  async getSemesters() {
    try {
      const response = await apiClient.get<Semester[]>('/semesters');
      return response.data;
    } catch (error) {
      console.warn('GET /semesters not available, using stub semesters.', error);
      return stubSemesters.map((item) => ({ ...item }));
    }
  }
};
