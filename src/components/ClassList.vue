<script setup lang="ts">
import {useOntologyStore} from "@/stores/ontology.ts";
import {computed} from "vue";
const ontologyStore = useOntologyStore();

const classList = computed(() => {
  return ontologyStore.classList.map((term) => {
    return {
      label: term.label,
      id: term.id.replace(/^.*([:#])/, ''),
    };
  })
})
</script>

<template>
  <h3>List of classes in the CEDS Ontology</h3>
  <div class="my-4">
    <ul>
      <li v-for="term in classList"><RouterLink :to="{ name: 'classView', params: { id: term.id }}">{{ term.label }}</RouterLink></li>
    </ul>
  </div>
</template>
