<template>
  <div id="cornerDetailsCard" :style="{...cssVars}">
    <q-dialog v-model="imgDialog">
      <q-card :style="`width: ${$data.$windowWidth <= 800 ? '100%' : '50%'};`">
        <q-img :src="src || testCompanyImages[Math.floor(Math.random()*testCompanyImages.length)]"></q-img>
        <q-btn round
               color="black"
               style="position: absolute; top: 0.5rem; right: 1rem;"
               @click="imgDialog = false">
          <q-icon name="close"></q-icon>
        </q-btn>
      </q-card>
    </q-dialog>

    <q-card class="wrapper" :style="`width: ${width}; height: ${height};`">
      <div class="container">
        <q-img :src="src || testCompanyImages[Math.floor(Math.random()*testCompanyImages.length)]"
               ratio="1"
               position="50% 50%"
               class="text-white"
               :style="`height: calc(100% - ${bottomHeight}px); background-color: black;`"
               @click="imgDialog = true">
          <slot name="image-text" :handleAddOrRemove="handleAddOrRemove">
            <div class="absolute-bottom">
              <div class="text-h5">Our Changing Planet</div>
              <div class="text-subtitle2">by John Doe</div>
            </div>
          </slot>
        </q-img>

        <div :class="{bottom: true, clicked: addClicked}">
          <div class="left">
            <div class="details" style="display: flex; align-items: center;">
              <slot name="left-details" :handleAddOrRemove="handleAddOrRemove">
                <h2 class="q-ma-none text-green" v-text="'$12'"></h2>
              </slot>
            </div>

            <div class="add" @click="handleAddOrRemove(true)">
              <slot name="add-icon" :handleAddOrRemove="handleAddOrRemove">
                <q-icon size="30" :color="'#212121'" name="fas fa-cart-plus"></q-icon>
              </slot>
            </div>
          </div>

          <div class="right">
            <div class="done">
              <slot name="done-icon" :handleAddOrRemove="handleAddOrRemove">
                <q-icon size="30" name="done"></q-icon>
              </slot>
            </div>

            <div class="details">
              <slot name="right-details" :handleAddOrRemove="handleAddOrRemove">
                <h2 class="q-ma-none text-green" v-text="'$12'"></h2>
                <p>Added to your cart</p>
              </slot>
            </div>

            <div class="remove" @click="handleAddOrRemove(false)">
              <slot name="remove-icon" :handleAddOrRemove="handleAddOrRemove">
                <q-icon size="30" name="clear"></q-icon>
              </slot>
            </div>
          </div>
        </div>
      </div>
      <div class="inside">
        <div class="icon">
          <slot name="info-icon" :handleAddOrRemove="handleAddOrRemove">
            <q-icon name="info_outline"></q-icon>
          </slot>
        </div>
        <div class="contents">
          <slot :handleAddOrRemove="handleAddOrRemove"></slot>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script>
  export default {
    name: 'cornerDetailsCard',
    props: {
      src: {
        type: String,
        required: false,
      },
      width: {
        type: String,
        default: '280px',
      },
      height: {
        type: String,
        default: '492px',
      },
    },
    emits: [
      'add',
      'remove',
    ],
    data() {
      return {
        imgDialog: false,
        addClicked: false,
        testCompanyImages: [
          'https://assets3.thrillist.com/v1/image/2797371/size/tmg-article_default_mobile.jpg',
          'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/screen-shot-2019-08-29-at-9-38-54-am-1567085949.png?crop=1.00xw:0.801xh;0,0&resize=640:*',
          'https://assets3.thrillist.com/v1/image/2818802/size/tmg-article_default_mobile.jpg',
          'https://pbs.twimg.com/media/DDfmcf3XsAEoC4r.jpg:large',
          'https://cdn2.lamag.com/wp-content/uploads/sites/6/2017/01/Screen-Shot-2017-01-31-at-11.53.04-AM.png',
          'https://isthmus.com/downloads/57406/download/Food-review-crRyanWisniewski-10242019.jpg?cb=5b94c5b96753f04c68b43ea2c130587e',
          'https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/article_thumbnails/slideshows/best_and_worst_indian_dishes_for_your_health_slideshow/1800x1200_best_and_worst_indian_dishes_for_your_health_slideshow.jpg',
          'https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/low-carb-fast-foods-1296x728-feature.jpg?w=1155&h=1528',
          'https://i.ebayimg.com/images/g/mf8AAOSwB1VgjGwF/s-l1600.jpg',
        ],
        bottomHeight: 100,
      };
    },
    mounted() {
      // eslint-disable-next-line no-unused-vars
      this.$watch('$data.$windowWidth', (newVal) => {
        let bottomEl = document.querySelector('.bottom');

        if (bottomEl) {
          this.bottomHeight = bottomEl.offsetHeight;
        }
      }, {
        immediate: true,
      });
    },
    computed: {
      cssVars() {
        return {
          '--bottom-height': `${this.bottomHeight}px`,
        };
      },
    },
    methods: {
      handleAddOrRemove(value) {
        this.addClicked = value;
        value ? this.$emit('add') : this.$emit('remove');
      },
    },
  };
</script>

<style scoped lang="scss" src="./_cornerDetailsCard.scss">

</style>
