<script setup lang="ts">
import { computed, watch } from 'vue'
import { useOntologyStore } from '@/stores/ontology.ts'
import { CEDS_PREFIX, RDFS_PREFIX, SKOS_PREFIX } from '@/stores/prefixes.ts'
const ontologyStore = useOntologyStore();

const props = defineProps<{property: any}>()
const propertyInfo = ontologyStore.getClassData(props.property);

</script>

<template>
    <div class="property ms-4">
      <span class="fw-bold" v-if="propertyInfo.notation.find(()=>true)">{{ propertyInfo.notation.find(()=>true) }} - </span><span class="">{{propertyInfo.label.find(()=>true)}}</span>
    </div>
</template>

<style scoped>

</style>
