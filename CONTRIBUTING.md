# Contributing to Lilt GUI

First off, thank you for considering contributing to Lilt GUI! It's people like you that make Lilt GUI such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by respect and professionalism. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Include your environment details** (OS, version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any similar features in other apps**

### Adding Translations

We welcome translations to new languages! To add a translation:

1. Copy `src/locales/en.json` to a new file with your language code (e.g., `fr.json` for French)
2. Translate all strings, keeping the JSON structure intact
3. Add your language to `src/i18n.ts`
4. Add your language to the selector in `src/components/LanguageSelector.tsx`
5. Test the translation thoroughly
6. Submit a pull request

### Pull Requests

1. Fork the repo and create your branch from `main`
2. Install dependencies: `npm install`
3. Make your changes
4. Ensure the linter passes: `npm run lint`
5. Ensure tests pass: `npm test`
6. Ensure code coverage remains >80%: `npm run test:coverage`
7. Format your code: `npm run format`
8. Commit your changes with descriptive commit messages
9. Push to your fork and submit a pull request

## Development Setup

See the [Development](README.md#development) section in the README for setup instructions.

## Style Guide

- Use TypeScript for all new code
- Follow the Biome configuration (runs automatically with `npm run lint`)
- Write tests for new features
- Keep functions small and focused
- Use meaningful variable and function names
- Comment complex logic

## Testing

- Write unit tests for utilities and hooks
- Write component tests for UI components
- Aim for >80% code coverage
- Run tests before submitting: `npm test`

## Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

Example:
```
Add Spanish translation support

- Created es.json with all translations
- Added Spanish to language selector
- Updated i18n configuration

Closes #123
```

## Questions?

Feel free to open an issue with the `question` label or reach out to [@Ardakilic](https://github.com/Ardakilic).

Thank you for contributing! 🎉
