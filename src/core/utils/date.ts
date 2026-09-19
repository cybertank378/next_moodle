export function formatUnixTimestamp(timestampSeconds: number): string {
  return new Date(timestampSeconds * 1000).toISOString();
}

export function isTimestampExpired(timestampSeconds: number): boolean {
  return Date.now() >= timestampSeconds * 1000;
}
