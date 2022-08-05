import {makeFindMixin} from '@feathersjs/vuex';

const $lcamelCase = require('lodash/camelCase');
const $lupperFirst = require('lodash/upperFirst');
const $lomitBy = require('lodash/omitBy');
const $lisNil = require('lodash/isNil');
const $lget = require('lodash/get');
const $lset = require('lodash/set');

export default function makeFindPaginateMixin(
  {
    limit = 10,
    skip = 0,
    query = {},
    params = {},
    infinite = false,
    advanced = false,
    service,
    name,
    qid = 'default',
    watch = true,
    makeFindMixinOptions = {},
  } = {}) {
  if (typeof service === 'function' && !name) name = 'service';
  const prefix = $lcamelCase(name || service);
  const capitalized = $lupperFirst($lcamelCase(name || service));

  makeFindMixinOptions = $lomitBy({
    service: service,
    name: name,
    qid: qid,
    watch: watch,
    ...makeFindMixinOptions,
  }, $lisNil);

  let mixin = {
    mixins: [makeFindMixin(makeFindMixinOptions)],
    data() {
      return {
        [`${prefix}Limit`]: limit,
        [`${prefix}Skip`]: skip,
      };
    },
    watch: {
      [`${prefix}Count`](newVal) {
        if (newVal) this[`${prefix}Refresh`]();
      },
      [`${prefix}Infinite`](newVal) {
        if (!newVal) this[`${prefix}Skip`] = skip;
      },
    },
    computed: {
      [`${prefix}Count`]() {
        return this.$store.getters[`${service}/count`] ? this.$store.getters[`${service}/count`]({query: {}}) : 0;
      },
      [`${prefix}Pages`]() {
        let prefixQid = this[`${prefix}Qid`];
        let mostRecent = $lget(this[`${prefix}PaginationData`], `${prefixQid}.mostRecent`);
        if (mostRecent) {
          return Math.ceil(mostRecent.total / this[`${prefix}Limit`]);
        } else {
          return 1;
        }
      },
      [`${prefix}CurrentPage`]: {
        get() {
          let prefixQid = this[`${prefix}Qid`];
          let mostRecent = $lget(this[`${prefix}PaginationData`], `${prefixQid}.mostRecent`);
          if (mostRecent) {
            return this[`${prefix}Skip`] >= mostRecent.total || this[`${prefix}`].length >= mostRecent.total ? 1 : this[`${prefix}Skip`] / this[`${prefix}Limit`] + 1;
          } else {
            return 1;
          }
        },
        set(page) {
          this[`${prefix}HandlePageChange`](page);
        },
      },
      [`${prefix}Params`]() {
        let params = {};
        if (this[`${prefix}Advanced`]) {
          let prefixQid = this[`${prefix}Qid`];
          let mostRecent = $lget(this[`${prefix}PaginationData`], `${prefixQid}.mostRecent`);
          if (mostRecent) {
            $lset(params, 'query._id', {
              $in: $lget(this[`${prefix}PaginationData`], [prefixQid, mostRecent.queryId, mostRecent.pageId, 'ids'], []),
            });
            if (this[`${prefix}Infinite`]) {
              let mostRecentQueries = $lget(this[`${prefix}PaginationData`], [prefixQid, mostRecent.queryId], {});
              let ids = Object.keys(mostRecentQueries).filter(key => !['total', 'queryParams'].includes(key)).reduce((acc, qkey) => {
                acc = acc.concat($lget(mostRecentQueries, [qkey, 'ids'], []));
                return acc;
              }, []);
              $lset(params, 'query._id', {
                $in: ids,
              });
            }
            let sort = $lget(this, `${prefix}QueryCust.$sort`);
            if (sort) {
              $lset(params, 'query.$sort', sort);
            }
          } else {
            if (!$lget(this[`${prefix}QueryParamsCust`], 'paginate', true)) {
              params = {
                query: {
                  ...this[`${prefix}QueryCust`],
                },
              };
            } else {
              params = undefined;
            }
          }
        } else {
          $lset(params, 'query', this[`${prefix}QueryCust`]);
          $lset(params, 'paginate', this[`${prefix}Advanced`]);
        }
        return params;
      },
      [`${prefix}FetchParams`]() {
        let fetchParams = {
          query: {
            ...this[`${prefix}QueryCust`],
          },
          ...this[`${prefix}QueryParamsCust`],
        };
        if ($lget(this[`${prefix}QueryParamsCust`], 'paginate', true)) {
          $lset(fetchParams, 'query.$limit', this[`${prefix}Limit`]);
          $lset(fetchParams, 'query.$skip', this[`${prefix}Skip`]);
        }
        return fetchParams;
      },
      [`${prefix}Total`]() {
        let prefixQid = this[`${prefix}Qid`];
        return $lget(this[`${prefix}PaginationData`], [prefixQid, 'mostRecent', 'total'], 0);
      },
      [`${prefix}Prefix`]() {
        return prefix;
      },
    },
    methods: {
      [`${prefix}HandlePageChange`](page) {
        // console.log('page', page);
        // console.log(this[`${prefix}Skip`] >= this[`${prefix}Total`] || this[`${prefix}`].length >= this[`${prefix}Total`]);
        if (this[`${prefix}Skip`] >= this[`${prefix}Total`] || this[`${prefix}`].length >= this[`${prefix}Total`]) {
          // console.log(this[`${prefix}Total`] < this[`${prefix}Limit`] ? 0 : this[`${prefix}Total`] - this[`${prefix}Limit`]);
          this[`${prefix}Skip`] = this[`${prefix}Total`] < this[`${prefix}Limit`] ? 0 : this[`${prefix}Total`] - this[`${prefix}Limit`];
        } else {
          // console.log(Math.max((page - 1), 0) * this[`${prefix}Limit`]);
          this[`${prefix}Skip`] = Math.max((page - 1), 0) * this[`${prefix}Limit`];
        }
        // this[`${prefix}Skip`] = this[`${prefix}Skip`] >= this[`${prefix}Total`] || this[`${prefix}`].length >= this[`${prefix}Total`] ? this[`${prefix}Total`] - this[`${prefix}Limit`] : Math.max((page - 1), 0) * this[`${prefix}Limit`];
        this.$emit('page', page);
      },
      [`${prefix}Refresh`]() {
        if (typeof this[`find${capitalized}`] === 'function') {
          let res = this[`find${capitalized}`]();
          if (res instanceof Promise) {
            return res
              .then(res => {
                console.log(`${prefix}Refresh res:`, res);
                return res;
              })
              .catch(err => {
                console.log(`${prefix}Refresh err:`, err);
                return err;
              });
          } else {
            return res;
          }
        }
      },
    },
  };

  mixin.computed[`${prefix}QueryCust`] = typeof query === 'function' ? query : () => query;
  mixin.computed[`${prefix}QueryParamsCust`] = typeof params === 'function' ? params : () => params;
  mixin.computed[`${prefix}Infinite`] = typeof infinite === 'function' ? infinite : () => infinite;
  mixin.computed[`${prefix}Advanced`] = typeof advanced === 'function' ? advanced : () => advanced;

  return mixin;
}
