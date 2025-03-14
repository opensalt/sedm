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
        <dd v-if="element.usage_notes">{{ element.usage_notes }}</dd>

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
        <dd><RouterLink :to="{name: 'propertyView', params: {id: 'P'+element.global_id}}">{{element.global_id}}</RouterLink></dd>
    </dl>
    </div>
    <div v-else>
      Element not found.
    </div>
  </div>
</template>

<style scoped>

</style>
