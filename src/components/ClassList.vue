<script setup lang="ts">
import { useOntologyStore } from '@/stores/ontology.ts'
import { computed, provide, ref } from 'vue'
import SubclassList from '@/components/SubclassList.vue'

const ontologyStore = useOntologyStore()

const optionSets = ref(ontologyStore.showOptionSets);
provide('optionSets', optionSets);

const onlyOneRef = ref(ontologyStore.showIfOneRef);
provide('onlyOneRef', onlyOneRef);

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
  <div class="form-check form-switch">
    <input
      class="form-check-input"
      type="checkbox"
      role="switch"
      id="optionSets"
      v-model="optionSets"
      @change="ontologyStore.toggleShowOptionSets()"
    />
    <label class="form-check-label" for="optionSets">Show Option Sets</label>
  </div>
  <div class="form-check form-switch">
    <input
      class="form-check-input"
      type="checkbox"
      role="switch"
      id="onlyOneRef"
      v-model="onlyOneRef"
      @change="ontologyStore.toggleShowIfOneRef()"
    />
    <label class="form-check-label" for="onlyOneRef">Show if referenced from one class</label>
  </div>

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
