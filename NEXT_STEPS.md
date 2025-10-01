# Next Steps for Lilt GUI

Congratulations! Your Lilt GUI project structure is complete with **Docker-first development** configured. You don't need Node.js or Rust installed locally!

## 🚀 Quick Start (Docker-Only)

```bash
# Run the automated setup script
./docker-setup.sh

# Start development
make dev-frontend
```

That's it! Your app will be available at http://localhost:1420

---

## Detailed Setup Instructions

### 1. Prerequisites

**Required:**
- Docker Desktop (https://www.docker.com/products/docker-desktop)
  - Make sure Docker is running before proceeding

**Optional (for Tauri GUI development):**
- **macOS**: XQuartz (https://www.xquartz.org/)
- **Linux**: X11 (usually pre-installed)
- **Windows**: WSL2 + X server (or install Node/Rust locally)

### 2. Automated Setup (Recommended)

Run the setup script to configure everything:

```bash
./docker-setup.sh
```

This script will:
- ✅ Check Docker is running
- ✅ Install all npm dependencies via Docker
- ✅ Build the Tauri Docker image
- ✅ Configure X11 for GUI development (macOS/Linux)
- ✅ Test the setup

### 3. Manual Setup (Alternative)

If you prefer manual setup:

```bash
# Install dependencies
make install

# Build Tauri image (for GUI development)
make build-tauri-image

# macOS only: Configure X11
# 1. Install XQuartz: https://www.xquartz.org/
# 2. Enable: XQuartz Preferences → Security → "Allow connections from network clients"
# 3. Run:
xhost + localhost
```

---

## 🛠️ Development Workflows

### Option 1: Frontend Only (Fastest)

Best for UI development without Rust backend:

```bash
make dev-frontend
# or
make quick-dev
```

- **URL**: http://localhost:1420
- **Fast**: Lightweight Node Alpine container
- **Hot reload**: Instant updates
- **Use when**: Building UI, testing components, styling

### Option 2: Full Stack (Docker Compose)

Run all services together:

```bash
make dev
```

Starts:
- Vite dev server (http://localhost:1420)
- Vitest test UI (http://localhost:51204)
- Biome linter (watch mode)

### Option 3: Tauri GUI Development

Full native app with GUI window (requires X11):

**macOS:**
```bash
# Start XQuartz first, then:
xhost + localhost
make dev-tauri
```

**Linux:**
```bash
xhost + local:docker
make dev-tauri
```

This runs the full Tauri app with Rust backend and GUI window.

---

## 📋 Common Tasks

### Testing

```bash
make test                # Run all tests
make test-coverage       # With coverage report
make test-ui             # Interactive UI (http://localhost:51204)
```

### Code Quality

```bash
make lint                # Check code style
make format              # Auto-fix issues
```

### Building

```bash
make build               # Build frontend
make build-tauri         # Build full Tauri app
```

### Utilities

```bash
make help                # Show all commands
make info                # Show project info
make clean               # Clean build artifacts
make docker-shell        # Open shell in container
```

---

## 📝 Next Development Steps

### 1. Create App Icons

Generate proper icon files:

1. Create a 512x512 PNG image
2. Use Tauri icon generator:
   ```bash
   make docker-shell
   npm install -g @tauri-apps/cli
   tauri icon path/to/icon.png
   exit
   ```

Or use online tools:
- https://icon.kitchen/
- https://www.appicon.co/

### 2. Configure Lilt Binary

1. Download Lilt: https://github.com/Ardakilic/lilt/releases/latest
2. In the app, use "Browse" or "Identify" to locate the binary
3. Choose Docker or local mode for SoX/FFmpeg

### 3. Test the Application

```bash
# Run all tests
make test

# Check coverage (should be >80%)
make test-coverage

# Lint code
make lint
```

### 4. Build for Production

When ready to distribute:

```bash
make build-tauri
```

Artifacts will be in: `src-tauri/target/release/bundle/`

Platform-specific builds are handled by GitHub Actions.

---

## 🐳 Docker Tips

### Performance

- **Use frontend-only mode** when possible (fastest)
- **Keep Docker running** to avoid startup delays
- **Docker volumes** cache dependencies automatically

### Troubleshooting

If you encounter issues:

1. **Check Docker is running**:
   ```bash
   make check-docker
   ```

2. **Rebuild images**:
   ```bash
   make clean
   make build-tauri-image
   ```

3. **Check logs**:
   ```bash
   docker compose logs -f
   ```

4. **See detailed guide**:
   ```bash
   cat DOCKER_GUIDE.md
   ```

### Common Issues

**Port already in use?**
```bash
make docker-down
```

**Permission errors?**
```bash
docker compose run --rm frontend chown -R node:node /app/node_modules
```

**X11 connection refused?** (macOS)
```bash
# Restart XQuartz and run:
xhost + localhost
```

See `DOCKER_GUIDE.md` for more troubleshooting.

---

## 📚 Documentation

- **DOCKER_GUIDE.md** - Comprehensive Docker development guide
- **README.md** - Project overview and features
- **CONTRIBUTING.md** - Contribution guidelines
- **PROJECT_SUMMARY.md** - Technical architecture details

---

## 🔄 Continuous Integration

GitHub Actions automatically:
- Runs tests on every push
- Lints code
- Builds for Windows/macOS/Linux (x64 + ARM64)
- Creates release artifacts

Workflow: `.github/workflows/ci-cd.yml`

Test the CI locally:
```bash
make ci
```

---

## 🎯 Recommended Development Flow

1. **Daily work**: Use `make dev-frontend` for fast UI iteration
2. **Testing backend**: Use `make dev-tauri` to test Rust commands
3. **Before commit**: Run `make lint` and `make test`
4. **Building**: Use `make build-tauri` for production builds

---

## 📖 Additional Resources

- [Tauri Documentation](https://tauri.app/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

## 🆘 Getting Help

If you need assistance:

1. Check `DOCKER_GUIDE.md` troubleshooting section
2. Run `make info` to see your environment
3. Check Docker Desktop logs
4. Open an issue on GitHub

---

**Happy coding! 🎉**

Your development environment is ready to use—no local dependencies required!

It will automatically:
- Run tests and linting
- Build for Windows, macOS, and Linux
- Create releases when you push a git tag like `v1.0.0`

## Project Features Implemented

✅ Complete Tauri + React + TypeScript setup
✅ Modern, responsive UI with dark mode support
✅ Internationalization (English, Turkish, German, Spanish)
✅ Binary path detection and file/folder selection
✅ Settings persistence with localStorage
✅ Docker mode support
✅ All transcoding options from lilt CLI
✅ Output display panel
✅ Help modal with project information
✅ Language selector
✅ Comprehensive tests with Vitest
✅ GitHub Actions CI/CD for multi-platform builds
✅ Makefile for Docker-based development
✅ Biome linter configuration
✅ Complete documentation (README, CONTRIBUTING, LICENSE)

## Troubleshooting

### "Module not found" errors in IDE
These are expected until you run `npm install`. The TypeScript compiler needs the actual packages.

### Tauri build fails
Make sure you have:
- Rust installed: `rustc --version`
- Platform-specific dependencies (see Tauri prerequisites)

### Docker commands not working
Ensure Docker Desktop is running on your Mac.

## Resources

- Tauri Documentation: https://tauri.app/
- React Documentation: https://react.dev/
- Vite Documentation: https://vitejs.dev/
- Biome Documentation: https://biomejs.dev/
- Lilt Repository: https://github.com/Ardakilic/lilt

## Need Help?

- Check the README.md for detailed documentation
- Review CONTRIBUTING.md for development guidelines
- Open an issue on GitHub for bugs or questions

Happy coding! 🚀
