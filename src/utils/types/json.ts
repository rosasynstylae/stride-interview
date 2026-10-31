type JsonPrimitive = string | number | boolean | null;

/**
 * Resolves to T if every value in it survives JSON.stringify unchanged,
 * otherwise maps the offending parts to `never` so T fails to match.
 *
 * Checks T's own shape rather than using a fixed JsonValue union, so
 * interfaces (which lack an implicit index signature) are accepted.
 */
type JsonCompatible<T> = T extends JsonPrimitive
  ? T
  : T extends undefined | bigint | symbol | ((...args: never[]) => unknown)
    ? never
    : T extends readonly (infer U)[]
      ? readonly JsonCompatible<U>[]
      : T extends object
        ? { [K in keyof T]: JsonCompatible<T[K]> }
        : never;

export type { JsonPrimitive, JsonCompatible };
