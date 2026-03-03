export function getTimeRemainingMs(endDateIso: string): number {
  const now = Date.now();
  const end = Date.parse(endDateIso);
  if (Number.isNaN(end)) return 0;
  return Math.max(0, end - now);
}

export function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return 'Resolved';

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}