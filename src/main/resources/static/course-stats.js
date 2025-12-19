const API_BASE_URL = "/api/v1/courses";

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function loadCourseStats(courseId) {
  const response = await fetch(`${API_BASE_URL}/${courseId}/statistics`, {
    headers: {
      Accept: "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const message =
      (await response.text().catch(() => "")) ||
      `Không thể tải thống kê (mã ${response.status})`;
    throw new Error(message);
  }

  return response.json();
}

async function exportCourseStats(courseId) {
  const response = await fetch(`${API_BASE_URL}/${courseId}/export-excel`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const message =
      (await response.text().catch(() => "")) ||
      `Không thể xuất thống kê (mã ${response.status})`;
    throw new Error(message);
  }

  const blob = await response.blob();
  if (!blob || blob.size === 0) {
    throw new Error("Tệp phản hồi trống.");
  }

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `course-${courseId}-stats.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

function pickStudentStat(card, stats) {
  if (!Array.isArray(stats)) return null;
  const studentCode = card.dataset.studentCode;
  if (studentCode) {
    const matched = stats.find((s) => s.studentCode === studentCode);
    if (matched) return matched;
  }
  return stats[0] || null;
}

function renderStats(card, stat) {
  const updateField = (name, value) => {
    const el = card.querySelector(`[data-stat="${name}"]`);
    if (el) el.textContent = value ?? "—";
  };

  if (!stat) {
    updateField("totalSessions", "—");
    updateField("absences", "—");
    updateField("absentPercentage", "—");
    updateField("isBanned", "—");
    return;
  }

  updateField("totalSessions", stat.totalSessions);
  updateField("absences", stat.absentSessions);
  updateField(
    "absentPercentage",
    stat.absentPercentage != null ? `${stat.absentPercentage}%` : "—"
  );
  updateField("isBanned", stat.isBanned ? "Cấm thi" : "Bình thường");
}

function showStatus(card, message) {
  const statusEl = card.querySelector("[data-status]");
  if (statusEl) {
    statusEl.textContent = message || "";
    statusEl.hidden = !message;
  }
}

async function hydrateCourseCard(card) {
  const courseId = card.dataset.courseId;
  if (!courseId) return;

  showStatus(card, "Đang tải thống kê...");
  try {
    const stats = await loadCourseStats(courseId);
    const studentStat = pickStudentStat(card, stats);
    renderStats(card, studentStat);
    showStatus(
      card,
      studentStat ? "" : "Không tìm thấy thống kê cho sinh viên này."
    );
  } catch (error) {
    showStatus(card, error.message);
  }
}

function wireExportButton(card) {
  const button = card.querySelector('[data-action="export-course"]');
  if (!button) return;

  const statusEl = card.querySelector("[data-export-status]");
  const courseId = card.dataset.courseId;

  button.addEventListener("click", async () => {
    if (!courseId) return;
    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = "Đang xuất...";
    if (statusEl) {
      statusEl.hidden = false;
      statusEl.textContent = "";
    }

    try {
      await exportCourseStats(courseId);
      if (statusEl) statusEl.textContent = "Tải xuống thành công.";
    } catch (error) {
      if (statusEl) statusEl.textContent = error.message;
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const courseCards = document.querySelectorAll("[data-course-card]");
  courseCards.forEach((card) => {
    hydrateCourseCard(card);
    wireExportButton(card);
  });
});

window.loadCourseStats = loadCourseStats;
window.exportCourseStats = exportCourseStats;
