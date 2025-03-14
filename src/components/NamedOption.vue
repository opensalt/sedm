<script setup lang="ts">
import { computed, watch } from 'vue'
import { useOntologyStore } from '@/stores/ontology.ts'
import { CEDS_PREFIX, RDFS_PREFIX, SKOS_PREFIX } from '@/stores/prefixes.ts'
const ontologyStore = useOntologyStore();

const props = defineProps<{property: any}>()
const propertyInfo = ontologyStore.getClassData(props.property);

</script>

<template>
    <tr>
      <td>{{ propertyInfo.label.find(()=>true) }}</td>
      <td>{{ propertyInfo.definition.find(()=>true) }}</td>
      <td>{{ propertyInfo.notation.find(()=>true) }}</td>
    </tr>
</template>

<style scoped>

</style>
