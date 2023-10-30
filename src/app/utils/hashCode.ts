export function hashCode(str: string): string {
  let hash = 0;
  let i: number;
  let charCode: number;
  for (i = 0; i < str.length; i++) {
    charCode = str.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash = (hash << 5) - hash + charCode;
    // eslint-disable-next-line no-bitwise
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
}
