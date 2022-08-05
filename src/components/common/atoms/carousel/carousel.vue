<template>
  <div class="carousel-wrapper" ref="carouselWrapper">
    <div class="carousel-top" ref="topCarousel" @mouseenter="stopTransition" @mouseleave="resumeTransition">
      <div class="item" v-for="(item, idx) of items" :key="idx">
        <slot name="items" :item="item">
          {{ item }}
        </slot>
      </div>
    </div>

    <div class="carousel-bottom" ref="bottomCarousel" v-if="bottomItems" @mouseenter="stopTransition" @mouseleave="resumeTransition">
      <div class="item" v-for="(item, idx) of bottomItems" :key="idx">
        <slot name="bottomItems" :item="item">
          {{ item }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script>

  function RecurringTimer(callback, delay) {
    let timerId, start, remaining = delay;

    this.pause = function() {
      window.clearTimeout(timerId);
      remaining -= new Date() - start;
    };

    let resume = function() {
      start = new Date();
      timerId = window.setTimeout(function() {
        remaining = delay;
        resume();
        callback();
      }, remaining);
    };

    this.resume = resume;
    this.resume();
  }

  import $ from 'jquery';

  export default {
    name: 'Carousel',
    props: {
      items: {type: Array, required: false},
      bottomItems: {type: Array, required: false},
      timing: {type: Number, required: false,},
      easing: {type: String, default: 'cubic-bezier(0.2, 0.0, 0.58, 1.0)'},
      // number 1.00 - 10.00
      speed: {type: Number, default: 3}
    },
    data() {
      return {
        reverse: false,
        animationTimer: null,
        timeoutCalled: false,
        newTiming: 0,
        stopped: false,
        windowWidth: 0,
        topWidth: 0,
        timeAmt: 0
      };
    },
    async mounted() {
      this.topWidth = $(this.$refs.topCarousel).width();
      this.windowWidth = $(this.$refs.carouselWrapper).width();
      this.timeAmt = this.timing || Math.ceil((this.topWidth) / (Math.log(this.speed + 1) * (this.speed > 5 ? 125 : 100)));

      $(this.$refs.topCarousel).css('transition', `${this.timeAmt}s all ${this.easing}`);
      this.setTransform(this.$refs.topCarousel, `translateX(-${this.topWidth - this.windowWidth}px)`, this.$refs.bottomCarousel, `translateX(-${this.topWidth - this.windowWidth}px)`);

      let res = await this.sleep(5);
      if (res) $(this.$refs.bottomCarousel).css('transition', `${this.timeAmt}s all ${this.easing}`);

      this.setTransform(this.$refs.bottomCarousel, 'translateX(0px)');
      this.initializeTimer(this.timeAmt);
    },
    methods: {
      setTransform(ref, value, ref2, value2) {
        $(ref).css('transform', value);
        $(ref2).css('transform', value2);
      },
      initializeTimer(timing) {
        if (this.stopped) return;
        if (this.animationTimer) this.animationTimer.pause();
        this.animationTimer = new RecurringTimer(() => {
          this.changeOrigin(this.topWidth);
        }, Number(String(timing) + '000'));
      },
      changeOrigin(amt, newTiming) {
        if ((newTiming && (newTiming !== this.newTiming)) || this.stopped) return;

        if (!this.reverse) {
          this.setTransform(this.$refs.topCarousel, 'translateX(0px)', this.$refs.bottomCarousel, `translateX(-${this.topWidth - this.windowWidth}px)`);
          $(this.$refs.topCarousel).css('transform', 'translateX(0px)');
          this.reverse = true;
        } else {
          this.setTransform(this.$refs.topCarousel, `translateX(-${this.topWidth - this.windowWidth}px)`, this.$refs.bottomCarousel, 'translateX(0px)');
          this.reverse = false;
        }
      },
      stopTransition() {
        this.stopped = true;
        this.animationTimer.pause();
        let bottomX = this.parseMatrix($(this.$refs.bottomCarousel).css('transform'));
        let topX = this.parseMatrix($(this.$refs.topCarousel).css('transform'));
        this.setTransform(this.$refs.topCarousel, `translateX(${topX}px)`);
        this.setTransform(this.$refs.bottomCarousel, `translateX(${bottomX}px)`);
      },
      resumeTransition() {
        this.stopped = false;
        let newTiming = undefined, curWidth = this.parseMatrix($(this.$refs.topCarousel).css('transform')) * -1;
        let amtFinished = curWidth / (this.topWidth - this.windowWidth);
        if (!this.reverse) {
          newTiming = this.timeAmt - ((amtFinished) * this.timeAmt);
          $(this.$refs.topCarousel).css('transition', `${newTiming}s all ${this.easing}`);
          $(this.$refs.bottomCarousel).css('transition', `${newTiming}s all ${this.easing}`);
          this.setTransform(this.$refs.topCarousel, `translateX(-${$(this.$refs.topCarousel).width() - this.windowWidth}px)`, this.$refs.bottomCarousel, `translateX(${0}px)`);
        } else {
          amtFinished = 1 - amtFinished;
          newTiming = this.timeAmt - ((amtFinished) * this.timeAmt);
          $(this.$refs.topCarousel).css('transition', `${newTiming}s all ${this.easing}`);
          $(this.$refs.bottomCarousel).css('transition', `${newTiming}s all ${this.easing}`);
          this.setTransform(this.$refs.bottomCarousel,  `translateX(-${$(this.$refs.topCarousel).width() - this.windowWidth}px)`, this.$refs.topCarousel, `translateX(${0}px)`);
        }

        this.newTiming = newTiming;

        setTimeout(() => {
          this.initializeTimer(this.timeAmt);
          this.changeOrigin(this.topWidth, newTiming);
          $(this.$refs.topCarousel).css('transition', `${this.timeAmt}s all ${this.easing}`);
          $(this.$refs.bottomCarousel).css('transition', `${this.timeAmt}s all ${this.easing}`);
        }, Math.ceil(newTiming * 1000));
      },
      parseMatrix(str) {
        if (!str) return '';
        let sub = str.substr(7, str.length - 8);
        sub = sub.split(',');
        return sub[4];
      },
      async sleep(time) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, time);
        });
      }
    }
  };
</script>

<style scoped lang="scss" src="./_carousel.scss">

</style>
