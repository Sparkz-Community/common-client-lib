<template>
  <div id="media" style="width: 100%; height: 100%;">
    <q-toolbar class="bg-black text-white">
      <q-toolbar-title>
        <slot name="title"></slot>
      </q-toolbar-title>
      <p v-if="showScreenSize" style="font-family:'Courier New'; font-size: 11pt;">{{ this.$data.$windowWidth }} x
        {{ this.$data.$windowHeight }}</p>
    </q-toolbar>


    <div class="videobox">
      <Videos id="Videos" ref="video-child"></Videos>
    </div>


    <slot name="actionToolbar"></slot>

    <q-toolbar class="bg-black text-white">
      <q-btn icon="flip_camera_ios" @click="switchCameras">
        <q-tooltip content-style="font-size: 14px">
          Switch Camera
        </q-tooltip>
      </q-btn>
      <q-space/>
      <photo-btn height="60px" width="60px" circle-color="white" @click="takePhoto()"></photo-btn>
      <q-space/>
      <q-btn icon="fas fa-cogs"
             @click="manageDevicesDialog = true">
        <q-tooltip content-style="font-size: 14px">
          Media Device Controls
        </q-tooltip>
      </q-btn>
    </q-toolbar>

    <q-dialog v-model="manageDevicesDialog">
      <q-card style="min-width: 350px">
        <q-item>
          <q-item-section>
            <q-item-label class="text-h5">Media Selection and Controls</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-btn flat round dense icon="close" v-close-popup></q-btn>
          </q-item-section>
        </q-item>

        <!--        <q-card-header>-->
        <!--          <q-card-title>-->
        <!--            <div>-->
        <!--              <span class=" q-ml-sm q-mt-sm text-h5"></span>-->
        <!--              -->
        <!--              -->
        <!--            </div>-->
        <!--          </q-card-title>-->
        <!--        </q-card-header>-->
        <!--        <q-card-section class="flex">-->
        <q-item class="q-pa-none">
          <q-space/>
          <q-item-section side>
            <q-toggle
              v-model="showScreenSize"
              label="Show Size"
              left-label
            />
          </q-item-section>
          <q-item-section side>
            <q-btn flat :icon="testAudio ? 'headset_off' : 'headset_mic'" @click="testMicrophone">
              <q-tooltip content-style="font-size: 14px">
                Test Audio
              </q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>


        <!--        </q-card-section>-->

        <q-card-section class="q-pt-none">
          <q-list bordered padding>
            <q-item-label header>Cameras</q-item-label>
            <q-expansion-item v-for="(videoDevice, idx) in videoDevices"
                              :key="`video-${idx}`"
                              :expand-icon-class="selected.video && $lget(videoDevice, 'value') === $lget(selected.video, 'value') ? 'q-pl-md' : 'hidden'">
              <template v-slot:header="{}">
                <div>
                  <q-icon name="videocam" size="sm"></q-icon>
                  <q-radio v-model="selected.video" :val="videoDevice" :label="videoDevice.label"/>
                </div>
                <q-space/>
              </template>
              <q-separator/>
              <device-controls
                v-if="stream && $lget(videoDevice, 'value') === getDeviceId(stream)"
                :streamObj="{stream}"
                type="videoinput"></device-controls>
            </q-expansion-item>

            <q-item-label header>Microphones</q-item-label>
            <q-expansion-item v-for="(audioDevice, idx) in audioDevices"
                              :key="`audio-${idx}`"
                              :expand-icon-class="selected.audio && $lget(audioDevice, 'value') === $lget(selected.audio, 'value') ? 'q-pl-md' : 'hidden'">
              <template v-slot:header="{}">
                <div>
                  <q-icon name="mic" size="sm"></q-icon>
                  <q-radio v-model="selected.audio" :val="audioDevice" :label="audioDevice.label"/>
                </div>
                <q-space/>
              </template>
              <q-separator/>
              <device-controls
                v-if="stream && $lget(audioDevice, 'value') === getDeviceId(stream)"
                :streamObj="{stream}"
                type="audioinput"></device-controls>
            </q-expansion-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import Videos from '../../atoms/videos/videos';
  import PhotoBtn from '../../atoms/PhotoBtn/PhotoBtn';
  import DeviceControls from './DeviceControls/DeviceControls.vue';

  const DEVICE_TEMPLATE = {
    active: false,
    video: null,
    audio: null,
    speaker: null,
  };

  export default {
    name: 'Media',
    components: {
      Videos,
      PhotoBtn,
      DeviceControls,
    },
    props: {
      mediaTypes: {
        kind: [Array, String],
        default() {
          return ['videoinput', 'audioinput', 'audiooutput'];
        },
      },
      videoWidth: {
        type: [Number, String, Object],
        default() {
          return {min: 360, ideal: 720, max: 2160};
          // return '100%';
        },
      },
      videoHeight: {
        type: [Number, String, Object],
        default() {
          return {min: 640, ideal: 1680, max: 3840};
          // return '100%';
        },
      },
      aspectRatio: {
        type: [Number, String],
        default() {
          return 16 / 9;
        },
      },
      stopErrorNotification: {
        type: Boolean,
        default: false,
      },
      stopErrorPropagation: {
        type: Boolean,
        default: false,
      },
    },
    emits: [
      'started',
      'photo',
      'error',
    ],
    data() {
      return {
        stream: null,
        testAudio: false,
        manageDevicesDialog: false,
        devices: [],
        selected: Object.assign({}, DEVICE_TEMPLATE),
        switchedCameras: [],
        showScreenSize: false,
      };
    },
    async mounted() {
      try {
        await this.loadDevices();
        // Try to set initial default devices
        if (this.devices.length > 0) {
          this.selected = {
            active: true,
            video: this.devices.find(dev => dev.kind === 'videoinput'),
            audio: this.devices.find(dev => this.$lget(dev, 'kind') === 'audioinput' && this.$lget(dev, 'value') === 'default'),
            speaker: this.devices.find(dev => this.$lget(dev, 'kind') === 'audiooutput' && this.$lget(dev, 'value') === 'default'),
          };
          this.switchedCameras.push(this.selected.video);
        }
        this.stream = await this.getStream(this.getConstraints(this.selected));
        console.log('stream.id:', this.stream.id);
        console.log('tracks:', this.stream.getTracks());
        console.log('selected:', this.selected);
        console.log('VideoTracks:', this.stream.getVideoTracks());
        console.log('AudioTracks:', this.stream.getAudioTracks());
        this.renderStream(this.stream);

      } catch (e) {
        console.error(e.name + ': ' + e.message);
        throw e;
      }

    },
    //Notify if children components error
    errorCaptured(err) {
      if (!this.stopErrorNotification) {
        this.$q.notify({type: 'negative', message: err.message});
      }
      return !this.stopErrorPropagation;
    },
    watch: {
      selected: {
        deep: true,
        async handler(newVal) {
          this.stream = await this.getStream(this.getConstraints(newVal));
          this.renderStream(this.stream);
        },
      },
      stream: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (newVal && this.testAudio) {
            this.testAudio.srcObject = newVal;
          }
        },
      },
    },
    computed: {
      videoDevices() {
        return this.devices.filter(dev => dev.kind === 'videoinput');
      },
      audioDevices() {
        return this.devices.filter(dev => dev.kind === 'audioinput');
      },
      speakerDevices() {
        return this.devices.filter(dev => dev.kind === 'audiooutput');
      },
    },
    methods: {
      getDeviceId(stream) {
        let setting = {};
        let device = stream.getVideoTracks().find(vid => vid.enabled);
        if (device) {
          setting = device.getSettings();
        }
        return this.$lget(setting, 'deviceId');
      },
      async loadDevices() {
        let self = this;
        self.devices = new Array(0);
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          console.warn('enumerateDevices() not supported.');
          return;
        }

        // List cameras and microphones and speakers.
        try {
          const media = await navigator.mediaDevices.enumerateDevices();
          let metadata;
          media
            // .filter(item => {
            //   return self.mediaTypes.includes(item.kind) && item.deviceId !== 'default';
            // })
            .forEach((device) => {
              switch (device.kind) {
                case 'audioinput':
                  metadata = {
                    label: device.label || `audio ${self.audioDevices.length + 1}`,
                    type: 'audio',
                    metadata: {
                      capabilities: device.getCapabilities(),
                      groupId: device.groupId,
                    },
                  };
                  break;
                case 'audiooutput':
                  metadata = {
                    label: device.label || `speaker ${self.speakerDevices.length + 1}`,
                    type: 'speaker',
                    metadata: {
                      groupId: device.groupId,
                    },
                  };
                  break;
                case 'videoinput':
                  metadata = {
                    label: device.label || `video ${self.videoDevices.length + 1}`,
                    type: 'video',
                    metadata: {
                      capabilities: device.getCapabilities(),
                      groupId: device.groupId,
                    },
                  };
                  break;
              }
              self.devices.push({
                value: device.deviceId,
                kind: device.kind,
                ...metadata,
              });
            });
          console.log('getDevices - self.devices:', self.devices);
        } catch (err) {
          console.error(err.name + ': ' + err.message);
          throw err;
        }

      },
      getConstraints(context) {
        function gcd(a, b) {
          return (b === 0) ? a : gcd(b, a % b);
        }

        let supports = navigator.mediaDevices.getSupportedConstraints();

        if (!supports['width'] || !supports['height'] || !supports['aspectRatio'] || !supports['frameRate'] || !supports['facingMode']) {
          // We're missing needed properties, so handle that error.
          this.$emit('error', 'Local media devices are missing needed properties');
          this.$q.notify({type: 'negative', message: 'Your media devices are missing needed properties'});
        } else {
          if (context.active) {
            let w = this.$data.$windowWidth;
            let h = w > this.$data.$windowHeight ? this.$data.$windowHeight - ((52 + 50 + 65) + 111) : this.$data.$windowHeight - (52 + 50 + 65);
            let r = gcd(w, h);
            let result = {
              video: {
                // deviceId: {
                //   exact: context.video.value,
                // },
                // width: this.videoWidth,
                // height: this.videoHeight,
                // aspectRatio: (typeof this.videoWidth === 'number' && typeof this.videoHeight === 'number' && this.videoWidth < this.videoHeight) ? 1 / this.aspectRatio : this.aspectRatio,
                aspectRatio: (w / r) / (h / r),
                // frameRate: {max: 30},
                facingMode: 'environment', // ['left', 'right', 'user', 'environment']
              },
            };
            let videoId = this.$lget(context, 'video.value');
            if (videoId) {
              this.$lset(result, 'video.deviceId.exact', videoId);
              delete result.video.facingMode;
            }

            let audioId = this.$lget(context, 'audio.value');
            if (audioId) this.$lset(result, 'audio.deviceId.exact', audioId);
            return result;
          } else {
            return {};
          }
        }
      },
      renderStream(mediaSource) {
        let video = this.$refs['video-child'].$refs.video;
        console.log('video:', video);
        if ('srcObject' in video) {
          try {
            video.srcObject = mediaSource;
          } catch (err) {
            if (err.name !== 'TypeError') {
              throw err;
            }
            // Even if they do, they may only support MediaStream
            video.src = URL.createObjectURL(mediaSource);
          }
        } else {
          video.src = URL.createObjectURL(mediaSource);
        }
        this.$emit('started', mediaSource);
      },
      testMicrophone() {
        if (this.testAudio) {
          this.testAudio.pause();
          this.testAudio = null;
        } else {
          this.$q.dialog({
            title: 'Audio Test Confirm',
            message: 'If you are not using headphones you will receive feedback.',
            ok: {
              push: true,
              color: 'negative',
              label: 'Continue',
            },
            cancel: {
              push: true,
              color: 'primary',
            },
          }).onOk(() => {
            this.testAudio = document.createElement('audio');
            this.testAudio.controls = true;
            this.testAudio.autoplay = true;
            this.testAudio.srcObject = this.stream;

            this.stream.oninactive = function () {
              console.log('Stream ended');
            };
          }).onCancel(() => {

          });
        }
      },
      async getStream(constraints) {
        let self = this;

        if (self.resolution) {
          constraints.video.height = self.resolution.height;
          constraints.video.width = self.resolution.width;
        }
        try {
          return await navigator.mediaDevices.getUserMedia(constraints);
        } catch (error) {
          self.$emit('error', error);
        }
      },
      // Attach audio output device to video element using device/sink ID.
      attachSinkId(element, sinkId) {
        if (typeof element.sinkId !== 'undefined') {
          element.setSinkId(sinkId)
            .then(() => {
              console.log(`Success, audio output device attached: ${sinkId}`);
            })
            .catch(error => {
              let errorMessage = error;
              if (error.name === 'SecurityError') {
                errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
              }
              console.error(errorMessage);
              // Jump back to first output device in the list as it's the default.
              this.audioOutputSelect.selectedIndex = 0;
            });
        } else {
          console.warn('Browser does not support output device selection.');
        }
      },
      // changeAudioDestination() {
      //   const audioDestination = this.audioOutputSelect.value;
      //   this.attachSinkId(this.videoElementSelect, audioDestination);
      // },
      async selectDevice() {
        this.stream = await this.getStream(this.getConstraints(this.selected));
        this.renderStream(this.stream);
      },
      async switchCameras() {
        let cameras = this.videoDevices.filter(dev => {
          return !this.switchedCameras.includes(dev) && JSON.stringify(this.selected.video) !== JSON.stringify(dev);
        });
        if (cameras.length === 0) {
          this.switchedCameras = [];
          cameras = this.videoDevices.filter(dev => {
            return JSON.stringify(this.selected.video) !== JSON.stringify(dev);
          });
        }
        this.switchedCameras.push(cameras[0]);
        this.$lset(this.selected, 'video', cameras[0]);
        await this.selectDevice();
      },

      async takePhoto() {
        try {
          const track = this.stream.getVideoTracks()[0];
          const imageCapture = new ImageCapture(track);
          // const blob = await imageCapture.takePhoto();
          const photo = {
            capabilities: await imageCapture.getPhotoCapabilities(),
            settings: await imageCapture.getPhotoSettings(),
            blob: await imageCapture.takePhoto()
          };

          this.$emit('photo', photo);
        } catch (error) {
          this.$emit('error', error);
        }
      },
    },
  };


  // const SOURCE_TEMPLATE = {};
  // const TRACK_CAPABILITIES_AUDIO_TEMPLATE = {
  //   autoGainControl: null,
  //   channelCount: null,
  //   deviceId: null,
  //   echoCancellation: null,
  //   groupId: null,
  //   latency: null,
  //   noiseSuppression: null,
  //   sampleRate: null,
  //   sampleSize: null
  // };
  // const TRACK_CAPABILITIES_VIDEO_TEMPLATE = {
  //   aspectRatio: null,
  //   deviceId: null,
  //   facingMode: null,
  //   groupId: null,
  //   frameRate: null,
  //   height: null,
  //   resizeMode: null,
  //   width: null
  // };
  // const TRACK_CONSTRAINTS_AUDIO_TEMPLATE = {
  //   deviceId: {exact: null},
  // };
  // const TRACK_CONSTRAINTS_VIDEO_TEMPLATE = {
  //   aspectRatio: null,
  //   deviceId: null,
  //   groupId: null,
  //   frameRate: null,
  //   height: null,
  //   width: null
  // };
  // const TRACK_SETTINGS_AUDIO_TEMPLATE = {
  //   autoGainControl: null,
  //   channelCount: null,
  //   deviceId: null,
  //   echoCancellation: null,
  //   groupId: null,
  //   latency: null,
  //   noiseSuppression: null,
  //   sampleRate: null,
  //   sampleSize: null
  // };
  // const TRACK_SETTINGS_VIDEO_TEMPLATE = {
  //   aspectRatio: null,
  //   deviceId: null,
  //   facingMode: null,
  //   groupId: null,
  //   frameRate: null,
  //   height: null,
  //   resizeMode: null,
  //   width: null
  // };
  // const TRACK_TEMPLATE = {
  //   kind: null,
  //   id: null,
  //   label: null,
  //   enabled: null,
  //   muted: null,
  //   readyState: null,
  //   capabilities: {...TRACK_CAPABILITIES_AUDIO_TEMPLATE || ...TRACK_CAPABILITIES_VIDEO_TEMPLATE},
  //   constraints: null,
  //   settings: null
  // };
  // const MEDIA_STREAM_TEMPLATE = {
  //   id: null,
  //   active: null,
  //   tracks: [
  //     ...TRACK_TEMPLATE
  //   ],
  // };
</script>

<style scoped lang="scss" src="./_media.scss">

</style>
