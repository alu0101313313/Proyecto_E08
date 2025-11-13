export function dataclassToDict(obj: any): any {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(dataclassToDict);

  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key === "sdk") continue;
    result[key] = dataclassToDict(value);
  }
  return result;
}