type Answers = Record<string, unknown>;

function getPath(obj: Answers, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as object)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function evaluateCondition(
  condition: unknown,
  answers: Answers
): boolean {
  if (!condition || typeof condition !== "object") return true;

  const c = condition as {
    field?: string;
    operator?: string;
    value?: unknown;
  };

  if (!c.field || !c.operator) return true;

  const actual = getPath(answers, c.field);

  switch (c.operator) {
    case "eq":
      return actual === c.value;
    case "contains":
      return Array.isArray(actual) && actual.includes(c.value);
    case "in":
      return Array.isArray(c.value) && c.value.includes(actual);
    case "truthy":
      return Boolean(actual);
    default:
      return true;
  }
}
