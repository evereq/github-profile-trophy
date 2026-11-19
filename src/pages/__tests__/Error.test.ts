import { assertEquals } from "../../../deps.ts";
import { EServiceKindError, ServiceError } from "../../Types/index.ts";
import { ERROR_CACHE_CONTROL, errorResponse } from "../Error.ts";

const cases: Array<[EServiceKindError, number]> = [
  [EServiceKindError.NOT_FOUND, 404],
  [EServiceKindError.RATE_LIMIT, 419],
  [EServiceKindError.UPSTREAM, 502],
];

for (const [kind, status] of cases) {
  Deno.test(`errorResponse for ${kind} is ${status} and never cached`, () => {
    const response = errorResponse(new ServiceError("failed", kind));

    assertEquals(response.status, status);
    assertEquals(response.headers.get("Content-Type"), "text/html");
    assertEquals(response.headers.get("Cache-Control"), "no-store");
    assertEquals(ERROR_CACHE_CONTROL, "no-store");
  });
}
