<script setup lang="ts">
import { useOntologyStore } from '@/stores/ontology.ts'
import { computed } from 'vue'
import SubclassList from '@/components/SubclassList.vue'

const ontologyStore = useOntologyStore()

const classList = computed(() => {
  return ontologyStore.classList
    .filter((c) => {
      const classData = ontologyStore.getClassData(c.id).value
      return classData.superClasses.length === 0
    })
    .map((term) => {
      return ontologyStore.getClassData(term.id).value
    })
    .sort((a, b) => {
      return a.label.find(() => true).localeCompare(b.label.find(() => true))
    })
})
</script>

<template>
  <h3>List of classes in the CEDS Ontology</h3>
  <div class="my-4">
    <ul>
      <li v-for="term in classList">
        <RouterLink :to="{ name: 'classView', params: { id: term.shortId } }">{{
          term.label.find(() => true)
        }}</RouterLink>
        <SubclassList :id="term.id"></SubclassList>
      </li>
    </ul>
  </div>
</template>
