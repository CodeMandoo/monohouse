export function noop() {}

export function assertNever(input: never): never {
  throw new Error(`Unexpected input: ${String(input)}`)
}
