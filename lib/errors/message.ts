export function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string" && error.length > 0) {
    return error;
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  if (error && typeof error === "object" && "type" in error) {
    return "A network or script loading error occurred. Refresh the page and check the terminal for details.";
  }

  return "Something went wrong. Check the terminal for details.";
}

export function isDatabaseConfigError(message: string): boolean {
  return (
    message.includes("DATABASE_URL") ||
    message.includes("postgresql://") ||
    message.includes("SQLite") ||
    message.includes("PrismaClientInitializationError")
  );
}
