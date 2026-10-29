<script setup lang="ts">
import type { Language } from "../../types/resume.types";

defineProps<{
  languages: Language[];
}>();
</script>

<template>
  <section class="cv-section">
    <h2>
      <font-awesome-icon icon="globe" class="section-icon" />
      Sprachen
    </h2>
    <div v-for="(language, index) in languages" :key="index" class="language-item">
      <strong>{{ language.language }}</strong>
      <span v-if="language.fluency" class="fluency">{{ language.fluency }}</span>
    </div>
  </section>
</template>

<style scoped>
.cv-section {
  margin: 30px auto;
  max-width: 900px;
  background: white;
  padding: 30px 40px;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #0e5091;
  border-bottom: 2px solid #0e5091;
  padding-bottom: 6px;
  margin-bottom: 20px;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-icon {
  font-size: 18px;
}

.language-item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 10px;
}

.language-item:last-child {
  margin-bottom: 0;
}

.fluency {
  color: #777;
}

@media print {
  .cv-section {
    box-shadow: none;
    page-break-inside: auto;
    margin: 0 1cm;
  }

  h2 {
    margin: 0 0 12px;
  }

  .language-item {
    page-break-inside: avoid;
    break-inside: avoid;
  }
}
</style>
