<script setup lang="ts">
import { useRoute } from 'vue-router'
import DomainElement from '@/components/DomainElement.vue'

const route = useRoute();
</script>

<template>
  <DomainElement :id="route.params.id as string" />
</template>

<style scoped>

</style>
