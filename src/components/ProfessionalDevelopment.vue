<script setup lang="ts">
import type { ProfessionalDevelopment } from "../types/cv.types";

defineProps<{
  professionalDevelopment: ProfessionalDevelopment[];
}>();
</script>

<template>
  <section class="cv-section">
    <h2>
      <font-awesome-icon icon="certificate" class="section-icon" />
      Weiterbildung
    </h2>
    <div v-for="(dev, index) in professionalDevelopment" :key="index" class="development-item">
      <p>
        <strong>{{ dev.title }}</strong
        ><br />
        {{ dev.institution }}<br />
        <em>{{ dev.period }}</em>
        <span v-if="dev.description"><br />{{ dev.description }}</span>
      </p>
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

.development-item {
  margin-bottom: 15px;
}

.development-item:last-child {
  margin-bottom: 0;
}

.development-item p {
  margin: 0;
  line-height: 1.6;
}

@media print {
  .cv-section {
    box-shadow: none;
    margin: 20px auto;
    page-break-inside: avoid;
  }
}
</style>