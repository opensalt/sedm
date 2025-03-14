<script setup lang="ts">
import {useOntologyStore} from "@/stores/ontology.ts";
import {computed} from "vue";
const ontologyStore = useOntologyStore();

const propertyList = computed(() => {
  return ontologyStore.getAllProperties.sort((a, b) => (a.label > b.label) ? 1 : ((b.label > a.label) ?  -1 : 0));
})
</script>

<template>
  <h3>List of properties in the CEDS Ontology</h3>
  <div class="my-4">
    <ul>
      <li v-for="term in propertyList">
        <RouterLink :to="{ name: 'propertyView', params: { id: term.id.replace(/^.*#/, '') }}">{{ term.label }}</RouterLink>
        <span v-if="term.sedm" class="float-start position-absolute" title="Is a SEDM property">*</span>
      </li>
    </ul>
  </div>
</template>
