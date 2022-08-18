import * as components from './components';
import {enumValues} from './utils';

// const tinycolor = require('tinycolor2');
import * as ChangeCase from 'change-case';
import {titleCase} from 'title-case';
import {swapCase} from 'swap-case';
import {isLowerCase} from 'is-lower-case';
import {isUpperCase} from 'is-upper-case';
import lowerCase from 'lower-case';
import {lowerCaseFirst} from 'lower-case-first';
import upperCase from 'upper-case';
import {upperCaseFirst} from 'upper-case-first';
import {spongeCase} from 'sponge-case';

import {lodash} from './packages';

import {useCssVars, useRouters} from './composables';


const install = (app, {prefix, loadComponents = true} = {}) => {
  if (loadComponents) {
    for (let key in components) {
      let _key = prefix ? prefix + key : key;
      app.component(_key, components[key]);
    }
  }

  import('./public/icons/svg/icons.css');

  Object.keys(lodash).forEach(k => {
    app.config.globalProperties[k] = lodash[k];
    app.provide(k, lodash[k]);
  });

  let changeCase = {
    ...ChangeCase,
    titleCase,
    swapCase,
    isLowerCase,
    isUpperCase,
    lowerCase,
    lowerCaseFirst,
    upperCase,
    upperCaseFirst,
    spongeCase,
  };
  app.config.globalProperties.$changeCase = changeCase;
  app.provide('$changeCase', changeCase);

  app.config.globalProperties.$enumValues = enumValues;
  app.provide('$enumValues', enumValues);

  app.mixin({
    setup() {
      return {
        ...useCssVars(),
        ...useRouters(),
      };
    },
    data() {
      return {
        $windowWidth: typeof window !== 'undefined' ? window.outerWidth : 0,
        $windowHeight: typeof window !== 'undefined' ? window.outerHeight : 0,
        $scrollY: typeof window !== 'undefined' ? window.scrollY : 0,
      };
    },
    created() {
      this.$q.iconMapFn = (iconName) => {
        if (iconName.startsWith('sp:') === true) {
          const name = iconName.substring(3);

          return {
            cls: 'icon-' + name,
          };
        }
      };
    },
    mounted() {
      window.addEventListener('resize', () => {
        this.$data.$windowWidth = window.outerWidth;
        this.$data.$windowHeight = window.outerHeight;
      });
      window.addEventListener('scroll', () => {
        this.$data.$scrollY = window.scrollY;
      });
    },
    methods: {
      $isLoading(val, options = {}) {
        if (val) {
          this.$q.loading.show({...options});
        } else {
          this.$q.loading.hide();
        }
      },
      $searchExactMatch(item_list, search_query, keys_list) {
        let self = this;
        let lowSearch = search_query.toLowerCase().trim();
        let keys = keys_list;
        if (!lowSearch) return item_list;

        return item_list.filter(function (item) {
          return keys.some(key =>
            String(self.$lget(item, key, '')).toLowerCase().includes(lowSearch),
          );
        });
      },
      $searchOrMatch(item_list, search_query, keys_list) {
        let self = this;
        if (!search_query) return item_list;

        let low_search_list = search_query.toLowerCase().trim().split(/[ ,]+/);
        let searchRegex = new RegExp(low_search_list.join('|'), 'g');
        let keys = keys_list;

        return item_list.filter(function (item) {
          return keys.some(key =>
            String(self.$lget(item, key, '')).toLowerCase().match(searchRegex),
          );
        });
      },
      $searchAndMatch(item_list, search_query, keys_list) {
        let self = this;
        if (!search_query) return item_list;

        let low_search_list = search_query.toLowerCase().trim().split(/[ ,]+/);
        let searchRegex = '(?=.*' + low_search_list.join(')(?=.*') + ')';
        let keys = keys_list;

        return item_list.filter(function (item) {
          return keys.some(key =>
            String(self.$lget(item, key, '')).toLowerCase().match(searchRegex),
          );
        });
      },
      $highlight(words, query, color = 'orange') {
        if (!query) return words;
        let low_search_list = query.toLowerCase().trim().split(/[ ,]+/);
        let iQuery = new RegExp(low_search_list.join('|'), 'ig');

        return words.toString().replace(iQuery, function (matchedTxt) {
          return (`<span style='background-color: ${color};'>` + matchedTxt + '</span>');
        });
      },
    },
  });
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {install};
