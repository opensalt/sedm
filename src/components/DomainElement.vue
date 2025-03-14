<script setup lang="ts">
import { useDomainStore } from '@/stores/domain.ts'
import { computed } from 'vue'

const props = defineProps(['id']);
const domainElements = useDomainStore();

const element: any = computed(() => {
  return domainElements.domainProperties.find((e) => {
    return e.global_id === props.id;
  });
});
const isSedm = computed(() => {
  return domainElements.sedmProperties.includes(element.global_id || 'Not Found');
});
const codesetId = computed(() => {
  const mapping = domainElements.termCodesets.find((e) => {
    return e.term_id == element.value.term_id;
  });

  return mapping?.codeset_id || null;
});
const codeset = computed(() => {
  if (codesetId.value === null) {
    return [];
  }

  const codeset = domainElements.codesets.find((e) => {
    return e.codeset_id === codesetId.value;
  });

  return codeset?.codes || [];
});
</script>

<template>
   <div>
    <div v-if="element">
    <h1>{{ element.name }}</h1>

    <div v-if="isSedm" class="alert alert-secondary" role="alert">This is a Special Ed Data Model property.</div>

    <dl>
        <dt>Definition</dt>
        <dd>{{ element.definition }}</dd>

        <dt v-if="element.format">Format</dt>
        <dd v-if="element.format">{{ element.format }}</dd>

        <dt v-if="element.usage_notes">Usage Notes</dt>
        <dd v-if="element.usage_notes" v-html="element.usage_notes"></dd>

        <dt v-if="codeset.length">Option Set</dt>
        <dd v-if="codeset.length" class="mx-3">
          <table class="table table-responsive table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">Definition</th>
                <th scope="col">Code</th>
              </tr>
            </thead>
            <tbody class="overflow-y-scroll">
              <tr v-for="code in codeset">
                <td>{{ code.description}}</td>
                <td>{{ code.definition }}</td>
                <td>{{ code.code}}</td>
              </tr>
            </tbody>
          </table>
        </dd>

        <dt>Related Domains, Entities, and Categories</dt>
        <dd>
          <span>{{element.domain}}</span> ->
          <span>{{element.entity}}</span>
          <span v-for="category in element.category?.split('->') || []"> -> {{ category }}</span>
        </dd>

        <dt>Global ID</dt>
        <dd>{{ element.global_id }}</dd>

        <dt>Term ID</dt>
        <dd>{{ element.term_id }}</dd>

        <dt>Element Technical Name</dt>
        <dd>{{ element.technical_name }}</dd>

        <dt>URL</dt>
        <dd>{{ element.url }}</dd>

        <dt>Find in ontology</dt>
        <dd><RouterLink :to="{name: 'propertyView', params: {id: 'P'+element.global_id}}">P{{element.global_id}}</RouterLink></dd>
    </dl>
    </div>
    <div v-else>
      Element not found.
    </div>
  </div>
</template>

<style scoped>

</style>
