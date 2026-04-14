export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  interval: number,
): Function {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => fn(...args), interval);
  };
}
