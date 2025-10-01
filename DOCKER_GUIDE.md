# Docker Development Guide

This guide covers everything you need to develop Lilt GUI using only Docker—no local Node.js or Rust installation required.

## Table of Contents

- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Development Workflows](#development-workflows)
- [GUI Development (Tauri)](#gui-development-tauri)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)
- [Performance Tips](#performance-tips)

## Quick Start

```bash
# 1. Clone the repository (if you haven't already)
git clone <your-repo-url>
cd lilt-gui

# 2. Run the automated setup
./docker-setup.sh

# 3. Start development
make dev-frontend
```

That's it! The dev server will be running at http://localhost:1420

## Prerequisites

### Required
- **Docker Desktop** (or Docker Engine + Docker Compose on Linux)
  - Download: https://www.docker.com/products/docker-desktop
  - Minimum version: Docker 20.10+

### Optional (for Tauri GUI development)
- **XQuartz** (macOS only) - Required for GUI apps in Docker
  - Download: https://www.xquartz.org/
- **X11** (Linux) - Usually pre-installed

## Setup

### Automated Setup (Recommended)

Run the setup script:

```bash
./docker-setup.sh
```

This script will:
1. Verify Docker is running
2. Install all npm dependencies
3. Build the Tauri Docker image
4. Configure X11 (macOS/Linux)
5. Test the setup

### Manual Setup

If you prefer manual setup:

```bash
# 1. Install dependencies
make install

# 2. Build Tauri image (for Tauri development)
make build-tauri-image

# 3. (macOS only) Install and configure XQuartz
# Download from https://www.xquartz.org/
# Then run:
xhost + localhost
```

## Development Workflows

### Workflow 1: Frontend Only (Fastest)

Perfect for UI development without running the Rust backend:

```bash
make dev-frontend
# or
make quick-dev
```

- **Dev server**: http://localhost:1420
- **Fast**: Uses lightweight Node Alpine image
- **Hot reload**: Changes reflect instantly
- **Use when**: Building UI, testing components, working on styling

### Workflow 2: Full Stack (Docker Compose)

Run both frontend and backend with all services:

```bash
make dev
```

This starts:
- **Frontend**: Vite dev server (port 1420)
- **Test server**: Vitest UI (port 51204)
- **Linter**: Biome watch mode

**Note**: This doesn't include the Tauri GUI window. Use `make dev-tauri` for that.

### Workflow 3: Tauri GUI Development

Full Tauri app with GUI window (requires X11):

```bash
# macOS: Make sure XQuartz is running and configured
xhost + localhost

# Start Tauri dev
make dev-tauri
```

This will:
- Build and run the Rust backend
- Start the Vite frontend
- Open a native GUI window
- Enable hot reload for both frontend and backend

## GUI Development (Tauri)

### macOS Setup

1. **Install XQuartz**:
   ```bash
   brew install --cask xquartz
   # or download from https://www.xquartz.org/
   ```

2. **Configure XQuartz**:
   - Open XQuartz
   - Go to Preferences → Security
   - Enable "Allow connections from network clients"
   - Restart XQuartz

3. **Enable Docker connections**:
   ```bash
   xhost + localhost
   ```

4. **Set DISPLAY** (usually automatic):
   ```bash
   export DISPLAY=:0
   ```

5. **Start development**:
   ```bash
   make dev-tauri
   ```

### Linux Setup

Linux has native X11 support:

```bash
# Allow Docker to connect to X11
xhost + local:docker

# Start development
make dev-tauri
```

### Windows

**Note**: Tauri in Docker requires X11 forwarding, which is complex on Windows. For Windows development, we recommend:

1. Install Node.js and Rust locally
2. Use WSL2 with X11 server (VcXsrv or X410)
3. Or use the frontend-only Docker workflow and test Tauri builds on macOS/Linux

## Common Tasks

### Installing Dependencies

```bash
# Install/update npm dependencies
make install

# Add a new dependency
make docker-shell
npm install <package-name>
# Then commit package.json and package-lock.json
```

### Testing

```bash
# Run all tests
make test

# Run with coverage report
make test-coverage

# Interactive test UI (browser)
make test-ui
# Then open http://localhost:51204
```

### Linting and Formatting

```bash
# Check code style
make lint

# Auto-fix issues
make format
```

### Building

```bash
# Build frontend only
make build

# Build Tauri app (full application)
make build-tauri
```

### Cleaning Up

```bash
# Remove build artifacts
make clean

# Stop all Docker containers
make docker-down

# Full cleanup (includes Docker volumes)
docker compose down -v
```

## Troubleshooting

### ERR_EMPTY_RESPONSE / Cannot Connect to Server

**Error**: Browser shows `ERR_EMPTY_RESPONSE` when accessing http://localhost:1420

**Cause**: Vite is binding to `localhost` inside the container, which is not accessible from the host.

**Solution**: This is already fixed in the project! The server is configured to listen on `0.0.0.0`. If you still see this error:

1. **Verify the server is running with `--host 0.0.0.0`**:
   ```bash
   # Check the logs for "Network: http://..." line
   docker logs <container-id>
   ```
   
   You should see:
   ```
   ➜  Local:   http://localhost:1420/
   ➜  Network: http://192.168.x.x:1420/
   ```

2. **If "Network" line is missing**, the host flag isn't being applied:
   ```bash
   # Stop current container
   docker ps -q | xargs docker stop
   
   # Restart with fix
   make dev-frontend
   ```

3. **Check Docker port mapping**:
   ```bash
   docker ps
   # Should show: 0.0.0.0:1420->1420/tcp
   ```

See `DOCKER_FIXES.md` for detailed explanation of this issue.

### Docker Not Running

**Error**: `Cannot connect to the Docker daemon`

**Solution**:
```bash
# Start Docker Desktop (macOS/Windows)
# or
sudo systemctl start docker  # Linux
```

### X11 Connection Refused (macOS)

**Error**: `Can't open display: :0`

**Solutions**:

1. **Check XQuartz is running**:
   ```bash
   ps aux | grep XQuartz
   ```

2. **Enable xhost**:
   ```bash
   xhost + localhost
   ```

3. **Verify DISPLAY variable**:
   ```bash
   echo $DISPLAY
   # Should show :0 or similar
   ```

4. **Restart XQuartz**:
   - Quit XQuartz completely
   - Open it again
   - Try `make dev-tauri` again

### Port Already in Use

**Error**: `Bind for 0.0.0.0:1420 failed: port is already allocated`

**Solution**:
```bash
# Find what's using the port
lsof -i :1420

# Kill the process or stop other containers
make docker-down
```

### Slow Build Times

See [Performance Tips](#performance-tips) below.

### Permission Errors

**Error**: `EACCES: permission denied`

**Solution**:
```bash
# Fix ownership of node_modules
docker compose run --rm frontend chown -R node:node /app/node_modules
```

### Rust Compilation Errors

**Error**: `error: linker 'cc' not found`

**Solution**:
```bash
# Rebuild the Tauri image
make build-tauri-image --no-cache
```

## Performance Tips

### Use Docker Volumes for Caching

The `docker-compose.yml` already includes these volumes:
- `node_modules_cache`: NPM packages
- `cargo_cache`: Rust dependencies  
- `target_cache`: Rust build artifacts

These dramatically speed up rebuilds.

### Don't Sync node_modules

Never sync `node_modules` or `target` directories to your host. Use Docker volumes instead.

The `.dockerignore` file already excludes these.

### Use BuildKit

Enable Docker BuildKit for faster builds:

```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
```

Or add to `~/.docker/config.json`:
```json
{
  "features": {
    "buildkit": true
  }
}
```

### Increase Docker Resources

For faster builds, allocate more resources in Docker Desktop:
- **CPUs**: 4-6 cores
- **Memory**: 8+ GB
- **Disk**: 64+ GB

Settings → Resources → Advanced

### Use Frontend-Only Mode

When working on UI, use `make dev-frontend` instead of full Tauri dev:
- Much faster startup
- Less resource intensive  
- Hot reload is instant

## Docker Images

### Frontend Image (`node:20-alpine`)

- **Purpose**: Vite dev server, testing, linting
- **Size**: ~200 MB
- **Build time**: ~1-2 minutes (first time)
- **Rebuild**: Only when dependencies change

### Tauri Image (`lilt-gui-tauri`)

- **Purpose**: Full Tauri development with GUI
- **Size**: ~3-4 GB
- **Build time**: ~10-15 minutes (first time)
- **Rebuild**: Rarely needed

Built from `Dockerfile.tauri` with:
- Rust 1.83
- Node 20
- Tauri CLI
- WebKit + X11 libraries
- Cross-compilation tools

## Environment Variables

Customize Docker behavior:

```bash
# Set Node environment
NODE_ENV=development make dev

# Use different display (macOS)
DISPLAY=:1 make dev-tauri

# Increase verbosity
DEBUG=true make build
```

## Best Practices

1. **Keep Docker running**: Starting Docker Desktop takes time, keep it running during dev
2. **Use frontend-only mode**: Faster iteration for UI work
3. **Commit lock files**: Always commit `package-lock.json` and `Cargo.lock`
4. **Clean periodically**: Run `make clean` weekly to free disk space
5. **Update images**: Rebuild images monthly: `make build-tauri-image --no-cache`

## Advanced Usage

### Custom Docker Commands

Open a shell in the container:

```bash
make docker-shell

# Or directly:
docker compose run --rm frontend sh
```

### Debugging Tauri

```bash
# Run with Rust backtraces
RUST_BACKTRACE=1 make dev-tauri

# Full backtrace
RUST_BACKTRACE=full make dev-tauri
```

### Multi-Platform Builds

Build for different architectures:

```bash
# Build for ARM64
docker buildx build --platform linux/arm64 -t lilt-gui-tauri:arm64 -f Dockerfile.tauri .

# Build for AMD64
docker buildx build --platform linux/amd64 -t lilt-gui-tauri:amd64 -f Dockerfile.tauri .
```

## CI/CD with Docker

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) uses Docker for:
- Installing dependencies
- Running tests
- Linting
- Building

Locally, replicate CI with:

```bash
make ci
```

This runs the full CI pipeline in Docker.

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Tauri Documentation](https://tauri.app/)
- [XQuartz Setup Guide](https://gist.github.com/sorny/969fe55d85c9b0035b0109a31cbcb088)
- [WSL2 GUI Apps](https://learn.microsoft.com/en-us/windows/wsl/tutorials/gui-apps)

## Getting Help

If you encounter issues:

1. Check this guide's [Troubleshooting](#troubleshooting) section
2. Run `make info` to see your environment
3. Check Docker Desktop logs
4. Open an issue on GitHub

---

Happy coding! 🎉
