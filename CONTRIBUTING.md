# Contributing to Lilt GUI

Thank you for your interest in contributing to Lilt GUI! We appreciate your help in making this project better.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Translation Contributions](#translation-contributions)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please be respectful and constructive in all interactions.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Set up the development environment (see below)
4. Create a new branch for your contribution

## Development Setup

### Using Docker (Recommended)

```bash
# Install dependencies
make install

# Run tests to ensure everything works
make test

# Start development
make dev-frontend
```

### Without Docker

```bash
# Prerequisites
# - Go 1.21+
# - Node.js 18+
# - Wails v2.8.0+

# Install dependencies
cd frontend && npm install && cd ..
go mod download

# Run tests
cd frontend && npm test

# Start development
wails dev
```

## Making Changes

### Before You Start

1. Check existing [issues](https://github.com/Ardakilic/lilt-gui/issues) to see if someone is already working on it
2. Create a new issue if needed to discuss your changes
3. Fork the repository and create a new branch

### Branch Naming

Use descriptive branch names:
- `feature/add-batch-processing` for new features
- `bugfix/fix-docker-detection` for bug fixes
- `docs/update-readme` for documentation
- `i18n/add-french-translation` for translations

### Development Workflow

1. Make your changes
2. Add or update tests
3. Run tests: `make test`
4. Run linter: `make lint`
5. Fix any linting issues: `make lint-fix`
6. Commit your changes with a clear message

### Commit Messages

Follow conventional commit format:

```
type(scope): Brief description

Longer description if needed

Fixes #123
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `i18n`: Translation updates

**Examples:**
```
feat(ui): Add batch processing queue
fix(docker): Correct path resolution on Windows
docs(readme): Add installation instructions
i18n(de): Update German translations
```

## Submitting Changes

1. Push your changes to your fork
2. Create a Pull Request to the main repository
3. Fill out the PR template with:
   - Description of changes
   - Issue number (if applicable)
   - Testing done
   - Screenshots (for UI changes)
4. Wait for review and address any feedback

### Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Ensure all tests pass
- Maintain >80% code coverage
- Update documentation as needed
- Add screenshots for UI changes
- Respond to review comments promptly

## Coding Standards

### Go Code

- Follow standard Go conventions
- Use `gofmt` for formatting
- Add comments for exported functions
- Write table-driven tests where appropriate

### TypeScript/React Code

- Follow Biome linter rules
- Use functional components with hooks
- Add JSDoc comments for complex functions
- Keep components small and focused
- Use TypeScript types, avoid `any`

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow DaisyUI component patterns
- Keep custom CSS minimal
- Ensure responsive design

## Translation Contributions

Adding a new language is highly appreciated!

### Steps to Add a Translation

1. Create a new JSON file in `frontend/src/i18n/locales/`
   - Name it with the ISO 639-1 language code (e.g., `fr.json` for French)

2. Copy the structure from `en.json`:
   ```bash
   cp frontend/src/i18n/locales/en.json frontend/src/i18n/locales/fr.json
   ```

3. Translate all values (keep keys unchanged):
   ```json
   {
     "app": {
       "title": "Lilt GUI"  // Keep as is (product name)
     },
     "header": {
       "help": "Aide",  // Translate
       "downloadLilt": "Télécharger Lilt"  // Translate
     }
     // ... translate all entries
   }
   ```

4. Import in `frontend/src/i18n/config.ts`:
   ```typescript
   import fr from './locales/fr.json';
   
   // Add to resources
   fr: { translation: fr },
   ```

5. Add to language selector in `frontend/src/components/Header.tsx`:
   ```typescript
   { code: 'fr', name: 'Français', flag: '🇫🇷' },
   ```

6. Test your translation:
   ```bash
   make dev-frontend
   # Change language in the app
   ```

7. Submit a PR with your translation

### Translation Guidelines

- Use native speaker quality translations
- Keep technical terms consistent
- Maintain the same tone (friendly, professional)
- Test all UI elements fit properly
- Preserve placeholders like `{{binary}}`

## Reporting Bugs

### Before Submitting a Bug Report

1. Check the [issue tracker](https://github.com/Ardakilic/lilt-gui/issues)
2. Update to the latest version
3. Verify it's not a configuration issue

### Submitting a Bug Report

Include:
- **Description**: Clear description of the bug
- **Steps to Reproduce**: Numbered steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**:
  - OS and version
  - Lilt GUI version
  - Lilt binary version
  - Docker version (if using Docker mode)
- **Logs**: Relevant error messages or console output
- **Screenshots**: If applicable

### Bug Report Template

```markdown
**Describe the bug**
A clear and concise description of the bug.

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. Windows 11, macOS 14, Ubuntu 22.04]
 - Lilt GUI Version: [e.g. 1.0.0]
 - Lilt Version: [e.g. 2.0.0]
 - Docker: [Yes/No, version]

**Additional context**
Any other information about the problem.
```

## Feature Requests

We welcome feature suggestions!

### Submitting a Feature Request

1. Check if it's already requested
2. Describe the problem it solves
3. Propose a solution
4. Consider alternative solutions
5. Explain why it's beneficial

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
Clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features.

**Additional context**
Any other context, screenshots, or mockups.
```

## Testing

### Running Tests

```bash
# All tests
make test

# With coverage
make test-coverage

# Watch mode (without Docker)
cd frontend && npm run test:watch
```

### Writing Tests

- Add tests for new features
- Update tests when changing existing code
- Aim for >80% coverage
- Test both success and error cases
- Use descriptive test names

### Test Structure

```typescript
describe('ComponentName', () => {
  it('should do something specific', () => {
    // Arrange
    const props = {...};
    
    // Act
    render(<Component {...props} />);
    
    // Assert
    expect(screen.getByText('...')).toBeTruthy();
  });
});
```

## Questions?

- Open an issue with the `question` label
- Check existing discussions
- Reach out to [@Ardakilic](https://github.com/Ardakilic)

## Thank You!

Your contributions make Lilt GUI better for everyone. We appreciate your time and effort! 🎉
