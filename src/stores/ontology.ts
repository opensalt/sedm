import { ref, computed, onBeforeMount } from 'vue'
import { defineStore } from 'pinia'
import { Store, Parser, DataFactory as df } from 'n3';
import sedm from '../assets/SEDM-Property-Ids.txt?raw';
import { CEDS_PREFIX, DC11_PREFIX, OS_PREFIX, RDF_PREFIX, RDFS_PREFIX, SCHEMA_PREFIX, SKOS_PREFIX, keyMap } from '@/stores/prefixes.ts'

export const useOntologyStore = defineStore('ontology', () => {
  const quads = new Store();
  const classList = ref<{id: string, label: string}[]>([]);
  const propertyList = ref<{id: string, label: string}[]>([]);
  const initialized = ref(false);
  const classInfo = ref<{[key in string]: any}>({});
  const sedmProperties: string[] = [];

  async function init() {
    fetch('/CEDS-Ontology.ttl')
      .then((response) => response.text())
      .then((text) => {
        const parser = new Parser();
        quads.addQuads(parser.parse(text));

        Array.from(sedm.matchAll(/P\d{6}/g), (m) => {
          sedmProperties.push(m[0]);
          quads.add(df.quad(df.namedNode(CEDS_PREFIX+m[0]), df.namedNode(OS_PREFIX+'hasTag'), df.literal('SEDM')));
        });

        // Get Class List
        quads.forSubjects(
          (subject) => {
            const classId = subject.value;
            quads.forObjects(
              (label) => {
                classList.value.push({ id: classId, label: label.value });
              },
              subject, RDFS_PREFIX+'label', null
            );

            /*
            classInfo.value[classId] = {};
            quads.getQuads(subject, null, null, null).forEach((q) => {
              (classInfo.value[classId][keyMap[q.predicate.value] || q.predicate.value] ??= []).push(q.object.value);
            });
             */
          },
          RDF_PREFIX+'type', RDFS_PREFIX+'Class', null
        );

        /*
        // Get Property List
        quads.forSubjects(
           (s) => {
             const propertyId = s.value;
             quads.forObjects(
               (label) => {
                 propertyList.value.push({ id: propertyId, label: label.value });
               },
               s, RDFS_PREFIX+'label', null
             )
           },
          RDF_PREFIX+'type', RDF_PREFIX+'Property', null
        );
         */

        initialized.value = true;
      });
  }

  onBeforeMount(async () => {
    await init();
  });

  const getClassData = (id: string) => computed(() => {
      const data: {[key in string]: any} = {
        id: id,
        type: <string[]>[],
        subClassOf: <string[]>[],
        label: <string[]>[],
        notation: <string[]>[],
        creator: <string[]>[],
        identifier: <string[]>[],
        comment: <string[]>[],
        domainIncludes: <string[]>[],
        rangeIncludes: <string[]>[],
        prefLabel: <string[]>[],
        description: <string[]>[],
        definition: <string[]>[],
        inScheme: <string[]>[],
        tags: <string[]>[],
        propertyIds: <string[]>[],
        optionIds: <string[]>[],
        inRangeOf: <string[]>[],
      };

      if (!initialized.value) {
        return data;
      }

      quads.forEach((q)=>{
        (data[keyMap[q.predicate.value] || q.predicate.value] ??= []).push(q.object.value);
      }, id, null, null, null);

      quads.forSubjects((s) => {
        data.propertyIds.push(s.value);
      }, SCHEMA_PREFIX+'domainIncludes', id, null);

      quads.forSubjects((s) => {
        data.optionIds.push(s.value);
      }, SKOS_PREFIX+'inScheme', id, null);

      quads.forSubjects((s) => {
        data.inRangeOf.push(s.value);
      }, SCHEMA_PREFIX+'rangeIncludes', id, null);

    return data;
    });

  const getAllProperties = computed(() => {
    const propertyList: {id: string, label: string, sedm: boolean}[] = [];

    if (!initialized.value) {
      return propertyList;
    }

    quads.forSubjects(
      (s) => {
        const propertyId = s.value
        quads.forObjects(
          (label) => {
            const sedm = sedmProperties.includes(propertyId.replace(/^.*#/, ''));
            propertyList.push({ id: propertyId, label: label.value, sedm: sedm })
          },
          s, RDFS_PREFIX + 'label', null,
        )
      },
      RDF_PREFIX + 'type',
      RDF_PREFIX + 'Property',
      null,
    );

    return propertyList;
  });

  const isInitialized = computed(() => {
    return initialized.value;
  });

  return { classList, propertyList, getClassData, getAllProperties, classInfo, isInitialized }
})
