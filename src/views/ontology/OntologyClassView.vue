<script setup lang="ts">
import ClassList from '@/components/ClassList.vue'
import { ref, onMounted, reactive } from 'vue'

// Classification data - using reactive for better reactivity
const classifications = reactive({
  greg: {} as { [key: string]: string[] },
  nathan: {} as { [key: string]: string[] },
  domain: {} as { [key: string]: string[] },
})
const organizationMethod = ref('current')

// Load classification files
const loadClassifications = async () => {
  try {
    console.log('Starting to load classifications...')
    const [gregResponse, nathanResponse, domainResponse] = await Promise.all([
      fetch('/greg-classifications.ttl'),
      fetch('/nathan-classifications.ttl'),
      fetch('/domain-classifications.ttl'),
    ])

    if (!gregResponse.ok || !nathanResponse.ok || !domainResponse.ok) {
      throw new Error('Failed to fetch classification files')
    }

    const gregText = await gregResponse.text()
    const nathanText = await nathanResponse.text()
    const domainText = await domainResponse.text()

    console.log('Greg text length:', gregText.length)
    console.log('Nathan text length:', nathanText.length)
    console.log('Domain text length:', domainText.length)

    const gregParsed = parseTurtleClassifications(gregText)
    const nathanParsed = parseTurtleClassifications(nathanText)
    const domainParsed = parseTurtleClassifications(domainText)

    // Update reactive object
    Object.assign(classifications.greg, gregParsed)
    Object.assign(classifications.nathan, nathanParsed)
    Object.assign(classifications.domain, domainParsed)

    console.log('Loaded classifications:', {
      greg: Object.keys(classifications.greg),
      nathan: Object.keys(classifications.nathan),
      domain: Object.keys(classifications.domain),
    })
  } catch (error) {
    console.error('Error loading classifications:', error)
  }
}

// Parse Turtle file to extract classifications
const parseTurtleClassifications = (turtleText: string): { [key: string]: string[] } => {
  const result: { [key: string]: string[] } = {}
  const lines = turtleText.split('\n')

  for (const line of lines) {
    // Match lines like: ceds:C200061 rdf:type greg:Asset . or ceds:C200061 rdf:type nathan:Asset . or ceds:C200061 rdf:type domain:assessments .
    const match = line.match(/ceds:([^>\s]+)\s+rdf:type\s+(?:greg|nathan|domain):(\w+)/)
    if (match) {
      const iri = `http://ceds.ed.gov/terms#${match[1]}`
      const conceptType = match[2]

      if (conceptType && iri) {
        if (!(conceptType in result)) {
          result[conceptType] = []
        }
        if (result[conceptType]) {
          result[conceptType].push(iri)
        }
      }
    }
  }

  return result
}

onMounted(async () => {
  await loadClassifications()
})
</script>

<template>
  <main>
    <div class="mb-3">
      <label for="organizationMethod" class="form-label">Organization Method:</label>
      <select id="organizationMethod" class="form-select" v-model="organizationMethod">
        <option value="current">Current (Ontology Hierarchy)</option>
        <option value="greg">Greg's Classifications</option>
        <option value="nathan">Nathan's Classifications</option>
        <option value="domain">Domain Classifications</option>
      </select>
    </div>

    <ClassList :organizationMethod="organizationMethod" :classifications="classifications" />
  </main>
</template>
