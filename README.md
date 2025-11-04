# Lilt GUI

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Build Status](https://github.com/Ardakilic/lilt-gui/workflows/Build%20and%20Test/badge.svg)
![Go Version](https://img.shields.io/badge/Go-1.21-blue.svg)
![Node Version](https://img.shields.io/badge/Node-18-green.svg)

A modern, cross-platform GUI application for [lilt](https://github.com/Ardakilic/lilt) - the lightweight intelligent lossless transcoder.

Lilt GUI provides an intuitive interface to convert Hi-Res FLAC and ALAC files to 16-bit FLAC files with sample rates of 44.1kHz or 48kHz, with support for enforcing output formats (FLAC, MP3, ALAC) for all audio files.

## Features

- 🎵 **Modern UI** - Clean, responsive interface built with React and DaisyUI
- 🌍 **Multi-language Support** - English, Turkish, German, and Spanish translations
- 🐳 **Docker Support** - No need to install external tools (SoX, FFmpeg) when using Docker mode
- 💾 **Configuration Persistence** - Remembers your last settings
- 📊 **Real-time Output** - Live transcoding output in the console
- 🎨 **Format Enforcement** - Convert all files to FLAC, MP3, or ALAC
- 🖼️ **Image Copying** - Optionally copy album artwork
- 🔍 **Auto-detect Binaries** - Identify tools in system PATH automatically
- ⚡ **Cross-platform** - Works on Windows, macOS, and Linux

## Screenshots

_Screenshots coming soon_

## Installation

### Download Pre-built Binaries

Download the latest release for your platform from the [Releases](https://github.com/Ardakilic/lilt-gui/releases) page:

- **Windows**: `lilt-gui-windows-amd64.exe`
- **macOS Intel**: `lilt-gui-darwin-amd64.zip`
- **macOS Apple Silicon**: `lilt-gui-darwin-arm64.zip`
- **Linux AMD64**: `lilt-gui-linux-amd64`
- **Linux ARM64**: `lilt-gui-linux-arm64`

### Build from Source

#### Prerequisites

- [Wails](https://wails.io/) v2.8.0 or later
- [Go](https://golang.org/) 1.21 or later
- [Node.js](https://nodejs.org/) 18 or later
- Platform-specific dependencies:
  - **Linux**: `libgtk-3-dev`, `libwebkit2gtk-4.0-dev`
  - **macOS**: Xcode Command Line Tools
  - **Windows**: MSVC or MinGW-w64

#### Build Steps

```bash
# Clone the repository
git clone https://github.com/Ardakilic/lilt-gui.git
cd lilt-gui

# Install dependencies
cd frontend && npm install && cd ..
go mod download

# Build the application
wails build

# The executable will be in the build/bin directory
```

## Development

### Using Docker (Recommended)

The project includes a Makefile for Docker-based development:

```bash
# Install dependencies
make install

# Run frontend development server
make dev-frontend

# Run tests
make test

# Run tests with coverage
make test-coverage

# Run linter
make lint

# Fix linting issues
make lint-fix

# Format code
make format

# Build frontend
make build-frontend

# Clean build artifacts
make clean

# Show all available commands
make help
```

### Without Docker

```bash
# Install frontend dependencies
cd frontend && npm install

# Run frontend dev server
npm run dev

# In another terminal, run Wails dev mode
wails dev
```

## Usage

### Basic Workflow

1. **Select Lilt Binary**: Browse or use "Identify" to find lilt in your PATH
2. **Choose Docker or Local Tools**:
   - **Docker Mode** (Recommended): Enable "Use Docker" - no need for external tools
   - **Local Mode**: Provide paths to SoX/SoX-NG, FFmpeg, and FFprobe
3. **Configure Options**:
   - **Output Format**: Choose default (smart detection), FLAC, MP3, or ALAC
   - **Preserve Metadata**: Keep ID3 tags and cover art (enabled by default)
   - **Copy Images**: Copy JPG and PNG files (optional)
4. **Select Directories**:
   - **Source Directory**: Folder containing audio files to transcode
   - **Target Directory**: Where transcoded files will be saved
5. **Start Transcoding**: Click the button and monitor progress in the output console
6. **Stop if Needed**: Use the "Stop Transcoding" button to cancel the process

### Download Lilt

If you don't have lilt installed, click the "Download Lilt" button in the header to get the latest version from the [lilt releases page](https://github.com/Ardakilic/lilt/releases/latest).

## Configuration

Settings are automatically saved and restored between sessions, including:

- Last used lilt binary path
- Tool paths (SoX, FFmpeg, etc.)
- Docker preference
- Output format selection
- Metadata and image copy preferences
- Language selection

Configuration is stored in:
- **Windows**: `%APPDATA%\lilt-gui\config.json`
- **macOS**: `~/Library/Application Support/lilt-gui/config.json`
- **Linux**: `~/.config/lilt-gui/config.json`

## Internationalization

Lilt GUI supports multiple languages. Contributions for additional translations are welcome!

### Supported Languages

- 🇬🇧 English
- 🇹🇷 Turkish (Türkçe)
- 🇩🇪 German (Deutsch)
- 🇪🇸 Spanish (Español)

### Adding a New Language

1. Create a new JSON file in `frontend/src/i18n/locales/` (e.g., `fr.json` for French)
2. Copy the structure from `en.json` and translate all values
3. Import and register the language in `frontend/src/i18n/config.ts`
4. Add the language to the `LANGUAGES` array in `frontend/src/components/Header.tsx`
5. Submit a pull request!

## Architecture

### Technology Stack

- **Framework**: [Wails](https://wails.io/) v2
- **Backend**: Go 1.21
- **Frontend**: React 18 with TypeScript
- **UI Components**: [DaisyUI](https://daisyui.com/) with Tailwind CSS
- **Build Tool**: Vite
- **Testing**: Vitest with React Testing Library
- **Linting**: Biome
- **Internationalization**: i18next

### Project Structure

```
lilt-gui/
├── app.go                  # Wails application logic
├── main.go                 # Application entry point
├── go.mod                  # Go dependencies
├── wails.json              # Wails configuration
├── Makefile                # Docker-based dev commands
├── build/
│   └── appicon.png         # Application icon
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── i18n/           # Translations
│   │   ├── styles/         # CSS files
│   │   ├── wailsjs/        # Wails bindings
│   │   ├── __tests__/      # Tests
│   │   └── App.tsx         # Main app component
│   ├── package.json        # Node dependencies
│   ├── vite.config.ts      # Vite configuration
│   ├── vitest.config.ts    # Test configuration
│   └── biome.json          # Linter configuration
└── .github/
    └── workflows/
        └── build.yml       # CI/CD pipeline
```

## Testing

The project includes comprehensive tests with >80% code coverage requirement:

```bash
# Run tests
make test

# Run tests with coverage
make test-coverage

# Run tests in watch mode (without Docker)
cd frontend && npm run test:watch
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Before contributing:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests and ensure they pass (`make test`)
4. Run linter and fix any issues (`make lint-fix`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Follow existing code style (enforced by Biome)
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass and coverage remains >80%
- Use conventional commit messages

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## About

### What is Lilt?

Lilt is a cross-platform command-line tool that converts Hi-Res FLAC and ALAC files to 16-bit FLAC files with a sample rate of 44.1kHz or 48kHz. Written in Go for excellent performance and cross-platform compatibility.

Lilt stands for "lightweight intelligent lossless transcoder". It's also a form of traditional singing common in the Goidelic speaking areas of Ireland, Scotland and the Isle of Man.

**Key Features of Lilt:**
- Smart detection of Hi-Res files requiring conversion
- Support for FLAC and ALAC input formats
- Preserve metadata and cover art
- Enforce output formats (FLAC, MP3, ALAC)
- Docker support for portability
- Cross-platform (Windows, macOS, Linux)

Learn more: [github.com/Ardakilic/lilt](https://github.com/Ardakilic/lilt)

## Author

**Arda Kılıçdağı**
- GitHub: [@Ardakilic](https://github.com/Ardakilic)
- Website: [arda.pw](https://arda.pw)

## Acknowledgments

- [Wails](https://wails.io/) - Amazing Go + Web framework
- [lilt](https://github.com/Ardakilic/lilt) - The core transcoding tool
- [DaisyUI](https://daisyui.com/) - Beautiful UI components
- All contributors and users!

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Ardakilic/lilt-gui/issues) page
2. Search for existing issues or create a new one
3. Provide as much detail as possible (OS, version, steps to reproduce)

## Roadmap

- [ ] Batch processing with queue management
- [ ] Audio preview before transcoding
- [ ] Advanced FFmpeg options
- [ ] Plugin system for custom presets
- [ ] Dark/Light theme toggle
- [ ] Progress notifications
- [ ] Audio quality analysis

---

Made with ❤️ by [Arda Kılıçdağı](https://github.com/Ardakilic)
