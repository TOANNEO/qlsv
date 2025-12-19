import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { createSemester } from '../../application/usecases/createSemester';
import { loadSemesters } from '../../application/usecases/loadSemesters';
import { CreateSemesterPayload, Semester } from '../../domain/entities/semester';
import { ALL_ROLES, useAuth } from '../../application/auth/AuthContext';
import { extractErrorMessages } from '../../infrastructure/httpClient';

type SemesterFormState = Omit<CreateSemesterPayload, 'year'> & {
  year: number | '';
};

export default function SemestersPage() {
  const { user } = useAuth();
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [submitErrors, setSubmitErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<SemesterFormState>(() => ({
    name: '',
    year: new Date().getFullYear(),
    startDate: '',
    endDate: ''
  }));

  useEffect(() => {
    (async () => {
      try {
        const data = await loadSemesters();
        setSemesters(sortSemesters(data));
      } catch (error) {
        setLoadError(extractErrorMessages(error).join('\n'));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const semesterCountText = useMemo(() => {
    if (loading) return 'Đang tải...';
    if (semesters.length === 0) return 'Chưa có học kỳ nào';
    return `${semesters.length} học kỳ`;
  }, [loading, semesters.length]);

  const handleChange = (field: keyof SemesterFormState) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setForm((prev) => ({
      ...prev,
      [field]: field === 'year' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitErrors([]);
    setSuccess('');
    setSaving(true);

    try {
      const payload: CreateSemesterPayload = {
        ...form,
        year: Number(form.year || new Date().getFullYear())
      };
      const created = await createSemester(payload);
      setSemesters((prev) => sortSemesters([created, ...prev]));
      setSuccess('Tạo học kỳ thành công.');
      setForm({ name: '', year: form.year || new Date().getFullYear(), startDate: '', endDate: '' });
    } catch (error) {
      setSubmitErrors(extractErrorMessages(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <div className="top-row">
        <div>
          <h2 style={{ margin: 0 }}>Quản lý học kỳ</h2>
          <p className="muted" style={{ margin: '6px 0 0' }}>
            Chỉ Admin/Thư ký có quyền truy cập. Vai trò hiện tại: <strong>{user?.role ?? 'N/A'}</strong>
          </p>
        </div>
        <div className="badge">{semesterCountText}</div>
      </div>

      <form onSubmit={handleSubmit} className="form" style={{ marginBottom: '12px' }}>
        <div className="form-grid">
          <div>
            <label htmlFor="name">Tên học kỳ</label>
            <input
              id="name"
              name="name"
              required
              value={form.name}
              onChange={handleChange('name')}
              placeholder="Ví dụ: Học kỳ Thu"
            />
          </div>
          <div>
            <label htmlFor="year">Năm</label>
            <input
              id="year"
              name="year"
              type="number"
              min={2000}
              required
              value={form.year}
              onChange={handleChange('year')}
            />
          </div>
          <div>
            <label htmlFor="startDate">Ngày bắt đầu</label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              required
              value={form.startDate}
              onChange={handleChange('startDate')}
            />
          </div>
          <div>
            <label htmlFor="endDate">Ngày kết thúc</label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              required
              value={form.endDate}
              onChange={handleChange('endDate')}
            />
          </div>
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
          <button type="submit" disabled={saving} style={{ maxWidth: 200 }}>
            {saving ? 'Đang tạo...' : 'Tạo học kỳ'}
          </button>
          <span className="muted">Sử dụng thông báo lỗi trả về từ backend để kiểm tra dữ liệu.</span>
        </div>
      </form>

      {success && <div className="alert success">{success}</div>}
      {submitErrors.length > 0 && (
        <div className="alert error">
          <strong>Không thể tạo học kỳ:</strong>
          <ul>
            {submitErrors.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      {loading ? (
        <p className="muted">Đang tải danh sách học kỳ...</p>
      ) : loadError ? (
        <div className="alert error">{loadError}</div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Tên</th>
                <th>Năm</th>
                <th>Ngày bắt đầu</th>
                <th>Ngày kết thúc</th>
              </tr>
            </thead>
            <tbody>
              {semesters.length === 0 && (
                <tr>
                  <td colSpan={5} className="muted">
                    Chưa có học kỳ nào được tạo.
                  </td>
                </tr>
              )}
              {semesters.map((semester, index) => (
                <tr key={semester.id ?? `${semester.name}-${index}`}>
                  <td>{semester.id ?? index + 1}</td>
                  <td>{semester.name}</td>
                  <td>{semester.year}</td>
                  <td>{formatDate(semester.startDate)}</td>
                  <td>{formatDate(semester.endDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <footer>
        Nếu API GET /semesters không khả dụng, dữ liệu mẫu sẽ được hiển thị để kiểm thử giao diện.
        Vai trò có quyền: {ALL_ROLES.filter((role) => role === 'ADMIN' || role === 'SECRETARY').join(', ')}.
      </footer>
    </div>
  );
}

function formatDate(dateValue: string) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleDateString();
}

function sortSemesters(items: Semester[]): Semester[] {
  return [...items].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
}
