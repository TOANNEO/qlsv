import { Semester } from '../../domain/models/semester';

interface SemesterTableProps {
  semesters: Semester[];
}

export function SemesterTable({ semesters }: SemesterTableProps) {
  if (!semesters.length) {
    return <div className="empty-state">Chưa có học kỳ nào.</div>;
  }

  return (
    <div className="card">
      <div className="heading">
        <h2 style={{ margin: 0 }}>Danh sách học kỳ</h2>
        <span className="badge">{semesters.length} mục</span>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Tên học kỳ</th>
            <th>Năm học</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
          </tr>
        </thead>
        <tbody>
          {semesters.map((semester) => (
            <tr key={semester.id}>
              <td>{semester.name}</td>
              <td>{semester.year}</td>
              <td>{semester.startDate}</td>
              <td>{semester.endDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
