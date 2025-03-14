<script setup lang="ts">

</script>

<template>
  <main>
    <h3>Which way do you want to browse the CEDS Data Model?</h3>
    <ul class="list-group">
      <li class="list-group-item"><RouterLink :to="{name: 'domainHierarchy'}">Domain Entity Schema</RouterLink></li>
      <li class="list-group-item"><RouterLink :to="{name: 'ontology'}">Ontology Classes</RouterLink></li>
      <li class="list-group-item"><RouterLink :to="{name: 'ontologyProperties'}">Ontology Properties</RouterLink></li>
    </ul>
  </main>
</template>

<style scoped>

</style>
