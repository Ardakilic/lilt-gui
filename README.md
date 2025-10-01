# Lilt GUI

<div align="center">

![Lilt GUI Logo](public/icon.png)

**Modern GUI for Lilt - Audio Transcoding Made Easy**

A cross-platform desktop application for [Lilt](https://github.com/Ardakilic/lilt), the powerful audio transcoding tool.

[![CI/CD](https://github.com/Ardakilic/lilt-gui/workflows/CI%2FCD/badge.svg)](https://github.com/Ardakilic/lilt-gui/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Download](https://github.com/Ardakilic/lilt-gui/releases/latest) | [Documentation](#documentation) | [Contributing](#contributing)

</div>

## 📖 About

Lilt GUI is a modern, user-friendly graphical interface for Lilt, a command-line tool that converts Hi-Res FLAC and ALAC files to various formats. Built with Tauri, React, and TypeScript, it provides a seamless experience for audio transcoding across Windows, macOS, and Linux.

## ✨ Features

- **🎵 Complete Audio Support**: Works with FLAC, ALAC (.m4a), and MP3 files
- **🎨 Modern Interface**: Clean, responsive UI with dark mode support
- **🌍 Multi-language**: Support for English, Turkish, German, and Spanish
- **🐳 Docker Integration**: Optional Docker support for containerized execution
- **💾 Smart Settings**: Automatically saves and restores your preferences
- **📊 Real-time Output**: View transcoding progress in real-time
- **🔍 Auto-detect Binaries**: Automatically find installed tools in your system PATH
- **⚙️ Flexible Options**: 
  - Multiple output formats (FLAC, MP3, ALAC)
  - Metadata preservation
  - Image copying
  - Custom target directories

## 🚀 Quick Start

### For Users

#### Download Pre-built Binaries

Download the latest release for your platform from the [Releases](https://github.com/Ardakilic/lilt-gui/releases) page:

- **Windows**: `lilt-gui_x.x.x_x64.msi` or `.exe`
- **macOS**: `lilt-gui_x.x.x_x64.dmg` (Intel) or `lilt-gui_x.x.x_aarch64.dmg` (Apple Silicon)
- **Linux**: `lilt-gui_x.x.x_amd64.deb` or `.AppImage`

You'll also need:
- [Lilt binary](https://github.com/Ardakilic/lilt/releases/latest)
- **Either** [Docker Desktop](https://www.docker.com/products/docker-desktop) (recommended)
- **Or** [SoX](http://sox.sourceforge.net/) + [FFmpeg](https://ffmpeg.org/)

### For Developers

**No local Node.js or Rust installation required!** Everything runs in Docker:

```bash
# Clone the repository
git clone https://github.com/Ardakilic/lilt-gui.git
cd lilt-gui

# Run automated setup
./docker-setup.sh

# Start development
make dev-frontend
```

See [Development](#development) section for details.

## 📘 Documentation

### Using Lilt GUI

1. **Configure Binaries**:
   - Click "Browse" to select the Lilt binary
   - Click "Identify" to auto-detect binaries in your PATH
   - If using Docker, only Lilt binary is required

2. **Set Options**:
   - Enable/disable Docker mode
   - Choose output format (or leave default for smart conversion)
   - Toggle metadata preservation and image copying

3. **Select Folders**:
   - Choose your source folder containing audio files
   - Choose your target folder for converted files

4. **Start Transcoding**:
   - Click "Start Transcoding" to begin
   - Monitor progress in the output panel
   - Use "Stop Transcoding" to cancel if needed

### Supported Formats

- **Input**: FLAC, ALAC (.m4a), MP3
- **Output**: FLAC (16-bit), MP3 (320kbps), ALAC (16-bit)

### Command-line Equivalents

Behind the scenes, Lilt GUI constructs commands like:

```bash
# Using Docker
lilt /path/to/source --target-dir /path/to/target --use-docker --copy-images

# Using local tools
lilt /path/to/source --target-dir /path/to/target --enforce-output-format mp3 --copy-images
```

## 🛠️ Development

### Prerequisites

**For Docker Development (Recommended - No local installation needed)**:
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- *Optional for GUI*: [XQuartz](https://www.xquartz.org/) (macOS) or X11 (Linux)

**For Local Development**:
- Node.js 22.20.0 or higher
- Rust 1.83 or higher
- Platform-specific dependencies (see [Tauri Prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites))

### Setup

#### Automated Setup (Docker)

```bash
# Clone the repository
git clone https://github.com/Ardakilic/lilt-gui.git
cd lilt-gui

# Run automated setup
./docker-setup.sh
```

This script will:
- Verify Docker is running
- Install all dependencies
- Build Tauri Docker image
- Configure X11 (macOS/Linux)
- Test the setup

#### Manual Setup (Local)

```bash
# Install dependencies
npm install

# Install Rust (if not installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# macOS: Install system dependencies
xcode-select --install
```

### Development Workflows

#### Docker Development (Recommended)

**Frontend Only** (Fastest):
```bash
make dev-frontend
# or
make quick-dev
```
Dev server: http://localhost:1420

**Full Tauri with GUI** (requires X11):
```bash
# macOS: Start XQuartz and run
xhost + localhost
make dev-tauri

# Linux: Run
xhost + local:docker
make dev-tauri
```

**All Services**:
```bash
make dev
```

#### Local Development

```bash
npm run tauri:dev     # Run Tauri in development mode
npm run dev           # Vite dev server only
```

### Available Commands

#### Makefile (Docker-based - 30+ targets)

```bash
# Development
make install              # Install dependencies via Docker
make dev-frontend         # Fast UI development
make dev-tauri            # Full Tauri with GUI (requires X11)
make dev                  # All services with docker-compose
make quick-dev            # Alias for dev-frontend

# Testing
make test                 # Run tests
make test-coverage        # Run with coverage
make test-ui              # Interactive test UI (port 51204)

# Code Quality
make lint                 # Run Biome linter
make format               # Auto-fix and format

# Building
make build                # Build frontend
make build-tauri          # Build full Tauri app

# Utilities
make clean                # Clean build artifacts
make docker-shell         # Open shell in container
make docker-up            # Start docker-compose
make docker-down          # Stop all containers
make info                 # Show project info
make help                 # Show all commands
make ci                   # Run full CI pipeline locally
```

#### NPM Scripts

```bash
npm run dev           # Vite dev server
npm run tauri:dev     # Tauri development mode
npm run tauri:build   # Build production application
npm run lint          # Run Biome linter
npm run lint:fix      # Fix linting issues
npm run format        # Format code
npm test              # Run tests
npm run test:coverage # Run tests with coverage
```

All npm commands run through Docker when using the Makefile.

### Project Structure

```
lilt-gui/
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── locales/            # Translation files (EN, TR, DE, ES)
│   ├── services/           # Tauri API services
│   ├── test/               # Test files
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── i18n.ts             # i18n configuration
├── src-tauri/              # Rust backend
│   ├── src/
│   │   └── main.rs         # Tauri commands
│   ├── icons/              # App icons
│   ├── Cargo.toml          # Rust dependencies
│   └── tauri.conf.json     # Tauri configuration
├── public/                 # Static assets
├── .github/workflows/      # CI/CD pipelines
├── Makefile                # Docker-based commands (30+ targets)
├── Dockerfile              # Frontend development image
├── Dockerfile.tauri        # Tauri development with GUI
├── docker-compose.yml      # Multi-service orchestration
├── docker-setup.sh         # Automated setup script
├── DOCKER_GUIDE.md         # Comprehensive Docker guide
├── NEXT_STEPS.md           # Getting started guide
└── package.json            # Node.js dependencies
```

### Docker Architecture

Three Docker configurations:

1. **Dockerfile**: Lightweight Node 20 Alpine for frontend development
2. **Dockerfile.tauri**: Full Rust 1.83 + X11 + Tauri for GUI development
3. **docker-compose.yml**: Orchestrates frontend, tauri-dev, test, and lint services

See `DOCKER_GUIDE.md` for comprehensive Docker documentation.

### Testing

Tests use Vitest and React Testing Library:

**Docker (Recommended)**:
```bash
make test                   # Run tests
make test-coverage          # Coverage report (>80% target)
make test-ui                # Interactive UI at http://localhost:51204
```

**Local**:
```bash
npm test                    # Run tests in watch mode
npm run test:coverage       # Generate coverage report
npm run test:ui             # Open Vitest UI
```

### Adding Translations

To add a new language:

1. Create a new JSON file in `src/locales/` (e.g., `fr.json`)
2. Copy the structure from `en.json` and translate all strings
3. Import and add it to `src/i18n.ts`
4. Add the language to the selector in `src/components/LanguageSelector.tsx`

## 🏗️ Building for Production

### Using Docker (Recommended)

```bash
# Build full Tauri app
make build-tauri

# Or just frontend
make build
```

### Local Build

```bash
npm run tauri:build
```

Artifacts will be in `src-tauri/target/release/bundle/`

### Multi-Platform Builds

GitHub Actions automatically builds for:
- Windows (x64)
- macOS (Intel + Apple Silicon)
- Linux (x64 + ARM64)

Workflow: `.github/workflows/ci-cd.yml`

Test CI locally:
```bash
make ci
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure:
- Code follows the existing style (Biome enforced)
- Tests pass: `make test`
- Coverage remains >80%: `make test-coverage`
- Linter passes: `make lint`
- All commits are descriptive

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Docker Development Tips

- Use `make dev-frontend` for fast UI iteration
- Use `make dev-tauri` to test Rust backend (requires X11)
- Run `make help` to see all available commands
- See `DOCKER_GUIDE.md` for comprehensive Docker documentation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Arda Kilicdagi**
- GitHub: [@Ardakilic](https://github.com/Ardakilic)
- Website: [arda.pw](https://arda.pw)

## 🙏 Acknowledgments

- [Lilt](https://github.com/Ardakilic/lilt) - The powerful audio transcoding tool this GUI is built for
- [Tauri](https://tauri.app/) - For making cross-platform desktop apps with web technologies
- [React](https://reactjs.org/) - For the UI framework
- [Biome](https://biomejs.dev/) - For lightning-fast linting and formatting

## 📊 Project Status

- ✅ Core functionality complete
- ✅ Multi-platform support (Windows, macOS, Linux)
- ✅ Multi-architecture support (x64, ARM64)
- ✅ Internationalization (4 languages: EN, TR, DE, ES)
- ✅ Comprehensive test coverage (>80%)
- ✅ CI/CD pipeline with GitHub Actions
- ✅ **Docker-first development** (no local dependencies required)
- ✅ **Comprehensive Docker guide** and automated setup
- 🚧 Additional translations welcome
- 🚧 Feature requests and bug reports appreciated

## 📚 Documentation

- **[NEXT_STEPS.md](NEXT_STEPS.md)** - Getting started guide (Docker-first)
- **[DOCKER_GUIDE.md](DOCKER_GUIDE.md)** - Comprehensive Docker development guide
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Technical architecture overview
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines

## 🐛 Known Issues

- None currently. Please report any issues on the [Issues](https://github.com/Ardakilic/lilt-gui/issues) page.

## 🗺️ Roadmap

- [ ] Real-time process output streaming
- [ ] Batch processing queues
- [ ] Audio file preview
- [ ] Conversion presets
- [ ] Progress percentage indicator
- [ ] System tray integration

---

<div align="center">

Made with ❤️ by [Arda Kilicdagi](https://github.com/Ardakilic)

[⬆ back to top](#lilt-gui)

</div>
