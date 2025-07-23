<script setup lang="ts">
  import {useOntologyStore} from "@/stores/ontology.ts";
  import { useRoute } from 'vue-router'
  import ClassProperty from '@/components/ClassProperty.vue'
  import { computed, ref, watch } from 'vue'
  import { CEDS_PREFIX, OWL_PREFIX } from '@/stores/prefixes.ts'
  import NamedOption from '@/components/NamedOption.vue'
  import ReferencingProperty from '@/components/ReferencingProperty.vue'

  const route = useRoute();
  const ontologyStore = useOntologyStore();

  const data = computed(() => {
    return ontologyStore.getClassData(CEDS_PREFIX+route.params.id);
  });
</script>

<template>
  <div>
    <h4 class="">{{data.value.type.includes(OWL_PREFIX+'Class') ? 'Option Set' : data.value.type.find(()=>true)?.replace(/^.*#/, '')}}</h4>
    <h1>{{data.value.label.find(()=>true)}}</h1>
    <p>{{data.value.description.find(()=>true) || data.value.comment.find(()=>true)}}</p>
    <p v-if="data.value.superClasses.length > 0">Sub-class of:
      <span v-for="(superClass, index) in data.value.superClasses" :key="superClass.value.id">
        <span v-if="index !== 0">, </span>
        <RouterLink :to="{ name: 'classView', params: { id: superClass.value.id.replace(/^.*#/, '') }}" class="fw-bold text-reset">{{ superClass.value.label.find(()=>true) || superClass.value.id }}</RouterLink>
      </span>
    </p>

    <div v-if="data.value.propertyIds.length">
      <h3>Properties</h3>
      <ClassProperty v-for="item in data.value.propertyIds" :key="item.id" :property="item" />
    </div>

    <div v-for="superclass in data.value.superClasses" :key="superclass.value.id" class="mt-3">
      <details v-if="superclass.value.propertyIds.length > 0">
        <summary>Properties inherited from {{ superclass.value.label.find(()=>true) }}</summary>
        <ClassProperty v-for="item in superclass.value.propertyIds" :key="item.id" :property="item" />
      </details>
    </div>

    <div v-if="data.value.inRangeOf.length" class="mt-3">
      <h3>Referenced By</h3>
      <ReferencingProperty v-for="item in data.value.inRangeOf" :key="item.id" :property="item" />
    </div>

    <div v-if="data.value.optionIds.length" class="mt-3">
      <h3>Options</h3>
      <table class="table table-responsive table-striped table-hover mx-3">
        <thead>
        <tr>
          <th scope="col">Description</th>
          <th scope="col">Definition</th>
          <th scope="col">Code</th>
        </tr>
        </thead>
        <tbody class="overflow-y-scroll">
          <NamedOption v-for="item in data.value.optionIds" :key="item.id" :property="item" />
        </tbody>
      </table>

    </div>
  </div>
</template>

<style scoped>

</style>
