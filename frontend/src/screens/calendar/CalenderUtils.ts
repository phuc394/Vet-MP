import type { AppointmentStatus } from '../../types/appointment.type';

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return iso;
  }

  const date = d.toLocaleDateString();
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${date} ${time}`;
}

export function formatDateOnly(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) {
    return date;
  }

  return d.toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

export function combineAppointmentDateTime(date: string, time: string): string {
  if (!date) return time;
  if (!time) return date;

  const normalizedDate = date.includes('T') ? date.split('T')[0] : date;
  return `${normalizedDate}T${time}`;
}

export function formatAppointmentRange(date: string, startTime: string, endTime?: string): string {
  const start = formatDateTime(combineAppointmentDateTime(date, startTime));
  if (!endTime) return start;

  const end = new Date(combineAppointmentDateTime(date, endTime));
  if (Number.isNaN(end.getTime())) {
    return start;
  }

  return `${start} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

export function normalizeAppointmentStatus(status: AppointmentStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function getStatusColor(status: AppointmentStatus): string {
  switch (status) {
    case 'pending':
    case 'confirmed':
      return '#F6F0E6';
    case 'completed':
      return '#E6F7EE';
    case 'cancelled':
      return '#FDECEA';
    default:
      return '#F6F0E6';
  }
}
