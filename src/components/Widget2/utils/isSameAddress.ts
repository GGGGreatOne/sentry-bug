export function isSameAddress(a?: string, b?: string): boolean {
  return a === b || a?.toLowerCase() === b?.toLowerCase() // Lazy-lowercases the addresses
}
