export function noop() {}

export function assertNever(input: never): never {
  throw new Error(`Unexpected input: ${String(input)}`)
}

export function formatCount(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}
