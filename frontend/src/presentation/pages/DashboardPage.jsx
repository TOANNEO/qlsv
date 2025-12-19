import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../state/AuthContext';
import { loadCourses } from '../../application/usecases/loadCourses';
import { RoleLabels } from '../../domain/models/user';

export function DashboardPage() {
  const { user, token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (!user || !token) return;
      setIsLoading(true);
      try {
        const result = await loadCourses({ token, role: user.role });
        setCourses(result || []);
      } catch (err) {
        setError(err.message || 'Không thể tải danh sách lớp.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [token, user]);

  const statisticCards = [
    {
      title: 'Lớp học phần',
      value: courses.length,
      detail: user?.role === 'STUDENT' ? 'Lớp đang tham gia' : 'Tổng số lớp quản lý',
    },
    {
      title: 'Vai trò',
      value: RoleLabels[user?.role] || user?.role,
      detail: 'Phân quyền truy cập hệ thống',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tổng quan"
        subtitle="Xem nhanh tiến độ lớp học, điểm danh và đơn xin phép."
        actions={<Button variant="soft">Hướng dẫn sử dụng</Button>}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {statisticCards.map((card) => (
          <Card key={card.title} className="bg-gradient-to-br from-white to-brand-50/30">
            <div className="text-sm text-slate-500">{card.title}</div>
            <div className="mt-2 text-3xl font-semibold text-slate-900">{card.value}</div>
            <div className="text-sm text-slate-600">{card.detail}</div>
          </Card>
        ))}
      </div>

      <Card title="Thông tin tài khoản">
        <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InfoRow label="Họ tên" value={user?.fullName || user?.username} />
          <InfoRow label="Email" value={user?.email} />
          <InfoRow label="Mã sinh viên / giảng viên" value={user?.studentCode || user?.lecturerCode || '—'} />
          <InfoRow label="Khoa/Bộ môn" value={user?.department || '—'} />
          <InfoRow label="Trạng thái" value={<StatusBadge status={user?.enabled ? 'ACTIVE' : 'INACTIVE'} />} />
        </dl>
      </Card>

      <Card
        title="Lớp học gần nhất"
        description={
          user?.role === 'STUDENT'
            ? 'Các lớp đang đăng ký giúp bạn kiểm tra lịch điểm danh và xin phép nhanh.'
            : 'Theo dõi lớp phụ trách để mở hoặc đóng phiên điểm danh.'
        }
      >
        {error && <div className="text-sm text-red-600">{error}</div>}
        {isLoading ? (
          <div className="text-sm text-slate-600">Đang tải lớp học...</div>
        ) : courses.length === 0 ? (
          <div className="text-sm text-slate-600">Chưa có lớp nào.</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {courses.slice(0, 4).map((course) => (
              <li key={course.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-semibold text-slate-900">{course.subjectName}</p>
                  <p className="text-xs text-slate-500">{course.code}</p>
                </div>
                <div className="text-right text-sm text-slate-600">
                  <p>{course.schedule?.dayOfWeek}</p>
                  <p className="text-xs text-slate-500">{course.schedule?.range}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="text-sm text-slate-900">{value || '—'}</dd>
    </div>
  );
}
