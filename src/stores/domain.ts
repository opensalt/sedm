import { defineStore } from 'pinia'
import sedm from '../assets/SEDM-Property-Ids.txt?raw';
import domainProperties from '../assets/properties.json';
import codesets from '../assets/codesets.json';
import termCodesets from '../assets/term_codeset.json';

export const useDomainStore = defineStore('domain', () => {
  const sedmProperties: string[] = [];

  Array.from(sedm.matchAll(/P\d{6}/g), (m) => {
    sedmProperties.push(m[0].replace(/^P/, ''));
  });

  return {
    domainProperties,
    sedmProperties,
    termCodesets,
    codesets,
  };
})
