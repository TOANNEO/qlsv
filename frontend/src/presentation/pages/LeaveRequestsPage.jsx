import { useEffect, useState } from 'react';
import { loadCourses } from '../../application/usecases/loadCourses';
import { loadLeaveRequests } from '../../application/usecases/loadLeaveRequests';
import { submitLeaveRequest } from '../../application/usecases/submitLeaveRequest';
import { approveLeave, rejectLeave } from '../../application/usecases/updateLeaveStatus';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { Select } from '../components/Select';
import { StatusBadge } from '../components/StatusBadge';
import { TextInput } from '../components/TextInput';
import { useAuth } from '../state/AuthContext';

const leaveTypes = [
  { value: 'ABSENCE', label: 'Vắng có phép' },
  { value: 'LATE', label: 'Xin đi muộn' },
];

export function LeaveRequestsPage() {
  const { user, token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({ reason: '', requestDate: '', type: leaveTypes[0].value });

  useEffect(() => {
    async function bootstrap() {
      if (!token || !user) return;
      try {
        const data = await loadCourses({ token, role: user.role });
        setCourses(data || []);
        if (data && data.length) {
          setSelectedCourseId(String(data[0].id));
        }
      } catch (err) {
        setMessage(err.message || 'Không thể tải lớp học.');
      }
    }

    bootstrap();
  }, [token, user]);

  useEffect(() => {
    async function fetchRequests() {
      if (!token || !user) return;
      setLoading(true);
      try {
        const data = await loadLeaveRequests({
          token,
          role: user.role,
          courseId: user.role === 'LECTURER' ? selectedCourseId : undefined,
        });
        setRequests(data || []);
      } catch (err) {
        setMessage(err.message || 'Không thể tải đơn.');
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, [token, user, selectedCourseId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);
    try {
      const created = await submitLeaveRequest(
        {
          ...form,
          courseId: Number(selectedCourseId),
        },
        token
      );
      setRequests((prev) => [created, ...prev]);
      setForm({ reason: '', requestDate: '', type: leaveTypes[0].value });
      setMessage('Gửi đơn thành công.');
    } catch (err) {
      setMessage(err.message || 'Không thể gửi đơn.');
    }
  };

  const handleDecision = async (requestId, approve) => {
    setMessage(null);
    try {
      const updated = approve ? await approveLeave(requestId, token) : await rejectLeave(requestId, token);
      setRequests((prev) => prev.map((req) => (req.id === requestId ? updated : req)));
      setMessage('Đã cập nhật trạng thái đơn.');
    } catch (err) {
      setMessage(err.message || 'Không thể cập nhật đơn.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Đơn xin phép" subtitle="Nộp đơn vắng mặt hoặc duyệt đơn theo lớp." />

      {message && <div className="rounded-lg border border-brand-100 bg-brand-50 px-3 py-2 text-sm text-brand-700">{message}</div>}

      <Card title="Bộ lọc">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <Select
            label="Lớp học"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            options={courses.map((course) => ({ value: course.id, label: `${course.subjectName} (${course.code})` }))}
          />
        </div>
      </Card>

      {user?.role === 'STUDENT' && (
        <Card title="Gửi đơn mới" description="Chọn lớp và thời gian vắng để gửi tới giảng viên phụ trách.">
          <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <Select
              label="Loại đơn"
              name="type"
              value={form.type}
              onChange={handleChange}
              options={leaveTypes}
              className="md:col-span-2"
            />
            <TextInput
              label="Ngày vắng"
              name="requestDate"
              type="date"
              value={form.requestDate}
              onChange={handleChange}
            />
            <TextInput
              label="Lý do"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="Ví dụ: Tham gia hội thảo khoa"
              className="md:col-span-2"
            />
            <div className="md:col-span-2">
              <Button type="submit" disabled={!selectedCourseId}>
                Gửi đơn
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card title="Danh sách đơn">
        {loading ? (
          <div className="text-sm text-slate-600">Đang tải đơn...</div>
        ) : requests.length === 0 ? (
          <EmptyState title="Chưa có đơn" description="Khi có đơn mới, bạn sẽ thấy tại đây." />
        ) : (
          <div className="space-y-3">
            {requests.map((request) => (
              <div key={request.id} className="rounded-lg border border-slate-100 p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{request.courseName}</p>
                    <p className="text-xs text-slate-500">{request.studentName}</p>
                  </div>
                  <StatusBadge status={request.status} />
                </div>
                <p className="mt-2 text-sm text-slate-700">Lý do: {request.reason}</p>
                <p className="text-xs text-slate-500">Ngày: {request.requestDate}</p>
                {user?.role === 'LECTURER' && request.status === 'PENDING' && (
                  <div className="mt-3 flex gap-2">
                    <Button variant="soft" onClick={() => handleDecision(request.id, true)}>
                      Chấp nhận
                    </Button>
                    <Button variant="danger" onClick={() => handleDecision(request.id, false)}>
                      Từ chối
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
