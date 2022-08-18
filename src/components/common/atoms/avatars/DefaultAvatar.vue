<template>
  <q-avatar
    :size="sizeIn"
    :class="`${avatar && !bgIn ? 'bg-transparent' : dark ? bgIn ? 'bg-' + bgIn + ' text-dark' : 'bg-light' + ' text-dark' : bgIn ? 'bg-' + bgIn + ' text-light' : 'bg-dark' + ' text-light'}`"
    :style="attrs.divStyle"
  >
    <template v-if="!$lisEmpty(avatar)" >
      <img :style="attrs.imageStyle" :src="avatar">
    </template>
    <template v-else-if="icon">
      <span>
      <q-icon :name="icon" :size="(parseFloat(sizeIn ? sizeIn : 60) / 1.5) + 'px'" :color="dark ? 'light' : ''"></q-icon>
      </span>
    </template>
    <template v-else>
      <span :class="`text-${dark ? 'dark' : 'white' }`">{{ character }}</span>
    </template>
    <slot name="menu" :item="val"></slot>
  </q-avatar>
</template>

<script>
  import idGet from '../../../../mixins/idGet';

  export default {
    name: 'DefaultAvatar',
    mixins: [
      idGet({
        service(){
          return this.service;
        },
        name: 'val',

      })
    ],
    props: {
      defaultAvatar: String,
      square: Boolean,
      namePath: {
        type: String,
        default: 'name'
      },
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
      modelValue: { required: true },
      bgIn: String,
      bordered: Boolean
    },
    watch: {},
    computed: {
      attrs() {
        let newVal = {...this.$attrs};
        // div-style defaults
        this.$lset(newVal, 'attrs.divStyle.borderRadius', this.$lget(newVal, 'attrs.divStyle.borderRadius', this.square ? '4px' : ''));
        this.$lset(newVal, 'attrs.divStyle.boxShadow', this.$lget(newVal, 'attrs.divStyle.boxShadow', this.bordered ? `0 0 0 3px ${this.bgIn ? 'var(--q-color-' + this.bgIn + ')' : this.dark ? '#fafafa' : '#101010'}` : 'none'));

        // image-style defaults
        this.$lset(newVal, 'attrs.imageStyle.objectFit', this.$lget(newVal, 'attrs.imageStyle.objectFit', 'cover'));

        return newVal;
      },

      character(){
        let p = this.$lget(this.val, this.namePath, this.$lget(this.val, this.backupNamePath));
        if(p) return p.charAt(0);
        else return this.defaultCharacter;
      },
      avatar(){
        if(Array.isArray(this.$lget(this.val, this.avatarPath))){
          return this.getAvatar(this.val,  this.avatarPath, 'small', 0, this.defaultAvatar);
        } else {
          return this.getAvatar(this.val, this.avatarPath, 'small', null, this.defaultAvatar);
        }
      }
    }
  };
</script>
