<script setup lang="ts">
import { TYPECHECK_RESULTS } from '../lib/typecheck'
import { ref, computed } from 'vue'

const includeFilter = ref('')
const excludeFilter = ref('')

const filteredResults = computed(() => TYPECHECK_RESULTS
  .filter(result => !includeFilter.value || result.filePath.toLowerCase().includes(includeFilter.value.toLowerCase()))
  .filter(result => !excludeFilter.value || !result.filePath.toLowerCase().includes(excludeFilter.value.toLowerCase()))
  .sort((a, b) => b.errors - a.errors)
)

const totalErrors = computed(() => filteredResults.value.reduce((sum, result) => sum + result.errors, 0))
const totalFiles = computed(() => filteredResults.value.length)
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex gap-1">
      <input type="text" v-model="includeFilter" placeholder="Include..." class="py-1 px-2">
      <input type="text" v-model="excludeFilter" placeholder="Exclude..." class="py-1 px-2">
    </div>

    <span>Errors: {{ totalErrors }}, Files: {{ totalFiles }}</span>

    <div class="h-100 overflow-y-scroll">
      <table>
        <thead>
          <tr>
            <th class="text-left">File Path</th>
            <th class="text-left">Errors</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="{ filePath, errors } in filteredResults" :key="filePath">
            <td>{{ filePath }}</td>
            <td>{{ errors }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>