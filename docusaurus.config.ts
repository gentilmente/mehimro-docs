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
          routeBasePath: '/',
          editUrl: 'https://github.com/gentilmente/mehimro-docs/tree/main/docs-portal',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          path: 'docs',
          includeCurrentVersion: true,
          onlyIncludeVersions: ['current'],
        },
        blog: false,
        pages: false,
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
          sidebarId: 'guiaSidebar',
          position: 'left',
          label: 'Guía de Usuario'
        },
        {
          type: 'docSidebar',
          sidebarId: 'investigacionSidebar',
          position: 'left',
          label: 'Investigación'
        },
        {
          type: 'docSidebar',
          sidebarId: 'desarrolladoresSidebar',
          position: 'left',
          label: 'Centro de Desarrollo'
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
          title: 'Guía de Usuario',
          items: [
            { label: 'Comenzar', to: '/guia/user-intro' },
            { label: 'Tutoriales', to: '/guia/tutorials/creating-your-first-assessment' },
            { label: 'Preguntas Frecuentes', to: '/guia/guides/frequently-asked-questions' }
          ]
        },
        {
          title: 'Investigación',
          items: [
            { label: 'Metodología', to: '/investigacion/methodology/formative-feedback-methodology' },
            { label: 'Papers', to: '/investigacion/papers/realtime-assessment-impact' }
          ]
        },
        {
          title: 'Desarrolladores',
          items: [
            { label: 'Arquitectura', to: '/desarrolladores/architecture/system-architecture' },
            { label: 'Estándares', to: '/desarrolladores/standards/coding-standards' },
            { label: 'Características', to: '/desarrolladores/features/feature-catalog' }
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
