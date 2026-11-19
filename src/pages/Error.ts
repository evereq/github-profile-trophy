import { EServiceKindError, ServiceError } from "../Types/index.ts";
import { Error400, Error404, Error419, Error502 } from "../error_page.ts";

interface ErrorPageProps {
  error: ServiceError;
}

export function ErrorPage({ error }: ErrorPageProps) {
  let cause: Error400 | Error404 | Error419 | Error502 = new Error400();

  if (error.cause === EServiceKindError.RATE_LIMIT) {
    cause = new Error419();
  }

  if (error.cause === EServiceKindError.NOT_FOUND) {
    cause = new Error404(
      "Sorry, the user you are looking for was not found.",
    );
  }

  if (error.cause === EServiceKindError.UPSTREAM) {
    cause = new Error502("GitHub returned an unexpected response.");
  }

  return cause;
}

// A failed render must never be cached. Cloudflare (s-maxage) and GitHub's camo
// image proxy would keep serving the error for hours after GitHub recovers: on
// 2026-11-19 one GitHub 502 took the README badge down for up to 8 hours.
export const ERROR_CACHE_CONTROL = "no-store";

export function errorResponse(error: ServiceError): Response {
  return new Response(ErrorPage({ error }).render(), {
    status: error.code,
    headers: new Headers({
      "Content-Type": "text/html",
      "Cache-Control": ERROR_CACHE_CONTROL,
    }),
  });
}
