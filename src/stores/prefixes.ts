export const CEDS_PREFIX = 'http://ceds.ed.gov/terms#';
export const RDFS_PREFIX = 'http://www.w3.org/2000/01/rdf-schema#';
export const RDF_PREFIX = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
export const SKOS_PREFIX = 'http://www.w3.org/2004/02/skos/core#';
export const DC11_PREFIX = 'http://purl.org/dc/elements/1.1/';
export const SCHEMA_PREFIX = 'https://schema.org/';
export const OWL_PREFIX = 'http://www.w3.org/2002/07/owl#';
export const OS_PREFIX = 'http://purl.org/os/terms#';

export const keyMap: {[key in string]: string} = {
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': 'type',
  'http://www.w3.org/2000/01/rdf-schema#subClassOf': 'subClassOf',
  'http://www.w3.org/2000/01/rdf-schema#label': 'label',
  'http://www.w3.org/2004/02/skos/core#notation': 'notation',
  'http://purl.org/dc/elements/1.1/creator': 'creator',
  'http://purl.org/dc/elements/1.1/identifier': 'identifier',
  'http://www.w3.org/2000/01/rdf-schema#comment': 'comment',
  'https://schema.org/domainIncludes': 'domainIncludes',
  'https://schema.org/rangeIncludes': 'rangeIncludes',
  'http://www.w3.org/2004/02/skos/core#prefLabel': 'prefLabel',
  'http://purl.org/dc/elements/1.1/description': 'description',
  'http://www.w3.org/2004/02/skos/core#definition': 'definition',
  'http://www.w3.org/2004/02/skos/core#inScheme': 'inScheme',
  'http://purl.org/os/terms#hasTag': 'tags',
}
