# Quick Start Guide

Get up and running with Lilt GUI in minutes!

## For Users

### Step 1: Download

Download the appropriate version for your operating system from the [Releases](https://github.com/Ardakilic/lilt-gui/releases) page.

### Step 2: Install

- **Windows**: Run the `.exe` file
- **macOS**: Extract the `.zip` and drag `lilt-gui.app` to Applications
- **Linux**: Make executable with `chmod +x lilt-gui` and run

### Step 3: Get Lilt Binary

1. Click "Download Lilt" in the app header, OR
2. Download from [lilt releases](https://github.com/Ardakilic/lilt/releases/latest)

### Step 4: Configure

1. **Select Lilt Binary**: Browse to your downloaded lilt executable or click "Identify" if it's in PATH
2. **Enable "Use Docker"**: Recommended - no need for additional tools
3. **Choose Output Format**: FLAC (default), MP3, or ALAC
4. **Select Source Directory**: Folder with your audio files
5. **Select Target Directory**: Where transcoded files will go

### Step 5: Transcode

Click "Start Transcoding" and watch the progress in the output console!

## For Developers

### Quick Development Setup (Docker)

```bash
# Clone repository
git clone https://github.com/Ardakilic/lilt-gui.git
cd lilt-gui

# Install dependencies
make install

# Run tests
make test

# Start frontend dev server
make dev-frontend
# Open http://localhost:34115 in browser
```

### Quick Development Setup (Local)

```bash
# Clone repository
git clone https://github.com/Ardakilic/lilt-gui.git
cd lilt-gui

# Install dependencies
cd frontend && npm install && cd ..
go mod download

# Run Wails dev mode (with hot reload)
wails dev
```

### Build for Production

```bash
# Using Docker
make build

# Or locally
wails build

# Output in build/bin/
```

## Common Tasks

### Change Language

Click the flag icon in the top-right corner and select your preferred language.

### Stop Transcoding

Click "Stop Transcoding" button in the output console area.

### Clear Output

Click "Clear" button to clean the output console.

### Save Settings

All settings are automatically saved when you start transcoding.

## Troubleshooting

### "Lilt binary path is required"
- Make sure you've selected the lilt executable
- Try clicking "Identify" if lilt is in your PATH

### "Source directory is required"
- Select a folder containing audio files to transcode

### "Docker not found"
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Or disable "Use Docker" and install SoX and FFmpeg manually

### Frontend doesn't load
- Check if port 34115 is available
- Try running on a different port by editing `frontend/vite.config.ts`

### Build fails on Linux
```bash
sudo apt-get update
sudo apt-get install libgtk-3-dev libwebkit2gtk-4.0-dev
```

## Next Steps

- Read the full [README](README.md)
- Check out [Development Guide](docs/DEVELOPMENT.md)
- See [Contributing Guidelines](CONTRIBUTING.md)
- Report bugs or request features via [Issues](https://github.com/Ardakilic/lilt-gui/issues)

## Need Help?

- 📖 [Documentation](README.md)
- 🐛 [Report a Bug](https://github.com/Ardakilic/lilt-gui/issues/new?template=bug_report.md)
- 💡 [Request a Feature](https://github.com/Ardakilic/lilt-gui/issues/new?template=feature_request.md)
- 💬 [GitHub Discussions](https://github.com/Ardakilic/lilt-gui/discussions)

---

**Happy transcoding! 🎵**
