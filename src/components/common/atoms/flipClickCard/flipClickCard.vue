<template>
  <div class="card" ref="card">
    <div class="details-bar" ref="det">
      <slot name="details" />
    </div>
    <div class="top" ref="top">
      <img v-if="profilePicture" @mouseleave="toggleClass" @mouseover="toggleClass"
           :src="profilePicture"/>
      <img v-if="profilePicture" :src="profilePicture" ref="hoverImg"/>
      <slot name="header" v-if="!profilePicture" />
      <div @click="flipCard" class="flip">
        <q-icon name="rotateIcon" />
      </div>
    </div>

    <div class="top top2" ref="topReverse">
      <div @click="toggleDetails" class="details">{{ isShown ? 'Hide Details' : 'Show Details' }}</div>
      <div class="flip" @click="flipCard">R</div>
    </div>

    <div class="bottom" ref="bottom">
      <slot name="default" />
    </div>

    <div class="bottom2" ref="bottomReverse">
      <slot name="flipped" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Card1',
    data(){
      return {
        isFlipped: false,
        isShown: false
      };
    },
    props: {
      timing: {type: Number, default: () => 1000},
      backgroundImage: {type: String, required: false},
      profilePicture: {type: String, required: false},
      rotateIcon: {type: String, default: () => 'sync'}
    },

    mounted() {
      if (this.backgroundImage) {
        let {top, topReverse} = this.$refs;

        top.style.background = `linear-gradient(rgba(255, 255, 255, .9), rgba(219, 211, 211, 0.8)), url('${this.backgroundImage}') no-repeat center`;
        top.style.backgroundSize = 'cover';

        topReverse.style.background = `linear-gradient(rgba(255, 255, 255, .9), rgba(219, 211, 211, 0.8)), url('${this.backgroundImage}') no-repeat center`;
        topReverse.style.backgroundSize = 'cover';
      }
    },
    methods: {
      toggleDetails(tog = true) {
        if (tog) this.isShown = !this.isShown;

        this.$refs.det.style.bottom = this.isShown ? '0' : '-300px';
      },
      toggleClass() {
        this.$refs.hoverImg.classList.toggle('hover-img');
        if (!this.$refs.hoverImg.classList.contains('hover-img')) {
          this.$refs.hoverImg.style.objectFit = 'cover';
        }
      },
      flipCard() {
        let {bottom, bottomReverse, top, topReverse, card} = this.$refs;

        if (this.isShown) this.toggleDetails();

        if (!this.isFlipped) {
          setTimeout(() => {
            bottom.style.display = 'none';
            bottomReverse.style.display = 'block';
            top.style.display = 'none';
            topReverse.style.display = 'block';
          }, this.timing / 3);

          card.classList.add('flip-card');

          setTimeout(() => {
            card.classList.remove('flip-card');
            card.style.transform = 'rotateY(180deg)';
          }, this.timing);
        } else {
          setTimeout(() => {
            bottom.style.display = 'block';
            bottomReverse.style.display = 'none';
            top.style.display = 'block';
            topReverse.style.display = 'none';
          }, this.timing / 3);

          card.classList.add('flip-card-rev');

          setTimeout(() => {
            card.classList.remove('flip-card-rev');
            card.style.transform = 'rotateY(0deg)';
          }, this.timing);
        }
        this.isFlipped = !this.isFlipped;
      },
    },
  };
</script>

<style scoped lang="scss" src="./flipClickCard.scss">

</style>
