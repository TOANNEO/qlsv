import { useAuth } from '../../application/auth/AuthContext';

export default function HomePage() {
  const { user } = useAuth();
  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Xin chào, {user?.name ?? 'bạn'}!</h2>
      <p className="muted">
        Sử dụng thanh điều hướng để vào trang quản lý học kỳ. Chỉ Admin và Thư ký có thể xem mục này.
      </p>
    </div>
  );
}
