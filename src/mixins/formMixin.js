import {models} from '@feathersjs/vuex';
import { vCheck } from './ir-validate';

export default function(
  {
    service,
    servicePath,
    formFn,
    valuePath = 'value',
    formPath = 'form',
    saveEvent = 'input',
    successMessage = 'Saved!',
    errMessage = 'Error saving - ',
    vCheckForm = 'form',
    displayError = true,
    errNotify = true,
    addValueFn,
    validate,
    resetFormOnSave,
    paramsPath,
    savePath = 'save',
    validWatch,
    afterFn,
    log
  } = {}){

  let mixin = {
    mixins: [vCheck],
    data() {
      return {
        [formPath]: {},
        updateValidOnInput: validWatch
      };
    },

    watch: {
      [`${valuePath}`]: {
        immediate: true,
        handler(newVal){
          this.setForm(newVal);
          if(addValueFn){
            this[addValueFn]();
          }
        }
      }
    },
    computed: {
      vCheckForm(){
        return this.form;
      },
      formMixinModelName(){
       let service =typeof this.formMixinService === 'function'? this.formMixinService(): this.formMixinService;
        // console.log(service);
        return models.api.byServicePath[service].modelName;
      },
      formMixinService(){
        if(servicePath){
          return this[servicePath] || service;
        } else return service;
      }
    },
    methods: {
      setForm(val = {}){
        const modelFn = val => {
          return new models.api[this.formMixinModelName](val).clone();
        };
        let fn = formFn ? formFn : modelFn;
        this[formPath] = fn(val);
      },
      [savePath](){
        const save = () => {
          let params = this[paramsPath] || {};
          let service =typeof this.formMixinService === 'function'? this.formMixinService(): this.formMixinService;
          // console.log(service);
          if(log) console.log('saving form', service, this[formPath], params);
          if(service) {
            this.$isLoading(true);
            return this[formPath].save(params)
              .then(res => {
                console.log('sa what');
                this.$isLoading(false);
                this.$emit(saveEvent, res);
                this.$successNotify(successMessage);
                if(log) console.log('saved form', res);
                if(afterFn) this[`${afterFn}`](res);
                if (resetFormOnSave) this.setForm();
                return res.clone();
              })
              .catch(err => {
                this.$isLoading(false);
                if(errNotify) this.$errNotify(errMessage + displayError ? err.message : '');
                console.error(errMessage + displayError ? err.message : '');
                return undefined;
              });
          } else this.$emit(saveEvent, this.form);
        };
        if(validate){
          const errors = this.$vCheck(this[vCheckForm]);
          if (errors && errors.length) {
            errors.forEach(err => {
              this.$vErrNotify(err);
            });
          } else {
            return save();
          }
        } else return save();
      }
    }
  };
  return mixin;
};
