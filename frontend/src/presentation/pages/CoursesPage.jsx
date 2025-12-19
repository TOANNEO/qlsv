import { useEffect, useMemo, useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../state/AuthContext';
import { loadCourses } from '../../application/usecases/loadCourses';
import { RoleLabels } from '../../domain/models/user';

export function CoursesPage() {
  const { user, token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourses() {
      if (!user || !token) return;
      setLoading(true);
      try {
        const result = await loadCourses({ token, role: user.role });
        setCourses(result || []);
      } catch (err) {
        setError(err.message || 'Không thể tải danh sách lớp.');
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [token, user]);

  const pageDescription = useMemo(() => {
    if (user?.role === 'STUDENT') return 'Xem lịch học và truy cập nhanh phiên điểm danh.';
    if (user?.role === 'LECTURER') return 'Quản lý lớp phụ trách, bắt đầu hoặc kết thúc phiên điểm danh.';
    return 'Theo dõi toàn bộ lớp học phần trong kỳ.';
  }, [user]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lớp học phần"
        subtitle={pageDescription}
        actions={<RoleBadge role={user?.role} />}
      />

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="text-sm text-slate-600">Đang tải dữ liệu...</div>
      ) : courses.length === 0 ? (
        <EmptyState
          title="Chưa có lớp nào"
          description="Hãy liên hệ quản trị viên để được cấp quyền và phân lớp."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {courses.map((course) => (
            <Card
              key={course.id}
              title={course.subjectName}
              description={`Mã lớp: ${course.code}`}
              actions={<Button variant="soft">Lịch điểm danh</Button>}
            >
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">Lịch học</span>
                  <span className="text-slate-700">{course.schedule?.dayOfWeek || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>Thời gian</span>
                  <span>{course.schedule?.range || '—'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>Học kỳ</span>
                  <span>
                    {course.semester} {course.semesterYear}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Giảng viên</p>
                  <p className="text-sm text-slate-600">
                    {course.lecturers?.length
                      ? course.lecturers.map((lec) => lec.fullName || lec.username).join(', ')
                      : 'Chưa phân công'}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function RoleBadge({ role }) {
  if (!role) return null;
  return (
    <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
      {RoleLabels[role] || role}
    </span>
  );
}
