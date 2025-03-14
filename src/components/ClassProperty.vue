<script setup lang="ts">
import { computed, watch } from 'vue'
import { useOntologyStore } from '@/stores/ontology.ts'
import { CEDS_PREFIX, RDFS_PREFIX, SKOS_PREFIX } from '@/stores/prefixes.ts'
const ontologyStore = useOntologyStore();

const props = defineProps<{property: any}>()
const propertyInfo = computed(() => {
  return ontologyStore.getClassData(props.property).value;
});

const range = computed(() => {
  const val = propertyInfo.value.rangeIncludes?.find(()=>true);

  const isSedm = propertyInfo.value.tags?.find((tag: string) => tag === 'SEDM');

  if (val.startsWith(CEDS_PREFIX)) {
    const classData = ontologyStore.getClassData(val);

    let type = '';
    if (classData.value.type.includes(RDFS_PREFIX+'Class')) {
      type = 'class';
    }
    if (classData.value.type.includes(SKOS_PREFIX+'ConceptScheme')) {
      type = 'option set';
    }

    return {
      type: type,
      label: (classData.value.label.find(()=>true) || ''),
      notation: (classData.value.notation.find(()=>true) || ''),
      prefLabel: (classData.value.prefLabel.find(()=>true) || ''),
      id: classData.value.id.replace(/^.*#/, ''),
      classData: classData,
      sedm: isSedm,
    };
  }

  return {
    type: 'element',
    label: val.replace(/^.*#/, ''),
    sedm: isSedm,
  }
})

const propertyId = computed(() => {
  return props.property.replace(/^.*#/, '');
})

</script>

<template>
    <div class="property">
      <span v-if="range.sedm" class="float-start position-absolute" title="Is a SEDM property">*</span>
      <RouterLink :to="{name: 'propertyView', params: {id: propertyId}}" class="fw-bold ms-3">{{ propertyInfo.label.find(()=>true) }}</RouterLink>
        [
          <span class="fst-italic text-lowercase text-muted">{{ range.type }}</span>:

          <RouterLink v-if="range.type==='class'" :to="{ name: 'classView', params: { id: range.id }}" class="fw-bold text-reset">{{range.label}}</RouterLink>
          <RouterLink v-else-if="range.type==='option set'" :to="{ name: 'classView', params: { id: range.id }}" class="fw-bold text-reset">{{range.label}}</RouterLink>
          <span class="fw-bold fst-italic text-muted" v-else>{{ range.label }}</span>
      ]
    </div>
</template>

<style scoped>

</style>
