<script setup lang="ts">
import { useOntologyStore } from '@/stores/ontology.ts'
import { computed, provide, ref } from 'vue'
import SubclassList from '@/components/SubclassList.vue'

// Props for organization method and classifications
interface Props {
  organizationMethod?: string
  classifications?: {
    greg: { [key: string]: string[] }
    nathan: { [key: string]: string[] }
    domain: { [key: string]: string[] }
  }
}

const props = withDefaults(defineProps<Props>(), {
  organizationMethod: 'current',
  classifications: () => ({ greg: {}, nathan: {}, domain: {} }),
})
const ontologyStore = useOntologyStore()

const optionSets = ref(ontologyStore.showOptionSets)
provide('optionSets', optionSets)

const onlyOneRef = ref(ontologyStore.showIfOneRef)
provide('onlyOneRef', onlyOneRef)

// Helper function to get class label from IRI
const getClassLabel = (iri: string): string => {
  const shortId = iri.split('#')[1]
  if (shortId) {
    const classData = ontologyStore.getClassData(`http://ceds.ed.gov/terms#${shortId}`)
    if (classData.value && classData.value.label && classData.value.label.length > 0) {
      return classData.value.label[0]
    }
  }
  return shortId || iri
}

// Build classification-based class list
const buildClassificationClassList = (classificationData: { [key: string]: string[] }) => {
  const classList: any[] = []

  Object.keys(classificationData).forEach((conceptType) => {
    // Get actual ontology classes for this concept type
    const conceptMembers = classificationData[conceptType] || []
    const subClasses = conceptMembers
      .map((iri: string) => {
        const shortId = iri.split('#')[1]
        if (shortId) {
          // Try to find the class in the ontology store
          const classData = ontologyStore.getClassData(`http://ceds.ed.gov/terms#${shortId}`)
          if (classData.value && classData.value.id) {
            return classData
          }
        }
        return null
      })
      .filter((classRef) => classRef !== null)

    // Create a virtual class for each concept type
    const conceptClass = {
      id: `concept-${conceptType}`,
      shortId: `concept-${conceptType}`,
      label: [`${conceptType} (Classification)`],
      superClasses: [],
      subClasses: subClasses,
      properties: [],
      conceptType: conceptType,
      isClassificationGroup: true,
      members: conceptMembers.sort((a, b) => {
        return getClassLabel(a).localeCompare(getClassLabel(b))
      }),
    }
    classList.push(conceptClass)
  })

  return classList.sort((a, b) => a.label[0].localeCompare(b.label[0]))
}

const classList = computed(() => {
  if (props.organizationMethod === 'greg') {
    return buildClassificationClassList(props.classifications.greg)
  } else if (props.organizationMethod === 'nathan') {
    return buildClassificationClassList(props.classifications.nathan)
  } else if (props.organizationMethod === 'domain') {
    return buildClassificationClassList(props.classifications.domain)
  } else {
    // Original logic for current method
    return ontologyStore.classList
      .filter((c) => {
        const classData = ontologyStore.getClassData(c.id).value
        return classData.superClasses.length === 0
      })
      .map((term) => {
        return ontologyStore.getClassData(term.id).value
      })
      .sort((a, b) => {
        return a.label.find(() => true).localeCompare(b.label.find(() => true))
      })
  }
})
</script>

<template>
  <h3>List of classes in the CEDS Ontology</h3>
  <div class="form-check form-switch">
    <input
      class="form-check-input"
      type="checkbox"
      role="switch"
      id="optionSets"
      v-model="optionSets"
      @change="ontologyStore.toggleShowOptionSets()"
    />
    <label class="form-check-label" for="optionSets">Show Option Sets</label>
  </div>
  <div class="form-check form-switch">
    <input
      class="form-check-input"
      type="checkbox"
      role="switch"
      id="onlyOneRef"
      v-model="onlyOneRef"
      @change="ontologyStore.toggleShowIfOneRef()"
    />
    <label class="form-check-label" for="onlyOneRef">Show if referenced from one class</label>
  </div>

  <div class="my-4">
    <ul>
      <li v-for="term in classList" :key="term.id">
        <template v-if="term.isClassificationGroup">
          <!-- Classification group display -->
          <strong>{{ term.label[0] }}</strong>
          <ul class="mt-2 ms-3">
            <li v-for="member in term.members" :key="member" class="text-muted">
              <RouterLink :to="{ name: 'classView', params: { id: member.split('#')[1] } }">
                {{ getClassLabel(member) }}
              </RouterLink>
            </li>
          </ul>
        </template>
        <template v-else>
          <!-- Regular ontology class display -->
          <RouterLink :to="{ name: 'classView', params: { id: term.shortId } }">{{
            term.label.find(() => true)
          }}</RouterLink>
          <SubclassList :id="term.id"></SubclassList>
        </template>
      </li>
    </ul>
  </div>
</template>
