<script setup lang="ts">
  import {useOntologyStore} from "@/stores/ontology.ts";
  import { useRoute } from 'vue-router'
  import ClassProperty from '@/components/ClassProperty.vue'
  import { watch } from 'vue'
  import { CEDS_PREFIX, OWL_PREFIX } from '@/stores/prefixes.ts'
  import NamedOption from '@/components/NamedOption.vue'

  const route = useRoute();
  const ontologyStore = useOntologyStore();

  let data = ontologyStore.getClassData(CEDS_PREFIX+route.params.id);
  watch(route, (newValue, oldValue) => {
    data = ontologyStore.getClassData(CEDS_PREFIX+newValue.params.id);
  }, {flush: 'pre', immediate: true, deep: true});
</script>

<template>
  <div>
    <h4 class="">{{data.type.includes(OWL_PREFIX+'Class') ? 'Option Set' : data.type.find(()=>true)?.replace(/^.*#/, '')}}</h4>
    <h1>{{data.label.find(()=>true)}}</h1>

    <p>{{data.description.find(()=>true) || data.comment.find(()=>true)}}</p>

    <div v-if="data.propertyIds.length">
      <h3>Properties</h3>
      <ClassProperty v-for="item in data.propertyIds" :key="item.id" :property="item" />
    </div>

    <div v-if="data.optionIds.length">
      <h3>Options</h3>
      <NamedOption v-for="item in data.optionIds" :key="item.id" :property="item" />
    </div>
  </div>
</template>

<style scoped>

</style>
