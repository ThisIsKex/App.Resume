import { defineStore } from "pinia";
import { ref, watch } from "vue";
import type { Resume } from "../types/resume.types";
import { getDefaultResume } from "../utils/defaults";
import { isValidResume, validateJSON } from "../utils/validation";
import { STORAGE_KEYS } from "../constants";

function hasResumeContent(value: unknown): boolean {
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.some(hasResumeContent);
  if (value && typeof value === "object") return Object.values(value).some(hasResumeContent);
  return false;
}

export const useCVStore = defineStore("cv", () => {
  // State
  const resumeData = ref<Resume>(getDefaultResume());
  const isLoading = ref(true);
  const error = ref<string | null>(null);

  // Auto-save to localStorage on changes (with debounce)
  let saveTimeout: number | undefined;
  watch(
    resumeData,
    () => {
      if (saveTimeout) clearTimeout(saveTimeout);
      saveTimeout = window.setTimeout(() => {
        saveToLocalStorage();
      }, 500);
    },
    { deep: true },
  );

  // Actions
  async function loadResumeData() {
    isLoading.value = true;
    error.value = null;

    try {
      // 1. Try loading from localStorage first
      const stored = localStorage.getItem(STORAGE_KEYS.CV_DATA);
      if (stored) {
        const validation = validateJSON(stored);
        if (validation.valid && validation.data && hasResumeContent(validation.data)) {
          resumeData.value = validation.data;
          console.log("✅ CV-Daten aus localStorage geladen");
          isLoading.value = false;
          return;
        }
      }

      // 2. Try the user-provided file, then the bundled example
      const response = await fetch("/cv-data.json");
      let jsonText =
        response.ok && response.headers.get("content-type")?.includes("application/json")
          ? await response.text()
          : "";

      if (!jsonText) {
        const exampleResponse = await fetch("/cv-data-example.json");
        if (
          exampleResponse.ok &&
          exampleResponse.headers.get("content-type")?.includes("application/json")
        ) {
          jsonText = await exampleResponse.text();
        }
      }

      if (jsonText) {
        const validation = validateJSON(jsonText);
        if (!validation.valid || !validation.data) {
          throw new Error(validation.error || "Ungültiges Resume-Format");
        }

        resumeData.value = validation.data;
        saveToLocalStorage();
        console.log("✅ CV-Daten aus öffentlicher JSON-Datei geladen");
      } else {
        // 3. Use default data when no public resume file is available
        console.log("ℹ️ Keine Resume-JSON-Datei gefunden, nutze Standard-Daten");
        resumeData.value = getDefaultResume();
      }
    } catch (err) {
      console.error("❌ Fehler beim Laden der CV-Daten:", err);
      error.value = err instanceof Error ? err.message : "Unbekannter Fehler";
      resumeData.value = getDefaultResume();
    } finally {
      isLoading.value = false;
    }
  }

  function saveToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.CV_DATA, JSON.stringify(resumeData.value));
    } catch (err) {
      console.error("❌ Fehler beim Speichern in localStorage:", err);
    }
  }

  function updateResumeData(newData: Resume) {
    if (isValidResume(newData)) {
      resumeData.value = newData;
      saveToLocalStorage();
    }
  }

  function resetResumeData() {
    resumeData.value = getDefaultResume();
    localStorage.removeItem(STORAGE_KEYS.CV_DATA);
    error.value = null;
  }

  // Array manipulation helpers with proper typing
  function addToArray<K extends keyof Resume>(
    section: K,
    item: Resume[K] extends (infer T)[] ? T : never,
  ) {
    const array = resumeData.value[section];
    if (Array.isArray(array)) {
      (array as Array<typeof item>).push(item);
    }
  }

  function removeFromArray<K extends keyof Resume>(section: K, index: number) {
    const array = resumeData.value[section];
    if (Array.isArray(array)) {
      array.splice(index, 1);
    }
  }

  return {
    // State
    resumeData,
    isLoading,
    error,

    // Actions
    loadResumeData,
    updateResumeData,
    resetResumeData,
    saveToLocalStorage,
    addToArray,
    removeFromArray,
  };
});
