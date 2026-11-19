import { assertEquals } from "../../../deps.ts";
import {
  attemptsFor,
  MIN_ATTEMPTS,
  parseTokens,
  tokenForAttempt,
} from "../tokens.ts";

Deno.test("parseTokens drops unset and blank tokens", () => {
  assertEquals(parseTokens(["one", undefined]), ["one"]);
  assertEquals(parseTokens(["one", "", "  ", " two "]), ["one", "two"]);
  assertEquals(parseTokens([undefined, undefined]), []);
});

Deno.test("attemptsFor retries a single token", () => {
  assertEquals(attemptsFor([]), MIN_ATTEMPTS);
  assertEquals(attemptsFor(["one"]), 2);
  assertEquals(attemptsFor(["one", "two"]), 2);
  assertEquals(attemptsFor(["one", "two", "three"]), 3);
});

Deno.test("tokenForAttempt never hands out an unset token", () => {
  // The 2026-11-19 outage: the retry used TOKENS[1], which was unset.
  assertEquals(tokenForAttempt(["one"], 0), "one");
  assertEquals(tokenForAttempt(["one"], 1), "one");
  assertEquals(tokenForAttempt(["one", "two"], 0), "one");
  assertEquals(tokenForAttempt(["one", "two"], 1), "two");
  assertEquals(tokenForAttempt(["one", "two"], 2), "one");
  assertEquals(tokenForAttempt([], 0), undefined);
});
