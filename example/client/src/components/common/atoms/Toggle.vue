<template>
  <!--  <div class="toggle-input">-->
  <!--    <span>TEST</span>-->
  <div id="toggle" class="toggle-btn" ref="toggleBtn" @click="toggleLeft">
    <div class="prepend-left" ref="prependLeft" v-if="label && labelPosition === 'left'">{{ label }}</div>
    <div class="toggle-left" ref="toggleLeft">

    </div>
    <div class="left-txt" ref="leftTxt" v-show="txt">
      {{ offText }}
    </div>
    <div class="right-txt" ref="rightTxt" v-show="txt">
      {{ onText }}
    </div>
    <div class="prepend-right" ref="appendRight" v-if="label && labelPosition === 'right'">{{ label }}</div>
  </div>
  <!--  </div>-->
</template>

<script>
  import $ from 'jquery';

  export default {
    name: 'Toggle',
    props: {
      width: {
        type: Number,
        default: 80
      },
      borderRadius: {
        type: Number,
        default: 16
      },
      offText: {
        type: String,
        default: () => 'NO'
      },
      onText: {
        type: String,
        default: () => 'YES'
      },
      value: null,
      size: {
        type: String,
        required: false
      },
      redBg: {
        type: Boolean,
        default: false
      },
      canToggleNull: {
        type: Boolean,
        default: false
      },
      label: {
        type: String,
        required: false
      },
      labelPosition: {
        type: String,
        default: () => 'left'
      }
    },
    mounted() {
      this.newWidth = this.findSize();
      $(this.$refs.rightTxt).fadeOut(0);
      let el = $(this.$refs.toggleBtn);
      let toggle = $(this.$refs.toggleLeft);
      el.css('background-color', this.redBg ? '#8F0615' : '#212121');
      el.css('border-radius', this.borderRadius);
      el.css('width', this.newWidth + 'px');
      el.css('height', (this.newWidth * .475) + 'px');
      toggle.css('border-radius', this.borderRadius + 2);
      toggle.css('width', (this.newWidth * .5625) + 'px');
      toggle.css('height', this.newWidth >= 150 ? (this.newWidth * .472) + 'px' : (this.newWidth * .46) + 'px');
      $(this.$refs.rightTxt).css('height', (this.newWidth * .475) + 'px');
      $(this.$refs.leftTxt).css('height', (this.newWidth * .475) + 'px');
      el.css('margin-left', $(this.$refs.prependLeft).width() + 15 + 'px');
      $(this.$refs.prependLeft).css('left', -$(this.$refs.prependLeft).width() - 15 + 'px');
      $(this.$refs.appendRight).css('right', -20 - $(this.$refs.appendRight).width() + 'px');
      typeof this.value === 'boolean' ? this.toggleLeft(true) : this.setNullState();
    },
    watch: {
      value: {
        handler(newVal) {
          if (newVal == null) {
            this.setNullState();
          } else {
            // this.txt = !newVal ? this.offText : this.onText;
            // this.toggleLeft();
          }
        }
      },
      // txt: {
      //   immediate: true,
      //   handler(newVal) {
      //     if (newVal === this.onText) {
      //       this.$emit('input', true);
      //     } else if (newVal !== this.onText) {
      //       this.$emit('input', false);
      //     }
      //   }
      // },
      nullState: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            this.$emit('input', null);
          }
        }
      }
    },
    data() {
      return {
        txt: !this.value ? this.offText : this.onText,
        newWidth: this.width,
        nullState: false,
        clicks: 0
      };
    },
    methods: {
      toggleLeft(onMount = false) {
        this.nullState = false;
        if (this.clicks === 2 && this.canToggleNull) {
          this.setNullState();
          return;
        }
        if(this.txt === this.onText && onMount !== true) {
          $(this.$refs.toggleLeft).css('left', '-2px');
          this.$refs.toggleBtn.style.backgroundColor = this.redBg ? '#8F0615' : '#212121';
          this.txt = this.offText;
          $(this.$refs.rightTxt).fadeOut(300);
          $(this.$refs.leftTxt).fadeIn(300);
          this.$emit('input', false);
        } else if ((this.txt !== this.onText && onMount !== true) || (this.txt === this.onText && onMount)) {
          $(this.$refs.toggleLeft).css('left', this.newWidth * 0.435);
          this.$refs.toggleBtn.style.backgroundColor = 'green';
          this.txt = this.onText;
          $(this.$refs.leftTxt).fadeOut(300);
          $(this.$refs.rightTxt).fadeIn(300);
          this.$emit('input', true);
        }
        this.clicks++;
        $(this.$refs.toggleLeft).removeClass('centered');
      },
      setNullState() {
        this.clicks = 0;
        this.txt = this.offText;
        this.nullState = true;
        $(this.$refs.rightTxt).fadeOut(0);
        $(this.$refs.toggleBtn).css('background-color', '#212121');
        $(this.$refs.leftTxt).fadeOut(0);
        $(this.$refs.toggleLeft).addClass('centered');
      },
      findSize() {
        if (!this.size) return this.width;
        let w = this.width;
        switch (this.size) {
          case 'xs':
            w = 40;
            break;
          case 'sm':
            w = 60;
            break;
          case 'md':
            w = 80;
            break;
          case 'lg':
            w = 110;
            break;
          case 'xl':
            w = 140;
            break;
        }
        return w;
      }
    }
  };
</script>

<style scoped>
  #toggle {

  }

  .toggle-btn {
    border: 2px solid #e2e2e2;
    background-color: #8F0615;
    position: relative;
    transition: 0.1s background-color;
    cursor: pointer;
  }
  .toggle-left {
    position: absolute;
    border: 2px solid #e2e2e2;
    color: white;
    display: flex;
    top: -1px;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    background-color: rgb(156,160,162);
    cursor: pointer;
    left: -2px;
    transition: 0.4s all cubic-bezier(0.76, 0, 0.24, 1);
  }
  .right-txt, .left-txt {
    font-weight: bold;
    /* height: 38px; */
    width: calc(50% + 4px);
    position: absolute;
    top: 0;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .left-txt {
    left: 0px;
    top: -1px;
  }
  .right-txt {
    right: -2px;
    top: -1px;
  }
  .centered {
    transition: 0.2s all;
    /*left: 0 !important;*/
    /*right: 0 !important;*/
    /*margin-left: auto;*/
    /*margin-right: auto;*/
    left: 50% !important;
    transform: translate(-50%, 0%);
  }
  .prepend-left {
    color: white;
    position: absolute;
    top: 50%;
    font-size: 1.2em;
    font-weight: 700;
    white-space: nowrap;
    transform: translate(0%, -50%);
  }
  .prepend-right {
    color: white;
    position: absolute;
    font-size: 1.2em;
    top: 50%;
    transform: translate(0%, -50%);
    font-weight: 700;
  }
</style>
