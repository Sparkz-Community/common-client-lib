<template>
  <q-dialog v-bind="{...positions[setting].dialog, ...dialogAttrs }" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card v-bind="{...positions[setting].card, ...cardAttrs }">

      <slot name="default">
        <q-btn class="t-r-f bg-dark text-light" size="sm" dense icon="mdi-close" @click="close()"/>
      </slot>
    </q-card>
  </q-dialog>
</template>

<script>
  export default {
    name: 'CommonDialog',
    props: {
      modelValue: Boolean,
      cardAttrs: {
        type: Object
      },
      dialogAttrs: {
        type: Object
      },
      setting: { type: String, default: 'standard' }
    },
    emits: [
      'update:modelValue',
      'close',
    ],
    computed: {
      positions() {
        return {
          standard: {
            dialog: {
              maximized: this.$q.screen.lt.sm,
              transitionShow: 'slide-up',
              transitionHide: 'slide-down'
            },
            card: {
              style: {
                width: '700px',
                maxWidth: '100%'
              },
              class: 'q-pa-md'
            }
          },
          right: {
            dialog: {
              position: 'right',
              maximized: this.$q.screen.lt.sm,
              transitionShow: 'slide-left',
              transitionHide: 'slide-right'
            },
            card: {
              style: {
                width: '700px',
                maxWidth: '100%',
                height: '100vh'
              },
              class: 'q-pa-md'
            }
          },
          left: {
            dialog: {
              position: 'left',
              maximized: this.$q.screen.lt.sm,
              transitionShow: 'slide-right',
              transitionHide: 'slide-left'
            },
            card: {
              style: {
                width: '700px',
                maxWidth: '100%',
                height: '100vh'
              },
              class: 'q-pa-md'
            }
          },
          small: {
            dialog: {},
            card: {
              style: {
                width: '400px',
                maxWidth: '100%'
              },
              class: 'q-pa-sm'
            }
          },
          full: {
            dialog: {
              maximized: true,
              transitionShow: 'slide-up',
              transitionHide: 'slide-down'
            },
            card: {
              height: '100vh',
              width: '100vw'
            }
          },
          message: {
            dialog: {
              maximized: true,
              position: 'bottom',
              transitionShow: 'slide-up',
              transitionHide: 'slide-down'
            },
            card: {
              height: '40vh',
              width: '100vw'
            }
          }
        };
      }
    },
    methods: {
      close() {
        this.$emit('update:modelValue', false);
        this.$emit('close');
      }
    }
  };
</script>

<style scoped>

</style>
