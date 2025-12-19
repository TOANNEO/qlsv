export const Roles = {
  ADMIN: 'ADMIN',
  SECRETARY: 'SECRETARY',
  LECTURER: 'LECTURER',
  STUDENT: 'STUDENT',
};

export const RoleLabels = {
  [Roles.ADMIN]: 'Quản trị',
  [Roles.SECRETARY]: 'Thư ký',
  [Roles.LECTURER]: 'Giảng viên',
  [Roles.STUDENT]: 'Sinh viên',
};

function normalizeRole(role) {
  if (!role) return role;
  return role.replace('ROLE_', '');
}

export function toUser(dto = {}) {
  return {
    id: dto.id,
    username: dto.username,
    email: dto.email,
    role: normalizeRole(dto.role),
    firstName: dto.firstName,
    lastName: dto.lastName,
    fullName: buildFullName(dto.firstName, dto.lastName) || dto.username,
    studentCode: dto.studentCode,
    lecturerCode: dto.lecturerCode,
    department: dto.department,
    enabled: dto.enabled ?? true,
  };
}

export function buildFullName(firstName, lastName) {
  return [firstName, lastName].filter(Boolean).join(' ').trim();
}

export function toAuthUser(dto = {}) {
  return {
    id: dto.userId,
    username: dto.username,
    email: dto.email,
    role: normalizeRole(dto.role),
  };
}
