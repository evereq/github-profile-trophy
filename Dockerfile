# Deno runtime, pinned so a rebuild never changes the runtime silently. Bump it
# deliberately to the newest release that passes the k8s-build smoke test.
FROM denoland/deno:2.9.7

WORKDIR /app
RUN chown deno:deno /app
USER deno

# Copy source
COPY --chown=deno:deno . .

# Fetch every remote module at build time. The app then starts with
# --cached-only, so the running container never downloads code.
RUN deno cache main.ts

ENV PORT=8080
EXPOSE 8080

# Least privilege instead of -A: network (GitHub API), env (tokens, PORT),
# read (cached modules, /tmp cache) and write to /tmp only (render cache).
CMD ["deno", "run", "--cached-only", "--allow-net", "--allow-env", "--allow-read", "--allow-write=/tmp", "main.ts"]
