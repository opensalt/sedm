<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { useOntologyStore } from '@/stores/ontology.ts'
  import { CEDS_PREFIX, RDFS_PREFIX, SKOS_PREFIX } from '@/stores/prefixes.ts'
  import { computed, watch } from 'vue'

  const route = useRoute();
  const ontologyStore = useOntologyStore();

  let propertyInfo = ontologyStore.getClassData(CEDS_PREFIX+route.params.id);
  watch(route, (newValue, oldValue) => {
    propertyInfo = ontologyStore.getClassData(CEDS_PREFIX+newValue.params.id);
    console.log(propertyInfo);
  }, {flush: 'pre', immediate: true, deep: true});

  const range = computed(() => {
    const val = propertyInfo.value.rangeIncludes?.find(()=>true);

    const isSedm = propertyInfo.value.tags?.find((tag: string) => tag === 'SEDM');

    if ((val||'').startsWith(CEDS_PREFIX)) {
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
      label: (val || '').replace(/^.*#/, ''),
      sedm: isSedm,
    }
  });

  const domains = computed(() => {
    return propertyInfo.value.domainIncludes.map((id: string) => {
      return ontologyStore.getClassData(id);
    });
  });
</script>

<template>
  <div>
    <div v-if="range.sedm" class="alert alert-secondary" role="alert">This is a Special Ed Data Model property.</div>

    <h4>Property</h4>

    <h1>{{propertyInfo.label.find(()=>true)}}</h1>

    <p>{{propertyInfo.description.find(()=>true) || propertyInfo.comment.find(()=>true)}}</p>
    <p v-if="propertyInfo.textFormat.find(()=>true)" class="mb-0">
      Format: {{ propertyInfo.textFormat.find(()=>true) }}
    </p>
    <p v-if="propertyInfo.minLength.find(()=>true) || propertyInfo.maxLength.find(()=>true)" class="my-0">
      Length:
      {{ propertyInfo.minLength.find(()=>true) || '0' }}
      -
      {{ propertyInfo.maxLength.find(()=>true) || '?' }}
    </p>
    <p v-if="propertyInfo.minCount.find(()=>true)" class="my-0">
      Count:
      {{ propertyInfo.minCount.find(()=>true) || '0' }}
      -
      {{ propertyInfo.maxCount.find(()=>true) || '?' }}
    </p>
    <p v-if="propertyInfo.minInclusive.find(()=>true) || propertyInfo.maxInclusive.find(()=>true)" class="my-0">
      Value:
      <span title="inclusive">{{ propertyInfo.minInclusive.find(()=>true) || '?' }}</span>
      -
      <span title="inclusive">{{ propertyInfo.maxInclusive.find(()=>true) || '? '}}</span>
    </p>
    <p v-if="propertyInfo.decimalPlaces.find(()=>true)" class="my-0">
      Decimal Places: {{ propertyInfo.decimalPlaces.find(()=>true) }}
    </p>

    <h4 class="mt-4">Range</h4>
    <span class="fst-italic text-lowercase text-muted">{{ range.type }}</span>:
    <RouterLink v-if="range.type==='class'" :to="{ name: 'classView', params: { id: range.id.replace(/^.*#/, '') }}" class="fw-bold text-reset">{{range.label}}</RouterLink>
    <RouterLink v-else-if="range.type==='option set'" :to="{ name: 'classView', params: { id: range.id.replace(/^.*#/, '') }}" class="fw-bold text-reset">{{range.label}}</RouterLink>
    <span class="fw-bold fst-italic text-muted" v-else>{{ range.label }}</span>

    <h4 class="mt-4">Property Of</h4>
    <ul>
      <li v-for="domain in domains" :key="domain.id">
        <RouterLink :to="{ name: 'classView', params: { id: domain.value.id.replace(/^.*#/, '') }}" class="fw-bold text-reset">{{domain.value.label?.find(()=>true)}}</RouterLink>
      </li>
    </ul>

  </div>
</template>

<style scoped>
  dd {margin-left: 10px;}
</style>
