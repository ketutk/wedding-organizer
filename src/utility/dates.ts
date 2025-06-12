export function isValidDateString(str: string): boolean {
  const d = new Date(str);
  return !isNaN(d.getTime()) && str.match(/^\d{4}-\d{2}-\d{2}T/) !== null;
}
