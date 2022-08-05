<template>
  <q-page>
    <div id="swiper-demo">
      <swiper @swiper="onSwiper"
              @slideChange="onSlideChange"
              style="width: 400px;"
      >
        <swiper-slide v-for="(image, index) in images" :key="index">
          <!--            <zoomie type="circle" :scale="scale" :url="image" :high-url="image"></zoomie>-->
          <zoomie type="circle"
                              :high-url="image"
                              :scale="scale"
          >
            <img :src="image"
                 style="max-width: 100%; max-height: 100%; margin: auto; display: block;"
            />
          </zoomie>
        </swiper-slide>
      </swiper>
    </div>
  </q-page>
</template>

<script>
  import {Swiper, SwiperSlide} from 'vue-awesome-swiper';
  import 'swiper/css/swiper.css';

  export default {
    components: {
      Zoomie: () => import('@iy4u/common-client-lib').then(module => module.Zoomie),
      Swiper,
      SwiperSlide,
    },
    name: 'ZoomieSwiper',
    data() {
      return {
        scale: 2,
        images: [
          require('./tiger-1.jpeg'),
          require('./tiger-2.jpeg'),
          require('./tiger-3.jpeg'),
          require('./tiger-4.webp'),
        ],
      };
    },
    mounted() {
    },
    methods: {
      onSwiper(swiper) {
        console.log(swiper);
      },
      onSlideChange() {
        console.log('slide change');
      },
    },
  };
</script>

<style scoped lang="scss">
  #swiper-demo {
    //.swiper-container,
    //.image {
    //  max-width: 1000px;
    //}

    .selector {
      z-index: 2 !important;
    }
  }
</style>
