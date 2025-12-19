import attendanceRepository from '../repositories/attendanceRepository.js';

const allowedStatuses = ['PRESENT', 'LATE', 'ABSENT', 'EXCUSED'];

export async function changeRecordStatus(recordId, status) {
  if (!recordId) {
    throw new Error('Record ID is required to update status');
  }

  if (!allowedStatuses.includes(status)) {
    throw new Error('Invalid attendance status');
  }

  await attendanceRepository.updateRecordStatus(recordId, status);
  return { recordId, status };
}

export default changeRecordStatus;
