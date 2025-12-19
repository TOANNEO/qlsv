# QLSV Frontend

Giao diện React + TailwindCSS cho hệ thống quản lý lớp học/điểm danh, thiết kế theo định hướng Clean Architecture.

## Kiến trúc thư mục
- `domain/` – Định nghĩa model thuần (User, Course, Attendance, LeaveRequest).
- `application/` – Các use case (login, tải danh sách lớp, mở phiên điểm danh, gửi/duyệt đơn xin phép).
- `infrastructure/` – Tầng truy cập hạ tầng (HTTP client, repository gọi API, lưu trữ token).
- `presentation/` – UI và state (component, page, router, context quản lý phiên đăng nhập).

## Thiết lập
1. Sao chép `.env.example` thành `.env` và cập nhật `VITE_API_BASE_URL` nếu backend chạy ở host/port khác.
2. Cài đặt phụ thuộc:
   ```bash
   npm install
   ```
3. Chạy dev server:
   ```bash
   npm run dev
   ```

## Trang chính
- **Login**: xác thực tới `/api/v1/auth/login`, lưu token và tải hồ sơ người dùng.
- **Dashboard**: thông tin tài khoản, vai trò và thống kê lớp nhanh.
- **Courses**: danh sách lớp theo quyền (student -> lớp của tôi, quản trị -> toàn bộ lớp).
- **Attendance**: giảng viên mở/đóng phiên; sinh viên quét điểm danh; xem lịch sử.
- **Leave Requests**: sinh viên gửi đơn, giảng viên duyệt theo lớp.
