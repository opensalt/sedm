<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="mb-3">
    <div>
      <nav>
        <RouterLink to="/">Home</RouterLink>
      </nav>
    </div>
  </header>

  <div>
  </div>

  <div class="mx-5">
    <RouterView />
  </div>
</template>

<style scoped>
</style>
