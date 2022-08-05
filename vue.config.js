module.exports = {
  chainWebpack: config => {
    config.externals({
      vue: 'vue',
      vuex: 'vuex',
      quasar: 'quasar',
      moment: 'moment',
      '@feathersjs/vuex': '@feathersjs/vuex',
      '@vue/composition-api': '@vue/composition-api'
    });
  }
};
