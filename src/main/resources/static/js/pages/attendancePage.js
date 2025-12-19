import loadSessionRecords from '../usecases/loadSessionRecords.js';
import changeRecordStatus from '../usecases/changeRecordStatus.js';
import attendanceRepository from '../repositories/attendanceRepository.js';

const sessionSelect = document.getElementById('sessionSelect');
const courseForm = document.getElementById('courseForm');
const courseIdInput = document.getElementById('courseId');
const sessionsList = document.getElementById('sessionsList');
const recordsPanel = document.getElementById('recordsPanel');
const recordsTableBody = document.getElementById('recordsTableBody');
const alertBox = document.getElementById('alertBox');
const sessionMeta = document.getElementById('sessionMeta');

const statusOptions = ['PRESENT', 'LATE', 'ABSENT', 'EXCUSED'];

const showAlert = (message, type = 'info') => {
  alertBox.textContent = message;
  alertBox.className = `alert alert-${type}`;
  alertBox.hidden = false;
};

const clearAlert = () => {
  alertBox.hidden = true;
  alertBox.textContent = '';
};

const setLoading = (isLoading) => {
  recordsPanel.classList.toggle('loading', isLoading);
};

const renderSessions = (sessions) => {
  sessionsList.innerHTML = '';
  sessionSelect.innerHTML = '<option value="">Chọn phiên điểm danh</option>';

  sessions.forEach((session) => {
    const option = document.createElement('option');
    option.value = session.sessionId;
    const start = session.startTime ? new Date(session.startTime).toLocaleString() : 'Không rõ thời gian';
    option.textContent = `${start} — ${session.status}`;
    sessionSelect.appendChild(option);

    const card = document.createElement('div');
    card.className = 'session-card';
    card.innerHTML = `
      <div class="session-card__header">
        <span class="session-card__title">${session.courseName || 'Lớp học phần'}</span>
        <span class="session-card__status badge">${session.status}</span>
      </div>
      <div class="session-card__meta">
        <div><strong>Mã phiên:</strong> ${session.sessionId}</div>
        <div><strong>Bắt đầu:</strong> ${start}</div>
      </div>
    `;
    card.addEventListener('click', () => {
      sessionSelect.value = session.sessionId;
      sessionSelect.dispatchEvent(new Event('change'));
    });

    sessionsList.appendChild(card);
  });
};

const renderRecords = (records) => {
  recordsTableBody.innerHTML = '';

  if (!records.length) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 4;
    cell.textContent = 'Chưa có sinh viên nào điểm danh trong phiên này.';
    row.appendChild(cell);
    recordsTableBody.appendChild(row);
    return;
  }

  records.forEach((record) => {
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.innerHTML = `<div class="student-name">${record.studentName}</div><div class="student-code">${record.studentCode}</div>`;

    const checkInCell = document.createElement('td');
    checkInCell.textContent = record.formattedCheckInTime;

    const statusCell = document.createElement('td');
    const statusSelect = document.createElement('select');
    statusSelect.className = 'status-select';
    statusOptions.forEach((status) => {
      const option = document.createElement('option');
      option.value = status;
      option.textContent = status;
      if (status === record.status) {
        option.selected = true;
      }
      statusSelect.appendChild(option);
    });
    statusCell.appendChild(statusSelect);

    const actionsCell = document.createElement('td');
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Cập nhật';
    updateButton.className = 'btn btn-primary';
    updateButton.addEventListener('click', async () => {
      updateButton.disabled = true;
      clearAlert();
      try {
        await changeRecordStatus(record.id, statusSelect.value);
        showAlert('Đã cập nhật trạng thái điểm danh.', 'success');
        await refreshRecords(sessionSelect.value);
      } catch (error) {
        showAlert(error.message || 'Không thể cập nhật trạng thái', 'error');
      } finally {
        updateButton.disabled = false;
      }
    });
    actionsCell.appendChild(updateButton);

    row.appendChild(nameCell);
    row.appendChild(checkInCell);
    row.appendChild(statusCell);
    row.appendChild(actionsCell);

    recordsTableBody.appendChild(row);
  });
};

const refreshRecords = async (sessionId) => {
  if (!sessionId) {
    recordsTableBody.innerHTML = '';
    sessionMeta.textContent = 'Chọn một phiên để xem bản ghi điểm danh.';
    return;
  }

  setLoading(true);
  try {
    const records = await loadSessionRecords(sessionId);
    const selectedOption = sessionSelect.options[sessionSelect.selectedIndex];
    sessionMeta.textContent = selectedOption ? selectedOption.textContent : '';
    renderRecords(records);
  } catch (error) {
    showAlert(error.message || 'Không thể tải bản ghi điểm danh', 'error');
  } finally {
    setLoading(false);
  }
};

const loadSessions = async (courseId) => {
  setLoading(true);
  clearAlert();
  try {
    const sessions = await attendanceRepository.getSessionsByCourse(courseId);
    renderSessions(sessions);
    if (sessions.length) {
      sessionSelect.value = sessions[0].sessionId;
      await refreshRecords(sessions[0].sessionId);
    } else {
      recordsTableBody.innerHTML = '';
      sessionMeta.textContent = 'Khoá học chưa có phiên điểm danh.';
    }
  } catch (error) {
    showAlert(error.message || 'Không thể tải danh sách phiên', 'error');
  } finally {
    setLoading(false);
  }
};

courseForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const courseId = courseIdInput.value;
  if (!courseId) {
    showAlert('Vui lòng nhập mã khoá học', 'warning');
    return;
  }
  await loadSessions(courseId);
});

sessionSelect.addEventListener('change', async (event) => {
  const sessionId = event.target.value;
  await refreshRecords(sessionId);
});

window.addEventListener('DOMContentLoaded', () => {
  clearAlert();
});

export default {
  loadSessions,
  refreshRecords,
};
