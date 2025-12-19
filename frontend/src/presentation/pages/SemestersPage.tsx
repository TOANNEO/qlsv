import { FormEvent, useEffect, useMemo, useState } from 'react';
import { createSemester } from '../../application/useCases/createSemester';
import { loadSemesters } from '../../application/useCases/loadSemesters';
import { Semester } from '../../domain/models/semester';
import { parseErrorMessages } from '../../infrastructure/apiClient';
import { SemesterTable } from '../components/SemesterTable';

interface FormState {
  name: string;
  year: string;
  startDate: string;
  endDate: string;
}

const initialForm = (): FormState => ({
  name: '',
  year: String(new Date().getFullYear()),
  startDate: '',
  endDate: '',
});

export function SemestersPage() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadSemesters()
      .then((data) => setSemesters(data))
      .catch((error) => setErrors(parseErrorMessages(error)))
      .finally(() => setLoading(false));
  }, []);

  const sortedSemesters = useMemo(() => {
    return [...semesters].sort((a, b) => b.year - a.year || a.name.localeCompare(b.name));
  }, [semesters]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setErrors([]);
    setSuccessMessage(null);

    try {
      const payload = {
        name: form.name.trim(),
        year: Number(form.year),
        startDate: form.startDate,
        endDate: form.endDate,
      };

      const created = await createSemester(payload);
      setSemesters((prev) => [...prev, created]);
      setSuccessMessage('Tạo học kỳ thành công');
      setForm(initialForm());
    } catch (error) {
      setErrors(parseErrorMessages(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (key: keyof FormState) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <div className="card">
        <div className="heading">
          <div>
            <p style={{ margin: 0, color: '#6b7280', fontWeight: 700 }}>Quản lý học kỳ</p>
            <h2 style={{ margin: 0 }}>Tạo mới</h2>
          </div>
          {submitting ? <div className="spinner" aria-label="Đang gửi"></div> : null}
        </div>

        {errors.length > 0 && (
          <div className="alert error" role="alert">
            <strong>Không hợp lệ:</strong>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
              {errors.map((err, idx) => (
                <li key={`${err}-${idx}`}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {successMessage && (
          <div className="alert success" role="status">
            {successMessage}
          </div>
        )}

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Tên học kỳ</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={(e) => handleChange('name')(e.target.value)}
              placeholder="Ví dụ: Học kỳ Xuân"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="year">Năm học</label>
            <input
              id="year"
              name="year"
              type="number"
              min={2000}
              value={form.year}
              onChange={(e) => handleChange('year')(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="startDate">Ngày bắt đầu</label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={(e) => handleChange('startDate')(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="endDate">Ngày kết thúc</label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={(e) => handleChange('endDate')(e.target.value)}
              required
            />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="button" type="submit" disabled={submitting}>
              {submitting ? 'Đang tạo...' : 'Tạo học kỳ'}
            </button>
          </div>
        </form>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        {loading ? <div className="spinner" aria-label="Đang tải danh sách" /> : <SemesterTable semesters={sortedSemesters} />}
      </div>
    </div>
  );
}
