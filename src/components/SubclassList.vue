<script setup lang="ts">
import { useOntologyStore } from '@/stores/ontology.ts'
import { computed } from 'vue'

const ontologyStore = useOntologyStore()

const props = defineProps<{id: string}>();

const classList = computed(() => {
  return ontologyStore.getClassData(props.id).value.subClasses
    .sort((a, b) => {
      return a.value.label.find(() => true).localeCompare(b.value.label.find(() => true))
    })
})
</script>

<template>
  <ul>
    <li v-for="term in classList">
      <RouterLink :to="{ name: 'classView', params: { id: term.value.shortId } }">{{
        term.value.label.find(() => true)
      }}</RouterLink>
      <SubclassList :id="term.value.id"></SubclassList>
    </li>
  </ul>
</template>
