<template>
  <q-chip class="chip_class" clickable @click="$emit('update:modelValue', modelValue)" v-bind="{dark: dark, ...chipAttrs}" @remove="$emit('remove', modelValue)">
    <slot name="avatar">
    <default-avatar
      v-show="!hideAvatar"
      :model-value="val"
      :descriptionPath="descriptionPath"
      :defaultAvatar="defaultAvatar"
      :square="square"
      :namePath="namePath"
      :defaultCharacter="character"
      :backupNamePath="backupNamePath"
      :icon="icon"
      :avatarPath="avatarPath"
      :dark="dark"
      :sizeIn="sizeIn"
      :bgIn="bgIn"
      :bordered="bordered"
    >
    </default-avatar>
    </slot>

    {{prefix}}{{ $lget(val, namePath, defaultName) }}

    <slot name="right"></slot>

    <slot name="menu" :item="val"></slot>
    <q-tooltip v-if="tooltip">{{ $lget(val, namePath, defaultName) }}</q-tooltip>
  </q-chip>
</template>

<script>
  import DefaultAvatar from './DefaultAvatar';
  import idGet from '../../../../mixins/idGet';

  export default {
    name: 'DefaultChip',
    components: { DefaultAvatar },
    mixins: [idGet({
      name: 'val',
      service(){
        return this.service;
      }
    })],
    props: {
      prefix: { type: String, default: ''},
      tooltip: Boolean,
      hideAvatar: Boolean,
      defaultName: String,
      chipAttrs: Object,
      modelValue: { required: true },
      descriptionPath: { type: String, default: 'description' },
      defaultAvatar: String,
      square: Boolean,
      namePath: {
        type: String,
        default: 'name'
      },
      defaultDescription: String,
      defaultCharacter: String,
      backupNamePath: {
        type: String,
        default: 'username'
      },
      icon: String,
      avatarPath: {
        type: String,
        default: 'avatar'
      },
      service: String,
      dark: Boolean,
      sizeIn: String,
      bgIn: String,
      bordered: Boolean
    },
    emits: [
      'update:modelValue',
      'remove',
    ],
    watch: {

    },
    computed: {
      character() {
        let p = this.$lget(this.val, this.namePath, this.$lget(this.val, this.backupNamePath));
        if (p) return p.charAt(0);
        else if(this.defaultName) return this.defaultName.charAt(0);
        else return this.defaultCharacter;
      }
    }
  };
</script>

<style scoped lang="scss">
  .chip_class {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
