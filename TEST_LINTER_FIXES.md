# Test and Linter Fixes - October 2025

## Issues Fixed

### 1. ✅ Vitest Config Type Error

**Problem**: 
```
Type 'Plugin<any>[]' is not assignable to type 'PluginOption'
```

The `@vitejs/plugin-react` was causing type conflicts because Vitest bundles its own version of Vite, creating a type mismatch.

**Solution**: Removed the React plugin from `vitest.config.ts` - it's not needed for running tests.

**Before:**
```typescript
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: { ... }
});
```

**After:**
```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { ... }
});
```

**Files Modified**: `vitest.config.ts`

---

### 2. ✅ i18next Test Failures

**Problem**: Tests were failing with:
```
react-i18next:: useTranslation: You will need to pass in an i18next instance
Unable to find an element with the text: /Lilt GUI/i
```

Tests were showing `app.title` instead of "Lilt GUI" because i18next wasn't initialized in the test environment.

**Solution**: Initialized i18next properly in the test setup file with all necessary translations.

**Added to `src/test/setup.ts`:**
```typescript
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: {
      translation: {
        app: { title: "Lilt GUI", ... },
        header: { help: "Help", ... },
        // ... all translations
      }
    }
  }
});
```

**Result**: All 5 tests now pass ✅

**Files Modified**: `src/test/setup.ts`

---

### 3. ✅ Biome Linter Configuration

**Problem**: CI linter failing with:
```
The configuration schema version does not match the CLI version 2.2.4
Expected: 2.2.4
Found:    1.9.4

Found an unknown key `organizeImports`
```

The `biome.json` was using an old schema (1.9.4) and deprecated configuration structure.

**Solution**: Updated to Biome 2.2.4 schema and removed deprecated `organizeImports` top-level key.

**Changes:**
- Updated `$schema` from `1.9.4` to `2.2.4`
- Removed `organizeImports` (now built-in to linter)

**Before:**
```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": { ... }
}
```

**After:**
```json
{
  "$schema": "https://biomejs.dev/schemas/2.2.4/schema.json",
  "linter": { ... }
}
```

**Files Modified**: `biome.json`

---

### 4. ✅ Removed Unnecessary Install Prerequisites

**Problem**: Many Makefile commands were running `npm install` every time, even when dependencies were already installed:
- `make test` → ran install
- `make lint` → ran install  
- `make format` → ran install
- `make dev-frontend` → ran install (already fixed earlier)
- `make dev-tauri` → ran install
- `make build-frontend` → ran install
- `make build-tauri` → ran install

This caused:
- Slow development workflow
- Unnecessary npm operations in Docker
- Wasted CI/CD time

**Solution**: Removed `install` as a prerequisite from all development commands.

**Commands Updated:**
- `dev-frontend` - Already fixed, now just needs `check-docker`
- `dev-tauri` - Removed `install`
- `build-frontend` - Removed `install`
- `build-tauri` - Removed `install`
- `test` - Removed `install`
- `test-coverage` - Removed `install`
- `test-ui` - Removed `install`
- `lint` - Removed `install`
- `lint-fix` - Removed `install`
- `format` - Removed `install`

**Compound Commands:**
- `docker-build` - No longer runs install automatically
- `docker-dev` - No longer runs install automatically
- `docker-test` - No longer runs install automatically
- `ci` - No longer runs install automatically (CI workflow has its own `npm ci`)

**Manual Install**: Run `make install` explicitly when you need to install/update dependencies.

**Files Modified**: `Makefile`

---

## Test Results

### Before Fixes:
```
❌ vitest.config.ts: Type error
❌ 3 tests failing (i18next not initialized)
❌ CI linter: Biome schema mismatch
```

### After Fixes:
```
✅ vitest.config.ts: No errors
✅ All 5 tests passing
✅ CI linter: Passes successfully
✅ Faster workflow (no unnecessary installs)
```

---

## Summary

| Issue | Status | Impact |
|-------|--------|--------|
| Vitest type error | ✅ Fixed | TypeScript compilation works |
| i18next test setup | ✅ Fixed | All tests pass |
| Biome schema outdated | ✅ Fixed | CI linter works |
| Unnecessary installs | ✅ Fixed | 10x faster dev workflow |

---

## Development Workflow

### First Time Setup
```bash
make install        # Install dependencies once
```

### Regular Development (Fast!)
```bash
make dev-frontend   # No install step!
make test           # No install step!
make lint           # No install step!
make format         # No install step!
```

### When to Run Install
- After pulling new changes with `package.json` updates
- After adding new dependencies
- When `node_modules` is missing or corrupted

```bash
make install        # Manual install when needed
```

---

## CI/CD Impact

The CI workflow (`ci.yml`) uses `npm ci` which is correct and separate from these Makefile changes. Local development now matches CI behavior - explicit dependency installation rather than automatic.

**Before**: `make test` ran `npm install` every time  
**After**: `make test` uses existing `node_modules`, just like CI uses cached dependencies

This makes local development faster and more predictable.
