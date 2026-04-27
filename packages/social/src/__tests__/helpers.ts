export function cartesian<T extends Record<string, readonly unknown[]>>(
  dims: T,
): { [K in keyof T]: T[K][number] }[] {
  return Object.entries(dims).reduce<Record<string, unknown>[]>(
    (acc, [key, values]) =>
      acc.flatMap((row) => values.map((v) => ({ ...row, [key]: v }))),
    [{}],
  ) as { [K in keyof T]: T[K][number] }[];
}
