export default function queryMixin(
  {
    name = '$query',
    query,
    filterName = 'name',
    useTagPath = 'tags',
    tagSearch,
    starter = { _id: { $in: [] } },
    search,
    // eslint-disable-next-line no-unused-vars
    log
  } = {}) {
  let mixin = {
    data() {
      return {
        [`${name}Static`]: { starter }
      };
    },
    watch: {
      [`${name}`]: {
        immediate: true,
        deep: true,
        handler(newVal, oldVal) {
          let JN = JSON.stringify(newVal);
          let JO = JSON.stringify(oldVal);
          if (log) console.log('saw change in query', newVal);
          if (newVal && !this.$lisEqual(JN, JO)) {
            if (log) console.log('query test passed', newVal);
            this[`${name}Static`] = Object.assign({}, newVal);
          } else if (!newVal) this[`${name}Static`] = starter;
        }
      }
    },
    computed: {
      [`${name}Search`]() {
        return this[`${name}SearchFn`];
      },
      [`${name}Name`]() {
        return this[`${name}NameFn`];
      },
      [`${name}Query`]() {
        return this[`${name}QueryFn`];
      },
      [`${name}FilterName`]() {
        return this[`${name}FilterNameFn`];
      },
      [`${name}TagSearch`]() {
        return this[`${name}TagSearchFn`];
      },
      [`${name}UseTagPath`]() {
        return [`${name}UseTagPathFn`];
      },
      [`${name}`]() {
        let q = this[`${name}Query`] ? Object.assign({}, this[`${name}Query`]) : {};
        let text = this[`${name}Search`];
        // console.log('text calc', text);
        if (text && typeof (text) === 'string' && text.length) {
          let nameSearch = {
            $regex: new RegExp(text),
            $options: 'igm',
          };
          let fName = this[`${name}FilterName`];
          if (this[`${name}TagSearch`]) {
            let nameObj = {};
            nameObj[fName] = nameSearch;
            let tagObj = {};
            let patternExp = new RegExp(text, 'igm');
            tagObj[useTagPath] = { $in: [patternExp] };
            if (q.$or) {
              q.$or.push(nameObj);
              q.$or.push(tagObj);
            } else q.$or = [nameObj, tagObj];
          } else {
            q[fName] = nameSearch;
          }
        } else if (q && q.name) delete q.name;
        return q;
      }
    }
  };
  mixin.computed[`${name}SearchFn`] = typeof search === 'function' ? search : () => search;
  mixin.computed[`${name}NameFn`] = typeof name === 'function' ? name : () => name;
  mixin.computed[`${name}QueryFn`] = typeof query === 'function' ? query : () => query;
  mixin.computed[`${name}FilterNameFn`] = typeof filterName === 'function' ? filterName : () => filterName;
  mixin.computed[`${name}TagSearchFn`] = typeof tagSearch === 'function' ? tagSearch : () => tagSearch;
  mixin.computed[`${name}UseTagPathFn`] = typeof useTagPath === 'function' ? useTagPath : () => useTagPath;
  return mixin;
};
