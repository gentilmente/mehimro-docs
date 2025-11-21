import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Docusaurus sidebar configuration for the Mehmiro documentation hub.
 * Each section mirrors the docs/ directory structure so that navigation
 * stays aligned with the curated information architecture.
 */
const sidebars: SidebarsConfig = {
  mehmiroSidebar: [
    {
      type: 'category',
      label: 'Foundations',
      collapsed: false,
      items: [
        'intro',
        'foundations/persona',
        'foundations/project-overview',
        'foundations/glossary',
        'foundations/core-guidelines'
      ]
    },
    {
      type: 'category',
      label: 'Architecture',
      collapsed: false,
      items: [
        'architecture/system-architecture',
        'architecture/data-model',
        'architecture/performance-security'
      ]
    },
    {
      type: 'category',
      label: 'Standards',
      collapsed: false,
      items: [
        'standards/coding-standards',
        'standards/ui-guidelines',
        'standards/testing-strategy'
      ]
    },
    {
      type: 'category',
      label: 'Processes',
      collapsed: false,
      items: [
        'processes/feature-lifecycle',
        'processes/documentation-governance'
      ]
    },
    {
      type: 'category',
      label: 'Features',
      collapsed: false,
      items: [
        'features/feature-catalog',
        {
          type: 'category',
          label: 'Student Assessment Insights',
          items: [
            'features/student-assessment-insights/student-assessment-insights-overview',
            'features/student-assessment-insights/student-assessment-insights-architecture',
            'features/student-assessment-insights/student-assessment-insights-bdd'
          ]
        },
        {
          type: 'category',
          label: 'Student Monitoring System',
          items: [
            'features/student-monitoring-system/student-monitoring-system-overview',
            'features/student-monitoring-system/student-monitoring-system-architecture',
            'features/student-monitoring-system/student-monitoring-system-database',
            'features/student-monitoring-system/student-monitoring-system-implementation'
          ]
        }
      ]
    }
  ]
};

export default sidebars;
