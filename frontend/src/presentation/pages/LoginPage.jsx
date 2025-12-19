import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';
import { useAuth } from '../state/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { user, login, error } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setMessage(err.message || 'Không thể đăng nhập, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-slate-50 to-white px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-xl backdrop-blur">
        <div className="mb-8 space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">QLSV PORTAL</p>
          <h1 className="text-2xl font-semibold text-slate-900">Đăng nhập hệ thống</h1>
          <p className="text-sm text-slate-600">
            Truy cập cổng quản lý lớp học, điểm danh và đơn xin phép.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            label="Tên đăng nhập"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="VD: phong.nguyen"
            autoComplete="username"
            required
          />
          <TextInput
            label="Mật khẩu"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />

          {(message || error) && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {message || error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Đang đăng nhập...' : 'Tiếp tục'}
          </Button>
        </form>
      </div>
    </div>
  );
}
