export default function idGet(
  {
    service,
    valuePath = 'value',
    idPath = '_id',
    name = 'item',
    routeParamsPath,
    routeQueryPath,
    alwaysLoad,
    refresh,
    paramsAdders = {},
    loadOnlyIf = true
  } = {}) {

  let mixin = {
    data() {
      return {
        [`${name}Refreshed`]: false,
        [`${name}Initialized`]: false,
      };
    },
    watch: {
      [`${name}Id`]: {
        immediate: true,
        handler(newVal, oldVal) {
          this.$nextTick(() => {
            if (this[`${name}Service`] && newVal && (JSON.stringify(newVal) !== JSON.stringify(oldVal))) {
              if ((this[`${name}RefreshCheck`] || !this.$lget(this[`${name}`], '_id')) && (!this[`${name}SkipInit`] || this[`${name}Initialized`])) {
                // console.log(`saw new ${this.useService}`, newVal, oldVal);
                this[`${name}LoadOnce`]();
                this[`${name}Initialized`] = true;
              }
            }
          });
        },
      },
    },
    computed: {
      [`${name}Service`]() {
        return this[`${name}ServiceFn`];
      },
      [`${name}Id`]() {
        let id;
        if(routeParamsPath) id = this.$route.params[routeParamsPath];
        else if(routeQueryPath) id = this.$route.query[routeQueryPath];
        if(!id) return this.$lget(
          this[`${valuePath}`],
          idPath, this[`${valuePath}`] && typeof this[`${valuePath}`] !== 'object' ? this[`${valuePath}`] : undefined);
        else return id;
      },
      [`${name}`]() {
        if (this.$lget(this[`${valuePath}`], idPath) && !(alwaysLoad || this[`${name}Refreshed`])) return this[`${valuePath}`];
        else if (this[`${name}Service`]) {
          let id = this[`${name}Id`];
          if (id) return this.$store.getters[`${this[`${name}Service`]}/get`](id);
          else return alwaysLoad ? undefined : this[`${valuePath}`];
        } else return alwaysLoad ? undefined : this[`${valuePath}`];
      }
    },
    methods: {
      [`${name}LoadOnce`]() {
        if (this[`${name}LoadCheck`]) {
          let id = this[`${name}Id`];
          if (!id) id = this.$lget(this[`${name}`], '_id');
          this.$store.dispatch(`${this[`${name}Service`]}/get`, [id, this[`${name}Params`]])
            .then(r => {
              console.log(r);
            });
        }
      },
      [`${name}Refresh`]() {
        this[`${name}LoadOnce`]();
        this[`${name}Refreshed`] = true;
      },
    },
  };
  mixin.computed[`${name}LoadCheck`] = typeof loadOnlyIf === 'function' ? loadOnlyIf : () => loadOnlyIf;
  mixin.computed[`${name}RefreshCheck`] = typeof refresh === 'function' ? refresh : () => refresh;
  mixin.computed[`${name}Params`] = typeof paramsAdders === 'function' ? paramsAdders : () => paramsAdders;
  mixin.computed[`${name}ServiceFn`] = typeof service === 'function' ? service : () => service;

  return mixin;
}
