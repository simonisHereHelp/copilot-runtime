import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/docs/__docusaurus/debug',
    component: ComponentCreator('/docs/__docusaurus/debug', 'e58'),
    exact: true
  },
  {
    path: '/docs/__docusaurus/debug/config',
    component: ComponentCreator('/docs/__docusaurus/debug/config', '2ce'),
    exact: true
  },
  {
    path: '/docs/__docusaurus/debug/content',
    component: ComponentCreator('/docs/__docusaurus/debug/content', '11b'),
    exact: true
  },
  {
    path: '/docs/__docusaurus/debug/globalData',
    component: ComponentCreator('/docs/__docusaurus/debug/globalData', 'f13'),
    exact: true
  },
  {
    path: '/docs/__docusaurus/debug/metadata',
    component: ComponentCreator('/docs/__docusaurus/debug/metadata', 'bff'),
    exact: true
  },
  {
    path: '/docs/__docusaurus/debug/registry',
    component: ComponentCreator('/docs/__docusaurus/debug/registry', '830'),
    exact: true
  },
  {
    path: '/docs/__docusaurus/debug/routes',
    component: ComponentCreator('/docs/__docusaurus/debug/routes', '13e'),
    exact: true
  },
  {
    path: '/docs/query/',
    component: ComponentCreator('/docs/query/', 'ab9'),
    exact: true
  },
  {
    path: '/docs/',
    component: ComponentCreator('/docs/', '7aa'),
    routes: [
      {
        path: '/docs/',
        component: ComponentCreator('/docs/', 'b93'),
        routes: [
          {
            path: '/docs/',
            component: ComponentCreator('/docs/', 'c5e'),
            routes: [
              {
                path: '/docs/content',
                component: ComponentCreator('/docs/content', '878'),
                exact: true,
                sidebar: "defaultSidebar"
              },
              {
                path: '/docs/',
                component: ComponentCreator('/docs/', 'f5d'),
                exact: true,
                sidebar: "defaultSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
