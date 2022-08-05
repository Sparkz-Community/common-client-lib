<template>
  <q-page class="flex flex-center">
    <div style="border: 1px solid black; width: 500px; height: 500px;">
      <q-btn icon="menu" @click="toggle_nav = !toggle_nav"></q-btn>

      <tab-navbar v-model="toggle_nav" :links="links" icon_colors="var(--q-color-secondary)"
                  icon_colors_hover="var(--q-color-primary)" position="bottom-right" container :navZindex="1999" :position_offset="70"></tab-navbar>
    </div>
  </q-page>
</template>

<script>
  // import TabNavbar from '../../../src/components/tabNavbar/tabNavbar';

  export default {
    name: 'testTabNavbar',
    // components: {
    //   TabNavbar,
    // },
    data() {
      return {
        toggle_nav: true,
        links: [
          {
            label: 'Twitter',
            icon: 'fab fa-twitter',
            icon_color: 'var(--q-color-accent)',
            icon_color_hover: 'var(--q-color-secondary)',
            to: {name: 'boards'},
          },
          {
            label: 'Github',
            icon: 'fab fa-github',
            icon_color_background: 'var(--q-color-accent)',
            to: {name: 'home'},
          },
          {
            label: 'Linkedin',
            icon: 'fab fa-linkedin-in',
            href: '#',
          },
          {
            label: 'Linkedin',
            href: '#',
          },
        ],
      };
    },
  };
</script>

<style scoped>

</style>
