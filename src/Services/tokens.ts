// GitHub tokens for the GraphQL API, and which one each retry attempt uses.

// Every attempt gets a real token: one configured token is retried with itself
// instead of falling through to an unset GITHUB_TOKEN2, which GitHub answers
// with 401 "Bad credentials".
export const MIN_ATTEMPTS = 2;

/** The configured tokens, without the unset or blank ones. */
export function parseTokens(values: Array<string | undefined>): string[] {
  const tokens = values.map((value) => value?.trim() ?? "");
  return tokens.filter((token) => token.length > 0);
}

/** One attempt per token, and never fewer than MIN_ATTEMPTS. */
export function attemptsFor(tokens: string[]): number {
  return Math.max(tokens.length, MIN_ATTEMPTS);
}

/** The token for a zero-based attempt, cycling through the configured ones. */
export function tokenForAttempt(
  tokens: string[],
  attempt: number,
): string | undefined {
  if (tokens.length === 0) {
    return undefined;
  }
  return tokens[attempt % tokens.length];
}
