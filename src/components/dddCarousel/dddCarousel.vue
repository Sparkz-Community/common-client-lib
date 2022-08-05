<template>
  <div id="dddCarousel">

    <q-dialog v-if="selectedItem" v-model="dialog">
      <q-card :style="$data.$windowWidth <= 800 ? 'width: 100%;' : 'width: 50%;' + ' position: relative;'">
        <q-img v-if="selectedItem._type === 'img'" :src="selectedItem.src"></q-img>
        <video v-else-if="selectedItem._type === 'video'"
               controls
               autoplay="autoplay"
               loop
               :src="selectedItem.src"
               type="video/mp4"
               style="width: 100%; height: 100%;"></video>
        <q-btn round
               style="position: absolute; top: 0.5rem; right: 1rem; color: white; background-color: rgba(0,0,0,0.5);"
               size="sm"
               @click="dialog = false">
          <q-icon name="close"></q-icon>
        </q-btn>
      </q-card>
    </q-dialog>

    <div id="drag-container">
      <div id="spin-container">

        <div v-for="(item, i) in items" :key="i">
          <a v-if="item._type === 'img' && !!item.href" :target="item.target" :href="item.href">
            <img :src="item.src"
                 :alt="item.alt">
          </a>
          <img v-else-if="item._type === 'img'"
               @click="setImageSelected(item)"
               :src="item.src"
               :alt="item.alt">
          <a v-if="item._type === 'video' && !!item.href" :target="item.target" :href="item.href">
            <video controls
                   autoplay="autoplay"
                   loop
                   :src="item.src"
                   type="video/mp4"/>
          </a>
          <video v-else-if="item._type === 'video'"
                 @click="setImageSelected(item)"
                 controls
                 autoplay="autoplay"
                 loop
                 :src="item.src"
                 type="video/mp4"/>
        </div>

        <h1>{{ title }}</h1>

        <div
          style="position:relative; left: -75%; top: -120px; color: orange; width: 120px; height: 20px; transform: rotate3d(0, 0, 0, 90deg);">
          <div id="music-container"></div>
        </div>

      </div>
      <div id="ground"></div>
    </div>

    <div id="control-bar">
      <q-btn @click="setRotate"
             round
             size="md">
        <q-icon v-if="localRotateSpeed > 0" name="fas fa-undo-alt"></q-icon>
        <q-icon v-else name="fas fa-redo-alt"></q-icon>

        <q-tooltip content-style="font-size: 10pt" anchor="top middle" self="center middle">
          Reverse Rotation
        </q-tooltip>
      </q-btn>
      <q-btn @click="setPause"
             round
             size="md">
        <q-icon v-if="localPause" name="fas fa-play"></q-icon>
        <q-icon v-else name="fas fa-pause"></q-icon>

        <q-tooltip content-style="font-size: 10pt" anchor="top middle" self="center middle">
          {{ localPause ? 'play Rotation' : 'Pause Rotation' }}
        </q-tooltip>
      </q-btn>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'dddCarousel',
    props: {
      title: {
        type: String,
        default: '3D Tiktok Carousel',
      },
      rotateSpeed: {
        type: Number,
        default: -80,
      },
      pause: {
        type: Boolean,
        default: false,
      },
      items: {
        type: Array,
        default() {
          return [
            {
              src: 'https://images.pexels.com/photos/206395/pexels-photo-206395.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
              alt: '',
              _type: 'img',
              href: null,
              target: null,
            },
            {
              src: 'https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
              alt: '',
              _type: 'img',
              href: null,
              target: null,
            },
            {
              src: 'https://images.pexels.com/photos/1462636/pexels-photo-1462636.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
              alt: '',
              _type: 'img',
              href: null,
              target: null,
            },
            {
              src: 'https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
              alt: '',
              _type: 'img',
              href: 'https://images.pexels.com/photos/139829/pexels-photo-139829.jpeg',
              target: '_blank',
            },
            {
              src: 'https://player.vimeo.com/external/322244668.sd.mp4?s=338c48ac2dfcb1d4c0689968b5baf94eee6ca0c1&profile_id=165&oauth2_token_id=57447761',
              _type: 'video',
            },
          ];
        },
        validator: function (value) {
          let validations = [];
          value.forEach(item => {
            validations.push(!!item.src);
            validations.push(['img', 'video'].includes(item._type));
          });
          return validations.every(valid => valid);
        },
      },
    },
    data() {
      return {
        localRotateSpeed: this.rotateSpeed,
        localPause: this.pause,
        selectedItem: null,
        dialog: false,
      };
    },
    mounted() {
      this.runCarousel();
    },
    watch: {
      rotateSpeed: {
        handler(val) {
          this.localRotateSpeed = val;
        },
      },
      pause: {
        handler(val) {
          this.localPause = val;
        },
      },
    },
    methods: {
      setImageSelected(item) {
        this.dialog = true;
        this.selectedItem = item;
      },
      setPause() {
        this.localPause = !this.localPause;
        this.$emit('update:pause', this.localPause);

        this.runPlaySpin(this.localPause);
      },
      runPlaySpin(yes) {
        let ospin = document.getElementById('spin-container');
        ospin.style.animationPlayState = (yes ? 'paused' : 'running');
        ospin.style.WebkitAnimationPlayState = (yes ? 'paused' : 'running');
      },
      setRotate() {
        let ospin = document.getElementById('spin-container');
        let animationName = (this.localRotateSpeed > 0 ? 'spin' : 'spinRevert');
        ospin.style.animation = `${animationName} ${Math.abs(this.localRotateSpeed)}s infinite linear`;
        this.localRotateSpeed *= -1;
        this.$emit('update:rotateSpeed', this.localRotateSpeed);
      },
      runCarousel() {
        // let self = this;

        // Author: Hoang Tran (https://www.facebook.com/profile.php?id=100004848287494)
        // Github verson (1 file .html): https://github.com/HoangTran0410/3DCarousel/blob/master/index.html


        let autoRotate = true;
        let imgWidth = 120;
        let imgHeight = 170;

        let bgMusicURL = 'https://api.soundcloud.com/tracks/143041228/stream?client_id=587aa2d384f7333a886010d5f52f302a';
        let bgMusicControls = true;
        let bgMusicAutoplay = false;

        /*
        CHÚ Ý:
            + imgWidth, imgHeight sẽ dùng được cho cả video -> <video> cũng sẽ được thu nhỏ cho bằng <img>
            + nếu imgWidth, imgHeight đủ nhỏ, có thể <video> sẽ không hiện nút play/pause
            + Link nhạc lấy từ: https://hoangtran0410.github.io/Visualyze-design-your-own-/?theme=HoangTran&playlist=2&song=8&background=3
            + https://api.soundcloud.com/tracks/191576787/stream?client_id=587aa2d384f7333a886010d5f52f302a
            + Custom from code in tiktok video  https://www.facebook.com/J2TEAM.ManhTuan/videos/1353367338135935/
        */

        let obox = document.getElementById('drag-container');
        let ospin = document.getElementById('spin-container');
        let aImg = ospin.getElementsByTagName('img');
        let aVid = ospin.getElementsByTagName('video');
        let aEle = [...aImg, ...aVid];
        let radius = aEle.length * 25;


        // ===================== start =======================
        setTimeout(init, 100);

        let audio = document.getElementById('player');
        window.addEventListener('keypress', function (e) {
          let x = e.keyCode;
          if (x === 112) { // pressed 'p'
            audio.play();
          } else if (x === 115) { // pressed 's'
            audio.pause();
          }
        });

        // chỉnh độ lớn ảnh
        ospin.style.width = imgWidth + 'px';
        ospin.style.height = imgHeight + 'px';

        // chỉnh độ lớn ground - theo radius
        let ground = document.getElementById('ground');
        ground.style.width = radius * 3 + 'px';
        ground.style.height = radius * 3 + 'px';

        function init(delayTime) {
          for (let i = 0; i < aEle.length; i++) {
            aEle[i].style.transform = `rotateY(${(i * (360 / aEle.length))}deg) translateZ(${radius}px)`;
            aEle[i].style.transition = `transform ${(delayTime || (aEle.length - i)) / 4 + 's'}, top 1s ease`;
          }
        }

        function applyTranform(obj) {
          if (tY > 180) tY = 180;
          if (tY < 0) tY = 0;

          // Áp dụng góc xoay
          obj.style.transform = `rotateX(${-tY}deg) rotateY(${tX}deg)`;
        }

        // // eslint-disable-next-line no-unused-vars
        // function playSpin(yes) {
        //   self.runPlaySpin(yes);
        // }

        // eslint-disable-next-line no-unused-vars
        let sX, sY, nX, nY, desX = 0,
            desY = 0,
            tX = 0,
            tY = 10;

        // tự động xoay
        if (autoRotate) {
          this.setRotate();
        }

        // thêm nhạc nền
        if (bgMusicURL && bgMusicControls) {
          document.getElementById('music-container').innerHTML += `
            <audio src="${bgMusicURL}" ${bgMusicControls ? 'controls' : ''} ${bgMusicAutoplay ? 'autoplay' : ''} loop>
            <p>If you are reading this, it is because your browser does not support the audio element.</p>
            </audio>
            `;
        }

        // cài đặt events
        if (mobilecheck()) {
          // ==================== Touch Events ====================
          document.ontouchstart = function (e) {
            clearInterval(obox.timer);
            e = e || window.event;
            let sX = e.touches[0].clientX,
                sY = e.touches[0].clientY;

            this.ontouchmove = function (e) {
              e = e || window.event;
              let nX = e.touches[0].clientX,
                  nY = e.touches[0].clientY;
              desX = nX - sX;
              desY = nY - sY;
              tX += desX * 0.1;
              tY += desY * 0.1;
              applyTranform(obox);
              sX = nX;
              sY = nY;
            };

            // eslint-disable-next-line no-unused-vars
            this.ontouchend = function (e) {
              this.ontouchmove = this.ontouchend = null;
              obox.timer = setInterval(function () {
                desX *= 0.95;
                desY *= 0.95;
                tX += desX * 0.1;
                tY += desY * 0.1;
                applyTranform(obox);
                // playSpin(true);
                // if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
                //   clearInterval(obox.timer);
                //   playSpin(false);
                // }
              }, 17);
            };

            // return false;
          };
        } else {
          // ==================== Mouse Events ====================
          document.onmousedown = function (e) {
            clearInterval(obox.timer);
            e = e || window.event;
            let sX = e.clientX,
                sY = e.clientY;

            this.onmousemove = function (e) {
              e = e || window.event;
              let nX = e.clientX,
                  nY = e.clientY;
              desX = nX - sX;
              desY = nY - sY;
              tX += desX * 0.1;
              tY += desY * 0.1;
              applyTranform(obox);
              sX = nX;
              sY = nY;
            };

            // eslint-disable-next-line no-unused-vars
            this.onmouseup = function (e) {
              this.onmousemove = this.onmouseup = null;
              obox.timer = setInterval(function () {
                desX *= 0.95;
                desY *= 0.95;
                tX += desX * 0.1;
                tY += desY * 0.1;
                applyTranform(obox);
                // playSpin(true);
                // if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
                //   clearInterval(obox.timer);
                //   playSpin(false);
                // }
              }, 13);
            };

            return false;
          };
          document.onmousewheel = function (e) {
            e = e || window.event;
            let d = e.wheelDelta / 20 || -e.detail;
            radius += d;
            init(1);
          };
        }

        // https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
        function mobilecheck() {
          let check = false;
          (function (a) {
            // eslint-disable-next-line no-useless-escape
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
          })(navigator.userAgent || navigator.vendor || window.opera);
          return check;
        }
      },
    },
  };
</script>

<style>
  @-webkit-keyframes spin {
    from {
      -webkit-transform: rotateY(0deg);
      transform: rotateY(0deg);
    }
    to {
      -webkit-transform: rotateY(360deg);
      transform: rotateY(360deg);
    }
  }

  @keyframes spin {
    from {
      -webkit-transform: rotateY(0deg);
      transform: rotateY(0deg);
    }
    to {
      -webkit-transform: rotateY(360deg);
      transform: rotateY(360deg);
    }
  }

  @-webkit-keyframes spinRevert {
    from {
      -webkit-transform: rotateY(360deg);
      transform: rotateY(360deg);
    }
    to {
      -webkit-transform: rotateY(0deg);
      transform: rotateY(0deg);
    }
  }

  @keyframes spinRevert {
    from {
      -webkit-transform: rotateY(360deg);
      transform: rotateY(360deg);
    }
    to {
      -webkit-transform: rotateY(0deg);
      transform: rotateY(0deg);
    }
  }
</style>

<style scoped lang="scss" src="./_dddCarousel.scss">

</style>
