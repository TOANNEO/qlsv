import { useEffect, useMemo, useState } from 'react';
import { loadCourses, loadCourseSessions, loadStudentHistory } from '../../application/usecases/loadCourses';
import { closeTeachingSession, startTeachingSession, submitStudentCheckIn } from '../../application/usecases/manageTeachingSession';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { Select } from '../components/Select';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../state/AuthContext';

export function AttendancePage() {
  const { user, token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [sessions, setSessions] = useState([]);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      if (!user || !token) return;
      setLoading(true);
      try {
        const data = await loadCourses({ token, role: user.role });
        setCourses(data || []);
        if (data && data.length) {
          setSelectedCourseId(String(data[0].id));
        }
      } catch (err) {
        setMessage(err.message || 'Không thể tải danh sách lớp.');
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
  }, [token, user]);

  useEffect(() => {
    async function loadData() {
      if (!selectedCourseId || !token) return;
      setLoading(true);
      try {
        const [sessionData, historyData] = await Promise.all([
          loadCourseSessions(selectedCourseId, token),
          user?.role === 'STUDENT' ? loadStudentHistory(selectedCourseId, token) : Promise.resolve([]),
        ]);
        setSessions(sessionData || []);
        setHistory(historyData || []);
      } catch (err) {
        setMessage(err.message || 'Không thể tải dữ liệu điểm danh.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedCourseId, token, user]);

  const selectedCourse = useMemo(
    () => courses.find((course) => String(course.id) === String(selectedCourseId)),
    [courses, selectedCourseId]
  );

  const handleStart = async () => {
    setMessage(null);
    try {
      const session = await startTeachingSession(Number(selectedCourseId), token);
      setSessions((prev) => [session, ...prev]);
      setMessage('Đã mở phiên điểm danh.');
    } catch (err) {
      setMessage(err.message || 'Không thể mở phiên.');
    }
  };

  const handleClose = async () => {
    setMessage(null);
    try {
      const session = await closeTeachingSession(Number(selectedCourseId), token);
      setSessions((prev) => prev.map((item) => (item.id === session.id ? session : item)));
      setMessage('Đã đóng phiên điểm danh.');
    } catch (err) {
      setMessage(err.message || 'Không thể đóng phiên.');
    }
  };

  const handleCheckIn = async () => {
    setMessage(null);
    try {
      await submitStudentCheckIn(Number(selectedCourseId), token);
      setMessage('Quét điểm danh thành công.');
    } catch (err) {
      setMessage(err.message || 'Không thể điểm danh.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Điểm danh" subtitle="Mở/đóng phiên và theo dõi lịch sử điểm danh." />

      {message && <div className="rounded-lg border border-brand-100 bg-brand-50 px-3 py-2 text-sm text-brand-700">{message}</div>}

      <Card title="Chọn lớp học">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <Select
            label="Lớp"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            options={courses.map((course) => ({ value: course.id, label: `${course.subjectName} (${course.code})` }))}
          />
          {user?.role === 'LECTURER' && (
            <div className="flex gap-2">
              <Button onClick={handleStart} disabled={!selectedCourseId}>
                Mở phiên
              </Button>
              <Button onClick={handleClose} variant="ghost" disabled={!selectedCourseId}>
                Đóng phiên
              </Button>
            </div>
          )}
          {user?.role === 'STUDENT' && (
            <Button onClick={handleCheckIn} disabled={!selectedCourseId}>
              Quét điểm danh
            </Button>
          )}
        </div>
        {selectedCourse && (
          <p className="mt-3 text-sm text-slate-600">
            Lịch học: {selectedCourse.schedule?.dayOfWeek || '—'} {selectedCourse.schedule?.range || ''}
          </p>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card title="Phiên điểm danh">
          {loading && <div className="text-sm text-slate-600">Đang tải...</div>}
          {!loading && sessions.length === 0 && <EmptyState title="Chưa có phiên" description="Mở phiên mới để bắt đầu điểm danh." />}
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{session.courseName}</p>
                  <p className="text-xs text-slate-500">{session.startTime}</p>
                </div>
                <StatusBadge status={session.status} />
              </div>
            ))}
          </div>
        </Card>

        <Card title="Lịch sử của tôi">
          {user?.role !== 'STUDENT' ? (
            <p className="text-sm text-slate-600">Chỉ sinh viên mới xem được lịch sử của mình.</p>
          ) : loading ? (
            <div className="text-sm text-slate-600">Đang tải...</div>
          ) : history.length === 0 ? (
            <EmptyState title="Chưa có lịch sử" description="Quét mã QR để cập nhật điểm danh." />
          ) : (
            <ul className="space-y-3">
              {history.map((item) => (
                <li key={item.sessionId} className="rounded-lg border border-slate-100 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Phiên #{item.sessionId}</p>
                      <p className="text-xs text-slate-500">{item.sessionDate}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="text-xs text-slate-500">Giờ quét: {item.checkInTime || '—'}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
