# Project Summary: Resume Vue App

## Project Overview

**Name**: Resume Vue App  
**Type**: Single Page Application (SPA)  
**Purpose**: Professional resume application with PDF export functionality  
**Status**: Actively in development  
**Framework**: Vue 3 + TypeScript + Vite

## Technical Architecture

### Frontend Stack
- **Vue 3** (Composition API with `<script setup>`)
- **TypeScript** (Strict mode)
- **Vite** (Build tool & dev server)
- **Font Awesome** (Icons: Solid + Brands)

### Project Structure
```
resume/
├── public/                 # Static assets
│   ├── resume-data.json       # Exported resume data (optional)
│   └── profile.jpg        # Profile image
├── src/
│   ├── components/         # Vue Single File Components
│   │   ├── Header.vue      # Header with profile image & contact info
│   │   ├── Profile.vue     # Personal profile/summary
│   │   ├── Experience.vue  # Work experience
│   │   ├── Education.vue   # Education
│   │   ├── Skills.vue      # Skills (chips)
│   │   ├── Projects.vue    # Project portfolio
│   │   └── Interests.vue   # Interests
│   ├── views/
│   │   ├── ResumeView.vue      # Resume view (/)
│   │   └── EditorView.vue  # Editor (/edit)
│   ├── composables/
│   │   └── useResumeData.ts    # Resume data state & JSON loading
│   ├── router/
│   │   └── index.ts        # Vue Router config
│   ├── data/
│   │   └── resume-data.ts      # Default resume data (fallback)
│   ├── types/
│   │   └── resume.types.ts     # TypeScript interfaces
│   ├── App.vue             # Root component with RouterView
│   ├── main.ts             # Entry point + Router + Font Awesome
│   └── vite-env.d.ts       # Vue & Vite type definitions
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .prettierrc
└── README.md
```

## Data Model

### TypeScript Interfaces (src/types/resume.types.ts)

```typescript
PersonalInfo    // Name, contact, social media, profile image
Experience      // Work experience (title, company, period, responsibilities)
Education       // Education (degree, institution, period)
Project         // Projects (name, description, icon)
ResumeData      // Main interface (combines all data)
```

### Data Sources
- **Default data**: `src/data/resume-data.ts` (fallback)
- **JSON data**: `public/resume-data.json` (auto-loaded if present)
- **Composable**: `src/composables/useResumeData.ts` – loads JSON or fallback
- **Editing**: Via editor at `/edit` or manually in JSON/TS

## Routing & Navigation

### Routes
- **`/`** – Resume view (ResumeView.vue)
- **`/edit`** – Editor interface (EditorView.vue)

### Router Setup
- Vue Router 4
- HTML5 history mode
- Config in `src/router/index.ts`

## Design System

### Color Scheme
- **Primary**: `#0e5091` (dark blue – header & headings)
- **Background**: `#fafafa` (light gray)
- **White**: `#ffffff` (sections)
- **Text**: `#333` (dark gray)
- **Chips**: `#e0e0e0` (light gray for skills)

### Typography
- **Font stack**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, etc.)
- **Header**: 2.5rem, center-aligned
- **Section titles**: 20px, with bottom border
- **Body**: 16px, line-height 1.6

### Layout
- **Desktop**: Max-width 900px, centered
- **Mobile**: Responsive, full-width
- **Print**: A4, margin 0 (header full-width), sections with 1.5cm margins

## Component Architecture

### Component Pattern
- **Props-based**: All components receive data via props
- **Scoped styles**: CSS is isolated per component
- **Type-safe props**: TypeScript interfaces for all props

### Component Overview

| Component | Props | Description |
|-----------|-------|-------------|
| Header | `personalInfo: PersonalInfo` | Blue header with profile image, name, contact, social links |
| Profile | `profile: string` | Personal summary |
| Experience | `experiences: Experience[]` | List of work experiences |
| Education | `education: Education[]` | Education entries |
| Skills | `skills: string[]` | Skill chips |
| Projects | `projects: Project[]` | Project portfolio |
| Interests | `interests: string` | Interests as text |

### Views
- **ResumeView.vue** – Main resume view, uses `useResumeData` composable
- **EditorView.vue** – Editor interface with forms for all sections

## Resume Data Editor

### Features
- **Live editing** – All resume sections editable
- **JSON export/import** – Download & upload of resume-data.json
- **LocalStorage** – Browser-based saving & loading
- **Dynamic lists** – Add/remove items
- **Responsive UI** – Works on desktop & mobile

### Editor Sections
1. Personal information (name, contact, links, profile image)
2. Profile (summary)
3. Work experience (dynamic list with responsibilities)
4. Education (dynamic list)
5. Skills (dynamic skill list)
6. Projects (dynamic list with icon & description)
7. Interests (text)

### Workflow
1. Visit `/edit`
2. Edit all fields
3. Click "JSON Export" → `resume-data.json` is downloaded
4. Place `resume-data.json` in the `public/` folder
5. Reload page → data is loaded automatically

### Print/PDF Optimization

#### Techniques
1. **@media print** rules in all components
2. **print-color-adjust: exact** for colors (header, skill chips)
3. **@page { margin: 0; size: A4; }** for A4 format
4. **page-break-inside: avoid** for sections
5. **Margin management**: Header full-width, content with 1.5cm margins

#### Print Workflow
1. `Ctrl+P` / `Cmd+P` in browser
2. Enable "background graphics"
3. Save as PDF
4. Result: Professional, print-ready resume

## Development Workflow

### Commands
```bash
npm install        # Install dependencies
npm run dev        # Start dev server (port 5173)
npm run build      # Production build
npm run preview    # Preview build
npm run format     # Format code with Prettier
```

### Hot Module Replacement (HMR)
- Vite provides instant HMR
- Changes to components, styles, data are immediately visible
- No reload needed

### Type Checking
- TypeScript strict mode enabled
- Vue language features (Volar) for IDE support
- Type-safe props & data

### Code Formatting
- Prettier for consistent formatting
- Double quotes
- 2 spaces indentation
- 100 character line width

## Implemented Features

✅ **Resume Editor** – Full editor at `/edit` with all sections  
✅ **JSON export/import** – Download & upload of resume data  
✅ **LocalStorage** – Browser-based saving & loading  
✅ **Automatic JSON loading** – `public/resume-data.json` is auto-loaded  
✅ **Dynamic lists** – Add/remove items for experience, education, skills, projects  
✅ **Responsive design** – Works on desktop & mobile  
✅ **Print optimization** – Perfect PDF layout with color retention  
✅ **Font Awesome icons** – Professional icon integration  
✅ **Vue Router** – Navigation between resume and editor  
✅ **TypeScript** – Fully type-safe  
✅ **Prettier** – Consistent code formatting

## Customization Points
1. **Colors**: Search for `#0e5091` in all .vue files
2. **Icons**: `src/main.ts` – Font Awesome icon library
3. **Layout**: `src/App.vue` – Global styles & @page rules
4. **Data**: `src/data/resume-data.ts` – All personal information
5. **Types**: `src/types/resume.types.ts` – Extend data model

## Key Files for Agents

### To be edited by user
- **Via editor**: `http://localhost:5173/edit` – recommended method
- `public/resume-data.json` – exported data (auto-loaded)
- `src/data/resume-data.ts` – fallback data (default template)
- `public/profile.jpg` – profile image

### For styling
- `src/components/*.vue` – component-specific styles (scoped)
- `src/App.vue` – global styles & print rules

### For functionality
- `src/types/resume.types.ts` – extend data model
- `src/main.ts` – add Font Awesome icons
- `src/components/*.vue` – component logic
- `src/views/EditorView.vue` – editor functions
- `src/composables/useResumeData.ts` – data loading logic

### For build/config
- `package.json` – dependencies
- `vite.config.ts` – Vite config
- `tsconfig.json` – TypeScript settings

## Dependencies

### Runtime
- `vue@^3.4.21`
- `vue-router@^4.3.0`
- `@fortawesome/fontawesome-svg-core@^6.5.1`
- `@fortawesome/free-solid-svg-icons@^6.5.1`
- `@fortawesome/free-brands-svg-icons@^6.5.1`
- `@fortawesome/vue-fontawesome@^3.0.5`

### Development
- `@vitejs/plugin-vue@^5.0.4`
- `typescript@^5.4.2`
- `vite@^5.1.6`
- `vue-tsc@^2.0.6`
- `prettier@^3.2.5`

## Best Practices

### Code Style
- Composition API with `<script setup lang="ts">`
- Props with TypeScript interfaces
- Scoped styles per component
- No global state management (not needed for this scope)

### Naming Conventions
- Components: PascalCase (Header.vue, Experience.vue)
- Props: camelCase (personalInfo, experiences)
- Types: PascalCase (PersonalInfo, ResumeData)
- Files: kebab-case or PascalCase

### Print Optimization
- Always use `print-color-adjust: exact` for background colors
- `page-break-inside: avoid` for grouped content
- Separate print styles in `@media print` blocks
- Explicitly set A4 format with `@page`

## Troubleshooting

### Problem: Colors not printed
**Solution**: Add `print-color-adjust: exact` and `-webkit-print-color-adjust: exact`

### Problem: Header has margins when printing
**Solution**: `@page { margin: 0 }` + header with `margin: 0 !important`

### Problem: TypeScript errors after npm install
**Solution**: Reload VS Code or run `vue.action.restartServer` command

### Problem: HMR not working
**Solution**: Restart dev server (`npm run dev`)

## Contact & Support

For questions or issues:
1. Consult README.md
2. Check TypeScript errors in the IDE
3. Check browser console for runtime errors
4. Check Vite dev server logs

---

**Last updated**: 2025-11-11  
**Version**: 1.0.0  
**License**: Free to use