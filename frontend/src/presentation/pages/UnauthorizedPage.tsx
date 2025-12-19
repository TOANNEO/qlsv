export default function UnauthorizedPage() {
  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Bạn không có quyền truy cập</h2>
      <p className="muted">Vui lòng chọn vai trò Admin hoặc Thư ký ở thanh bên để xem trang này.</p>
    </div>
  );
}
