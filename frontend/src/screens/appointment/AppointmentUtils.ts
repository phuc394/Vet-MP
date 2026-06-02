import type { AppointmentStatus } from '../../types/appointment.type';
import {
  combineAppointmentDateTime,
  formatAppointmentRange,
  normalizeAppointmentStatus,
} from '../calendar/CalenderUtils';

export function formatAppointmentId(id: number | string) {
  return String(id);
}

export function getAppointmentStatusBackground(status: AppointmentStatus) {
  switch (status) {
    case 'pending':
    case 'confirmed':
      return '#F7E9D6';
    case 'completed':
      return '#E8F6EF';
    case 'cancelled':
      return '#FFF1F0';
    default:
      return '#F3F3F3';
  }
}

export function formatAppointmentStatus(status: AppointmentStatus) {
  return normalizeAppointmentStatus(status);
}

export function formatAppointmentDatetime(date?: string, startTime?: string, endTime?: string) {
  if (!date || !startTime) return '';
  return formatAppointmentRange(date, startTime, endTime);
}

export function toAppointmentDateTime(date: string, time: string) {
  return combineAppointmentDateTime(date, time);
}
