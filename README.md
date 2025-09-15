# Lilt GUI 🎵

[![CI/CD](https://github.com/Ardakilic/lilt-gui/actions/workflows/ci.yml/badge.svg)](https://github.com/Ardakilic/lilt-gui/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/Ardakilic/lilt-gui/branch/main/graph/badge.svg)](https://codecov.io/gh/Ardakilic/lilt-gui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, cross-platform graphical user interface for [Lilt](https://github.com/Ardakilic/lilt) - the lightweight intelligent lossless transcoder for Hi-Res FLAC and ALAC files.

![Lilt GUI Screenshot](assets/screenshot.png)

## Features

### 🎨 Modern Interface
- **Responsive Design**: Adapts to different screen sizes with a clean, modern UI
- **Dark/Light Theme**: Beautiful gradient background with intuitive controls
- **Real-time Output**: Live transcoding progress with scrollable output terminal
- **Smart Validation**: Form validation with helpful error messages

### 🛠️ Powerful Functionality
- **Binary Management**: Auto-detect or manually select Lilt, SoX, FFmpeg, and FFprobe binaries
- **Docker Support**: Built-in Docker integration for hassle-free transcoding
- **Multiple Formats**: Support for FLAC, ALAC, and MP3 output formats
- **Batch Processing**: Process entire directories with preserved folder structure
- **Metadata Preservation**: Optional copying of ID3 tags and cover art

### 🌍 Internationalization
- **Multi-language Support**: English, Turkish, German, and Spanish
- **Easy Translation**: JSON-based translation files for easy community contributions
- **Dynamic Language Switching**: Change language on-the-fly without restart

### ⚙️ Advanced Features
- **Settings Persistence**: Remembers your preferences and last used paths
- **Process Management**: Start, stop, and monitor transcoding processes
- **Auto-download**: Download latest Lilt binary from GitHub releases
- **Cross-platform**: Works on Windows, macOS, and Linux

## Installation

### Pre-built Releases

Download the latest release for your platform from the [Releases](https://github.com/Ardakilic/lilt-gui/releases) page:

- **Windows**: `lilt-gui-setup.exe`
- **macOS**: `lilt-gui.dmg`
- **Linux**: `lilt-gui.AppImage` or `lilt-gui.deb`

### Build from Source

#### Prerequisites
- **For Docker Development** (Recommended): Docker installed
- **For Local Development**: Node.js 22+ (LTS recommended) and npm

#### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/Ardakilic/lilt-gui.git
cd lilt-gui

# Install dependencies
make install

# Start development server
make dev

# Build for production
make build

# Create distributable packages
make dist
```

#### Local Development

```bash
# Clone the repository
git clone https://github.com/Ardakilic/lilt-gui.git
cd lilt-gui

# Install dependencies
make install-local

# Start development server
make dev-local

# Build for production
make build-local

# Create distributable packages
npm run dist
```

## Usage

### First Time Setup

1. **Launch Lilt GUI** - Open the application
2. **Download Lilt Binary** - Click "Download Lilt" button to auto-download the latest Lilt binary
3. **Configure Binaries** (if not using Docker):
   - Click "Identify" buttons to auto-detect SoX, FFmpeg, and FFprobe in your PATH
   - Or manually select binary files using "Browse" buttons
4. **Select Folders**:
   - Choose source folder containing your audio files
   - Choose destination folder for converted files

### Basic Workflow

1. **Select Source and Target Folders**
2. **Choose Output Format** (optional):
   - Default: Smart conversion (24-bit → 16-bit, Hi-Res → 44.1/48kHz)
   - FLAC: Force all files to FLAC format
   - MP3: Convert to 320kbps MP3
   - ALAC: Convert to 16-bit ALAC
3. **Configure Options**:
   - Enable Docker for easier setup (recommended)
   - Choose to copy images (JPG/PNG files)
   - Preserve or skip metadata
4. **Start Transcoding** and monitor progress in real-time

### Advanced Configuration

#### Docker Setup
- **Enabled by default** for easier setup
- Uses `ardakilic/sox_ng:latest` Docker image
- Automatically includes SoX and FFmpeg
- No local binary installation required

#### Binary Configuration
When Docker is disabled, you need:
- **Lilt**: The main transcoding binary
- **SoX**: Audio processing engine
- **FFmpeg**: For ALAC support and metadata
- **FFprobe**: For audio file analysis

#### Format Enforcement
- **Default**: Intelligent conversion based on file properties
- **FLAC**: Convert all audio to 16-bit FLAC
- **MP3**: Convert lossless files to 320kbps MP3
- **ALAC**: Convert all audio to 16-bit ALAC

## Development

### Project Structure

```
src/
├── main/                 # Electron main process
│   └── main.ts          # Main application logic
├── renderer/            # React frontend
│   ├── components/      # UI components
│   ├── i18n/           # Translation files
│   ├── styles/         # Styling and themes
│   └── App.tsx         # Main React component
└── shared/             # Shared types and utilities
    └── types.ts        # TypeScript definitions
```

### Development Commands

#### Using Docker (Recommended)
```bash
make help              # Show all available commands
make install           # Install dependencies
make dev              # Start development with hot reload
make build            # Build the application
make test             # Run tests
make test-coverage    # Run tests with coverage
make lint             # Lint and fix code
make typecheck        # Run TypeScript type checking
make dist             # Build and package for all platforms
make shell            # Open interactive Docker shell
make clean            # Clean Docker containers
```

#### Local Development
```bash
make install-local    # Install dependencies locally
make dev-local        # Start development locally
make build-local      # Build locally
make test-local       # Run tests locally

# For distribution (requires local Electron)
npm run dist          # Build and package for all platforms
npm run dist:mac      # Package for macOS
npm run dist:win      # Package for Windows
npm run dist:linux    # Package for Linux
```

### Technology Stack

- **Frontend**: React 18, TypeScript, styled-components
- **Backend**: Electron, Node.js
- **Build Tools**: Webpack, Babel
- **Testing**: Jest, React Testing Library
- **Linting**: ESLint, TypeScript ESLint
- **CI/CD**: GitHub Actions
- **Internationalization**: react-i18next

### Adding New Languages

1. Create a new translation file in `src/renderer/i18n/locales/`:
   ```json
   // src/renderer/i18n/locales/fr.json
   {
     "app": {
       "title": "Lilt GUI",
       "version": "Version {{version}}"
     },
     // ... more translations
   }
   ```

2. Import and add to `src/renderer/i18n/i18n.ts`:
   ```typescript
   import fr from './locales/fr.json';
   
   const resources = {
     en: { translation: en },
     // ... other languages
     fr: { translation: fr },
   };
   ```

3. Update language options in components as needed.

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes with tests
4. Ensure all tests pass: `npm test`
5. Lint your code: `npm run lint`
6. Commit changes: `git commit -m "Add feature"`
7. Push to branch: `git push origin feature-name`
8. Create a Pull Request

#### Development Guidelines

- Follow TypeScript best practices
- Maintain 80%+ test coverage
- Add translations for new UI text
- Use semantic commit messages
- Update documentation for new features

## Requirements

### System Requirements
- **OS**: Windows 10+, macOS 10.14+, or Linux (Ubuntu 18.04+)
- **RAM**: 512MB minimum, 1GB recommended
- **Storage**: 100MB for application, additional space for processing

### Runtime Dependencies
- **Docker** (recommended): For automatic binary management
- **OR Manual Setup**:
  - Lilt binary (auto-downloadable)
  - SoX audio processing library
  - FFmpeg for ALAC support and metadata

## Troubleshooting

### Common Issues

#### "Binary not found in PATH"
- **Solution**: Use "Identify" buttons or manually browse for binaries
- **Alternative**: Enable Docker mode for automatic setup

#### "Permission denied" on macOS/Linux
- **Solution**: Make downloaded binaries executable:
  ```bash
  chmod +x /path/to/lilt
  ```

#### Docker not working
- **Check**: Docker is installed and running
- **Verify**: Docker image can be pulled:
  ```bash
  docker pull ardakilic/sox_ng:latest
  ```

#### High memory usage
- **Cause**: Processing large files or many files simultaneously
- **Solution**: Process smaller batches or increase system RAM

### Debug Mode
Enable debug logging by setting environment variable:
```bash
# macOS/Linux
DEBUG=lilt-gui npm start

# Windows
set DEBUG=lilt-gui && npm start
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Lilt](https://github.com/Ardakilic/lilt) - The core audio transcoding engine
- [SoX](http://sox.sourceforge.net/) - Sound processing library
- [FFmpeg](https://ffmpeg.org/) - Multimedia framework
- [Electron](https://electronjs.org/) - Cross-platform desktop framework
- [React](https://reactjs.org/) - UI library

## Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/Ardakilic/lilt-gui/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Ardakilic/lilt-gui/discussions)
- 📧 **Contact**: [arda@kilicdagi.com](mailto:arda@kilicdagi.com)

---

Made with ❤️ by [Arda Kilicdagi](https://github.com/Ardakilic)
