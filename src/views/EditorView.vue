<script setup lang="ts">
import PersonalDataEditor from "../components/editor/PersonalDataEditor.vue";
import WorkEditor from "../components/editor/WorkEditor.vue";
import EducationEditor from "../components/editor/EducationEditor.vue";
import SkillsEditor from "../components/editor/SkillsEditor.vue";
import ProjectsEditor from "../components/editor/ProjectsEditor.vue";
import InterestsEditor from "../components/editor/InterestsEditor.vue";
import CertificatesEditor from "../components/editor/CertificatesEditor.vue";
import AwardsEditor from "../components/editor/AwardsEditor.vue";
import PublicationsEditor from "../components/editor/PublicationsEditor.vue";
import LanguagesEditor from "../components/editor/LanguagesEditor.vue";
import ReferencesEditor from "../components/editor/ReferencesEditor.vue";
import { ref, onMounted, computed } from "vue";
import { useCVStore } from "../stores/cvStore";
import { useToast } from "../composables/useToast";
import { useFileHandling } from "../composables/useFileHandling";

const cvStore = useCVStore();
const { success, error: showError, warning } = useToast();
const { downloadResume, uploadResume } = useFileHandling();

const fileInputRef = ref<HTMLInputElement | null>(null);
const showConfirmDialog = ref(false);

// Computed reference to store data
const resume = computed(() => cvStore.resumeData);
const sections = computed(() => [
  { id: "personal-data", title: "Persönliches", count: null },
  { id: "work", title: "Berufserfahrung", count: resume.value.work.length },
  { id: "education", title: "Ausbildung", count: resume.value.education.length },
  { id: "skills", title: "Kenntnisse", count: resume.value.skills.length },
  { id: "projects", title: "Projekte", count: resume.value.projects.length },
  { id: "interests", title: "Interessen", count: resume.value.interests.length },
  { id: "certificates", title: "Weiterbildungen", count: resume.value.certificates.length },
  { id: "awards", title: "Auszeichnungen", count: resume.value.awards.length },
  { id: "publications", title: "Publikationen", count: resume.value.publications.length },
  { id: "languages", title: "Sprachen", count: resume.value.languages.length },
  { id: "references", title: "Referenzen", count: resume.value.references.length },
]);

onMounted(async () => {
  await cvStore.loadResumeData();
});

function triggerFileInput() {
  fileInputRef.value?.click();
}

function handleDownload() {
  downloadResume(resume.value);
  success("CV-Daten erfolgreich heruntergeladen!");
}

function handleSave() {
  cvStore.saveToLocalStorage();
  success("Daten wurden gespeichert!");
}

async function handleUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  try {
    const data = await uploadResume(file);
    cvStore.updateResumeData(data);
    success("Daten erfolgreich geladen!");
  } catch (err) {
    showError(err instanceof Error ? err.message : "Fehler beim Laden der Datei");
  } finally {
    // Reset input so the same file can be uploaded again
    input.value = "";
  }
}

function requestReset() {
  showConfirmDialog.value = true;
}

function confirmReset() {
  cvStore.resetResumeData();
  showConfirmDialog.value = false;
  warning("Alle Daten wurden zurückgesetzt");
}

function cancelReset() {
  showConfirmDialog.value = false;
}

function addArrayItem<K extends keyof typeof resume.value>(
  section: K,
  item: (typeof resume.value)[K] extends Array<infer T> ? T : never,
) {
  cvStore.addToArray(section, item);
}

function removeArrayItem<K extends keyof typeof resume.value>(section: K, idx: number) {
  cvStore.removeFromArray(section, idx);
}
</script>
<template>
  <div class="editor-view">
    <!-- Confirmation Dialog -->
    <div v-if="showConfirmDialog" class="modal-overlay" @click="cancelReset">
      <div
        class="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-dialog-title"
        @click.stop
      >
        <h3 id="reset-dialog-title">Alle Daten zurücksetzen?</h3>
        <p>
          Möchten Sie wirklich alle Daten zurücksetzen? Diese Aktion kann nicht rückgängig gemacht
          werden.
        </p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="cancelReset">Abbrechen</button>
          <button class="btn-confirm" @click="confirmReset">Zurücksetzen</button>
        </div>
      </div>
    </div>

    <div v-if="cvStore.isLoading" class="loading-state" role="status">
      <span class="loading-spinner" aria-hidden="true"></span>
      Lebenslaufdaten werden geladen …
    </div>

    <template v-else>
      <header class="editor-header">
        <a class="back-link" href="/">← Zum Lebenslauf</a>
        <h1>Lebenslauf bearbeiten</h1>
        <p>Deine Änderungen werden automatisch gespeichert.</p>
      </header>

      <div class="editor-toolbar" role="toolbar" aria-label="Lebenslauf-Aktionen">
        <button class="editor-btn" type="button" @click="triggerFileInput">JSON importieren</button>
        <input
          ref="fileInputRef"
          class="visually-hidden"
          type="file"
          accept=".json,application/json"
          aria-label="JSON-Lebenslaufdatei auswählen"
          @change="handleUpload"
        />
        <button class="editor-btn" type="button" @click="handleSave">Jetzt speichern</button>
        <button class="editor-btn" type="button" @click="handleDownload">JSON exportieren</button>
        <button class="editor-btn btn-danger" type="button" @click="requestReset">
          Daten zurücksetzen
        </button>
      </div>

      <nav class="section-nav" aria-label="Zu einem Abschnitt springen">
        <a v-for="section in sections" :key="section.id" :href="`#${section.id}`">
          {{ section.title }}
          <span v-if="section.count !== null" class="section-count">{{ section.count }}</span>
        </a>
      </nav>

      <main class="editor-sections">
        <PersonalDataEditor
          id="personal-data"
          v-model="resume"
          @addProfile="
            (resume.basics.profiles ?? (resume.basics.profiles = [])).push({
              network: '',
              username: '',
              url: '',
            })
          "
          @removeProfile="(idx) => (resume.basics.profiles ?? []).splice(idx, 1)"
        />
        <WorkEditor
          id="work"
          v-model="resume"
          @addWork="
            addArrayItem('work', {
              name: '',
              position: '',
              startDate: '',
              endDate: '',
              url: '',
              summary: '',
              highlights: [],
            })
          "
          @removeWork="(idx) => removeArrayItem('work', idx)"
          @addWorkHighlight="(idx) => resume.work[idx]?.highlights?.push('')"
          @removeWorkHighlight="(idx, hidx) => resume.work[idx]?.highlights?.splice(hidx, 1)"
        />
        <EducationEditor
          id="education"
          v-model="resume"
          @addEducation="
            addArrayItem('education', {
              institution: '',
              area: '',
              studyType: '',
              score: '',
              startDate: '',
              endDate: '',
            })
          "
          @removeEducation="(idx) => removeArrayItem('education', idx)"
        />
        <SkillsEditor
          id="skills"
          v-model="resume"
          @addSkill="addArrayItem('skills', { name: '', level: '', keywords: [] })"
          @removeSkill="(idx) => removeArrayItem('skills', idx)"
          @addSkillKeyword="(idx) => resume.skills[idx]?.keywords?.push('')"
          @removeSkillKeyword="(idx, kidx) => resume.skills[idx]?.keywords?.splice(kidx, 1)"
        />
        <ProjectsEditor
          id="projects"
          v-model="resume"
          @addProject="
            addArrayItem('projects', {
              name: '',
              url: '',
              startDate: '',
              endDate: '',
              description: '',
              highlights: [],
              keywords: [],
            })
          "
          @removeProject="(idx) => removeArrayItem('projects', idx)"
          @addProjectHighlight="(idx) => resume.projects[idx]?.highlights?.push('')"
          @removeProjectHighlight="(idx, hidx) => resume.projects[idx]?.highlights?.splice(hidx, 1)"
          @addProjectKeyword="(idx) => resume.projects[idx]?.keywords?.push('')"
          @removeProjectKeyword="(idx, kidx) => resume.projects[idx]?.keywords?.splice(kidx, 1)"
        />
        <InterestsEditor
          id="interests"
          v-model="resume"
          @addInterest="addArrayItem('interests', { name: '', keywords: [] })"
          @removeInterest="(idx) => removeArrayItem('interests', idx)"
          @addInterestKeyword="(idx) => resume.interests[idx]?.keywords?.push('')"
          @removeInterestKeyword="(idx, kidx) => resume.interests[idx]?.keywords?.splice(kidx, 1)"
        />
        <CertificatesEditor
          id="certificates"
          v-model="resume"
          @addCertificate="
            addArrayItem('certificates', { name: '', issuer: '', date: '', url: '' })
          "
          @removeCertificate="(idx) => removeArrayItem('certificates', idx)"
        />
        <AwardsEditor
          id="awards"
          v-model="resume"
          @addAward="addArrayItem('awards', { title: '', awarder: '', date: '', summary: '' })"
          @removeAward="(idx) => removeArrayItem('awards', idx)"
        />
        <PublicationsEditor
          id="publications"
          v-model="resume"
          @addPublication="
            addArrayItem('publications', {
              name: '',
              publisher: '',
              releaseDate: '',
              url: '',
              summary: '',
            })
          "
          @removePublication="(idx) => removeArrayItem('publications', idx)"
        />
        <LanguagesEditor
          id="languages"
          v-model="resume"
          @addLanguage="addArrayItem('languages', { language: '', fluency: '' })"
          @removeLanguage="(idx) => removeArrayItem('languages', idx)"
        />
        <ReferencesEditor
          id="references"
          v-model="resume"
          @addReference="addArrayItem('references', { name: '', reference: '' })"
          @removeReference="(idx) => removeArrayItem('references', idx)"
        />
      </main>
    </template>
  </div>
</template>

<style scoped>
.editor-view {
  max-width: 1080px;
  margin: 0 auto;
  padding: 32px 24px 64px;
}

.editor-header {
  margin-bottom: 24px;
}

.back-link {
  display: inline-block;
  margin-bottom: 12px;
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.editor-header h1 {
  margin: 0;
  color: var(--color-text-dark);
  font-size: clamp(1.7rem, 4vw, 2.2rem);
  line-height: 1.2;
}

.editor-header p {
  margin-top: 8px;
  color: var(--color-text-light);
}

.editor-toolbar {
  position: sticky;
  top: 12px;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin: 0 0 16px;
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: var(--border-radius-lg);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(8px);
}

.editor-view :deep(button) {
  min-height: 42px;
  margin: 0;
  padding: 9px 14px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: var(--color-primary);
  color: var(--color-white);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    transform 0.15s ease;
}

.editor-view :deep(button:hover) {
  background: var(--color-primary-dark);
}

.editor-view :deep(button:active) {
  transform: translateY(1px);
}

.editor-view :deep(button:focus-visible),
.section-nav a:focus-visible,
.back-link:focus-visible {
  outline: 3px solid #8fc5f5;
  outline-offset: 2px;
}

.editor-view :deep(.btn-danger) {
  margin-left: auto;
  border-color: #e7b9bd;
  background: white;
  color: #a32330;
}

.editor-view :deep(.btn-danger:hover) {
  background: #fff1f2;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.section-nav {
  display: flex;
  gap: 8px;
  margin: 0 0 24px;
  padding: 2px 2px 10px;
  overflow-x: auto;
  scrollbar-width: thin;
}

.section-nav a {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  border: 1px solid #e1e6eb;
  border-radius: 999px;
  background: white;
  color: #354354;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
}

.section-nav a:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.section-count {
  display: inline-grid;
  min-width: 22px;
  height: 22px;
  place-items: center;
  padding: 0 5px;
  border-radius: 999px;
  background: #edf3f8;
  color: var(--color-primary);
  font-size: 0.75rem;
}

.editor-sections {
  display: grid;
  gap: 18px;
}

.editor-sections > * {
  scroll-margin-top: 90px;
}

.editor-sections :deep(section) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 0;
  padding: 24px;
  border: 1px solid #e4e9ee;
  border-radius: var(--border-radius-lg);
  background: white;
  box-shadow: var(--shadow-sm);
}

.editor-sections :deep(section > h2) {
  grid-column: 1 / -1;
  margin: 0 0 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e8edf2;
  color: var(--color-text-dark);
  font-size: 1.25rem;
}

.editor-sections :deep(section > button) {
  grid-column: 1 / -1;
}

.editor-sections :deep(section > div) {
  grid-column: 1 / -1;
}

.editor-sections :deep(.social-profiles) {
  display: grid;
  gap: 12px;
  margin-top: 8px;
}

.editor-sections :deep(.social-profiles > h3) {
  margin-bottom: 0;
  color: #435367;
  font-size: 1rem;
}

.editor-sections :deep(.profile-item) {
  display: grid;
  grid-template-columns: minmax(140px, 0.8fr) minmax(140px, 0.8fr) minmax(220px, 1.4fr) auto;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 1px solid #e6ebf0;
  border-radius: 10px;
  background: #fafbfd;
}

.editor-sections :deep(.profile-item .remove-profile) {
  border-color: #e7b9bd;
  background: white;
  color: #a32330;
  white-space: nowrap;
}

.editor-sections :deep(.profile-item .remove-profile:hover) {
  background: #fff1f2;
}

.editor-sections :deep(.social-profiles .add-profile) {
  justify-self: start;
  margin-top: 2px;
}

.editor-sections :deep(.array-block) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 0 0 4px;
  padding: 16px;
  border: 1px solid #e6ebf0;
  border-radius: 10px;
  background: #fafbfd;
  counter-increment: editor-entry;
}

.editor-sections :deep(section) {
  counter-reset: editor-entry;
}

.editor-sections :deep(.array-block::before) {
  grid-column: 1 / -1;
  color: #435367;
  font-size: 0.95rem;
  font-weight: 700;
  content: "Eintrag " counter(editor-entry);
}

.editor-sections :deep(.array-block > textarea),
.editor-sections :deep(.array-block > div),
.editor-sections :deep(.array-block > button:last-child) {
  grid-column: 1 / -1;
}

.editor-sections :deep(input),
.editor-sections :deep(textarea) {
  width: 100%;
  min-width: 0;
  min-height: 44px;
  margin: 0;
  padding: 10px 12px;
  border: 1px solid #cbd4dd;
  border-radius: 6px;
  background: white;
  color: var(--color-text-dark);
  font: inherit;
}

.editor-sections :deep(textarea) {
  min-height: 100px;
  resize: vertical;
}

.editor-sections :deep(input:focus),
.editor-sections :deep(textarea:focus) {
  border-color: var(--color-primary);
  outline: 3px solid rgba(14, 80, 145, 0.14);
}

.editor-sections :deep(input::placeholder),
.editor-sections :deep(textarea::placeholder) {
  color: #6b7280;
  opacity: 1;
}

.editor-sections :deep(.array-block > div) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center;
  gap: 8px;
}

.editor-sections :deep(.array-block > div > h4),
.editor-sections :deep(.array-block > div > button:last-child) {
  grid-column: 1 / -1;
}

.editor-sections :deep(.array-block > div > div) {
  display: flex;
  gap: 12px;
}

.editor-sections :deep(.array-block > div > div input) {
  flex: 1;
}

.editor-sections :deep(.array-block > div > div button) {
  flex: 0 0 auto;
}

.editor-sections :deep(.array-block > button:last-child) {
  border-color: #e7b9bd;
  background: white;
  color: #a32330;
}

.editor-sections :deep(.array-block > button:last-child:hover) {
  background: #fff1f2;
}

.loading-state {
  display: grid;
  min-height: 50vh;
  align-content: center;
  justify-items: center;
  gap: 12px;
  color: var(--color-text-light);
}

.loading-spinner {
  width: 36px;
  height: 36px;
  border: 4px solid #e2e8f0;
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.modal-overlay {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.55);
  z-index: 1000;
}

.modal-content {
  width: min(100%, 480px);
  padding: 28px;
  border-radius: var(--border-radius-lg);
  background: white;
  box-shadow: var(--shadow-lg);
}

.modal-content h3 {
  margin: 0;
  color: var(--color-primary);
}

.modal-content p {
  margin: 12px 0 24px;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-cancel,
.btn-confirm {
  min-width: 130px;
}

.btn-cancel {
  background: #596579 !important;
}

.btn-cancel:hover {
  background: #414c5e !important;
}

.btn-confirm {
  background: var(--color-error) !important;
}

.btn-confirm:hover {
  background: #b02a37 !important;
}

@media (max-width: 640px) {
  .editor-view {
    padding: 20px 14px 40px;
  }

  .editor-toolbar {
    top: 8px;
    gap: 6px;
    padding: 8px;
  }

  .editor-toolbar .editor-btn {
    flex: 1 1 calc(50% - 6px);
    padding: 8px;
    font-size: 0.88rem;
  }

  .editor-view :deep(.btn-danger) {
    margin-left: 0;
  }

  .editor-sections :deep(section) {
    grid-template-columns: minmax(0, 1fr);
    padding: 18px 14px;
  }

  .editor-sections :deep(.array-block),
  .editor-sections :deep(.array-block > div) {
    grid-template-columns: minmax(0, 1fr);
  }

  .editor-sections :deep(.profile-item) {
    grid-template-columns: minmax(0, 1fr);
  }

  .editor-sections :deep(.profile-item .remove-profile) {
    justify-self: start;
  }

  .editor-sections :deep(.array-block > div > div) {
    align-items: stretch;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .modal-actions button {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
