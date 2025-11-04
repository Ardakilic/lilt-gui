# Development Guide

This guide will help you set up your development environment and understand the project structure.

## Prerequisites

### Option 1: Docker (Recommended)

- Docker Desktop or Docker Engine
- Make

### Option 2: Local Development

- [Go](https://golang.org/) 1.21 or later
- [Node.js](https://nodejs.org/) 18 or later  
- [Wails](https://wails.io/) v2.8.0 or later
- Platform-specific dependencies:
  - **Linux**: `libgtk-3-dev`, `libwebkit2gtk-4.0-dev`
  - **macOS**: Xcode Command Line Tools
  - **Windows**: MSVC or MinGW-w64

## Quick Start

### Using Docker

```bash
# Install dependencies
make install

# Run tests
make test

# Start frontend dev server
make dev-frontend

# Build frontend
make build-frontend

# View all commands
make help
```

### Local Development

```bash
# Install dependencies
cd frontend && npm install && cd ..
go mod download

# Run Wails in dev mode (with hot reload)
wails dev
```

## Project Structure

```
lilt-gui/
├── main.go                     # Application entry point
├── app.go                      # Core application logic and Wails bindings
├── go.mod                      # Go dependencies
├── wails.json                  # Wails configuration
├── Makefile                    # Docker-based commands
│
├── build/
│   └── appicon.png            # Application icon (512x512 recommended)
│
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Header.tsx
│   │   │   ├── ConfigForm.tsx
│   │   │   └── OutputConsole.tsx
│   │   │
│   │   ├── i18n/              # Internationalization
│   │   │   ├── config.ts
│   │   │   └── locales/
│   │   │       ├── en.json
│   │   │       ├── tr.json
│   │   │       ├── de.json
│   │   │       └── es.json
│   │   │
│   │   ├── styles/            # CSS files
│   │   │   └── index.css
│   │   │
│   │   ├── wailsjs/           # Auto-generated Wails bindings
│   │   │   ├── go/
│   │   │   └── runtime/
│   │   │
│   │   ├── __tests__/         # Test files
│   │   │   └── components/
│   │   │
│   │   ├── test/              # Test setup
│   │   │   └── setup.ts
│   │   │
│   │   ├── App.tsx            # Main application component
│   │   └── main.tsx           # React entry point
│   │
│   ├── public/                # Static assets
│   ├── package.json           # Node dependencies
│   ├── vite.config.ts         # Vite build configuration
│   ├── vitest.config.ts       # Test configuration
│   ├── tsconfig.json          # TypeScript configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   ├── postcss.config.js      # PostCSS configuration
│   └── biome.json             # Biome linter configuration
│
├── .github/
│   ├── workflows/
│   │   └── build.yml          # CI/CD pipeline
│   └── ISSUE_TEMPLATE/        # Issue templates
│
└── docs/                      # Documentation
```

## Development Workflow

### 1. Make Changes

Edit Go code in `app.go` or `main.go`, or React components in `frontend/src/`.

### 2. Run Tests

```bash
# With Docker
make test

# Without Docker
cd frontend && npm test
```

### 3. Check Linting

```bash
# With Docker
make lint
make lint-fix  # Auto-fix issues

# Without Docker
cd frontend
npm run lint
npm run lint:fix
```

### 4. Test in Dev Mode

```bash
# With Docker (frontend only)
make dev-frontend
# Then open http://localhost:34115 in browser

# Without Docker (full Wails app)
wails dev
```

### 5. Build

```bash
# With Docker
make build

# Without Docker
wails build
```

## Key Components

### Backend (Go)

**`app.go`** - Main application logic:
- `SelectFile()` - Opens file picker dialog
- `SelectDirectory()` - Opens directory picker dialog
- `FindInPath()` - Finds executables in system PATH
- `StartTranscoding()` - Starts lilt transcoding process
- `StopTranscoding()` - Stops running transcoding
- `SaveConfig()` / `LoadConfig()` - Persist user configuration
- `OpenURL()` - Opens URLs in default browser

**`main.go`** - Application entry point:
- Configures Wails app
- Sets window properties
- Embeds frontend assets

### Frontend (React + TypeScript)

**`App.tsx`** - Main component:
- Loads saved configuration on startup
- Manages application state
- Renders Header, ConfigForm, and OutputConsole

**`Header.tsx`** - Top navigation:
- App title and version
- Help modal
- Download Lilt button
- Language selector

**`ConfigForm.tsx`** - Configuration interface:
- Binary path selection
- Docker mode toggle
- Output format selection
- Metadata/image options
- Source/target directory selection
- Start transcoding button

**`OutputConsole.tsx`** - Output display:
- Real-time transcoding output
- Stop transcoding button
- Clear output button

## Wails Bindings

Wails automatically generates TypeScript bindings for Go functions:

```typescript
// These are auto-generated in frontend/src/wailsjs/go/main/App.ts
import { 
  SelectFile, 
  StartTranscoding,
  // ... other functions
} from './wailsjs/go/main/App';

// Usage in React
const handleStart = async () => {
  await StartTranscoding(config);
};
```

**Note**: The `wailsjs/` directory contains mock implementations for development. Real bindings are generated when running `wails dev` or `wails build`.

## Internationalization (i18n)

### Adding a New Language

1. Create translation file:
```bash
cp frontend/src/i18n/locales/en.json frontend/src/i18n/locales/fr.json
```

2. Translate all strings in `fr.json`

3. Import in `frontend/src/i18n/config.ts`:
```typescript
import fr from './locales/fr.json';

i18n.use(initReactI18next).init({
  resources: {
    // ... existing
    fr: { translation: fr },
  },
  // ...
});
```

4. Add to language selector in `frontend/src/components/Header.tsx`:
```typescript
const LANGUAGES = [
  // ... existing
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];
```

### Using Translations

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return <div>{t('config.title')}</div>;
}
```

## Testing

### Running Tests

```bash
# Run all tests
make test

# Run with coverage
make test-coverage

# Watch mode (without Docker)
cd frontend && npm run test:watch
```

### Writing Tests

Place tests in `frontend/src/__tests__/` with `.test.tsx` extension:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from '../components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeTruthy();
  });
});
```

### Coverage Requirements

- Minimum 80% coverage for all metrics (lines, functions, branches, statements)
- CI will fail if coverage drops below threshold

## Building for Production

### Multi-platform Build

GitHub Actions automatically builds for all platforms on push/PR. For local builds:

```bash
# Linux
wails build -platform linux/amd64

# Windows
wails build -platform windows/amd64

# macOS Intel
wails build -platform darwin/amd64

# macOS Apple Silicon
wails build -platform darwin/arm64
```

### Manual Build Steps

1. Build frontend:
```bash
cd frontend && npm run build
```

2. Build Wails app:
```bash
wails build
```

3. Output is in `build/bin/`

## Debugging

### Frontend Debugging

1. Run `wails dev`
2. Open DevTools in the app window (F12)
3. Console logs, network requests, etc. available

### Backend Debugging

Add logging in Go code:
```go
import "fmt"

func (a *App) MyFunction() {
    fmt.Println("Debug message")
    // or
    runtime.LogPrint(a.ctx, "Debug message")
}
```

### Common Issues

**"Cannot find module" errors**:
- Run `make install` or `cd frontend && npm install`

**Wails bindings not working**:
- Run `wails dev` to generate bindings
- Check `frontend/src/wailsjs/` exists

**Build fails on Linux**:
- Install required packages: `libgtk-3-dev libwebkit2gtk-4.0-dev`

**Port 34115 in use**:
- Change port in `frontend/vite.config.ts`

## Code Style

### Go
- Use `gofmt` for formatting
- Follow [Effective Go](https://golang.org/doc/effective_go) guidelines
- Add comments for exported functions

### TypeScript/React
- Biome handles formatting and linting
- Use functional components with hooks
- Avoid `any` types
- Add JSDoc for complex functions

### CSS
- Use Tailwind utility classes
- Follow DaisyUI patterns
- Keep custom CSS minimal

## Continuous Integration

GitHub Actions runs on every push and PR:

1. **Test Job**:
   - Installs dependencies
   - Runs linter
   - Runs tests with coverage
   - Uploads coverage to Codecov

2. **Build Job**:
   - Builds for all platforms
   - Uploads artifacts
   - Creates releases (on tags)

## Performance Tips

- Use React DevTools Profiler to find slow components
- Memoize expensive computations with `useMemo`
- Use `useCallback` for event handlers passed to children
- Keep component tree shallow

## Resources

- [Wails Documentation](https://wails.io/docs/introduction)
- [React Documentation](https://react.dev)
- [DaisyUI Components](https://daisyui.com/components/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vitest Documentation](https://vitest.dev)
- [i18next Documentation](https://www.i18next.com)

## Getting Help

- Check [GitHub Issues](https://github.com/Ardakilic/lilt-gui/issues)
- Read [Contributing Guide](../CONTRIBUTING.md)
- Reach out to [@Ardakilic](https://github.com/Ardakilic)
