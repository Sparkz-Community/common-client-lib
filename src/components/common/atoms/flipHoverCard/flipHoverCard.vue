<template>
  <div id="flipHoverCard" :style="{...cssVars}">
    <q-dialog v-model="imageDialog" full-height id="imageDialogCarousel">
      <slot name="dialog" :images="images">
        <div style="position: relative; width: 100%">
          <div :style="{...dialogBgStyles}"></div>
          <div :style="{padding: '45px 20px 0px 20px', ...dialogDivStyles}">
            <q-btn round
                   color="dark"
                   icon="close"
                   @click="imageDialog = false"
                   style="z-index: 7000; position: absolute; top: 5px; right: 5px;"/>

            <q-carousel v-model="imageSlide"
                        swipeable
                        animated
                        thumbnails
                        infinite
                        class="bg-transparent"
                        height="90%"
                        style="min-width: 100%;">
              <q-carousel-slide v-for="(image, index) in images"
                                :key="index"
                                :name="index"
                                :img-src="image"
                                style="background-size: contain; background-repeat: no-repeat;"/>
            </q-carousel>
          </div>
        </div>
      </slot>
    </q-dialog>

    <q-card class="shadow-5"
            :style="{
              width: `calc(${width} + 20px)`,
              height: 'auto',
              display: 'flex',
              'justify-content': 'center',
              'align-items': 'center'
            }">
      <div>
        <div id="top" :style="{width}">
          <slot name="top" :handleFlip="handleFlip" :setImageDialog="setImageDialog">
            <div class="q-pa-sm">
              <div class="flex">
                <q-avatar>
                  <img :src="avatarSrc"/>
                </q-avatar>

                <q-space/>

                <q-btn flat dense @click="handleFlip">
                  <q-icon size="xs" name="fas fa-sync-alt"></q-icon>
                </q-btn>
                <q-btn flat
                       dense
                       @click="setImageDialog(true)">
                  <q-icon size="xs" name="fas fa-expand-alt"></q-icon>
                </q-btn>
                <q-btn v-if="showEdit" flat dense @click="$emit('edit', $event)">
                  <q-icon size="xs" name="fas fa-edit"></q-icon>
                </q-btn>
              </div>
            </div>
          </slot>
        </div>

        <div class="wrapper" :style="{height, width}">
          <div :class="`card-front-${itemIndex}`">
            <div class="card">
              <img :src="frontImageSrc"/>
              <div class="details">
                <div class="details-container">
                  <slot name="front-details" :handleFlip="handleFlip">
                    <div class="text-secondary text-h5 text-weight-bold" style="line-height: 1.10;">
                      <slot name="front-details-title" :handleFlip="handleFlip">
                        <span v-if="frontTitle">{{ frontTitle }}</span>
                      </slot>
                    </div>
                    <p style="max-height: 75%; overflow: auto;">
                      <slot name="front-details-text" :handleFlip="handleFlip">
                        <span v-if="frontText">{{ frontText }}</span>
                      </slot>
                    </p>
                    <div class="flex" style="position: absolute; bottom: 5px; right: 5px; left: 0px;">
                      <slot name="front-details-actions" :handleFlip="handleFlip">
                        <q-space/>

                        <q-btn color="primary"
                               icon="fas fa-info-circle"
                               label="Details"
                               @click="$emit('front-details', $event)"></q-btn>
                      </slot>
                    </div>
                  </slot>
                </div>
              </div>
            </div>
          </div>
          <div :class="`card-back-${itemIndex}`">
            <div class="card">
              <img :src="backImageSrc"/>
              <div class="details">
                <div class="details-container">
                  <slot name="back-details" :handleFlip="handleFlip">
                    <div class="text-secondary text-h5 text-weight-bold" style="line-height: 1.10;">
                      <slot name="back-details-title">
                        <span v-if="backTitle">{{ backTitle }}</span>
                      </slot>
                    </div>
                    <p style="max-height: 75%; overflow: auto;">
                      <slot name="back-details-text" :handleFlip="handleFlip">
                        <span v-if="backText">{{ backText }}</span>
                      </slot>
                    </p>
                    <div class="flex" style="position: absolute; bottom: 5px; right: 5px; left: 0px;">
                      <slot name="back-details-actions" :handleFlip="handleFlip">
                        <q-space/>

                        <q-btn color="primary"
                               icon="fas fa-info-circle"
                               label="Details"
                               @click="$emit('back-details', $event)"></q-btn>
                      </slot>
                    </div>
                  </slot>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="bottom" :style="{width}">
          <slot name="bottom" :price="price" :handleFlip="handleFlip">
            <div class="q-pa-sm">
              <div class="flex justify-between" style="align-items: center;">
                <component :is="price.toLocaleString('en-US').length > 8 ? 'h4' : 'h3'"
                           v-if="![null, undefined].includes(price)"
                           class="q-ma-none text-green"
                           v-text="`$${price.toLocaleString('en-US')}`"></component>
                <q-space/>

                <q-btn v-if="showBuy" color="primary" icon="fas fa-cart-plus" label="Buy"
                       @click="$emit('buy', $event)"></q-btn>
              </div>
            </div>
          </slot>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script>
  import {v4 as uuidv4} from 'uuid';
  import {gsap} from 'gsap/all';

  export default {
    name: 'flipHoverCard',
    props: {
      itemIndex: {
        type: [Number, String],
        default() {
          return uuidv4();
        },
      },
      width: {
        type: String,
        default: '280px',
      },
      height: {
        type: String,
        default: '392px',
      },
      placeHolderFontFamily: {
        type: String,
        default: 'Garamond',
      },
      placeHolderFontSize: {
        type: String,
        default: '45',
      },
      placeHolderDY: {
        type: String,
        default: '10.5',
      },
      placeHolderFontWeight: {
        type: String,
        default: '',
      },
      placeHolderBGColor: {
        type: String,
        default: '#ddd',
      },
      placeHolderTextColor: {
        type: String,
        default: 'rgba(0,0,0,0.5)',
      },
      placeHolderText: {
        type: String,
        default(props) {
          return props.width.replace('px', '') + 'x' + props.height.replace('px', '');
        },
      },
      placeholderImage: {
        default(props) {
          const str = `<svg xmlns="http://www.w3.org/2000/svg" width="${props.width}" height="${props.height}">
                          <rect fill="${props.placeHolderBGColor}" width="${props.width}" height="${props.height}"/>
                          <text fill="${props.placeHolderTextColor}" font-family="${props.placeHolderFontFamily}" font-size="${props.placeHolderFontSize}" dy="${props.placeHolderDY}" font-weight="${props.placeHolderFontWeight}" x="50%" y="50%" text-anchor="middle">${props.placeHolderText}</text>
                        </svg>`;
          const cleaned = str
            .replace(/[\t\n\r]/gim, '') // Strip newlines and tabs
            .replace(/\s\s+/g, ' ') // Condense multiple spaces
            .replace(/'/gim, '\\i'); // Normalize quotes
          const encoded = encodeURIComponent(cleaned)
            .replace(/\(/g, '%28') // Encode brackets
            .replace(/\)/g, '%29');
          return `data:image/svg+xml;charset=UTF-8,${encoded}`;
        },
      },
      avatarSrc: {
        type: String,
        default(props) {
          return props.placeholderImage;
        },
      },
      frontImageSrc: {
        type: String,
        default(props) {
          return props.placeholderImage;
        },
      },
      backImageSrc: {
        type: String,
        default(props) {
          return props.placeholderImage;
        },
      },
      frontTitle: {
        type: String,
      },
      backTitle: {
        type: String,
      },
      frontText: {
        type: String,
      },
      backText: {
        type: String,
      },
      price: {
        type: Number,
      },
      showEdit: {
        type: Boolean,
        default: false,
      },
      showBuy: {
        type: Boolean,
        default: true,
      },
      dialogBgColor: {
        type: String,
        default: 'black',
      },
      showBlurryBackgroundImg: {
        type: Boolean,
        default: false,
      },
      showImgBorder: {
        type: Boolean,
        default: true,
      },
      showImgShadow: {
        type: Boolean,
        default: true,
      },
    },

    data() {
      return {
        tween: null,
        imageDialog: false,
        imageSlide: 0,
      };
    },
    mounted() {
      this.tween = gsap
        .timeline({paused: true})
        .fromTo(`.card-front-${this.itemIndex}`, {
          duration: 1,
          rotationY: 0,
        }, {
          duration: 1,
          rotationY: 180,
        }, 0)
        .fromTo(`.card-back-${this.itemIndex}`, {
          duration: 1,
          rotationY: -180,
        }, {
          duration: 1,
          rotationY: 0,
        }, 0)
        .reverse();
    },
    computed: {
      cssVars() {
        let styles = {};
        if (this.showImgBorder) {
          this.$lset(styles, '--inner-border', '2px solid #fff');
          this.$lset(styles, '--outer-border', '2px solid #222222');
        }
        if (this.showImgShadow) this.$lset(styles, '--box-shadow', '0px 4px 7px rgba(0, 0, 0, .5)');
        return styles;
      },
      dialogBgStyles() {
        let styles = {
          display: 'none',
        };

        if (this.images[this.imageSlide] && this.showBlurryBackgroundImg) {
          styles = {
            ...styles,
            display: undefined,
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            'background-image': `url(${this.images[this.imageSlide]})`,
            'background-position': 'center',
            'background-repeat': 'no-repeat',
            'background-size': 'cover',

            filter: 'blur(8px)',
            '-webkit-filter': 'blur(8px)',
          };
        }
        return styles;
      },
      dialogDivStyles() {
        let styles = {
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          background: this.dialogBgColor,
        };

        if (this.images[this.imageSlide] && this.showBlurryBackgroundImg) {
          styles = {
            ...styles,
            background: undefined,
          };
        }
        return styles;
      },
      images() {
        return [this.frontImageSrc, this.backImageSrc];
      },
    },
    methods: {
      handleFlip() {
        if (!this.tween.reversed()) {
          this.tween.reverse(1.5);
        } else {
          this.tween.play();
        }
      },
      setImageDialog(val) {
        this.imageDialog = val;
      },
    },
  };
</script>

<style lang="scss">
  #imageDialogCarousel {
    .q-panel-parent {
      position: unset;
      overflow: hidden;
    }

    .q-carousel__navigation--bottom {
      bottom: 20px;
      z-index: 2000;
    }

    //.q-carousel__prev-arrow--horizontal, .q-carousel__next-arrow--horizontal {
    //  bottom: calc(-100vh + 130px);
    //  margin-left: 30%;
    //  margin-right: 30%;
    //  z-index: 2000;
    //}
  }
</style>

<style scoped lang="scss" src="./_flipHoverCard.scss">

</style>
