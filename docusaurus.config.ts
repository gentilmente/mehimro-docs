import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

/**
 * Mehmiro Documentation Hub configuration.
 * This file runs in Node.js; avoid browser APIs or JSX here.
 */
const config: Config = {
  title: 'Centro de Documentación Mehmiro',
  tagline: 'Arquitectura centralizada, estándares y flujos de trabajo BDD/TDD',
  favicon: 'img/favicon.ico',

  future: {
    v4: true
  },

  url: 'https://mehmiro-docs.example.com',
  baseUrl: '/',

  organizationName: 'mehmiro',
  projectName: 'mehmiro-docs',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'ignore'
    }
  },
  onBrokenLinks: 'ignore',
  onBrokenAnchors: 'ignore',

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
      },
      es: {
        label: 'Español',
        direction: 'ltr',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/docs',
          editUrl: 'https://github.com/gentilmente/mehimro-docs/tree/main/docs-portal',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          path: 'docs',
          includeCurrentVersion: true,
          onlyIncludeVersions: ['current'],
        },
        blog: false,
        pages: {
          path: 'src/pages',
          routeBasePath: '/'
        },
        theme: {}
      } satisfies Preset.Options
    ]
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
      defaultMode: 'light',
      disableSwitch: false
    },
    navbar: {
      title: 'Documentación Mehmiro',
      logo: {
        alt: 'Logo de Mehmiro',
        src: 'img/logo.svg'
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'userSidebar',
          position: 'left',
          label: 'Guía de Usuario'
        },
        {
          type: 'docSidebar',
          sidebarId: 'devSidebar',
          position: 'left',
          label: 'Centro de Desarrollo'
        },
        {
          type: 'docSidebar',
          sidebarId: 'researchSidebar',
          position: 'left',
          label: 'Investigación'
        },
        {
          type: 'dropdown',
          label: 'Blog',
          position: 'left',
          items: [
            {
              type: 'doc',
              docId: 'research/research-intro',
              label: 'Blog de Investigación'
            }
          ]
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/gentilmente/mehimro-docs',
          label: 'GitHub',
          position: 'right'
        }
      ]
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Secciones',
          items: [
            { label: 'Fundamentos', to: '/docs/foundations/project-overview' },
            {
              label: 'Arquitectura',
              to: '/docs/developer/architecture/system-architecture'
            },
            { label: 'Estándares', to: '/docs/developer/standards/coding-standards' },
            { label: 'Procesos', to: '/docs/developer/processes/feature-lifecycle' }
          ]
        },
        {
          title: 'Características',
          items: [
            {
              label: 'Catálogo de Características',
              to: '/docs/developer/features/feature-catalog'
            },
            {
              label: 'Sistema de Monitoreo Estudiantil',
              to: '/docs/developer/features/student-monitoring-system/overview'
            },
            {
              label: 'Perspectivas de Evaluación Estudiantil',
              to: '/docs/developer/features/student-assessment-insights/overview'
            }
          ]
        },
        {
          title: 'Externo',
          items: [
            {
              label: 'Storybook',
              href: 'https://mehmiro-storybook.vercel.app'
            },
            { label: 'GitHub', href: 'https://github.com/gentilmente/mehimro-docs' }
          ]
        }
      ],
      copyright: `© ${new Date().getFullYear()} Mehmiro. Construido con ❤️ para educadores.`
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['typescript', 'javascript', 'json', 'bash', 'sql']
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true
      }
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4
    }
  } satisfies Preset.ThemeConfig
};

export default config;
