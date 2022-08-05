<template>
  <nav id="tabNavbar"
       ref="tabNavbar"
       :style="{
          ...positionStyles,
          '--nav-z-index': navZindex,
          transition: 'all 1s',
        }">
    <ul>
      <template v-for="(link, index) in links">
        <router-link v-if="link.to"
                     :key="index"
                     :to="link.to"
                     :style="{...varStyles, ...getStyles(link)}"
                     v-slot="{ href, navigate, isActive, isExactActive }">
          <template v-if="$q.platform.is.mobile">
            <li
              :class="[isActive && 'router-link-active-li', isExactActive && 'router-link-exact-active-li', 'li-direction']">

              <q-icon v-if="link.icon"
                      :name="link.icon"
                      :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active', 'icon']"></q-icon>
              <q-avatar v-else-if="link.img"
                        :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active', 'img']"
                        :style="{display: 'inline-table'}">
                <img :src="link.img"/>
              </q-avatar>
              <q-avatar v-else
                        :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active', 'icon']"
                        :style="{display: 'inline-table'}">
                <span v-if="!no_num_icons">{{ index + 1 }}</span>
              </q-avatar>

              <a :href="href" @click="navigate" style="display: inline-block;">
                {{ link.label }}
              </a>
            </li>
          </template>

          <template v-else>
            <li @click="navigate"
                :class="[isActive && 'router-link-active-li', isExactActive && 'router-link-exact-active-li', 'li-direction', 'cursor-pointer']">
              <a :href="href" class="li-direction">
                <q-icon v-if="link.icon"
                        :name="link.icon"
                        :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active', 'icon']"></q-icon>
                <q-avatar v-else-if="link.img"
                          :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active', 'img']"
                          :style="{display: 'inline-table'}">
                  <img :src="link.img"/>
                </q-avatar>
                <q-avatar v-else
                          :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active', 'icon']"
                          :style="{display: 'inline-table'}">
                  <span v-if="!no_num_icons">{{ index + 1 }}</span>
                </q-avatar>
                {{ link.label }}
              </a>
            </li>
          </template>
        </router-link>
        <template v-else>
          <template v-if="$q.platform.is.mobile">
            <li :key="index" class="li-direction" :style="{...varStyles, ...getStyles(link)}">
              <q-icon v-if="link.icon"
                      :name="link.icon"
                      class="icon"></q-icon>
              <q-avatar v-else-if="link.img"
                        class="img"
                        :style="{display: 'inline-table'}">
                <img :src="link.img"/>
              </q-avatar>
              <q-avatar v-else class="icon" :style="{display: 'inline-table'}">
                <span v-if="!no_num_icons">{{ index + 1 }}</span>
              </q-avatar>

              <a :href="link.href" style="display: inline-block;">
                {{ link.label }}
              </a>
            </li>
          </template>

          <template v-else>
            <li :key="index" class="li-direction cursor-pointer" @click="handleHref(link)"
                :style="{...varStyles, ...getStyles(link)}">
              <a :href="link.href" class="li-direction">
                <q-icon v-if="link.icon" :name="link.icon" class="icon"></q-icon>
                <q-avatar v-else-if="link.img"
                          class="img"
                          :style="{display: 'inline-table'}">
                  <img :src="link.img"/>
                </q-avatar>
                <q-avatar v-else class="icon" :style="{display: 'inline-table'}">
                  <span v-if="!no_num_icons">{{ index + 1 }}</span>
                </q-avatar>
                {{ link.label }}
              </a>
            </li>
          </template>
        </template>
      </template>
    </ul>
  </nav>
</template>

<script>
  // https://codepen.io/HighFlyer/pen/BQdxgZ?editors=1100

  export default {
    name: 'tabNavbar',
    props: {
      value: {
        type: Boolean,
        default: true,
      },
      container: {
        type: Boolean,
        default: false,
      },
      navZindex: {
        type: Number,
        default: 2000,
      },
      position: {
        type: String,
        default: 'top-right',
        validator: (value) => {
          return ['top-right', 'top-left', 'bottom-right', 'bottom-left'].includes(value);
        },
      },
      position_offset: {
        type: Number,
      },
      no_num_icons: {
        type: Boolean,
        default: false,
      },
      icon_colors: {
        type: String,
        default: '#000000',
      },
      icon_colors_hover: {
        type: String,
        default: '#ffffff',
      },
      icon_color_backgrounds: {
        type: String,
        default: '#ffffff',
      },
      icon_color_backgrounds_hover: {
        type: String,
        default: 'rgba(0, 0, 0, 0.7)',
      },
      links: {
        type: Array,
        default() {
          return [
            {
              label: 'Twitter longer link text',
              icon: 'fab fa-twitter',
              to: {name: 'boards'},
            },
            {
              label: 'Github',
              icon: 'fab fa-github',
              to: {name: 'home'},
            },
            {
              label: 'Linkedin',
              // icon: 'fab fa-linkedin-in',
              img: 'https://cdn.quasar.dev/img/avatar.png',
              href: '#',
            },
            {
              label: 'Linkedin',
              href: '#',
            },
          ];
        },
      },
    },
    data() {
      return {};
    },
    mounted() {
      this.$watch('container', (newVal, oldVal) => {
        if (newVal && newVal !== oldVal) {
          let el = this.$refs['tabNavbar'];
          el.style.position = 'absolute';
          let parent = el.parentNode;
          parent.style.position = 'relative';
          parent.style.overflow = 'auto';
        }
      }, {
        immediate: true,
      });
    },
    computed: {
      positionStyles() {
        switch (this.position) {
          case 'bottom-right': {
            return {
              right: 0,
              bottom: `${this.$lget(this, 'position_offset', '75')}px`,
              '--position-transform': 'translate(260px, 0)',
              '--position-transform--hover': 'translate(-185px, 0)',
              '--position-li-border-radius': '30px 0px 0px 30px',
              '--position-li-text-align': 'left',
              '--position-icon-margin': '0 5px 0 0',
              '--position-li-direction': 'row',
              width: !this.value ? '250px' : '310px',
            };
          }
          case 'bottom-left': {
            return {
              left: 0,
              bottom: `${this.$lget(this, 'position_offset', '75')}px`,
              '--position-transform': 'translate(-260px, 0)',
              '--position-transform--hover': 'translate(185px, 0)',
              '--position-li-border-radius': '0 30px 30px 0',
              '--position-li-text-align': 'right',
              '--position-icon-margin': '0 0 0 5px',
              '--position-li-direction': 'row-reverse',
              width: !this.value ? '250px' : '310px',
            };
          }
          case 'top-left': {
            return {
              left: 0,
              top: `${this.$lget(this, 'position_offset', '50')}px`,
              '--position-transform': 'translate(-260px, 0)',
              '--position-transform--hover': 'translate(185px, 0)',
              '--position-li-border-radius': '0 30px 30px 0',
              '--position-li-text-align': 'right',
              '--position-icon-margin': '0 0 0 5px',
              '--position-li-direction': 'row-reverse',
              width: !this.value ? '250px' : '310px',
            };
          }
          default: { // top-right
            return {
              right: 0,
              top: `${this.$lget(this, 'position_offset', '50')}px`,
              '--position-transform': 'translate(260px, 0)',
              '--position-transform--hover': 'translate(-185px, 0)',
              '--position-li-border-radius': '30px 0px 0px 30px',
              '--position-li-text-align': 'left',
              '--position-icon-margin': '0 5px 0 0',
              '--position-li-direction': 'row',
              width: !this.value ? '250px' : '310px',
            };
          }
        }
      },
      varStyles() {
        return JSON.parse(JSON.stringify({
          '--icon-color': this.icon_colors,
          '--icon-color--hover': this.icon_colors_hover,

          '--icon-background': this.icon_color_backgrounds,
          '--icon-background--hover': this.icon_color_backgrounds_hover,
        }));
      },
    },
    methods: {
      getStyles(link) {
        return JSON.parse(JSON.stringify({
          '--icon-color': this.$lget(link, 'icon_color', undefined),
          '--icon-color--hover': this.$lget(link, 'icon_color_hover', undefined),

          '--icon-background': this.$lget(link, 'icon_color_background', undefined),
          '--icon-background--hover': this.$lget(link, 'icon_color_background_hover', undefined),
        }));
      },
      handleHref(link) {
        window.location.href = link.href;
      }
    },
  };
</script>

<style scoped lang="scss" src="./_tabNavbar.scss">

</style>
