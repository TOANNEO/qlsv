import { Semester, NewSemester } from '../../domain/models/semester';
import { apiClient, ApiError } from '../apiClient';

const stubSemesters: Semester[] = [
  {
    id: 1,
    name: 'Học kỳ Thu',
    year: 2024,
    startDate: '2024-08-15',
    endDate: '2024-12-20',
  },
  {
    id: 2,
    name: 'Học kỳ Xuân',
    year: 2025,
    startDate: '2025-01-10',
    endDate: '2025-05-15',
  },
];

function isEndpointUnavailable(error: unknown): boolean {
  const apiError = error as ApiError;
  return apiError.status === 404 || apiError.status === 501;
}

export const semesterRepository = {
  async getAll(): Promise<Semester[]> {
    try {
      return await apiClient.get<Semester[]>('/semesters');
    } catch (error) {
      if (isEndpointUnavailable(error)) {
        console.warn('Semesters endpoint unavailable, using stub data');
        return stubSemesters;
      }
      throw error;
    }
  },

  async create(payload: NewSemester): Promise<Semester> {
    return apiClient.post<Semester>('/semesters', payload);
  },
};
