import { defineStore } from 'pinia'
import sedm from '../assets/SEDM-Property-Ids.txt?raw';
import domain from '../assets/properties.json?raw';

export const useDomainStore = defineStore('domain', () => {
  const domainProperties: {[key in string]: string}[] = JSON.parse(domain);
  const sedmProperties: string[] = [];

  Array.from(sedm.matchAll(/P\d{6}/g), (m) => {
    sedmProperties.push(m[0].replace(/^P/, ''));
  });

  return {
    domainProperties,
    sedmProperties,
  };
})
