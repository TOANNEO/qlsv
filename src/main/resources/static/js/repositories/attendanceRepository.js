const ATTENDANCE_API_BASE = '/api/v1/attendance';

const buildAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response, fallbackMessage) => {
  if (response.ok) {
    if (response.status === 204) {
      return null;
    }
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return response.text();
  }

  const errorText = await response.text();
  throw new Error(errorText || fallbackMessage);
};

export const attendanceRepository = {
  async getSessionsByCourse(courseId) {
    const response = await fetch(`${ATTENDANCE_API_BASE}/course/${courseId}`, {
      headers: {
        ...buildAuthHeaders(),
      },
      credentials: 'include',
    });

    return handleResponse(response, 'Không thể tải danh sách phiên điểm danh');
  },

  async getRecordsBySession(sessionId) {
    const response = await fetch(`${ATTENDANCE_API_BASE}/session/${sessionId}/records`, {
      headers: {
        ...buildAuthHeaders(),
      },
      credentials: 'include',
    });

    return handleResponse(response, 'Không thể tải bản ghi điểm danh');
  },

  async updateRecordStatus(recordId, status) {
    const response = await fetch(`${ATTENDANCE_API_BASE}/record/${recordId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...buildAuthHeaders(),
      },
      credentials: 'include',
      body: JSON.stringify({ status }),
    });

    await handleResponse(response, 'Cập nhật trạng thái điểm danh thất bại');
  },
};

export default attendanceRepository;
