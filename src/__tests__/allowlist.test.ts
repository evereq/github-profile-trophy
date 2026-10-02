import { assertEquals } from "../../deps.ts";
import { isUsernameAllowed, parseAllowedUsernames } from "../utils.ts";

Deno.test("allowlist: unset or empty list serves everyone", () => {
  assertEquals(parseAllowedUsernames(undefined), null);
  assertEquals(parseAllowedUsernames(""), null);
  assertEquals(parseAllowedUsernames(" , ,"), null);
  assertEquals(isUsernameAllowed("anyone", null), true);
});

Deno.test("allowlist: names are trimmed and case-insensitive", () => {
  const allowed = parseAllowedUsernames(" evereq, Ever-Co ,");
  assertEquals(allowed, new Set(["evereq", "ever-co"]));
  assertEquals(isUsernameAllowed("evereq", allowed), true);
  assertEquals(isUsernameAllowed("EvereQ", allowed), true);
  assertEquals(isUsernameAllowed("ever-co", allowed), true);
});

Deno.test("allowlist: names not on the list are rejected", () => {
  const allowed = parseAllowedUsernames("evereq");
  assertEquals(isUsernameAllowed("ryo-ma", allowed), false);
  assertEquals(isUsernameAllowed("evereq2", allowed), false);
  assertEquals(isUsernameAllowed("", allowed), false);
});
