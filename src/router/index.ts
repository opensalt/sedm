import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/domain',
      name: 'domainHierarchy',
      component: () => import('../views/domain/HierarchyView.vue'),
    },
    {
      path: '/domain/element/:id',
      name: 'domainElement',
      component: () => import('../views/domain/ElementView.vue'),
    },
    {
      path: '/ontology',
      name: 'ontology',
      component: () => import('../views/ontology/OntologyClassView.vue'),
    },
    {
      path: '/ontology/properties',
      name: 'ontologyProperties',
      component: () => import('../views/ontology/OntologyPropertyView.vue'),
    },
    {
      path: '/ontology/class/:id',
      name: 'classView',
      component: () => import('../views/ontology/ClassView.vue'),
    },
    {
      path: '/ontology/property/:id',
      name: 'propertyView',
      component: () => import('../views/ontology/PropertyView.vue'),
    },
  ],
})

export default router
