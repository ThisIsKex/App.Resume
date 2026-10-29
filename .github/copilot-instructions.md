# Copilot instructions

## Build, lint, and format

Run commands from the repository root:

- `npm run dev` starts Vite on port 3000.
- `npm run build` runs `vue-tsc` and creates the production build.
- `npm run type-check` runs TypeScript/Vue type checking without emitting files.
- `npm run lint` runs ESLint on `src`; `npx eslint src/path/to/File.vue` checks one file.
- `npm run format:check` checks Prettier formatting; `npm run format` formats source files.

The project does not currently define a test script or have a tracked test suite.
CI runs `npm run lint` and `npm run build` on pushes and pull requests to `main`.

## Architecture

This is a Vue 3 + TypeScript single-page app for editing and presenting resumes based
on the [JSON Resume standard](https://jsonresume.org/). `src/main.ts` installs Pinia,
Vue Router, Font Awesome, and Paged.js; `src/router/index.ts` lazy-loads the resume
(`/`) and editor (`/edit`) views.

Both views use `src/stores/cvStore.ts` as the shared source of resume data. The store
loads validated data from localStorage first, then `/cv-data.json` in `public/`, and
otherwise uses `src/utils/defaults.ts`; a deep watcher saves edits to localStorage.
`src/types/resume.types.ts` defines the JSON Resume-shaped model, while
`src/utils/validation.ts` validates imported or loaded data and fills missing section
arrays for JSON imports.

The editor view composes one editor component per resume section and uses
`src/composables/useFileHandling.ts` for JSON upload/download. The resume view passes
typed store sections to presentation components under `src/components/resume/`;
global theme and print rules are in `src/App.vue`, with component-specific styles
alongside the components.

## Repository conventions

- Use Vue Single File Components with Composition API and `<script setup lang="ts">`.
- Keep resume data structures aligned with the JSON Resume standard and the interfaces
  in `src/types/resume.types.ts`; preserve standard field names and use those types for
  editor props and resume presentation props.
- Section editors generally receive the resume as `modelValue` and emit add/remove
  actions for dynamic lists; the view coordinates those actions through the store.
- Reuse the store, validation helper, and file-handling composable for resume state and
  JSON flows rather than adding a second persistence path.
- Use the CSS custom properties defined in `src/App.vue` for shared theme values.
  Preserve print behavior when changing resume markup or styles.
- Prettier uses double quotes, semicolons, two-space indentation, and a 100-character
  print width.
