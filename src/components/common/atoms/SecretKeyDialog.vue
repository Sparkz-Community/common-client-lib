<template>
  <q-dialog v-bind="attrs" seamless position="top" persistent transition-show="scale"
            transition-hide="scale">
    <q-card style="width: 350px">
      <q-linear-progress :value="1" color="primary"/>

      <q-card-section class="row items-center no-wrap">
        <div>
          <div class="text-weight-bold">Secret Key</div>
          <div class="text-grey text-bold text-sm ">{{ secretKey }}</div>
        </div>

        <q-space/>
        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
          <strong>Tooltip</strong> on <em>top</em>
          (
          <q-icon name="keyboard_arrow_up"/>
          )
        </q-tooltip>
        <q-btn
          flat
          size="sm"
          @click="copy"
          icon="fas fa-copy"
          color="dark"
          :label="copied?'copied':'copy'"
        >
        </q-btn>
        <q-btn flat round icon="close" v-close-popup @click="close"/>
      </q-card-section>
      <q-card-section>
        <span
          class="text-caption">Copy and keep it secure. Once you close this form, you won't see it ever again!</span>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
  import {copyToClipboard} from 'quasar';

  export default {
    name: 'secret-key-dialog',
    props: {
      secretKey: String,
    },
    emits: ['close'],
    data() {
      return {
        copied: false,
      };
    },
    computed: {
      attrs () {
        let newVal = {...this.$attrs};
        // attrs defaults
        this.$lset(newVal, 'attrs.seamless', this.$lget(newVal, 'attrs.seamless', true));
        this.$lset(newVal, 'attrs.position', this.$lget(newVal, 'attrs.position', 'top'));
        this.$lset(newVal, 'attrs.persistent', this.$lget(newVal, 'attrs.persistent', true));
        this.$lset(newVal, 'attrs.transition-show', this.$lget(newVal, 'attrs.transition-show', 'scale'));
        this.$lset(newVal, 'attrs.transition-hide', this.$lget(newVal, 'attrs.transition-hide', 'scale'));
        return newVal;
      }
    },
    methods: {
      copy() {
        copyToClipboard(this.secretKey)
          .then(() => {
            // success!
            this.copied = true;
          })
          .catch((error) => {
            // fail
            this.copied = false;
            this.$q.notify({
              type: 'negative',
              message: error.message,
              timeout: 30000,
              actions: [
                {
                  icon: 'close', color: 'white', handler: () => {
                    /* ... */
                  },
                },
              ],
            });
          });
      },
      close() {
        this.copied = false;
        this.$emit('close');
      }
    },
  };
</script>
