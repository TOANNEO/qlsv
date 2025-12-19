import { FormEvent, useEffect, useMemo, useState } from "react";
import { createSubject } from "../../application/usecases/createSubject";
import { loadSubjects } from "../../application/usecases/loadSubjects";
import { useAuth } from "../../application/context/AuthContext";
import { CreateSubjectPayload, Subject } from "../../domain/models/Subject";

const defaultForm: CreateSubjectPayload = {
  subjectCode: "",
  name: "",
  credits: 3
};

const SubjectsPage = () => {
  const { role } = useAuth();
  const allowed = useMemo(() => role === "ADMIN" || role === "SECRETARY", [role]);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [form, setForm] = useState<CreateSubjectPayload>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!allowed) return;
    setLoading(true);
    loadSubjects()
      .then((data) => setSubjects(data))
      .catch((err) => setError(err.message || "Không thể tải danh sách môn học"))
      .finally(() => setLoading(false));
  }, [allowed]);

  const handleChange = (field: keyof CreateSubjectPayload, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const created = await createSubject({
        subjectCode: form.subjectCode.trim(),
        name: form.name.trim(),
        credits: Number(form.credits)
      });
      setSubjects((prev) => [created, ...prev]);
      setForm(defaultForm);
      setSuccess("Đã tạo môn học thành công");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Tạo môn học thất bại";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!allowed) {
    return (
      <div className="card">
        <h2>Truy cập bị hạn chế</h2>
        <p>Chỉ quản trị viên hoặc giáo vụ mới có thể quản lý môn học.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h1>Quản lý môn học</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px", marginBottom: "20px" }}>
        <div>
          <label>
            Mã môn học
            <input
              type="text"
              required
              value={form.subjectCode}
              onChange={(e) => handleChange("subjectCode", e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            />
          </label>
        </div>
        <div>
          <label>
            Tên môn học
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            />
          </label>
        </div>
        <div>
          <label>
            Số tín chỉ
            <input
              type="number"
              min={1}
              max={10}
              required
              value={form.credits}
              onChange={(e) => handleChange("credits", Number(e.target.value))}
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            />
          </label>
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Đang lưu..." : "Tạo môn học"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <h2>Danh sách môn học</h2>
      {loading && subjects.length === 0 ? (
        <p>Đang tải...</p>
      ) : subjects.length === 0 ? (
        <p>Chưa có môn học.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #e5e7eb", textAlign: "left", padding: "8px" }}>Mã</th>
              <th style={{ borderBottom: "1px solid #e5e7eb", textAlign: "left", padding: "8px" }}>Tên</th>
              <th style={{ borderBottom: "1px solid #e5e7eb", textAlign: "right", padding: "8px" }}>Tín chỉ</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={`${subject.id}-${subject.subjectCode}`}>
                <td style={{ padding: "8px", borderBottom: "1px solid #f3f4f6" }}>{subject.subjectCode}</td>
                <td style={{ padding: "8px", borderBottom: "1px solid #f3f4f6" }}>{subject.name}</td>
                <td style={{ padding: "8px", borderBottom: "1px solid #f3f4f6", textAlign: "right" }}>
                  {subject.credits}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SubjectsPage;
