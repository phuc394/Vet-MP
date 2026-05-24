// Utility helpers for Calendar screen
export function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString();
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${date} ${time}`;
  } catch (e) {
    return iso;
  }
}

export function getStatusColor(status: 'Pending' | 'Completed' | 'Cancelled'): string {
  switch (status) {
    case 'Pending':
      return '#F6F0E6';
    case 'Completed':
      return '#E6F7EE';
    case 'Cancelled':
      return '#FDECEA';
    default:
      return '#F6F0E6';
  }
}
