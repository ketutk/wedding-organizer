export function getNestedValue(obj: any, path: string) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}
