const { resolve } = require('path')

module.exports = {
  base: '/',
  title: 'IY Foundation Common Library',
  description: 'IY Foundation Common Library',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Components', link: '/components/' },
      { text: 'Github', link: 'https://gitlab.com/iy4u/common-client-lib' },
    ],
    sidebar: [
      {
        title: 'Introduction',
        collapsable: false,
        children: [
          'introduction/guide'
        ]
      },
      {
        title: 'Components',
        collapsable: false,
        children: [
          'components/tabNavbar',
          'components/draggableResizable',
          'components/tabStepper'
        ]
      }
    ]
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@sparkz-community/common-client-lib': resolve(__dirname, '../../src')
      }
    }
  },
  plugins: [
    ['demo-code', {
      jsLibs: [
        // umd
        'https://unpkg.com/tua-storage/dist/TuaStorage.umd.js',
      ],
      cssLibs: [
        'https://unpkg.com/animate.css@3.7.0/animate.min.css',
      ],
      showText: 'show code',
      hideText: 'hide',
      styleStr: 'text-decoration: underline;',
      minHeight: 200,
      onlineBtns: {
        codepen: true,
        jsfiddle: true,
        codesandbox: true,
      },
      codesandbox: {
        deps: {
          'lodash': 'latest',
          '@vue/composition-api': '^0.6.7',
          'feathers-vuex': '^3.14.0',
          'moment': '^2.27.0',
          'quasar': '^1.0.0',
          'vue': '^2.6.11'
        },
        json: '',
        query: '',
        embed: '',
      },
      demoCodeMark: 'demo-code',
      // copyOptions: { ... },
    }]
  ],
}
