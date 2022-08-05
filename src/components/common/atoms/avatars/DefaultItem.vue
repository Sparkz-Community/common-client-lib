<template>
  <q-item :clickable="clickable" @click="$emit('input', val)" style="width: 100%;">
    <q-item-section avatar v-show="!hideAvatar">
      <slot name="avatar" :item="val">
        <default-avatar
          :value="val"
          :descriptionPath="descriptionPath"
          :defaultAvatar="defaultAvatar"
          :square="square"
          :namePath="namePath"
          :defaultCharacter="defaultCharacter"
          :backupNamePath="backupNamePath"
          :icon="icon"
          :avatarPath="avatarPath"
          :dark="dark"
          :sizeIn="sizeIn"
          :bgIn="bgIn"
          :bordered="bordered"
        ></default-avatar>
      </slot>
    </q-item-section>
    <q-item-section>
      <q-item-label :class="titleClass">
        {{ $lget(val, namePath, defaultName) }}
      </q-item-label>
      <q-item-label :class="subtitleClass" caption>
        {{ $limitStr($lget(val, descriptionPath, defaultDescription), 200, '...') }}
      </q-item-label>
      <slot name="bottom" :item="val"></slot>
    </q-item-section>
    <q-item-section side>
      <slot name="side" :item="val"></slot>
    </q-item-section>
    <slot name="menu" :item="val"></slot>
  </q-item>
</template>

<script>
  import DefaultAvatar from './DefaultAvatar';

  export default {
    name: 'DefaultItem',
    components: { DefaultAvatar },
    props: {
      clickable: { type: Boolean, default: true },
      titleClass: { type: String, default: 'text-xxs text-mb-xxs text-weight-bold' },
      subtitleClass: { type: String, default: 'text-xxs text-mb-xxs' },
      hideAvatar: Boolean,
      value: { required: true },
      descriptionPath: { type: String, default: 'description' },
      defaultAvatar: String,
      square: Boolean,
      namePath: {
        type: String,
        default: 'name'
      },
      defaultName: String,
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
    watch: {
      valId: {
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal && (newVal !== oldVal) && this.service && (newVal !== this.$lget(this.val, '_id'))) {
            this.$store.dispatch(`${this.service}/get`, newVal);
          }
        }
      }
    },
    computed: {
      character() {
        let p = this.$lget(this.val, this.namePath, this.$lget(this.val, this.backupNamePath));
        if (p) return p.charAt(0);
        else return this.defaultCharacter;
      },
      valId() {
        return this.$lget(this.value, '_id', this.value);
      },
      val() {
        if (!this.service) return this.value;
        else {
          if (this.valId) {
            let v = this.$store.getters[`${this.service}/get`](this.valId);
            if (v) return v;
            else return null;
          } else return null;
        }
      }
    }
  };
</script>

<style scoped>

</style>
