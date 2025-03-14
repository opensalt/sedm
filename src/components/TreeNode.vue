<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{node: any, onlySedm?: boolean}>();
const router = useRouter();
const emit = defineEmits(['clicked']);

const clickHandler = (id: string) => {
  emit('clicked', id);
  //router.push({ name: 'domainElement', params: { id: id } });
};
</script>

<template>
  <template v-for="child in node.children">
    <template v-if="!props.onlySedm || child.isSEDM">
    <details v-if="child.children" class="ps-3">
      <summary :class="(child.isSEDM ? 'fw-bold' : '')">{{child.title}}</summary>
      <TreeNode :node="child" :onlySedm="props.onlySedm" @clicked="(id) => clickHandler(id)" />
    </details>
    <div v-else>
      <span class="ps-4" :class="(child.isSEDM ? 'fw-bold' : '')" @click.prevent="clickHandler(child.globalId)">{{ child.title }}</span>
      <span v-if="child.isSEDM" title="Is a SEDM element"> *</span>
    </div>
    </template>
  </template>
</template>

<style scoped>

</style>
