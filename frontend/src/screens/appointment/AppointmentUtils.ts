import { formatDateTime as formatFromCalendar } from '../calendar/CalenderUtils';

export type AppointmentStatus = 'Pending' | 'Completed' | 'Cancelled';

export function formatAppointmentId(id: number | string) {
  return String(id);
}

export function getAppointmentStatusBackground(status: AppointmentStatus) {
  switch (status) {
    case 'Pending':
      return '#F7E9D6';
    case 'Completed':
      return '#E8F6EF';
    case 'Cancelled':
      return '#FFF1F0';
    default:
      return '#F3F3F3';
  }
}

export function formatAppointmentDatetime(iso?: string) {
  if (!iso) return '';
  return formatFromCalendar(iso);
}
