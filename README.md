# Resume Vue App

A modern, professional resume application built with **Vue 3**, **TypeScript**, **Vite**, and **Font Awesome**. 
Optimized for PDF export with perfect print layout.

## ✨ Features

- ✏️ **Resume Data Editor** – User-friendly interface at `/edit` for editing all resume data
- 💾 **JSON Export/Import** – Save and load resume data as JSON files
- 🔄 **LocalStorage** – Automatic saving in the browser
- 📦 **Automatic Loading** – Resume data is automatically loaded from `public/resume-data.json`
- 🎨 Modern, responsive design
- 📝 Type-safe data management with TypeScript
- 🖼️ Profile image integration (circular)
- 🎯 Font Awesome icons
- 📄 Print-optimized for PDF export
- 🔄 Hot Module Replacement (HMR)
- 🎨 Custom color scheme (#0e5091)

## 📋 Requirements

- Node.js (v16 or higher)
- npm or yarn

## 🚀 Installation

```bash
npm install
```

## ⚙️ First Setup

**Important step:** Before starting the app for the first time, copy the example resume data:

```bash
# Copy the example file to the actual resume file
cp public/resume-data-example.json public/resume-data.json
```

**Windows (PowerShell/CMD):**
```cmd
copy public\resume-data-example.json public\resume-data.json
```

The file `resume-data-example.json` contains sample data you can use as a starting point.

## 💻 Development

```bash
npm run dev
```

The app will run at `http://localhost:5173`

**Important:** 
- **View Resume:** `http://localhost:5173/` 
- **Edit Resume:** `http://localhost:5173/edit`

### 📝 Edit Resume Data

The app provides an integrated **Resume Data Editor** at `/edit`:

1. Navigate to `http://localhost:5173/edit` in your browser
2. Fill out all sections (Personal Info, Experience, Education, etc.)
3. **"Save to LocalStorage"** – Save data in the browser
4. **"Export JSON"** – Download data as `resume-data.json`
5. Move the JSON file to the `public/` folder
6. Reload the app – data will be loaded automatically!

**Workflow:**
```
/edit → Edit data → Export JSON → Move file to public/ → Done!
```

The exported `public/resume-data.json` is automatically loaded at app start.

**💡 Tip:** You can version `public/resume-data.json` with Git to track changes to your resume.

## 🏗️ Build

```bash
npm run build
```

Creates an optimized production build in the `dist/` folder.

## 📄 Export as PDF

1. Open the app in your browser (`http://localhost:5173`)
2. Press `Ctrl + P` (Windows) / `Cmd + P` (Mac)
3. Select "Save as PDF" as the target
4. In the settings:
   - **Background graphics**: Enable (important for colors!)
   - **Page margins**: Minimal or standard
5. Save

**Tip:** The blue header will be printed thanks to `print-color-adjust: exact`.

## ✏️ Personalization

### Adjust Data

**Recommended:** Use the **Resume Data Editor** at `/edit` (see above).

**Alternatively:** Edit `src/data/resume-data.ts` directly with your personal information:

```typescript
export const resumeData: ResumeData = {
  personalInfo: {
    name: 'Your Name',
    location: 'Your City',
    phone: '+49 ...',
    email: 'your@email.com',
    github: 'https://github.com/username',
    linkedin: 'https://linkedin.com/in/username',
    profileImage: '/profile.jpg'  // Optional
  },
  // ... more data
}
```

**Note:** If a `public/resume-data.json` exists, it will be loaded automatically and override `resume-data.ts`.

### Add Profile Image

1. Prepare a square photo (at least 300x300px)
2. Save as `profile.jpg` or `profile.png` in the `public/` folder
3. Adjust the path in `resume-data.ts`: `profileImage: '/profile.jpg'`

The image will be displayed as a circle (120px diameter).

### Change Colors

The main color (#0e5091) can be changed in all component files:
- `src/components/Header.vue`
- `src/components/Profile.vue`
- `src/components/Experience.vue`
- etc.

## 📁 Project Structure

```
resume/
├── public/              
│   └── resume-data.json     # Exported resume data (auto-loaded)
├── src/
│   ├── components/      # Vue components
│   │   ├── Header.vue
│   │   ├── Profile.vue
│   │   ├── Experience.vue
│   │   ├── Education.vue
│   │   ├── Skills.vue
│   │   ├── Projects.vue
│   │   └── Interests.vue
│   ├── views/           # Router views
│   │   ├── ResumeView.vue
│   │   └── EditorView.vue  # Resume Data Editor (route: /edit)
│   ├── router/
│   │   └── index.ts     # Vue Router config
│   ├── composables/
│   │   └── useResumeData.ts # Resume data management & JSON loading
│   ├── data/
│   │   └── resume-data.ts   # Fallback data (if no JSON present)
│   ├── types/
│   │   └── resume.types.ts  # TypeScript interfaces
│   ├── App.vue          # Main component with router
│   ├── main.ts          # Entry point + Font Awesome setup
│   └── vite-env.d.ts    # TypeScript definitions
├── .prettierrc          # Prettier config
├── .prettierignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🛠️ Technology Stack

- **Vue 3** – Progressive JavaScript framework
- **TypeScript** – Type safety
- **Vite** – Build tool & dev server
- **Vue Router** – Client-side routing
- **Font Awesome** – Icon library
  - `@fortawesome/fontawesome-svg-core`
  - `@fortawesome/free-solid-svg-icons`
  - `@fortawesome/free-brands-svg-icons`
  - `@fortawesome/vue-fontawesome`
- **Prettier** – Code formatter

## 🎨 Design Principles

- Clear, professional structure
- Responsive design (desktop & mobile)
- Print-first approach for PDF export
- Consistent icon usage
- Type-safe data management

## 📝 License

Free for private and commercial use.

---

**Made with ❤️ and Vue 3**
