<script setup lang="ts">
import { useOntologyStore } from '@/stores/ontology.ts'
import { computed, inject, type Ref } from 'vue'
import { CEDS_PREFIX, OWL_PREFIX } from '@/stores/prefixes.ts'

const ontologyStore = useOntologyStore()

const props = defineProps<{ id: string }>()
const optionSets: Ref<boolean, boolean> | undefined = inject('optionSets');
const onlyOneRef: Ref<boolean, boolean> | undefined = inject('onlyOneRef');

const classList = computed(() => {
  return ontologyStore
    .getClassData(props.id)
    .value.subClasses.filter((c) => {
      return (
        (optionSets?.value || !c.value.type.includes(OWL_PREFIX + 'Class'))
        && (onlyOneRef?.value || c.value.inRangeOf.length !== 1)
        // && !(props.id === CEDS_PREFIX+'C000000' && c.value.superClasses.length > 1)
      )
    })
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
