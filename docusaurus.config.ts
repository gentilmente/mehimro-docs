import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

/**
 * Mehmiro Documentation Hub configuration.
 * This file runs in Node.js; avoid browser APIs or JSX here.
 */
const config: Config = {
  title: 'Mehmiro Documentation Hub',
  tagline: 'Centralized architecture, standards, and BDD/TDD workflows',
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
    defaultLocale: 'en',
    locales: ['en']
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
          showLastUpdateTime: true
        },
        blog: {
          blogTitle: 'Mehmiro Research & Updates',
          blogDescription: 'Latest research findings, feature updates, and educational insights from the Mehmiro team',
          postsPerPage: 'ALL',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          blogSidebarCount: 'ALL',
          blogSidebarTitle: 'Recent Posts',
          feedOptions: {
            type: 'all',
            copyright: `Copyright © ${new Date().getFullYear()} Mehmiro Educational Technology.`,
          },
        },
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
      title: 'Mehmiro Docs',
      logo: {
        alt: 'Mehmiro Logo',
        src: 'img/logo.svg'
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'userSidebar',
          position: 'left',
          label: 'User Guide'
        },
        {
          type: 'docSidebar',
          sidebarId: 'devSidebar',
          position: 'left',
          label: 'Developer Hub'
        },
        {
          type: 'docSidebar',
          sidebarId: 'researchSidebar',
          position: 'left',
          label: 'Research'
        },
        {
          type: 'doc',
          docId: 'research/intro',
          position: 'left',
          label: 'Research'
        },
        {
          type: 'dropdown',
          label: 'Blog',
          position: 'left',
          items: [
            {
              type: 'doc',
              docId: 'research/intro',
              label: 'Research Blog'
            }
          ]
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
          title: 'Sections',
          items: [
            { label: 'Foundations', to: '/docs/foundations/project-overview' },
            {
              label: 'Architecture',
              to: '/docs/architecture/system-architecture'
            },
            { label: 'Standards', to: '/docs/standards/coding-standards' },
            { label: 'Processes', to: '/docs/processes/feature-lifecycle' }
          ]
        },
        {
          title: 'Features',
          items: [
            {
              label: 'Feature Catalog',
              to: '/docs/features/feature-catalog'
            },
            {
              label: 'Student Monitoring System',
              to: '/docs/features/student-monitoring-system/student-monitoring-system-overview'
            },
            {
              label: 'Student Assessment Insights',
              to: '/docs/features/student-assessment-insights/student-assessment-insights-overview'
            }
          ]
        },
        {
          title: 'External',
          items: [
            {
              label: 'Storybook',
              href: 'https://mehmiro-storybook.vercel.app'
            },
            { label: 'GitHub', href: 'https://github.com/gentilmente/mehimro-docs' }
          ]
        }
      ],
      copyright: `© ${new Date().getFullYear()} Mehmiro. Built with ❤️ for educators.`
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
