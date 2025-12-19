import attendanceRepository from '../repositories/attendanceRepository.js';

const formatDateTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

export async function loadSessionRecords(sessionId) {
  if (!sessionId) {
    throw new Error('Session ID is required to load records');
  }

  const records = await attendanceRepository.getRecordsBySession(sessionId);
  return records.map((record) => ({
    ...record,
    formattedCheckInTime: formatDateTime(record.checkInTime),
  }));
}

export default loadSessionRecords;
