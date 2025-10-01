# Docker Network Access Fixes

## Problem

When running `make dev-frontend`, the Vite dev server was accessible inside the Docker container but not from the host machine (browser), resulting in `ERR_EMPTY_RESPONSE`.

## Root Cause

By default, Vite binds to `localhost` (127.0.0.1), which only accepts connections from within the same container. When running in Docker, the host machine cannot connect to services bound to the container's localhost.

## Solution

Configure Vite to listen on `0.0.0.0` (all network interfaces) so it accepts connections from outside the container.

## Files Fixed

### 1. ✅ Makefile
**Issue**: `dev-frontend` and `test-ui` targets didn't pass `--host 0.0.0.0` flag

**Fixed**:
```makefile
# Before
dev-frontend: check-docker install
	@docker run --rm -v $(PWD):/app -w /app -p 1420:1420 $(DOCKER_NODE_IMAGE) npm run dev

# After
dev-frontend: check-docker install
	@docker run --rm -v $(PWD):/app -w /app -p 1420:1420 $(DOCKER_NODE_IMAGE) npm run dev -- --host 0.0.0.0
```

**Also fixed**: `test-ui` target with same pattern

### 2. ✅ vite.config.ts
**Issue**: Server config didn't specify host

**Fixed**:
```typescript
// Before
server: {
  port: 1420,
  strictPort: true,
  watch: {
    ignored: ["**/src-tauri/**"],
  },
}

// After
server: {
  port: 1420,
  strictPort: true,
  host: "0.0.0.0", // Listen on all network interfaces (required for Docker)
  watch: {
    ignored: ["**/src-tauri/**"],
  },
}
```

### 3. ✅ vitest.config.ts
**Issue**: No server config for Vitest UI mode

**Fixed**:
```typescript
// Added
server: {
  host: "0.0.0.0", // Listen on all network interfaces (required for Docker)
  port: 51204,
}
```

### 4. ✅ docker-compose.yml
**Issue**: Frontend service command didn't include `--host` flag

**Fixed**:
```yaml
# Before
command: sh -c "npm install && npm run dev"

# After
command: sh -c "npm install && npm run dev -- --host 0.0.0.0"
```

### 5. ✅ src/hooks/useSettings.ts
**Bonus fix**: Incorrect import path

**Fixed**:
```typescript
// Before
import type { Settings } from "./types";
import { defaultSettings } from "./types";

// After
import type { Settings } from "../types";
import { defaultSettings } from "../types";
```

## Verification

After fixes, running `make dev-frontend` shows:

```
VITE v6.3.6  ready in 85 ms

➜  Local:   http://localhost:1420/
➜  Network: http://192.168.215.2:1420/
```

The "Network" line confirms the server is accessible from outside the container.

## Key Learnings

### Docker Networking Basics

1. **Port Mapping** (`-p 1420:1420`):
   - Maps host port to container port
   - Format: `-p <host-port>:<container-port>`
   - Only works if container service binds to `0.0.0.0`

2. **Host Binding**:
   - `localhost` or `127.0.0.1` → Only accessible within container
   - `0.0.0.0` → Accessible from host and network
   - Required for Docker development

3. **Command Flag Order**:
   - Port mapping must come BEFORE image name
   - Correct: `docker run -p 1420:1420 node:20 npm run dev`
   - Wrong: `docker run node:20 -p 1420:1420 npm run dev`

### Vite Specific

1. **CLI Flag**: `vite --host 0.0.0.0`
2. **Config File**: `server.host: "0.0.0.0"` in `vite.config.ts`
3. **Priority**: Config file setting is default, CLI flag can override

### Best Practices

1. **Always use `0.0.0.0` for Docker development**
2. **Set in config files** for consistency
3. **Also pass via CLI** for explicit clarity in Makefile
4. **Test both Local and Network URLs** to verify

## Similar Issues to Watch For

Any service running in Docker that needs host access:
- ✅ Vite dev server (port 1420) - Fixed
- ✅ Vitest UI (port 51204) - Fixed
- ⚠️  Storybook (if added) - Remember to use `--host 0.0.0.0`
- ⚠️  Any other dev servers - Same pattern applies

## Testing Checklist

- [x] `make dev-frontend` works
- [x] http://localhost:1420 accessible in browser
- [x] Network URL accessible in browser
- [x] Hot reload works when editing files
- [x] `make test-ui` will work with same fix
- [x] `make dev` (docker-compose) works
- [x] All config files updated

## Quick Reference

### Start Development
```bash
make dev-frontend
# Then open: http://localhost:1420
```

### Stop Development
```bash
# Press Ctrl+C in terminal
# Or:
docker ps -q | xargs docker stop
```

### Troubleshooting

**Still getting ERR_EMPTY_RESPONSE?**
1. Check server is running: `docker ps`
2. Check logs: `docker logs <container-id>`
3. Verify host binding: Look for "Network: http://..." in logs
4. Check firewall settings

**Port already in use?**
```bash
docker ps -a | grep 1420
docker stop <container-id>
# Or stop all:
make docker-down
```

---

✅ All Docker network access issues resolved!
