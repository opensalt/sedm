<script setup lang="ts">
import { useDomainStore } from '@/stores/domain.ts'
import TreeNode from '@/components/TreeNode.vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Modal } from 'bootstrap';
import DomainElement from '@/components/DomainElement.vue'

const domainElements = useDomainStore();

let data: any = {};
const sedmOnly = ref(false);

domainElements.domainProperties.forEach((property) => {
  const isSedm = domainElements.sedmProperties.includes(property.global_id || 'Not Found');

  data[property.domain] ??= {
    title: property.domain,
    type: 'domain',
    children: {},
  };
  if (isSedm) data[property.domain]['isSEDM'] = true;

  data[property.domain]['children'][property.entity] ??= {
    title: property.entity,
    type: 'entity',
    children: {},
  };
  if (isSedm) data[property.domain]['children'][property.entity]['isSEDM'] = true;

  const categories = property.category?.split(/->/);
  let current = data[property.domain]['children'][property.entity];
  if (categories) {
    categories.forEach((category) => {
      current['children'][category] ??= {
        title: category,
        type: 'category',
        children: {},
      };
      if (isSedm) current['children'][category]['isSEDM'] = true;

      current = current['children'][category];
    });
  }

  current['children'][property.name] ??= {
    title: property.name,
    type: (isSedm ? 'sedm-' : '')+'element',
    globalId: property.global_id,
    modelId: property.data_model_id,
    termId: property.term_id,
    isSEDM: isSedm,
  };
});

const convertChildren = (elem: any) => {
  if (elem instanceof Object) {
    Object.keys(elem).forEach((child) => {
      convertChildren(elem[child]);
    })
  }
  if (elem.children instanceof Object) {
    elem.children = Object.values(elem.children);
  }
}

data = {
  types: {
    domain: {},
    entity: {},
    category: {},
    element: {},
    'sedm-element': {classes: 'bold-style', icon: 'bi bi-asterisk'},
  },
  'children': data,
};
convertChildren(data);


const modal = ref<Modal|null>(null);
onMounted(async () => {
  modal.value = new Modal('#elementModal', {});
})

onBeforeUnmount(async () => {
  if (modal.value) {
    modal.value.hide();
  }
})

const elementId = ref<string|null>(null);
const showModal = (id: string) => {
  elementId.value = id;
  if (modal.value) {
    modal.value.show();
  }
}
</script>

<template>
  <main>
    <h3>CEDS Domain Entities</h3>

    <div class="form-check form-switch">
      <input class="form-check-input" type="checkbox" role="switch" id="sedmOnly" v-model="sedmOnly">
      <label class="form-check-label" for="sedmOnly">Only show <abbr title="Special Education Data Model">SEDM</abbr> elements</label>
    </div>

    <br />

    <TreeNode :node="data" :onlySedm="sedmOnly" @clicked="(id) => showModal(id)" />

<div id='elementModal' class="modal" tabindex="-1">
  <div class="modal-dialog modal-dialog-scrollable modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Element Details</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body overflow-y-scroll">
        <DomainElement :id="elementId" />
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
  </main>
</template>

<style scoped>
#elementModal {
  max-height: 75vh;
}
</style>
