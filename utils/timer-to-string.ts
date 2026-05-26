export function timeToString(time: number): string {
  if (time < 60) {
    return String(time) + "s";
  }

  if (time % 60 === 0) {
    return `${time / 60}m`;
  }

  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);

  return `${min}m ${sec}s`;
}
