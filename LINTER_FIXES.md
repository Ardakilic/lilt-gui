# Linter and Coverage Fixes

## Summary
Fixed linter errors and maintained test coverage at 90.18%.

## Issues Fixed

### 1. Coverage Directory Being Linted
**Problem:** Biome was trying to lint generated coverage files (JSON, CSS, JS), causing hundreds of format violations.

**Solution:** Modified `package.json` to explicitly check only the `src/` directory:
```json
"lint": "biome check src/"
```

This prevents Biome from checking the `coverage/` directory which contains auto-generated files from vitest coverage reports.

### 2. Duplicate Code in BinaryConfig.test.tsx
**Problem:** The test file had duplicate imports and test suites, likely from a merge conflict or copy-paste error.

**Solution:** Removed duplicate code while preserving all unique tests. Maintained 17 tests covering:
- Rendering binary config inputs
- Updating paths on input change
- Docker mode behavior (disabling fields)
- Browse and Identify buttons
- Alert in browser mode
- All binary path updates (lilt, sox, ffmpeg, ffprobe)

### 3. Biome Configuration
**Attempted Solutions:**
- Tried `files.ignore` property - not supported in Biome 2.2.4
- Tried root-level `ignore` property - not allowed
- Tried `overrides` with `includes` - didn't work for directory exclusion

**Final Solution:**
Modified npm scripts to explicitly specify which directories to lint, avoiding the need for complex Biome configuration.

## Test Results

### Coverage (All above 80% target ✅)
```
All files          |   90.18 |     81.7 |   83.33 |   90.18
src                |   82.71 |      100 |   16.66 |   82.71
src/components     |   92.44 |    81.81 |   94.28 |   92.44
src/hooks          |   68.42 |       75 |     100 |   68.42
```

- **Lines:** 90.18% (target: 80%) ✅
- **Branches:** 81.7% (target: 80%) ✅
- **Functions:** 83.33% (target: 80%) ✅
- **Statements:** 90.18% (target: 80%) ✅

### Test Files
- 10 test files
- 78 tests passing
- All tests green ✅

### Linter
- Checked 30 files
- No fixes applied ✅
- Clean output ✅

## CI Configuration
The GitHub Actions workflow correctly runs:
1. Linter: `npm run lint`
2. Tests with coverage: `npm run test:coverage`

No codecov upload - using local coverage checks as requested.
